// El "juego de hoy": rota entre trivia, sopa de letras, memoria y sudoku.
// Todo corre en el navegador, sin pedirle nada a ningún servidor.

/* ---------- utilidades comunes ---------- */

function fechaHoyART() {
  // "YYYY-MM-DD" según la hora de Argentina, para que el juego sea el mismo
  // todo el día y cambie a la mañana siguiente.
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
}

function diasDesdeEpoch(fechaStr) {
  return Math.floor(new Date(fechaStr + "T00:00:00Z").getTime() / 86400000);
}

// Generador de números pseudoaleatorios determinístico (Park–Miller),
// para que el mismo día le toque a todo el mundo el mismo puzzle.
function crearRng(semilla) {
  let s = semilla % 2147483647;
  if (s <= 0) s += 2147483646;
  const siguiente = function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  // Semillas consecutivas dan primeros valores casi iguales: se descartan unos cuantos.
  for (let i = 0; i < 5; i++) siguiente();
  return siguiente;
}

function elegir(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function barajar(rng, arr) {
  const copia = arr.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/* ---------- banco de trivia ---------- */

const TRIVIA_BANCO = [
  { q: "¿En qué año llegó el hombre a la Luna por primera vez?", o: ["1965", "1969", "1972", "1958"], r: 1 },
  { q: "¿Cuál es el hueso más pequeño del cuerpo humano?", o: ["El estribo (en el oído)", "La falange", "El coxis", "La rótula"], r: 0 },
  { q: "¿Quién escribió \"Cien años de soledad\"?", o: ["Mario Vargas Llosa", "Julio Cortázar", "Gabriel García Márquez", "Pablo Neruda"], r: 2 },
  { q: "¿Cuál es la capital de Australia?", o: ["Sídney", "Canberra", "Melbourne", "Perth"], r: 1 },
  { q: "¿En qué año se declaró la independencia argentina?", o: ["1810", "1816", "1820", "1853"], r: 1 },
  { q: "¿Cuál es el elemento químico más abundante en el universo?", o: ["Oxígeno", "Helio", "Hidrógeno", "Carbono"], r: 2 },
  { q: "¿Quién pintó \"Las Meninas\"?", o: ["Francisco de Goya", "Diego Velázquez", "El Greco", "Salvador Dalí"], r: 1 },
  { q: "¿Qué país tiene más husos horarios, por sus territorios de ultramar?", o: ["Rusia", "Estados Unidos", "Francia", "China"], r: 2 },
  { q: "¿Cómo se llama la teoría de Einstein sobre el espacio y el tiempo?", o: ["Teoría cuántica", "Teoría de la relatividad", "Teoría del caos", "Teoría de cuerdas"], r: 1 },
  { q: "¿Cuál es el desierto cálido más grande del mundo?", o: ["Gobi", "Kalahari", "Sahara", "Atacama"], r: 2 },
  { q: "¿En qué siglo nació Leonardo da Vinci?", o: ["Siglo XIII", "Siglo XV", "Siglo XVII", "Siglo XIX"], r: 1 },
  { q: "¿Cuál es la montaña más alta de América?", o: ["Aconcagua", "Chimborazo", "Denali", "Huascarán"], r: 0 },
  { q: "¿En qué año se creó la Organización de las Naciones Unidas?", o: ["1919", "1945", "1957", "1963"], r: 1 },
  { q: "¿Cuál es la capital de Canadá?", o: ["Toronto", "Vancouver", "Ottawa", "Montreal"], r: 2 },
  { q: "¿Quién compuso \"Las cuatro estaciones\"?", o: ["Johann Sebastian Bach", "Antonio Vivaldi", "Wolfgang Amadeus Mozart", "Ludwig van Beethoven"], r: 1 },
  { q: "¿Qué metal es líquido a temperatura ambiente?", o: ["Plomo", "Mercurio", "Estaño", "Zinc"], r: 1 },
  { q: "¿En qué continente están las Cataratas Victoria?", o: ["Asia", "América", "África", "Oceanía"], r: 2 },
  { q: "¿Cuál es la moneda oficial de Japón?", o: ["El yuan", "El yen", "El won", "El baht"], r: 1 },
  { q: "¿Quién fue el primer ser humano en viajar al espacio?", o: ["Neil Armstrong", "Yuri Gagarin", "John Glenn", "Buzz Aldrin"], r: 1 },
  { q: "¿Cuál es el río más caudaloso del mundo?", o: ["El Nilo", "El Amazonas", "El Misisipi", "El Yangtsé"], r: 1 },
  { q: "¿Qué batalla marcó el fin definitivo del imperio de Napoleón?", o: ["Trafalgar", "Austerlitz", "Waterloo", "Leipzig"], r: 2 },
  { q: "¿Cuál es la capital de Turquía?", o: ["Estambul", "Ankara", "Esmirna", "Bursa"], r: 1 },
  { q: "¿Qué gas es el principal responsable del efecto invernadero?", o: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Ozono"], r: 1 },
  { q: "¿Cuál es el órgano más grande del cuerpo humano?", o: ["El hígado", "El pulmón", "La piel", "El intestino"], r: 2 },
  { q: "¿En qué año cayó el Muro de Berlín?", o: ["1985", "1989", "1991", "1993"], r: 1 },
  { q: "¿Cuál es la capital de Egipto?", o: ["Alejandría", "El Cairo", "Luxor", "Giza"], r: 1 },
  { q: "¿Quién escribió \"El Quijote\"?", o: ["Lope de Vega", "Miguel de Cervantes", "Federico García Lorca", "Calderón de la Barca"], r: 1 },
  { q: "¿Cuál es el planeta más grande del sistema solar?", o: ["Saturno", "Júpiter", "Urano", "Neptuno"], r: 1 },
  { q: "¿Qué imperio construyó Machu Picchu?", o: ["El imperio azteca", "El imperio maya", "El imperio inca", "El imperio tolteca"], r: 2 },
  { q: "¿Cuál es la capital de Grecia?", o: ["Esparta", "Atenas", "Tesalónica", "Corinto"], r: 1 },
  { q: "¿Cuántos huesos tiene el cuerpo humano adulto, aproximadamente?", o: ["186", "196", "206", "216"], r: 2 },
  { q: "¿Qué científico formuló las leyes del movimiento y de la gravedad?", o: ["Galileo Galilei", "Isaac Newton", "Nicolás Copérnico", "Johannes Kepler"], r: 1 },
  { q: "¿Cuál es el lago navegable más alto del mundo?", o: ["Titicaca", "Maracaibo", "Nahuel Huapi", "Chungará"], r: 0 },
  { q: "¿En qué país, junto con Argentina, también se originó el tango?", o: ["Uruguay", "Chile", "Paraguay", "Brasil"], r: 0 },
  { q: "¿Cuál es la capital de Portugal?", o: ["Oporto", "Lisboa", "Coimbra", "Faro"], r: 1 },
  { q: "¿Qué vitamina produce el cuerpo principalmente por la exposición al sol?", o: ["La vitamina A", "La vitamina C", "La vitamina D", "La vitamina K"], r: 2 },
  { q: "¿Qué país fue el primero en desarrollar y usar la bomba atómica?", o: ["Alemania", "Estados Unidos", "La Unión Soviética", "Japón"], r: 1 },
  { q: "¿Qué escritor argentino escribió \"Ficciones\" y \"El Aleph\"?", o: ["Julio Cortázar", "Jorge Luis Borges", "Ernesto Sabato", "Adolfo Bioy Casares"], r: 1 },
  { q: "¿Cuál es el punto más profundo de los océanos?", o: ["La Fosa de Puerto Rico", "La Fosa de las Marianas", "La Fosa de Japón", "La Fosa de Tonga"], r: 1 },
  { q: "¿Cuál es la capital de Rusia?", o: ["San Petersburgo", "Moscú", "Novosibirsk", "Kazán"], r: 1 },
];

/* ---------- banco de sopa de letras ---------- */

// Los temas (SOPA_TEMAS) están en bancos-trivia.js. De cada tema se eligen 10 palabras
// distintas cada vez, así que ni el tema repetido da la misma sopa.
const SOPA_CANTIDAD = 10;

function elegirPalabrasSopa(tema, rng) {
  const elegidas = [];
  for (const p of barajar(rng, tema.palabras)) {
    if (elegidas.some((q) => q.includes(p) || p.includes(q))) continue;
    elegidas.push(p);
    if (elegidas.length === SOPA_CANTIDAD) break;
  }
  return elegidas;
}

const SOPA_TAMANO = 13;
const SOPA_DIRECCIONES = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
  { dx: 1, dy: 1 },
  { dx: -1, dy: -1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 1 },
];

function crearGrillaSopa(palabras, rng) {
  const grilla = Array.from({ length: SOPA_TAMANO }, () => Array(SOPA_TAMANO).fill(null));

  function cabe(palabra, fila, col, dir) {
    for (let i = 0; i < palabra.length; i++) {
      const f = fila + dir.dy * i;
      const c = col + dir.dx * i;
      if (f < 0 || f >= SOPA_TAMANO || c < 0 || c >= SOPA_TAMANO) return false;
      const actual = grilla[f][c];
      if (actual && actual !== palabra[i]) return false;
    }
    return true;
  }

  const colocadas = [];
  for (const palabra of palabras) {
    let colocada = false;
    for (let intento = 0; intento < 300 && !colocada; intento++) {
      const dir = elegir(rng, SOPA_DIRECCIONES);
      const fila = Math.floor(rng() * SOPA_TAMANO);
      const col = Math.floor(rng() * SOPA_TAMANO);
      if (cabe(palabra, fila, col, dir)) {
        for (let i = 0; i < palabra.length; i++) {
          grilla[fila + dir.dy * i][col + dir.dx * i] = palabra[i];
        }
        colocada = true;
        colocadas.push(palabra);
      }
    }
  }

  const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let f = 0; f < SOPA_TAMANO; f++) {
    for (let c = 0; c < SOPA_TAMANO; c++) {
      if (!grilla[f][c]) grilla[f][c] = elegir(rng, ALFABETO.split(""));
    }
  }
  // Solo se listan las palabras que de verdad quedaron escondidas en la grilla.
  return { grilla, colocadas };
}

function celdasEnLinea(inicio, fin) {
  const dr = fin.fila - inicio.fila;
  const dc = fin.col - inicio.col;
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const pasos = Math.max(Math.abs(dr), Math.abs(dc));
  const stepR = Math.sign(dr);
  const stepC = Math.sign(dc);
  const celdas = [];
  for (let i = 0; i <= pasos; i++) {
    celdas.push({ fila: inicio.fila + stepR * i, col: inicio.col + stepC * i });
  }
  return celdas;
}

/* ---------- banco de sudoku (pistas fáciles, solución única) ---------- */

const SUDOKU_BANCO = [
  { puzzle: "908000050700000000563027000000000030000206410006004002004960700030100200050700063", solucion: "928431657741695328563827941472519836385276419196384572214963785637158294859742163" },
  { puzzle: "020900080010050930036070004053096400040000008702000000009800126200000000100007000", solucion: "527934681418652937936178254853796412641523798792481563379845126264319875185267349" },
  { puzzle: "000904163800100090009200080067510000100000040000408000048060000051000630000020008", solucion: "572984163834156297619237584467513829183692745925478316248365971751849632396721458" },
  { puzzle: "900008040100000000050060100003000400640010085002500009408097000000402063025000070", solucion: "936128547184735692257964138513879426649213785872546319468397251791452863325681974" },
  { puzzle: "000007080006009010071200043100970002600000030208605000013700000800400600004000001", solucion: "329147586486359217571286943145973862697824135238615794913762458852431679764598321" },
  { puzzle: "500000013000031078000002004042017900001000350005090020260009100010000000004008002", solucion: "589746213426931578137852694342517986691284357875693421268379145713425869954168732" },
  { puzzle: "001026080600500000070130040000300870000004092080000500700040230094070160030000000", solucion: "951426783643587921872139645425391876167854392389762514718645239594273168236918457" },
  { puzzle: "020009005510040000800065930040000000001002007238000009305080000000006050090500806", solucion: "623819475519347268874265931746958123951432687238671549365184792182796354497523816" },
];

// Generador de sudokus: cada fecha da un tablero distinto, de solución única.
// SUDOKU_BANCO queda solo como respaldo por si la generación fallara.
const SUDOKU_BITS = Array.from({ length: 1024 }, (_, n) => {
  let c = 0;
  for (let x = n; x; x &= x - 1) c++;
  return c;
});

// Resuelve (o cuenta soluciones, hasta "limite"). Con rng prueba los dígitos en orden al azar.
function sudokuBuscar(celdas, limite, rng) {
  const g = celdas.slice();
  const filas = Array(9).fill(0);
  const cols = Array(9).fill(0);
  const cajas = Array(9).fill(0);
  const caja = (i) => ((i / 27) | 0) * 3 + (((i % 9) / 3) | 0);
  for (let i = 0; i < 81; i++) {
    if (!g[i]) continue;
    const b = 1 << g[i];
    filas[(i / 9) | 0] |= b;
    cols[i % 9] |= b;
    cajas[caja(i)] |= b;
  }
  let cantidad = 0;
  let primera = null;

  function resolver() {
    let mejor = -1;
    let mejorLibres = 0;
    let mejorN = 10;
    for (let i = 0; i < 81; i++) {
      if (g[i]) continue;
      const libres = ~(filas[(i / 9) | 0] | cols[i % 9] | cajas[caja(i)]) & 0x3fe;
      const n = SUDOKU_BITS[libres];
      if (n < mejorN) {
        mejorN = n;
        mejor = i;
        mejorLibres = libres;
        if (n <= 1) break;
      }
    }
    if (mejor === -1) {
      cantidad++;
      if (!primera) primera = g.slice();
      return;
    }
    if (mejorN === 0) return;
    const f = (mejor / 9) | 0;
    const c = mejor % 9;
    const k = caja(mejor);
    let digitos = [];
    for (let d = 1; d <= 9; d++) if (mejorLibres & (1 << d)) digitos.push(d);
    if (rng) digitos = barajar(rng, digitos);
    for (const d of digitos) {
      const b = 1 << d;
      g[mejor] = d;
      filas[f] |= b;
      cols[c] |= b;
      cajas[k] |= b;
      resolver();
      g[mejor] = 0;
      filas[f] &= ~b;
      cols[c] &= ~b;
      cajas[k] &= ~b;
      if (cantidad >= limite) return;
    }
  }

  resolver();
  return { cantidad, primera };
}

function generarSudoku(semilla, pistas = 28) {
  const rng = crearRng(semilla);
  const solucion = sudokuBuscar(Array(81).fill(0), 1, rng).primera;
  const puzzle = solucion.slice();
  let quedan = 81;
  for (const i of barajar(rng, [...Array(81).keys()])) {
    if (quedan <= pistas) break;
    const valor = puzzle[i];
    puzzle[i] = 0;
    if (sudokuBuscar(puzzle, 2).cantidad === 1) quedan--;
    else puzzle[i] = valor;
  }
  return { puzzle: puzzle.join(""), solucion: solucion.join("") };
}

// El tablero del día se genera una vez y se guarda en el celular para no recalcularlo.
function sudokuDelDia(fecha, semilla, ciclo) {
  const clave = "canillita-sudoku-" + fecha;
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("canillita-sudoku-") && k !== clave)
      .forEach((k) => localStorage.removeItem(k));
    const g = JSON.parse(localStorage.getItem(clave));
    if (g && /^\d{81}$/.test(g.puzzle) && /^[1-9]{81}$/.test(g.solucion)) return g;
  } catch {
    // sin almacenamiento o dato dañado: se genera de nuevo
  }
  let resultado = null;
  try {
    resultado = generarSudoku(semilla * 31 + 7);
  } catch {
    resultado = null;
  }
  if (!resultado) resultado = SUDOKU_BANCO[ciclo % SUDOKU_BANCO.length];
  try {
    localStorage.setItem(clave, JSON.stringify(resultado));
  } catch {
    // sin almacenamiento: vale solo para esta visita
  }
  return resultado;
}

