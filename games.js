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
  { q: "¿Cuál es la capital de Francia?", o: ["Madrid", "París", "Roma", "Berlín"], r: 1 },
  { q: "¿Cuántos días tiene un año bisiesto?", o: ["360", "365", "366", "370"], r: 2 },
  { q: "¿Cuál es el río más largo del mundo?", o: ["Nilo", "Amazonas", "Paraná", "Misisipi"], r: 1 },
  { q: "¿Qué planeta es conocido como \"el planeta rojo\"?", o: ["Venus", "Júpiter", "Marte", "Saturno"], r: 2 },
  { q: "¿Cuál es el océano más grande del mundo?", o: ["Atlántico", "Índico", "Pacífico", "Ártico"], r: 2 },
  { q: "¿En qué continente está Egipto?", o: ["Asia", "África", "Europa", "Oceanía"], r: 1 },
  { q: "¿Cuántas patas tiene una araña?", o: ["6", "8", "10", "4"], r: 1 },
  { q: "¿Cuál es el animal terrestre más grande del mundo?", o: ["Rinoceronte", "Hipopótamo", "Elefante africano", "Jirafa"], r: 2 },
  { q: "¿Qué gas necesitamos respirar para vivir?", o: ["Dióxido de carbono", "Oxígeno", "Nitrógeno", "Hidrógeno"], r: 1 },
  { q: "¿Cuál es la moneda de Brasil?", o: ["Peso", "Real", "Sol", "Bolívar"], r: 1 },
  { q: "¿Quién pintó la Mona Lisa?", o: ["Pablo Picasso", "Miguel Ángel", "Leonardo da Vinci", "Vincent van Gogh"], r: 2 },
  { q: "¿Cuántos colores tiene el arcoíris?", o: ["5", "6", "7", "8"], r: 2 },
  { q: "¿Cuál es el hueso más largo del cuerpo humano?", o: ["El húmero", "El fémur", "La tibia", "La columna"], r: 1 },
  { q: "¿En qué país está la Torre Eiffel?", o: ["Italia", "España", "Francia", "Inglaterra"], r: 2 },
  { q: "¿Cuál es la capital de Argentina?", o: ["Córdoba", "Rosario", "Buenos Aires", "Mendoza"], r: 2 },
  { q: "¿Cuántos lados tiene un hexágono?", o: ["5", "6", "7", "8"], r: 1 },
  { q: "¿Qué instrumento se usa para medir la temperatura?", o: ["El barómetro", "El termómetro", "La balanza", "El altímetro"], r: 1 },
  { q: "¿Qué océano baña las playas de Mar del Plata?", o: ["El Pacífico", "El Atlántico", "El Índico", "El Ártico"], r: 1 },
  { q: "¿Cómo se llama el proceso con el que las plantas fabrican su alimento?", o: ["Respiración", "Fotosíntesis", "Germinación", "Polinización"], r: 1 },
  { q: "¿Cuál es el país más grande del mundo por superficie?", o: ["Canadá", "China", "Rusia", "Brasil"], r: 2 },
  { q: "¿Cuántas cuerdas tiene una guitarra clásica?", o: ["4", "5", "6", "7"], r: 2 },
  { q: "¿Qué animal es conocido como \"el rey de la selva\"?", o: ["El tigre", "El león", "El leopardo", "El puma"], r: 1 },
  { q: "¿Cuál es la capital de Italia?", o: ["Milán", "Nápoles", "Roma", "Venecia"], r: 2 },
  { q: "¿En qué mes se celebra el Día de la Independencia argentina?", o: ["Mayo", "Junio", "Julio", "Agosto"], r: 2 },
  { q: "¿Cuántos meses tiene un año?", o: ["10", "11", "12", "13"], r: 2 },
  { q: "¿Cuál es el idioma con más hablantes nativos en el mundo?", o: ["El inglés", "El español", "El chino mandarín", "El hindi"], r: 2 },
  { q: "¿Qué fruta amarilla y curva es rica en potasio?", o: ["La banana", "La pera", "El limón", "El ananá"], r: 0 },
  { q: "¿Cómo se llama el satélite natural de la Tierra?", o: ["Marte", "La Luna", "El Sol", "Venus"], r: 1 },
  { q: "¿Qué país tiene forma de bota?", o: ["España", "Grecia", "Italia", "Portugal"], r: 2 },
  { q: "¿Cuántas estaciones tiene el año?", o: ["2", "3", "4", "5"], r: 2 },
  { q: "¿Qué instrumento musical tiene teclas blancas y negras?", o: ["El violín", "El piano", "La flauta", "El acordeón"], r: 1 },
  { q: "¿Cuál es la capital de España?", o: ["Barcelona", "Sevilla", "Madrid", "Valencia"], r: 2 },
  { q: "¿Cómo se llama la cordillera que recorre la Argentina de norte a sur?", o: ["Los Andes", "Los Alpes", "El Himalaya", "Los Urales"], r: 0 },
  { q: "¿Qué insecto produce la miel?", o: ["La hormiga", "La abeja", "La mariposa", "El escarabajo"], r: 1 },
  { q: "¿Cuál es el deporte más popular en la Argentina?", o: ["El rugby", "El básquet", "El fútbol", "El tenis"], r: 2 },
  { q: "¿Cuántos jugadores tiene un equipo de fútbol dentro de la cancha?", o: ["9", "10", "11", "12"], r: 2 },
  { q: "¿Cuál es el ave nacional de la Argentina?", o: ["El cóndor", "El hornero", "El ñandú", "El zorzal"], r: 1 },
  { q: "¿Cuál es la capital de México?", o: ["Guadalajara", "Ciudad de México", "Cancún", "Monterrey"], r: 1 },
  { q: "¿Cuál es la estación del año más calurosa?", o: ["El otoño", "El invierno", "El verano", "La primavera"], r: 2 },
  { q: "¿Qué color se obtiene al mezclar azul y amarillo?", o: ["Violeta", "Naranja", "Verde", "Marrón"], r: 2 },
];

