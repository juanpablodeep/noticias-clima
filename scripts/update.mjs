// Trae el clima de Buenos Aires y las noticias del día, y arma data/data.json.
// No usa ninguna clave/API key: todo son fuentes públicas y gratuitas.

import { writeFileSync } from "node:fs";

const TOPICS = [
  { key: "politica", label: "Política" },
  { key: "economia", label: "Economía" },
  { key: "mundo", label: "Mundo" },
  { key: "sociedad", label: "Sociedad" },
  { key: "deportes", label: "Deportes" },
  { key: "espectaculos", label: "Espectáculos" },
];

const MAX_ITEMS_PER_TOPIC = 10;

// Feeds con sección propia: le decimos directamente a qué tema pertenecen.
const DIRECT_FEEDS = [
  // Clarín
  { source: "Clarín", topic: "politica", url: "https://www.clarin.com/rss/politica/" },
  { source: "Clarín", topic: "economia", url: "https://www.clarin.com/rss/economia/" },
  { source: "Clarín", topic: "mundo", url: "https://www.clarin.com/rss/mundo/" },
  { source: "Clarín", topic: "sociedad", url: "https://www.clarin.com/rss/sociedad/" },
  { source: "Clarín", topic: "deportes", url: "https://www.clarin.com/rss/deportes/" },
  { source: "Clarín", topic: "espectaculos", url: "https://www.clarin.com/rss/espectaculos/" },
  // La Nación
  { source: "La Nación", topic: "politica", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/politica/" },
  { source: "La Nación", topic: "economia", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/economia/" },
  { source: "La Nación", topic: "mundo", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/el-mundo/" },
  { source: "La Nación", topic: "sociedad", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/sociedad/" },
  { source: "La Nación", topic: "deportes", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/deportes/" },
  { source: "La Nación", topic: "espectaculos", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/espectaculos/" },
  // Infobae
  { source: "Infobae", topic: "politica", url: "https://www.infobae.com/arc/outboundfeeds/rss/category/politica/" },
  { source: "Infobae", topic: "economia", url: "https://www.infobae.com/arc/outboundfeeds/rss/category/economia/" },
  { source: "Infobae", topic: "mundo", url: "https://www.infobae.com/arc/outboundfeeds/rss/category/america/" },
  { source: "Infobae", topic: "sociedad", url: "https://www.infobae.com/arc/outboundfeeds/rss/category/sociedad/" },
  { source: "Infobae", topic: "deportes", url: "https://www.infobae.com/arc/outboundfeeds/rss/category/deportes/" },
  { source: "Infobae", topic: "espectaculos", url: "https://www.infobae.com/arc/outboundfeeds/rss/category/teleshow/" },
  // Página/12
  { source: "Página/12", topic: "politica", url: "https://www.pagina12.com.ar/arc/outboundfeeds/rss/secciones/el-pais/notas" },
  { source: "Página/12", topic: "economia", url: "https://www.pagina12.com.ar/arc/outboundfeeds/rss/secciones/economia/notas" },
  { source: "Página/12", topic: "mundo", url: "https://www.pagina12.com.ar/arc/outboundfeeds/rss/secciones/el-mundo/notas" },
  { source: "Página/12", topic: "sociedad", url: "https://www.pagina12.com.ar/arc/outboundfeeds/rss/secciones/sociedad/notas" },
  { source: "Página/12", topic: "deportes", url: "https://www.pagina12.com.ar/arc/outboundfeeds/rss/secciones/deportes/notas" },
  { source: "Página/12", topic: "espectaculos", url: "https://www.pagina12.com.ar/arc/outboundfeeds/rss/secciones/cultura/notas" },
];

// Medios sin RSS por sección: traemos el feed general y adivinamos el
// tema mirando la sección que aparece en la URL de la nota.
const GENERAL_FEEDS = [
  { source: "TN", url: "https://tn.com.ar/feed/" },
  { source: "Perfil", url: "https://www.perfil.com/feed" },
];

const SECTION_TO_TOPIC = {
  politica: "politica",
  economia: "economia",
  negocios: "economia",
  mundo: "mundo",
  "el-mundo": "mundo",
  internacional: "mundo",
  america: "mundo",
  sociedad: "sociedad",
  deportes: "deportes",
  deporte: "deportes",
  espectaculos: "espectaculos",
  show: "espectaculos",
  teleshow: "espectaculos",
  cultura: "espectaculos",
  entretenimiento: "espectaculos",
};

function topicFromUrl(link) {
  try {
    const parts = new URL(link).pathname.toLowerCase().split("/").filter(Boolean);
    for (const part of parts) {
      if (SECTION_TO_TOPIC[part]) return SECTION_TO_TOPIC[part];
    }
  } catch {
    // URL inválida, no le asignamos tema
  }
  return null;
}

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ntilde: "ñ",
  Ntilde: "Ñ",
  aacute: "á",
  eacute: "é",
  iacute: "í",
  oacute: "ó",
  uacute: "ú",
  Aacute: "Á",
  Eacute: "É",
  Iacute: "Í",
  Oacute: "Ó",
  Uacute: "Ú",
  uuml: "ü",
  Uuml: "Ü",
  iexcl: "¡",
  iquest: "¿",
};

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-zA-Z]+);/g, (match, name) => ENTITIES[name] ?? match);
}

function stripCdata(text) {
  const m = text.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  return m ? m[1] : text;
}

function stripTags(text) {
  return text.replace(/<[^>]*>/g, " ");
}

function cleanText(raw) {
  if (!raw) return "";
  return decodeEntities(stripTags(stripCdata(raw)))
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1] : "";
}

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > 40 ? lastSpace : max) + "…";
}