/* ---------- banco de memoria (emojis) ---------- */

const MEMORIA_POOL = ["🐶", "🐱", "🐵", "🐸", "🦁", "🐼", "🦊", "🐷", "🐰", "🐨", "🦉", "🐢", "🌸", "🌻", "🍎", "⚽", "🎵", "☀️", "⭐", "🍀"];

/* ---------- render: contenedor y arranque ---------- */

function tipoDeHoy(semilla) {
  const tipos = ["trivia", "sopa", "memoria", "sudoku"];
  return tipos[semilla % tipos.length];
}

const NOMBRES_JUEGO = {
  trivia: "Trivia 🧠",
  sopa: "Sopa de letras 🔤",
  memoria: "Memoria 🃏",
  sudoku: "Sudoku 🔢",
};

function iniciarJuegoDelDia() {
  const contenedor = document.getElementById("juego-cuerpo");
  const tituloEl = document.getElementById("juego-titulo");
  if (!contenedor) return;

  const fecha = fechaHoyART();
  const semilla = diasDesdeEpoch(fecha);
  const tipo = tipoDeHoy(semilla);

  tituloEl.textContent = NOMBRES_JUEGO[tipo];

  // Cada juego aparece cada 4 días: "ciclo" cuenta sus apariciones para recorrer todo el banco.
  const ciclo = Math.floor(semilla / 4);

  if (tipo === "trivia") renderTrivia(contenedor, ciclo);
  else if (tipo === "sopa") renderSopa(contenedor, semilla, ciclo);
  else if (tipo === "memoria") renderMemoria(contenedor, semilla);
  else renderSudoku(contenedor, sudokuDelDia(fecha, semilla, ciclo));
}

