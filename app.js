const DIAS_SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function escapeHtml(text) {
  return String(text ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

function esLinkSeguro(url) {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

function nombreDia(fechaISO, hoyISO) {
  if (fechaISO === hoyISO) return "Hoy";
  const fecha = new Date(fechaISO + "T12:00:00");
  return DIAS_SEMANA[fecha.getDay()];
}

function formatoHora(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CODIGOS_CLIMA = {
  0: ["Despejado", "☀️"],
  1: ["Mayormente despejado", "🌤️"],
  2: ["Parcialmente nublado", "⛅"],
  3: ["Nublado", "☁️"],
  45: ["Niebla", "🌫️"],
  48: ["Niebla", "🌫️"],
  51: ["Llovizna leve", "🌦️"],
  53: ["Llovizna", "🌦️"],
  55: ["Llovizna fuerte", "🌦️"],
  56: ["Llovizna helada", "🌧️"],
  57: ["Llovizna helada", "🌧️"],
  61: ["Lluvia leve", "🌧️"],
  63: ["Lluvia", "🌧️"],
  65: ["Lluvia fuerte", "🌧️"],
  66: ["Lluvia helada", "🌧️"],
  67: ["Lluvia helada", "🌧️"],
  71: ["Nieve leve", "🌨️"],
  73: ["Nieve", "🌨️"],
  75: ["Nieve fuerte", "🌨️"],
  77: ["Granizo fino", "🌨️"],
  80: ["Chubascos leves", "🌦️"],
  81: ["Chubascos", "🌧️"],
  82: ["Chubascos fuertes", "⛈️"],
  85: ["Nevadas leves", "🌨️"],
  86: ["Nevadas fuertes", "🌨️"],
  95: ["Tormenta", "⛈️"],
  96: ["Tormenta con granizo", "⛈️"],
  99: ["Tormenta con granizo", "⛈️"],
};

function descripcionClima(codigo) {
  const [label, emoji] = CODIGOS_CLIMA[codigo] || ["Sin datos", "🌡️"];
  return { label, emoji };
}

// Pide el clima directo a Open-Meteo (gratis, sin clave). Así está siempre al día aunque el
// robot de GitHub no haya corrido. Si falla, la página usa el que dejó el robot.
async function climaEnVivo() {
  const control = new AbortController();
  const timer = setTimeout(() => control.abort(), 10000);
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=-34.6037&longitude=-58.3816" +
      "&current=temperature_2m,precipitation,weather_code" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
      "&timezone=America%2FArgentina%2FBuenos_Aires&forecast_days=6";
    const res = await fetch(url, { signal: control.signal });
    if (!res.ok) return null;
    const d = await res.json();
    const daily = d.daily.time.map((date, i) => {
      const w = descripcionClima(d.daily.weather_code[i]);
      return {
        date,
        max: Math.round(d.daily.temperature_2m_max[i]),
        min: Math.round(d.daily.temperature_2m_min[i]),
        precipProb: d.daily.precipitation_probability_max[i],
        label: w.label,
        emoji: w.emoji,
      };
    });
    const actual = descripcionClima(d.current.weather_code);
    return {
      obtenidoEn: new Date().toISOString(),
      current: {
        temp: Math.round(d.current.temperature_2m),
        precipitation: d.current.precipitation,
        label: actual.label,
        emoji: actual.emoji,
      },
      today: daily[0],
      nextDays: daily.slice(1),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function renderClima(weather) {
  if (!weather) {
    return '<p class="error">No se pudo cargar el clima. Probá de nuevo en un rato.</p>';
  }

  const { current, today, nextDays } = weather;
  const viejo = weather.obtenidoEn && Date.now() - Date.parse(weather.obtenidoEn) > 6 * 3600 * 1000;
  const nota = viejo
    ? `<div class="clima-nota">Datos de las ${formatoHora(weather.obtenidoEn)} (no se pudieron actualizar ahora)</div>`
    : "";

  const proximos = nextDays
    .map(
      (dia) => `
      <div class="clima-dia">
        <div class="dia-nombre">${nombreDia(dia.date, today.date)}</div>
        <div class="dia-emoji">${dia.emoji}</div>
        <div class="dia-temps">${dia.max}° / ${dia.min}°</div>
      </div>`
    )
    .join("");

  return `
    <section class="clima">
      <div class="clima-hoy">
        <div class="clima-emoji">${current.emoji}</div>
        <div>
          <div class="clima-temp">${current.temp}°</div>
          <div class="clima-detalle">${current.label} en Buenos Aires</div>
        </div>
      </div>
      <div class="clima-minmax">Hoy: máxima ${today.max}° · mínima ${today.min}°</div>
      <div class="clima-lluvia">Probabilidad de lluvia hoy: ${today.precipProb}%</div>
      <div class="clima-proximos">${proximos}</div>
      ${nota}
    </section>
  `;
}

function renderNav(topics) {
  const chips = topics.map((t) => `<a href="#${t.key}">${t.label}</a>`).join("");
  return `<nav class="temas-nav">${chips}</nav>`;
}

function renderTopics(topics) {
  return topics
    .map((topic) => {
      const items = topic.items
        .filter((item) => esLinkSeguro(item.link))
        .map(
          (item) => `
        <a class="noticia" href="${escapeHtml(item.link)}" target="_blank" rel="noopener">
          <p class="noticia-titulo">${escapeHtml(item.title)}</p>
          ${item.summary ? `<p class="noticia-resumen">${escapeHtml(item.summary)}</p>` : ""}
          <span class="noticia-medio">${escapeHtml(item.source)}</span>
        </a>`
        )
        .join("");

      return `
        <section class="tema" id="${topic.key}">
          <h2>${topic.label}</h2>
          ${items}
        </section>
      `;
    })
    .join("");
}

async function main() {
  const contenido = document.getElementById("contenido");
  const actualizado = document.getElementById("actualizado");

  try {
    const res = await fetch(`data/data.json?t=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    actualizado.textContent = `Actualizado hoy a las ${formatoHora(data.generatedAt)}`;

    const hayNoticias = data.topics && data.topics.length > 0;

    contenido.innerHTML =
      `<div id="clima-bloque">${renderClima(data.weather)}</div>` +
      (hayNoticias
        ? renderNav(data.topics) + renderTopics(data.topics)
        : '<p class="error">No se pudieron cargar las noticias en esta actualización.</p>');

    climaEnVivo().then((clima) => {
      const bloque = document.getElementById("clima-bloque");
      if (clima && bloque) bloque.innerHTML = renderClima(clima);
    });
  } catch (err) {
    console.error(err);
    contenido.innerHTML = '<p class="error">No se pudo cargar la información. Probá de nuevo más tarde.</p>';
    actualizado.textContent = "";
  }
}

main();

// Al abrir el ícono, el celular suele mostrar la página que había dejado "dormida". Si pasó
// un rato largo o cambió el día, se recarga sola para traer las noticias y los juegos nuevos.
const CARGADA_EN = Date.now();
const DIA_CARGADO = fechaHoyART();
function recargarSiEstaVieja() {
  if (document.visibilityState !== "visible") return;
  if (Date.now() - CARGADA_EN > 45 * 60 * 1000 || fechaHoyART() !== DIA_CARGADO) location.reload();
}
document.addEventListener("visibilitychange", recargarSiEstaVieja);
window.addEventListener("pageshow", (e) => {
  if (e.persisted) recargarSiEstaVieja();
});
