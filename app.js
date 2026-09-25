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

function renderClima(weather) {
  if (!weather) {
    return '<p class="error">No se pudo cargar el clima en esta actualización.</p>';
  }

  const { current, today, nextDays } = weather;

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
      renderClima(data.weather) +
      (hayNoticias
        ? renderNav(data.topics) + renderTopics(data.topics)
        : '<p class="error">No se pudieron cargar las noticias en esta actualización.</p>');
  } catch (err) {
    console.error(err);
    contenido.innerHTML = '<p class="error">No se pudo cargar la información. Probá de nuevo más tarde.</p>';
    actualizado.textContent = "";
  }
}

main();