/* ---------- trivia ---------- */

// Las preguntas se arman a partir de tablas (bancos-trivia.js) y de cuentas, series y acertijos
// que se inventan solos. Cada categoría recorre toda su tabla antes de repetir una pregunta.

function leerTabla(texto) {
  return texto.trim().split("\n").map((l) => l.split("|"));
}

const TRIVIA_T = {
  paises: leerTabla(TRIVIA_PAISES),
  provincias: leerTabla(TRIVIA_PROVINCIAS),
  obras: leerTabla(TRIVIA_OBRAS),
  pinturas: leerTabla(TRIVIA_PINTURAS),
  musica: leerTabla(TRIVIA_MUSICA),
  monumentos: leerTabla(TRIVIA_MONUMENTOS),
  animales: leerTabla(TRIVIA_ANIMALES),
  elementos: leerTabla(TRIVIA_ELEMENTOS),
  mundiales: leerTabla(TRIVIA_MUNDIALES),
  hechos: leerTabla(TRIVIA_HECHOS),
};

const unicos = (arr) => [...new Set(arr)];
const mayuscula = (s) => s[0].toUpperCase() + s.slice(1);

function armarPregunta(rng, q, correcta, pool) {
  const otros = barajar(rng, unicos(pool).filter((x) => x !== correcta)).slice(0, 3);
  const o = barajar(rng, [correcta, ...otros]);
  return { q, o, r: o.indexOf(correcta) };
}