function parseRss(xml) {
  const items = [];
  const itemBlocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  for (const block of itemBlocks) {
    const title = cleanText(extractTag(block, "title"));
    const link = cleanText(extractTag(block, "link"));
    const description = cleanText(extractTag(block, "description"));
    const pubDateRaw = cleanText(extractTag(block, "pubDate"));
    const pubDate = pubDateRaw ? new Date(pubDateRaw) : null;
    if (!title || !link) continue;
    items.push({
      title,
      link,
      summary: truncate(description, 140),
      pubDate: pubDate && !isNaN(pubDate) ? pubDate.toISOString() : null,
    });
  }
  return items;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; NoticiasPapasBot/1.0)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
  return res.text();
}

async function collectNews() {
  const byTopic = Object.fromEntries(TOPICS.map((t) => [t.key, []]));
  const seenLinks = new Set();

  function addItem(topicKey, source, item) {
    if (!byTopic[topicKey] || seenLinks.has(item.link)) return;
    seenLinks.add(item.link);
    byTopic[topicKey].push({ ...item, source });
  }

  const jobs = [];

  for (const feed of DIRECT_FEEDS) {
    jobs.push(
      fetchText(feed.url)
        .then((xml) => {
          for (const item of parseRss(xml)) addItem(feed.topic, feed.source, item);
        })
        .catch((err) => console.error(`Aviso: no se pudo leer ${feed.source} (${feed.topic}): ${err.message}`))
    );
  }

  for (const feed of GENERAL_FEEDS) {
    jobs.push(
      fetchText(feed.url)
        .then((xml) => {
          for (const item of parseRss(xml)) {
            const topicKey = topicFromUrl(item.link);
            if (topicKey) addItem(topicKey, feed.source, item);
          }
        })
        .catch((err) => console.error(`Aviso: no se pudo leer ${feed.source}: ${err.message}`))
    );
  }

  await Promise.all(jobs);

  return TOPICS.map((topic) => {
    const items = byTopic[topic.key]
      .sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0))
      .slice(0, MAX_ITEMS_PER_TOPIC);
    return { key: topic.key, label: topic.label, items };
  }).filter((topic) => topic.items.length > 0);
}

const WEATHER_CODES = {
  0: { label: "Despejado", emoji: "☀️" },
  1: { label: "Mayormente despejado", emoji: "🌤️" },
  2: { label: "Parcialmente nublado", emoji: "⛅" },
  3: { label: "Nublado", emoji: "☁️" },
  45: { label: "Niebla", emoji: "🌫️" },
  48: { label: "Niebla", emoji: "🌫️" },
  51: { label: "Llovizna leve", emoji: "🌦️" },
  53: { label: "Llovizna", emoji: "🌦️" },
  55: { label: "Llovizna fuerte", emoji: "🌦️" },
  56: { label: "Llovizna helada", emoji: "🌧️" },
  57: { label: "Llovizna helada", emoji: "🌧️" },
  61: { label: "Lluvia leve", emoji: "🌧️" },
  63: { label: "Lluvia", emoji: "🌧️" },
  65: { label: "Lluvia fuerte", emoji: "🌧️" },
  66: { label: "Lluvia helada", emoji: "🌧️" },
  67: { label: "Lluvia helada", emoji: "🌧️" },
  71: { label: "Nieve leve", emoji: "🌨️" },
  73: { label: "Nieve", emoji: "🌨️" },
  75: { label: "Nieve fuerte", emoji: "🌨️" },
  77: { label: "Granizo fino", emoji: "🌨️" },
  80: { label: "Chubascos leves", emoji: "🌦️" },
  81: { label: "Chubascos", emoji: "🌧️" },
  82: { label: "Chubascos fuertes", emoji: "⛈️" },
  85: { label: "Nevadas leves", emoji: "🌨️" },
  86: { label: "Nevadas fuertes", emoji: "🌨️" },
  95: { label: "Tormenta", emoji: "⛈️" },
  96: { label: "Tormenta con granizo", emoji: "⛈️" },
  99: { label: "Tormenta con granizo", emoji: "⛈️" },
};

function describeWeather(code) {
  return WEATHER_CODES[code] || { label: "Sin datos", emoji: "🌡️" };
}

async function collectWeather() {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=-34.6037&longitude=-58.3816" +
    "&current=temperature_2m,precipitation,weather_code" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&timezone=America%2FArgentina%2FBuenos_Aires" +
    "&forecast_days=6";

  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} pidiendo el clima`);
  const data = await res.json();

  const current = data.current;
  const currentWeather = describeWeather(current.weather_code);

  const daily = data.daily.time.map((date, i) => {
    const w = describeWeather(data.daily.weather_code[i]);
    return {
      date,
      max: Math.round(data.daily.temperature_2m_max[i]),
      min: Math.round(data.daily.temperature_2m_min[i]),
      precipProb: data.daily.precipitation_probability_max[i],
      label: w.label,
      emoji: w.emoji,
    };
  });

  return {
    current: {
      temp: Math.round(current.temperature_2m),
      precipitation: current.precipitation,
      label: currentWeather.label,
      emoji: currentWeather.emoji,
    },
    today: daily[0],
    nextDays: daily.slice(1),
  };
}

async function main() {
  const [weather, topics] = await Promise.all([
    collectWeather().catch((err) => {
      console.error(`No se pudo traer el clima: ${err.message}`);
      return null;
    }),
    collectNews(),
  ]);

  const data = {
    generatedAt: new Date().toISOString(),
    weather,
    topics,
  };

  writeFileSync(new URL("../data/data.json", import.meta.url), JSON.stringify(data, null, 2) + "\n");
  console.log(
    `Listo: ${topics.reduce((n, t) => n + t.items.length, 0)} noticias en ${topics.length} temas. Clima: ${
      weather ? "ok" : "falló"
    }.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
