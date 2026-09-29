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
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
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

const SOPA_TEMAS = [
  { nombre: "Animales", palabras: ["GATO", "PERRO", "LEON", "TIGRE", "JIRAFA", "ELEFANTE", "CONEJO", "OSO", "CABALLO", "DELFIN"] },
  { nombre: "Frutas", palabras: ["MANZANA", "BANANA", "NARANJA", "UVA", "PERA", "LIMON", "ANANA", "DURAZNO", "FRUTILLA", "SANDIA"] },
  { nombre: "Colores", palabras: ["ROJO", "AZUL", "VERDE", "AMARILLO", "VIOLETA", "NARANJA", "NEGRO", "BLANCO", "CELESTE", "MARRON"] },
  { nombre: "Países de Sudamérica", palabras: ["CHILE", "BOLIVIA", "PARAGUAY", "BRASIL", "URUGUAY", "PERU", "ECUADOR", "COLOMBIA", "VENEZUELA", "GUYANA"] },
  { nombre: "Capitales", palabras: ["LIMA", "QUITO", "BOGOTA", "ASUNCION", "CARACAS", "BRASILIA", "SANTIAGO", "PANAMA", "MONTEVIDEO", "OTTAWA"] },
  { nombre: "Deportes", palabras: ["FUTBOL", "TENIS", "RUGBY", "BASQUET", "VOLEY", "NATACION", "BOXEO", "CICLISMO", "ATLETISMO", "HOCKEY"] },
  { nombre: "Flores", palabras: ["ROSA", "TULIPAN", "CLAVEL", "JAZMIN", "ORQUIDEA", "GIRASOL", "VIOLETA", "AZUCENA", "MARGARITA", "HORTENSIA"] },
  { nombre: "Profesiones", palabras: ["MEDICO", "MAESTRO", "ABOGADO", "PINTOR", "MUSICO", "COCINERO", "BOMBERO", "PILOTO", "INGENIERO", "PERIODISTA"] },
];

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
      }
    }
  }

  const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let f = 0; f < SOPA_TAMANO; f++) {
    for (let c = 0; c < SOPA_TAMANO; c++) {
      if (!grilla[f][c]) grilla[f][c] = elegir(rng, ALFABETO.split(""));
    }
  }
  return grilla;
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

  if (tipo === "trivia") renderTrivia(contenedor, semilla);
  else if (tipo === "sopa") renderSopa(contenedor, semilla);
  else if (tipo === "memoria") renderMemoria(contenedor, semilla);
  else renderSudoku(contenedor, semilla);
}

/* ---------- trivia ---------- */

function preguntasTrivia(semilla) {
  const n = TRIVIA_BANCO.length;
  const inicio = (semilla * 5) % n;
  const preguntas = [];
  for (let i = 0; i < 5; i++) preguntas.push(TRIVIA_BANCO[(inicio + i) % n]);
  return preguntas;
}

function renderTrivia(contenedor, semilla) {
  let preguntas = preguntasTrivia(semilla);
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
      preguntas = barajar(crearRng(Date.now() % 100000), TRIVIA_BANCO).slice(0, 5);
      actual = 0;
      aciertos = 0;
      dibujarPregunta();
    });
  }

  dibujarPregunta();
}

/* ---------- sopa de letras ---------- */

function renderSopa(contenedor, semilla) {
  function nuevoJuego(rngSemilla) {
    const rng = crearRng(rngSemilla);
    const tema = elegir(rng, SOPA_TEMAS);
    const grilla = crearGrillaSopa(tema.palabras, rng);
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
          ${tema.palabras
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

      if (encontradas.size === tema.palabras.length) {
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
      const palabraEncontrada = tema.palabras.find(
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

  nuevoJuego(semilla);
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

function renderSudoku(contenedor, semilla) {
  const { puzzle, solucion } = SUDOKU_BANCO[semilla % SUDOKU_BANCO.length];
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