function opcionesNumericas(rng, correcta, extras) {
  const candidatos = unicos([correcta + 1, correcta - 1, correcta + 2, correcta - 2, correcta + 10, correcta - 10, correcta + 5, correcta - 5, ...(extras || [])])
    .filter((x) => x > 0 && x !== correcta);
  const o = barajar(rng, [correcta, ...barajar(rng, candidatos).slice(0, 3)]).map(String);
  return { o, r: o.indexOf(String(correcta)) };
}

function entre(rng, a, b) {
  return a + Math.floor(rng() * (b - a + 1));
}

/* --- categorías que se inventan solas (nunca se repiten) --- */

function genCuentas(_i, rng) {
  const tipo = entre(rng, 0, 5);
  let q, res;
  if (tipo === 0) {
    const a = entre(rng, 12, 189), b = entre(rng, 12, 189);
    q = `¿Cuánto es ${a} + ${b}?`;
    res = a + b;
  } else if (tipo === 1) {
    const a = entre(rng, 60, 400), b = entre(rng, 11, a - 8);
    q = `¿Cuánto es ${a} − ${b}?`;
    res = a - b;
  } else if (tipo === 2) {
    const a = entre(rng, 6, 25), b = entre(rng, 3, 15);
    q = `¿Cuánto es ${a} × ${b}?`;
    res = a * b;
  } else if (tipo === 3) {
    const b = entre(rng, 3, 15), c = entre(rng, 4, 40);
    q = `¿Cuánto es ${b * c} ÷ ${b}?`;
    res = c;
  } else if (tipo === 4) {
    const n = entre(rng, 17, 899);
    q = `¿Cuál es el doble de ${n}?`;
    res = n * 2;
  } else {
    const m = entre(rng, 9, 450);
    q = `¿Cuál es la mitad de ${m * 2}?`;
    res = m;
  }
  return { q, ...opcionesNumericas(rng, res) };
}

function genCuentas2(_i, rng) {
  const tipo = entre(rng, 0, 5);
  let q, res;
  if (tipo === 0) {
    const p = elegir(rng, [10, 20, 25, 50]);
    const paso = { 10: 10, 20: 5, 25: 4, 50: 2 }[p];
    const n = paso * entre(rng, 4, 150);
    q = `¿Cuánto es el ${p}% de ${n}?`;
    res = (n * p) / 100;
  } else if (tipo === 1) {
    const k = entre(rng, 3, 60);
    q = `¿Cuántos días hay en ${k} semanas?`;
    res = 7 * k;
  } else if (tipo === 2) {
    const k = entre(rng, 2, 48);
    q = `¿Cuántos minutos hay en ${k} horas?`;
    res = 60 * k;
  } else if (tipo === 3) {
    const k = entre(rng, 2, 40);
    q = `¿Cuántos meses hay en ${k} años?`;
    res = 12 * k;
  } else if (tipo === 4) {
    const k = entre(rng, 2, 30);
    q = `¿Cuántos segundos hay en ${k} minutos?`;
    res = 60 * k;
  } else {
    const precio = entre(rng, 12, 195), k = entre(rng, 3, 14);
    q = `Si cada lápiz cuesta $${precio} y compro ${k}, ¿cuánto pago en total?`;
    res = precio * k;
  }
  return { q, ...opcionesNumericas(rng, res) };
}

function genSerie(_i, rng) {
  const tipo = entre(rng, 0, 9);
  let t = [];
  let sig;
  if (tipo <= 1) {
    const a = entre(rng, 1, 190), d = entre(rng, 2, 29);
    t = [a, a + d, a + 2 * d, a + 3 * d];
    sig = a + 4 * d;
  } else if (tipo === 2) {
    const d = entre(rng, 3, 29), a = entre(rng, 4 * d + 10, 4 * d + 200);
    t = [a, a - d, a - 2 * d, a - 3 * d];
    sig = a - 4 * d;
  } else if (tipo === 3) {
    const x = entre(rng, 1, 90), a = entre(rng, 2, 29), b = entre(rng, 2, 29);
    t = [x, x + a, x + a + b, x + 2 * a + b, x + 2 * a + 2 * b];
    sig = x + 3 * a + 2 * b;
  } else if (tipo === 4) {
    const a = entre(rng, 1, 19), b = entre(rng, 2, 29);
    t = [a, b, a + b, a + 2 * b, 2 * a + 3 * b];
    sig = 3 * a + 5 * b;
  } else if (tipo === 5) {
    const s = entre(rng, 1, 190);
    t = [s, s + 1, s + 3, s + 6, s + 10];
    sig = s + 15;
  } else if (tipo === 6) {
    const s = entre(rng, 1, 190), k = entre(rng, 2, 9);
    t = [s, s + k, s + 3 * k, s + 6 * k, s + 10 * k];
    sig = s + 15 * k;
  } else if (tipo === 7) {
    const a = entre(rng, 1, 12), r = entre(rng, 2, 3);
    t = [a, a * r, a * r * r, a * r ** 3];
    sig = a * r ** 4;
  } else if (tipo === 8) {
    const m = entre(rng, 2, 45);
    t = [m * m, (m + 1) ** 2, (m + 2) ** 2, (m + 3) ** 2];
    sig = (m + 4) ** 2;
  } else {
    const a = entre(rng, 1, 90), d = entre(rng, 2, 19), e = entre(rng, 2, 19);
    t = [a, a + d, a + 2 * d, a + 3 * d, a + 4 * d, a + 5 * d].map((v, k) => (k % 2 === 0 ? v : v - d + e));
    sig = a + 6 * d;
  }
  return { q: `¿Qué número sigue en esta serie? ${t.join(", ")}, …`, ...opcionesNumericas(rng, sig, [sig + 3, sig - 3]) };
}