/* ---------- banco de sopa de letras ---------- */

const SOPA_TEMAS = [
  { nombre: "Animales", palabras: ["GATO", "PERRO", "LEON", "TIGRE", "JIRAFA", "ELEFANTE", "CONEJO", "OSO"] },
  { nombre: "Frutas", palabras: ["MANZANA", "BANANA", "NARANJA", "UVA", "PERA", "LIMON", "ANANA", "DURAZNO"] },
  { nombre: "Colores", palabras: ["ROJO", "AZUL", "VERDE", "AMARILLO", "VIOLETA", "NARANJA", "NEGRO", "BLANCO"] },
  { nombre: "Países de Sudamérica", palabras: ["CHILE", "BOLIVIA", "PARAGUAY", "BRASIL", "URUGUAY", "PERU", "ECUADOR", "COLOMBIA"] },
  { nombre: "Capitales", palabras: ["LIMA", "QUITO", "BOGOTA", "ASUNCION", "CARACAS", "BRASILIA", "SANTIAGO", "PANAMA"] },
  { nombre: "Deportes", palabras: ["FUTBOL", "TENIS", "RUGBY", "BASQUET", "VOLEY", "NATACION", "BOXEO", "CICLISMO"] },
  { nombre: "Flores", palabras: ["ROSA", "TULIPAN", "CLAVEL", "JAZMIN", "ORQUIDEA", "GIRASOL", "VIOLETA", "AZUCENA"] },
  { nombre: "Profesiones", palabras: ["MEDICO", "MAESTRO", "ABOGADO", "PINTOR", "MUSICO", "COCINERO", "BOMBERO", "PILOTO"] },
];

const SOPA_TAMANO = 10;
const SOPA_DIRECCIONES = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: 1 },
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
  { puzzle: "020078000036915407490062050201080005763000204958000760502800046304500870089043510", solucion: "125478693836915427497362158241687935763159284958234761572891346314526879689743512" },
  { puzzle: "000062380320498501807010460000800925002056048518020030089005003204030057135607090", solucion: "451762389326498571897513462643871925972356148518924736789245613264139857135687294" },
  { puzzle: "020007060370060800684301000598006734736480002142000698010620007067050301003108026", solucion: "925847163371562849684391275598216734736489512142735698819623457267954381453178926" },
  { puzzle: "630210987892570400074398060081039750300700600040180029517923000008050200000007105", solucion: "635214987892576431174398562281639754359742618746185329517923846968451273423867195" },
  { puzzle: "800620100906000200152730964360915042200384790409076300590140008000802003708500009", solucion: "874629135936451287152738964367915842215384796489276351593147628641892573728563419" },
  { puzzle: "904200506205908741007540920052480097098170032070020800009000078740850200083002015", solucion: "914237586235968741867541923352486197498175632176329854529614378741853269683792415" },
  { puzzle: "046008271009217046702000308030780450974000823000904617003165080020800000800429105", solucion: "546398271389217546712546398631782459974651823258934617493165782125873964867429135" },
  { puzzle: "903618000800340910104097306000024698600079405495003271040002109200406700706000820", solucion: "923618547867345912154297386371524698682179435495863271548732169219486753736951824" },
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
    const elegidos = barajar(rng, MEMORIA_POOL).slice(0, 8);
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