const DIAS_SEMANA_T = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const MESES_T = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function genCalendario(_i, rng) {
  const tipo = entre(rng, 0, 2);
  if (tipo === 0) {
    const d = entre(rng, 0, 6), n = entre(rng, 2, 90);
    const res = DIAS_SEMANA_T[(d + n) % 7];
    return armarPregunta(rng, `Si hoy es ${DIAS_SEMANA_T[d]}, ¿qué día de la semana será dentro de ${n} días?`, mayuscula(res), DIAS_SEMANA_T.map(mayuscula));
  }
  if (tipo === 1) {
    const h = entre(rng, 0, 23), k = entre(rng, 2, 30);
    const fmt = (x) => `${String(x % 24).padStart(2, "0")}:00`;
    const hs = [h + k, h + k + 1, h + k - 1, h + k + 2, h + k - 2, h + k + 3, h + k - 3].map(fmt);
    return armarPregunta(rng, `Si ahora son las ${fmt(h)}, ¿qué hora será dentro de ${k} horas?`, fmt(h + k), hs);
  }
  const m1 = entre(rng, 0, 11), falta = entre(rng, 2, 11);
  const m2 = (m1 + falta) % 12;
  const res = String(falta);
  const cerca = [];
  for (let x = Math.max(1, falta - 4); x <= Math.min(11, falta + 4); x++) if (x !== falta) cerca.push(String(x));
  const o = barajar(rng, [res, ...barajar(rng, cerca).slice(0, 3)]);
  return { q: `Si estamos en ${MESES_T[m1]}, ¿cuántos meses faltan para ${MESES_T[m2]}?`, o, r: o.indexOf(res) };
}

function genIntruso(_i, rng) {
  const tipo = entre(rng, 0, 3);
  const paises = TRIVIA_T.paises;
  const nombresPaises = paises.map((p) => p[0]);
  const nombresCapitales = paises.map((p) => p[1]);
  if (tipo === 0) {
    const cap = elegir(rng, nombresCapitales.filter((c) => !nombresPaises.includes(c)));
    const tres = barajar(rng, nombresPaises).slice(0, 3);
    const o = barajar(rng, [cap, ...tres]);
    return { q: "¿Cuál de estos NO es un país?", o, r: o.indexOf(cap) };
  }
  if (tipo === 1) {
    const pais = elegir(rng, nombresPaises.filter((c) => !nombresCapitales.includes(c)));
    const tres = barajar(rng, nombresCapitales).slice(0, 3);
    const o = barajar(rng, [pais, ...tres]);
    return { q: "¿Cuál de estos NO es una capital?", o, r: o.indexOf(pais) };
  }
  if (tipo === 2) {
    const clases = ["mamífero", "ave", "reptil", "pez", "insecto"];
    const clase = elegir(rng, clases);
    const dentro = TRIVIA_T.animales.filter((a) => a[1] === clase).map((a) => mayuscula(a[0]));
    const fuera = TRIVIA_T.animales.filter((a) => a[1] !== clase).map((a) => mayuscula(a[0]));
    const intruso = elegir(rng, fuera);
    const o = barajar(rng, [intruso, ...barajar(rng, dentro).slice(0, 3)]);
    return { q: `¿Cuál de estos animales NO es un ${clase}?`, o, r: o.indexOf(intruso) };
  }
  const noProvincias = ["Rosario", "Bariloche", "Mar del Plata", "Bahía Blanca", "Tandil", "Villa Gesell", "Puerto Madryn", "El Calafate", "Río Cuarto", "San Rafael", "Villa Carlos Paz", "Pinamar", "Cafayate", "Puerto Iguazú", "Esquel", "Comodoro Rivadavia", "Trelew", "Concordia", "Gualeguaychú", "Olavarría", "Junín", "Pergamino", "Luján", "Tigre", "Quilmes"];
  const intruso = elegir(rng, noProvincias);
  const tres = barajar(rng, TRIVIA_T.provincias.map((p) => p[0])).slice(0, 3);
  const o = barajar(rng, [intruso, ...tres]);
  return { q: "¿Cuál de estos NO es una provincia argentina?", o, r: o.indexOf(intruso) };
}

/* --- categorías armadas desde tablas (cada una incluye también la pregunta "al revés") --- */

function genCapital(i, rng) {
  const [pais, cap, cont] = TRIVIA_T.paises[i];
  const mismos = TRIVIA_T.paises.filter((p) => p[2] === cont && p[1] !== cap).map((p) => p[1]);
  const pool = mismos.length >= 3 ? mismos : TRIVIA_T.paises.map((p) => p[1]);
  return armarPregunta(rng, `¿Cuál es la capital de ${pais}?`, cap, pool);
}

function genContinente(i, rng) {
  const n = TRIVIA_T.paises.length;
  if (i < n) {
    const [pais, , cont] = TRIVIA_T.paises[i];
    return armarPregunta(rng, `¿En qué continente está ${pais}?`, cont, ["América", "Europa", "Asia", "África", "Oceanía"]);
  }
  const [pais, cap] = TRIVIA_T.paises[i - n];
  return armarPregunta(rng, `¿De qué país es capital ${cap}?`, pais, TRIVIA_T.paises.map((p) => p[0]));
}

function genProvincia(i, rng) {
  const n = TRIVIA_T.provincias.length;
  const [prov, cap] = TRIVIA_T.provincias[i % n];
  if (i < n) return armarPregunta(rng, `¿Cuál es la capital de la provincia de ${prov}?`, cap, TRIVIA_T.provincias.map((p) => p[1]));
  return armarPregunta(rng, `¿De qué provincia es capital ${cap}?`, prov, TRIVIA_T.provincias.map((p) => p[0]));
}

const PERSONAJES_T = ["Mafalda", "Sherlock Holmes", "Manuelita"];

function genObra(i, rng) {
  const n = TRIVIA_T.obras.length;
  const [autor, obra] = TRIVIA_T.obras[i % n];
  const personaje = PERSONAJES_T.includes(obra);
  if (i >= n) {
    const pool = TRIVIA_T.obras.filter((p) => p[0] !== autor).map((p) => p[1]);
    const q = personaje ? `¿Cuál de estas creaciones es de ${autor}?` : `¿Cuál de estas obras escribió ${autor}?`;
    return armarPregunta(rng, q, obra, pool);
  }
  const q = personaje ? `¿Quién creó a ${obra}?` : `¿Quién escribió «${obra}»?`;
  return armarPregunta(rng, q, autor, TRIVIA_T.obras.map((p) => p[0]));
}

function genArte(i, rng) {
  const todas = [...TRIVIA_T.pinturas.map((p) => [...p, true]), ...TRIVIA_T.musica.map((p) => [...p, false])];
  const n = todas.length;
  const [autor, obra, esPintura] = todas[i % n];
  const mismaClase = todas.filter((p) => p[2] === esPintura);
  const verbo = esPintura ? "pintó" : "compuso";
  if (i >= n) {
    const pool = mismaClase.filter((p) => p[0] !== autor).map((p) => mayuscula(p[1]));
    return armarPregunta(rng, `¿Cuál de estas obras ${verbo} ${autor}?`, mayuscula(obra), pool);
  }
  const cita = /^(el|la|las|los) /.test(obra) ? obra : `«${obra}»`;
  return armarPregunta(rng, `¿Quién ${verbo} ${cita}?`, autor, mismaClase.map((p) => p[0]));
}

function genMonumento(i, rng) {
  const n = TRIVIA_T.monumentos.length;
  const [monu, pais] = TRIVIA_T.monumentos[i % n];
  if (i < n) {
    const pool = [...TRIVIA_T.monumentos.map((m) => m[1]), ...TRIVIA_T.paises.map((p) => p[0])];
    return armarPregunta(rng, `¿En qué país está ${monu}?`, pais, pool);
  }
  const pool = TRIVIA_T.monumentos.filter((m) => m[1] !== pais).map((m) => mayuscula(m[0]));
  return armarPregunta(rng, `¿Cuál de estos lugares está en ${pais}?`, mayuscula(monu), pool);
}

function genAnimal(i, rng) {
  const n = TRIVIA_T.animales.length;
  const [animal, clase] = TRIVIA_T.animales[i % n];
  if (i < n) {
    return armarPregunta(rng, `¿A qué grupo de animales pertenece ${animal}?`, mayuscula(clase), unicos(TRIVIA_T.animales.map((a) => mayuscula(a[1]))));
  }
  const pool = TRIVIA_T.animales.filter((a) => a[1] !== clase).map((a) => mayuscula(a[0]));
  return armarPregunta(rng, `¿Cuál de estos animales es un ${clase}?`, mayuscula(animal), pool);
}

function genElemento(i, rng) {
  const n = TRIVIA_T.elementos.length;
  if (i < n) {
    const [nombre, simbolo] = TRIVIA_T.elementos[i];
    return armarPregunta(rng, `¿Qué símbolo químico representa al ${nombre.toLowerCase()}?`, simbolo, TRIVIA_T.elementos.map((e) => e[1]));
  }
  const [nombre, simbolo] = TRIVIA_T.elementos[i - n];
  return armarPregunta(rng, `¿Qué elemento químico tiene el símbolo «${simbolo}»?`, nombre, TRIVIA_T.elementos.map((e) => e[0]));
}

function genMundial(i, rng) {
  const n = TRIVIA_T.mundiales.length;
  const [anio, campeon, sede] = TRIVIA_T.mundiales[i % n];
  if (i < n) {
    return armarPregunta(rng, `¿Qué selección ganó el Mundial de fútbol de ${anio}?`, campeon, TRIVIA_T.mundiales.map((m) => m[1]));
  }
  return armarPregunta(rng, `¿Qué país fue sede del Mundial de fútbol de ${anio}?`, sede, TRIVIA_T.mundiales.map((m) => m[2]));
}

function genHecho(i, rng) {
  const n = TRIVIA_T.hechos.length;
  const [anio, hecho] = TRIVIA_T.hechos[i % n];
  const y = Number(anio);
  if (i >= n) {
    const pool = TRIVIA_T.hechos.filter((h) => h[0] !== anio).map((h) => mayuscula(h[1]));
    return armarPregunta(rng, `¿Cuál de estos hechos ocurrió en ${anio}?`, mayuscula(hecho), pool);
  }
  const offsets = barajar(rng, [-1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -8, 8, -10, 10, -12, 12]);
  const otros = [];
  for (const d of offsets) {
    if (otros.length === 3) break;
    if (y + d > 0 && y + d <= 2026) otros.push(String(y + d));
  }
  const o = barajar(rng, [anio, ...otros]);
  return { q: `¿En qué año ${hecho}?`, o, r: o.indexOf(anio) };
}

// Del banco escrito a mano se descartan las preguntas que las tablas ya cubren.
const TRIVIA_LEGACY = TRIVIA_BANCO.filter(
  (p) => !/capital de|Cien años|Meninas|Quijote|Ficciones|cuatro estaciones|Muro de Berlín|llegó el hombre a la Luna|independencia argentina/i.test(p.q)
);

function genLegacy(i, rng) {
  const p = TRIVIA_LEGACY[i];
  const o = barajar(rng, p.o);
  return { q: p.q, o, r: o.indexOf(p.o[p.r]) };
}

// Cuántas preguntas distintas da cada categoría (Infinity = se inventan solas) y cuántos
// lugares tiene en el ciclo: las tablas grandes aparecen más seguido, así todas tardan
// parecido en repetirse.
const TRIVIA_CATEGORIAS = [
  { n: Infinity, peso: 1, gen: genCuentas },
  { n: TRIVIA_T.paises.length, peso: 2, gen: genCapital },
  { n: TRIVIA_T.obras.length * 2, peso: 3, gen: genObra },
  { n: Infinity, peso: 1, gen: genSerie },
  { n: TRIVIA_T.provincias.length * 2, peso: 1, gen: genProvincia },
  { n: TRIVIA_T.monumentos.length * 2, peso: 2, gen: genMonumento },
  { n: Infinity, peso: 1, gen: genCuentas2 },
  { n: TRIVIA_T.animales.length * 2, peso: 2, gen: genAnimal },
  { n: TRIVIA_T.mundiales.length * 2, peso: 1, gen: genMundial },
  { n: (TRIVIA_T.pinturas.length + TRIVIA_T.musica.length) * 2, peso: 2, gen: genArte },
  { n: Infinity, peso: 1, gen: genIntruso },
  { n: TRIVIA_T.elementos.length * 2, peso: 2, gen: genElemento },
  { n: TRIVIA_T.hechos.length * 2, peso: 2, gen: genHecho },
  { n: Infinity, peso: 1, gen: genCalendario },
  { n: TRIVIA_LEGACY.length, peso: 1, gen: genLegacy },
  { n: TRIVIA_T.paises.length * 2, peso: 3, gen: genContinente },
];

// Orden del ciclo: va intercalando categorías para que en un mismo día no se junten parecidas.
const TRIVIA_CICLO = (() => {
  const restantes = TRIVIA_CATEGORIAS.map((c) => c.peso);
  const orden = [];
  let ultimo = -1;
  while (restantes.some((r) => r > 0)) {
    let mejor = -1;
    for (let c = 0; c < restantes.length; c++) {
      if (restantes[c] > 0 && c !== ultimo && (mejor === -1 || restantes[c] > restantes[mejor])) mejor = c;
    }
    if (mejor === -1) mejor = restantes.findIndex((r) => r > 0);
    orden.push({ cat: mejor, rango: TRIVIA_CATEGORIAS[mejor].peso - restantes[mejor] });
    restantes[mejor]--;
    ultimo = mejor;
  }
  return orden;
})();

function preguntasTrivia(ciclo) {
  const K = TRIVIA_CICLO.length;
  const preguntas = [];
  for (let k = 0; k < 5; k++) {
    const t = ciclo * 5 + k;
    const { cat: c, rango } = TRIVIA_CICLO[t % K];
    const cat = TRIVIA_CATEGORIAS[c];
    const vez = Math.floor(t / K) * cat.peso + rango;
    let idx = vez;
    if (Number.isFinite(cat.n)) {
      // Mismo orden mezclado en cada vuelta: así cada pregunta tarda lo máximo posible en volver.
      const orden = barajar(crearRng(c * 1009 + 1), [...Array(cat.n).keys()]);
      idx = orden[vez % cat.n];
    }
    preguntas.push(cat.gen(idx, crearRng(c * 100003 + vez * 7919 + 11)));
  }
  return preguntas;
}

function renderTrivia(contenedor, ciclo) {
  let preguntas = preguntasTrivia(ciclo);
  let actual = 0;
  let aciertos = 0;

  function dibujarPregunta() {
    const p = preguntas[actual];
    contenedor.innerHTML = `
      <p class="juego-progreso">Pregunta ${actual + 1} de ${preguntas.length}</p>
      <p class="trivia-pregunta">${p.q}</p>
      <div class="trivia-opciones">
        ${p.o.map((op, i) => `<button class="trivia-opcion" data-i="${i}">${op}</button>`).join("")}
      </div>
    `;
    contenedor.querySelectorAll(".trivia-opcion").forEach((boton) => {
      boton.addEventListener("click", () => responder(Number(boton.dataset.i)));
    });
  }

  function responder(i) {
    const p = preguntas[actual];
    const botones = contenedor.querySelectorAll(".trivia-opcion");
    botones.forEach((b) => (b.disabled = true));
    botones[p.r].classList.add("trivia-correcta");
    if (i !== p.r) botones[i].classList.add("trivia-incorrecta");
    else aciertos++;

    const siguiente = document.createElement("button");
    siguiente.className = "juego-boton";
    siguiente.textContent = actual + 1 < preguntas.length ? "Siguiente pregunta" : "Ver resultado";
    siguiente.addEventListener("click", () => {
      actual++;
      if (actual < preguntas.length) dibujarPregunta();
      else dibujarResultado();
    });
    contenedor.appendChild(siguiente);
  }

  function dibujarResultado() {
    contenedor.innerHTML = `
      <p class="juego-resultado">¡Listo! Acertaste ${aciertos} de ${preguntas.length} preguntas.</p>
      <button class="juego-boton" id="jugar-de-nuevo">Jugar de nuevo</button>
    `;
    document.getElementById("jugar-de-nuevo").addEventListener("click", () => {
      preguntas = preguntasTrivia(Math.floor(Math.random() * 1000000) + 5000);
      actual = 0;
      aciertos = 0;
      dibujarPregunta();
    });
  }

  dibujarPregunta();
}

/* ---------- sopa de letras ---------- */

function renderSopa(contenedor, semilla, ciclo) {
  function nuevoJuego(rngSemilla, indiceTema) {
    const rng = crearRng(rngSemilla);
    const tema = indiceTema === undefined ? elegir(rng, SOPA_TEMAS) : SOPA_TEMAS[indiceTema % SOPA_TEMAS.length];
    const { grilla, colocadas } = crearGrillaSopa(elegirPalabrasSopa(tema, rng), rng);
    const palabras = colocadas.slice().sort();
    const encontradas = new Set();
    let inicioSeleccion = null;

    function dibujar() {
      const filasHtml = grilla
        .map((fila, f) =>
          fila
            .map((letra, c) => `<button class="sopa-celda" data-f="${f}" data-c="${c}">${letra}</button>`)
            .join("")
        )
        .join("");

      contenedor.innerHTML = `
        <p class="juego-progreso">Tema: ${tema.nombre}. Tocá la primera letra de una palabra y después la última.</p>
        <div class="sopa-grilla" style="grid-template-columns: repeat(${SOPA_TAMANO}, 1fr)">${filasHtml}</div>
        <div class="sopa-palabras">
          ${palabras
            .map((p) => `<span class="sopa-palabra ${encontradas.has(p) ? "encontrada" : ""}">${p}</span>`)
            .join("")}
        </div>
        <button class="juego-boton juego-boton-secundario" id="sopa-cancelar">Cancelar selección</button>
      `;

      document.getElementById("sopa-cancelar").addEventListener("click", () => {
        inicioSeleccion = null;
        dibujar();
      });

      contenedor.querySelectorAll(".sopa-celda").forEach((celda) => {
        celda.addEventListener("click", () => {
          const f = Number(celda.dataset.f);
          const c = Number(celda.dataset.c);
          onTocarCelda(f, c);
        });
      });

      if (encontradas.size === palabras.length) {
        const felicitacion = document.createElement("p");
        felicitacion.className = "juego-resultado";
        felicitacion.textContent = "¡Encontraste todas las palabras! 🎉";
        contenedor.prepend(felicitacion);
        const botonNuevo = document.createElement("button");
        botonNuevo.className = "juego-boton";
        botonNuevo.textContent = "Jugar de nuevo";
        botonNuevo.addEventListener("click", () => nuevoJuego(Date.now() % 100000));
        contenedor.appendChild(botonNuevo);
      }
    }

    function onTocarCelda(f, c) {
      if (!inicioSeleccion) {
        inicioSeleccion = { fila: f, col: c };
        dibujar();
        marcarSeleccionInicial();
        return;
      }
      if (inicioSeleccion.fila === f && inicioSeleccion.col === c) {
        inicioSeleccion = null;
        dibujar();
        return;
      }
      const camino = celdasEnLinea(inicioSeleccion, { fila: f, col: c });
      inicioSeleccion = null;
      if (!camino) {
        dibujar();
        return;
      }
      const letras = camino.map(({ fila, col }) => grilla[fila][col]).join("");
      const letrasInvertidas = letras.split("").reverse().join("");
      const palabraEncontrada = palabras.find(
        (p) => !encontradas.has(p) && (p === letras || p === letrasInvertidas)
      );
      if (palabraEncontrada) encontradas.add(palabraEncontrada);
      dibujar();
    }

    function marcarSeleccionInicial() {
      const celda = contenedor.querySelector(
        `.sopa-celda[data-f="${inicioSeleccion.fila}"][data-c="${inicioSeleccion.col}"]`
      );
      if (celda) celda.classList.add("sopa-celda-seleccionada");
    }

    dibujar();
  }

  nuevoJuego(semilla, ciclo);
}

/* ---------- memoria ---------- */

function renderMemoria(contenedor, semilla) {
  function nuevoJuego() {
    const rng = crearRng(Date.now() % 100000 || semilla);
    const elegidos = barajar(rng, MEMORIA_POOL).slice(0, 12);
    const cartas = barajar(rng, [...elegidos, ...elegidos]).map((emoji, i) => ({
      id: i,
      emoji,
      vuelta: false,
      encontrada: false,
    }));

    let seleccionadas = [];
    let intentos = 0;
    let bloqueado = false;

    function dibujar() {
      contenedor.innerHTML = `
        <p class="juego-progreso">Intentos: ${intentos}</p>
        <div class="memoria-grilla">
          ${cartas
            .map(
              (carta) => `
            <button class="memoria-carta ${carta.vuelta || carta.encontrada ? "vuelta" : ""} ${
                carta.encontrada ? "encontrada" : ""
              }" data-id="${carta.id}" ${bloqueado ? "disabled" : ""}>
              ${carta.vuelta || carta.encontrada ? carta.emoji : "❔"}
            </button>`
            )
            .join("")}
        </div>
      `;
      contenedor.querySelectorAll(".memoria-carta").forEach((boton) => {
        boton.addEventListener("click", () => voltear(Number(boton.dataset.id)));
      });

      if (cartas.every((c) => c.encontrada)) {
        const felicitacion = document.createElement("p");
        felicitacion.className = "juego-resultado";
        felicitacion.textContent = `¡Ganaste! Encontraste todos los pares en ${intentos} intentos. 🎉`;
        contenedor.prepend(felicitacion);
        const botonNuevo = document.createElement("button");
        botonNuevo.className = "juego-boton";
        botonNuevo.textContent = "Jugar de nuevo";
        botonNuevo.addEventListener("click", nuevoJuego);
        contenedor.appendChild(botonNuevo);
      }
    }

    function voltear(id) {
      if (bloqueado) return;
      const carta = cartas.find((c) => c.id === id);
      if (!carta || carta.vuelta || carta.encontrada) return;
      carta.vuelta = true;
      seleccionadas.push(carta);
      dibujar();

      if (seleccionadas.length === 2) {
        intentos++;
        bloqueado = true;
        const [a, b] = seleccionadas;
        if (a.emoji === b.emoji) {
          a.encontrada = true;
          b.encontrada = true;
          seleccionadas = [];
          bloqueado = false;
          dibujar();
        } else {
          setTimeout(() => {
            a.vuelta = false;
            b.vuelta = false;
            seleccionadas = [];
            bloqueado = false;
            dibujar();
          }, 900);
        }
      }
    }

    dibujar();
  }

  nuevoJuego();
}

/* ---------- sudoku ---------- */

function renderSudoku(contenedor, { puzzle, solucion }) {
  const valores = puzzle.split("").map(Number);
  const fijas = valores.map((v) => v !== 0);
  let seleccionada = null;
  let mostrandoSolucion = false;

  function dibujar() {
    const celdasHtml = valores
      .map((v, i) => {
        const fila = Math.floor(i / 9);
        const col = i % 9;
        const clases = [
          "sudoku-celda",
          fijas[i] ? "fija" : "",
          seleccionada === i ? "seleccionada" : "",
          col % 3 === 0 ? "borde-izq" : "",
          fila % 3 === 0 ? "borde-arriba" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return `<button class="${clases}" data-i="${i}" ${fijas[i] ? "disabled" : ""}>${v === 0 ? "" : v}</button>`;
      })
      .join("");

    contenedor.innerHTML = `
      <p class="juego-progreso">Tocá una casilla vacía y después un número.</p>
      <div class="sudoku-grilla">${celdasHtml}</div>
      <div class="sudoku-numeros">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="juego-boton sudoku-num" data-n="${n}">${n}</button>`).join("")}
        <button class="juego-boton sudoku-num" data-n="0">Borrar</button>
      </div>
      <div class="sudoku-acciones">
        <button class="juego-boton" id="sudoku-revisar">Revisar</button>
        <button class="juego-boton juego-boton-secundario" id="sudoku-solucion">Mostrar solución</button>
      </div>
      <p class="juego-resultado" id="sudoku-mensaje"></p>
    `;

    contenedor.querySelectorAll(".sudoku-celda:not(.fija)").forEach((celda) => {
      celda.addEventListener("click", () => {
        seleccionada = Number(celda.dataset.i);
        dibujar();
      });
    });

    contenedor.querySelectorAll(".sudoku-num").forEach((boton) => {
      boton.addEventListener("click", () => {
        if (seleccionada === null) return;
        valores[seleccionada] = Number(boton.dataset.n);
        dibujar();
      });
    });

    document.getElementById("sudoku-revisar").addEventListener("click", revisar);
    document.getElementById("sudoku-solucion").addEventListener("click", () => {
      mostrandoSolucion = true;
      for (let i = 0; i < 81; i++) valores[i] = Number(solucion[i]);
      dibujar();
    });
  }

  function revisar() {
    const mensaje = document.getElementById("sudoku-mensaje");
    if (valores.some((v) => v === 0)) {
      mensaje.textContent = "Todavía quedan casillas vacías.";
      return;
    }
    const correcto = valores.every((v, i) => v === Number(solucion[i]));
    mensaje.textContent = correcto
      ? "¡Está perfecto! 🎉"
      : "Hay algún número que no va. Probá de nuevo.";
  }

  dibujar();
}

document.addEventListener("DOMContentLoaded", iniciarJuegoDelDia);
