// "Juegos La Nación": versiones propias (contenido original) de tres pasatiempos clásicos
// del diario: Diferencias, Crucigrama y Palabra oculta. Rota uno por día.
// Usa las utilidades de games.js (fechaHoyART, diasDesdeEpoch, crearRng, elegir, barajar).

(function () {
  const TIPOS_LN = ["diferencias", "crucigrama", "palabra"];
  const NOMBRES_LN = {
    diferencias: "Diferencias 🔍",
    crucigrama: "Crucigrama ✏️",
    palabra: "Palabra oculta 🔤",
  };

  /* ---------- guardado del progreso del día ---------- */

  const PREFIJO = "canillita-ln-";

  function leer(clave) {
    try {
      return JSON.parse(localStorage.getItem(PREFIJO + clave));
    } catch {
      return null;
    }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
    } catch {
      // sin almacenamiento: el progreso vale solo para esta visita
    }
  }

  function limpiarViejos(fecha) {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIJO) && !k.startsWith(PREFIJO + fecha))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      // nada que limpiar
    }
  }

  /* ---------- teclado en pantalla (Palabra oculta y Crucigrama) ---------- */

  const FILAS_TECLADO = ["QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"];

  function htmlTeclado(estados, conEnviar) {
    const tecla = (l) => `<button type="button" class="tec ${estados[l] || ""}" data-tecla="${l}">${l}</button>`;
    const filas = FILAS_TECLADO.map((fila, i) => {
      let h = fila.split("").map(tecla).join("");
      if (i === 2) {
        if (conEnviar) h = `<button type="button" class="tec tec-ancha" data-tecla="ENTER">Enviar</button>` + h;
        h += `<button type="button" class="tec tec-ancha" data-tecla="BORRAR" aria-label="Borrar">⌫</button>`;
      }
      return `<div class="tec-fila">${h}</div>`;
    });
    return `<div class="teclado">${filas.join("")}</div>`;
  }

  let manejadorTeclas = null;

  function escucharTeclado(fn) {
    if (manejadorTeclas) document.removeEventListener("keydown", manejadorTeclas);
    manejadorTeclas = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target && e.target.tagName;
      if (t === "INPUT" || t === "TEXTAREA") return;
      if (e.key === "Enter") fn("ENTER");
      else if (e.key === "Backspace") fn("BORRAR");
      else if (/^[a-zñ]$/i.test(e.key)) fn(e.key.toUpperCase());
      else return;
      if (e.key === "Backspace" || e.key === "Enter") e.preventDefault();
    };
    document.addEventListener("keydown", manejadorTeclas);
  }

  /* ---------- PALABRA OCULTA ---------- */

  const PALABRAS = "PLAYA LIBRO SILLA FELIZ TIGRE NUBES RELOJ CAMPO FUEGO PLATO VERDE BLUSA CARTA MUNDO NOCHE TARDE ARBOL FRUTA PERRO PAPEL LLAVE CALLE JUEGO VIAJE DULCE AMIGO CINTA BANCO PLAZA RADIO TRIGO LIMON MANGO PIANO NIEVE BRISA CIELO SELVA TENIS RUGBY GLOBO MUSEO CLIMA TRUCO NAIPE TANGO ASADO AVION BARCO COCHE MOTOR RUEDA PUNTO LINEA NORTE OESTE COSTA ARENA ROBLE CEDRO PALMA ROSAL FLORA FAUNA POTRO GANSO AGUJA SABOR AROMA GUSTO DIETA SALUD ANDEN VAGON METRO TECHO PARED HORNO JARRA PASTA PIZZA HUEVO LECHE QUESO TORTA CREMA SALSA BRAZO CARNE PECHO MENTE SABIO TEMOR HONOR AVENA ARROZ MIEDO RISAS CANTO BAILE COLOR TINTA FERIA CLASE MONTE VALLE CERRO HIELO PLUMA LLAMA".split(" ");

  const INTENTOS_MAX = 6;
  const LARGO = 5;

  function evaluarIntento(adiv, resp) {
    const res = Array(LARGO).fill("ausente");
    const sobran = {};
    for (let i = 0; i < LARGO; i++) {
      if (adiv[i] === resp[i]) res[i] = "correcta";
      else sobran[resp[i]] = (sobran[resp[i]] || 0) + 1;
    }
    for (let i = 0; i < LARGO; i++) {
      if (res[i] !== "correcta" && sobran[adiv[i]] > 0) {
        res[i] = "presente";
        sobran[adiv[i]]--;
      }
    }
    return res;
  }

  function renderPalabraOculta(cont, fecha, ciclo) {
    const resp = PALABRAS[ciclo % PALABRAS.length];
    const clave = `${fecha}-palabra`;
    const guardado = leer(clave);
    const intentos = Array.isArray(guardado) ? guardado.filter((s) => typeof s === "string" && s.length === LARGO) : [];
    let actual = "";
    let mensaje = "";

    const gano = () => intentos.length > 0 && intentos[intentos.length - 1] === resp;
    const termino = () => gano() || intentos.length >= INTENTOS_MAX;

    function dibujar() {
      const estados = {};
      const rango = { ausente: 1, presente: 2, correcta: 3 };
      intentos.forEach((it) => {
        evaluarIntento(it, resp).forEach((e, i) => {
          if (!estados[it[i]] || rango[e] > rango[estados[it[i]]]) estados[it[i]] = e;
        });
      });

      let filas = "";
      for (let f = 0; f < INTENTOS_MAX; f++) {
        let celdas = "";
        if (f < intentos.length) {
          const ev = evaluarIntento(intentos[f], resp);
          celdas = intentos[f].split("").map((l, i) => `<div class="pal-casilla ${ev[i]}">${l}</div>`).join("");
        } else if (f === intentos.length && !termino()) {
          for (let i = 0; i < LARGO; i++) {
            const l = actual[i] || "";
            celdas += `<div class="pal-casilla ${l ? "escribiendo" : ""}">${l}</div>`;
          }
        } else {
          celdas = '<div class="pal-casilla"></div>'.repeat(LARGO);
        }
        filas += `<div class="pal-fila">${celdas}</div>`;
      }

      let final = "";
      if (gano()) final = `<p class="juego-resultado">¡Excelente! Era ${resp}. Lo lograste en ${intentos.length} ${intentos.length === 1 ? "intento" : "intentos"}. 🎉</p>`;
      else if (termino()) final = `<p class="juego-resultado">Se terminaron los intentos. La palabra era ${resp}. Mañana hay otra.</p>`;

      cont.innerHTML = `
        <p class="juego-progreso">Adiviná la palabra de ${LARGO} letras en ${INTENTOS_MAX} intentos. Verde: letra bien puesta. Amarillo: está, pero en otro lugar. Gris: no está.</p>
        <div class="pal-grilla">${filas}</div>
        <p class="juego-aviso" aria-live="polite">${mensaje}</p>
        ${final}
        ${termino() ? "" : htmlTeclado(estados, true)}
      `;
    }

    function tecla(t) {
      if (termino()) return;
      mensaje = "";
      if (t === "BORRAR") actual = actual.slice(0, -1);
      else if (t === "ENTER") {
        if (actual.length < LARGO) mensaje = "Faltan letras.";
        else {
          intentos.push(actual);
          actual = "";
          guardar(clave, intentos);
        }
      } else if (actual.length < LARGO) actual += t;
      dibujar();
    }

    cont.onclick = (e) => {
      const b = e.target.closest("[data-tecla]");
      if (b) tecla(b.dataset.tecla);
    };
    escucharTeclado(tecla);
    dibujar();
  }

  /* ---------- CRUCIGRAMA ---------- */

  // Cada palabra: [número, fila, columna, dirección, respuesta, pista]
  const CRUCIGRAMAS = [{"f":13,"c":11,"p":[[1,0,1,"V","COMETA","Cuerpo celeste con cola luminosa"],[2,0,4,"V","PUMA","Felino de montaña americano"],[3,0,8,"V","SATELITE","La Luna lo es de la Tierra"],[4,1,1,"H","ORQUESTA","Conjunto de músicos que tocan juntos"],[5,1,10,"V","TOMATE","Fruto rojo de la ensalada"],[6,3,0,"H","LETRA","Signo del alfabeto"],[7,3,3,"V","ROSA","Flor con espinas"],[8,3,6,"V","ESCUELA","Donde estudian los chicos"],[9,4,6,"H","SELVA","Bosque tropical espeso"],[10,6,2,"H","BASQUET","Se juega con aro y pelota naranja"],[11,7,1,"V","HUESO","Parte dura del esqueleto"],[12,9,1,"H","ESCOBA","Sirve para barrer"],[13,9,3,"V","CINE","Sala donde se proyectan películas"],[14,11,0,"H","HORNERO","Ave que construye su nido de barro"]]},{"f":11,"c":11,"p":[[1,0,0,"H","TREN","Va sobre rieles"],[2,0,2,"V","EMPANADA","Masa rellena, plato típico"],[3,0,5,"V","SUBTE","Tren subterráneo porteño"],[4,1,8,"V","DADO","Cubo con puntos del uno al seis"],[5,1,10,"V","BOMBERO","Apaga incendios"],[6,2,4,"H","ABOGADO","Defiende en los juicios"],[7,4,1,"H","INVIERNO","Estación más fría"],[8,6,5,"V","LEON","Rey de la selva"],[9,6,7,"V","BARCO","Navega por el agua"],[10,7,1,"H","BANDERA","Símbolo patrio de colores"],[11,9,0,"H","PULMON","Órgano de la respiración"],[12,10,6,"H","POETA","Autor de versos"]]},{"f":11,"c":10,"p":[[1,0,1,"V","CRUCIGRAMA","Pasatiempo de palabras cruzadas"],[2,0,7,"V","GEOGRAFIA","Estudia la Tierra y sus paisajes"],[3,0,9,"V","PAPA","Tubérculo que se come frito, hervido o en puré"],[4,1,4,"H","NOVELA","Obra literaria extensa de ficción"],[5,3,3,"V","RELOJ","Marca la hora"],[6,5,1,"H","GALLINA","Pone huevos"],[7,5,5,"V","ISLA","Tierra rodeada de agua por todos lados"],[8,5,9,"V","PILOTO","Conduce un avión"],[9,8,4,"H","ZAPATO","Calzado"],[10,9,0,"H","LAGO","Masa de agua dulce rodeada de tierra"],[11,10,4,"H","HELADO","Postre frío de crema"]]},{"f":12,"c":10,"p":[[1,0,4,"V","CANCION","Composición para cantar"],[2,1,0,"H","CARNAVAL","Fiesta con disfraces y murgas"],[3,1,9,"V","PINGUINO","Ave que no vuela y vive en el frío"],[4,3,0,"V","JAZMIN","Flor blanca muy perfumada"],[5,3,2,"H","COCINA","Habitación donde se prepara la comida"],[6,5,2,"V","LLUVIA","Cae de las nubes"],[7,5,7,"V","ZAPALLO","Hortaliza grande y anaranjada"],[8,6,0,"H","MILANESA","Carne rebozada y frita"],[9,8,4,"H","VERANO","Estación más calurosa"],[10,10,0,"H","ASADO","Comida típica argentina que se prepara a la parrilla"],[11,11,6,"H","ROJO","Color de la sangre"]]},{"f":13,"c":10,"p":[[1,0,5,"H","VERDE","Color del pasto"],[2,0,8,"V","DELFIN","Mamífero marino muy inteligente"],[3,1,1,"V","TELESCOPIO","Instrumento para mirar los astros"],[4,1,4,"V","VITAMINA","Sustancia que el cuerpo necesita en pequeñas dosis"],[5,2,6,"V","TEATRO","Sala donde se representan obras"],[6,4,3,"H","GALAXIA","Conjunto de millones de estrellas"],[7,6,1,"H","COLIBRI","Ave diminuta que vuela quieta en el aire"],[8,8,8,"V","PIANO","Instrumento de teclas blancas y negras"],[9,9,3,"V","VACA","Da leche"],[10,10,0,"H","CORAZON","Órgano que bombea sangre"],[11,12,2,"H","CABILDO","Edificio histórico de la Plaza de Mayo"]]},{"f":13,"c":10,"p":[[1,0,1,"H","MONEDA","Pieza de metal para pagar"],[1,0,1,"V","MENDOZA","Provincia argentina famosa por sus vinos"],[2,2,1,"H","NIEBLA","Nube baja que reduce la visibilidad"],[3,2,8,"V","BANCO","Guarda el dinero"],[4,4,5,"H","HIMNO","Canción patria"],[5,5,4,"V","TRUCO","Juego de cartas muy popular en Argentina"],[6,6,1,"H","AMARILLO","Color del limón"],[7,6,2,"V","MEDICO","Profesional que atiende enfermos"],[8,7,0,"V","MUSICA","Arte de combinar sonidos"],[9,8,4,"H","CAFE","Bebida oscura y estimulante"],[10,11,0,"H","CHOCOLATE","Dulce hecho con cacao"]]},{"f":13,"c":10,"p":[[1,0,5,"V","MESSI","Capitán campeón del mundo en Qatar 2022"],[2,1,3,"H","MAESTRO","Enseña en la escuela"],[3,1,9,"V","ORQUIDEA","Flor exótica y delicada"],[4,4,2,"V","HORMIGA","Insecto trabajador que camina en fila"],[5,5,4,"V","SANDIA","Fruta grande, verde por fuera y roja por dentro"],[6,5,7,"V","PANADERO","Hace el pan"],[7,6,0,"H","FARMACIA","Lugar donde se venden remedios"],[7,6,0,"V","FARO","Torre con luz que guía a los barcos"],[8,8,6,"H","MAPA","Representa un territorio dibujado"],[9,10,1,"H","DAMAS","Juego de fichas en un tablero"],[10,12,1,"H","NATACION","Deporte que se practica en la pileta"]]},{"f":13,"c":11,"p":[[1,0,0,"H","TENIS","Deporte de raqueta y red"],[1,0,0,"V","TORTUGA","Reptil con caparazón"],[2,0,2,"V","NAVIDAD","Fiesta del 25 de diciembre"],[3,2,5,"H","ESPEJO","Refleja la imagen"],[3,2,5,"V","ELEFANTE","Mamífero con trompa"],[4,2,7,"V","PARANA","Río que baña Brasil, Paraguay y Argentina"],[5,4,10,"V","OCEANO","Gran extensión de agua salada"],[6,6,2,"H","DURAZNO","Fruta aterciopelada con carozo"],[7,8,2,"V","CALLE","Vía urbana entre edificios"],[8,9,2,"H","ATLETISMO","Carreras y saltos en la pista"],[9,11,1,"H","FLAUTA","Instrumento de viento"]]},{"f":13,"c":10,"p":[[1,0,0,"V","HOSPITAL","Lugar donde se atiende a los enfermos"],[2,1,5,"H","BRUJA","Personaje de los cuentos que vuela en escoba"],[3,1,8,"V","JIRAFA","Animal de cuello larguísimo"],[4,3,0,"H","PINTOR","Artista de los pinceles y el óleo"],[5,3,3,"V","TIGRE","Felino rayado"],[6,5,6,"V","MUSEO","Lugar donde se exhiben objetos históricos"],[7,6,2,"H","BRUJULA","Señala el norte"],[8,7,9,"V","PELOTA","Se patea o se lanza en muchos deportes"],[9,8,2,"V","RADIO","Medio que se escucha"],[10,8,4,"H","ACEITE","Líquido graso que se saca de la oliva"],[10,8,4,"V","AZUL","Color del cielo despejado"],[11,11,1,"H","BILLETE","Papel moneda"]]},{"f":13,"c":11,"p":[[1,0,0,"H","PAMPA","Llanura extensa del centro de la Argentina"],[1,0,0,"V","PALABRA","Conjunto de letras con significado"],[2,1,5,"H","GAUCHO","Jinete de la pampa argentina"],[3,1,8,"V","CANCHA","Terreno de juego"],[4,1,10,"V","OBELISCO","Monumento emblemático de Buenos Aires"],[5,2,0,"H","LIMON","Cítrico ácido"],[6,2,4,"V","NAIPE","Carta de la baraja"],[7,3,4,"H","AVION","Vuela con alas y motores"],[8,5,2,"V","CASTILLO","Fortaleza de los reyes"],[9,6,2,"H","AVENIDA","Calle ancha y principal"],[10,8,0,"H","FUTBOL","Deporte más popular del país"],[11,10,0,"H","BALLENA","Mamífero marino gigante que visita Península Valdés"],[12,12,1,"H","BOSQUE","Terreno poblado de árboles"]]},{"f":13,"c":11,"p":[[1,0,0,"H","CARPINTERO","Trabaja la madera"],[1,0,0,"V","CAMISA","Prenda con cuello y botones"],[2,0,6,"V","TELEFONO","Sirve para hablar a distancia"],[3,2,2,"H","CEBOLLA","Hortaliza que hace llorar"],[4,4,2,"V","LLAVE","Abre una cerradura"],[5,4,4,"H","BUFANDA","Abriga el cuello"],[6,6,1,"H","CARPINCHO","Roedor más grande del mundo"],[7,8,0,"H","VIENTO","Aire en movimiento"],[7,8,0,"V","VOLEY","Deporte de red con pelota en el aire"],[8,8,4,"V","TANGO","Baile rioplatense nacido en Buenos Aires"],[9,8,8,"V","QUESO","Derivado de la leche"],[10,11,4,"H","GIRASOL","Flor que sigue al Sol"]]},{"f":13,"c":10,"p":[[1,0,3,"H","ALFAJOR","Golosina de dos tapas rellena"],[2,0,9,"V","RELAMPAGO","Destello de luz en una tormenta"],[3,2,1,"H","VIOLETA","Color entre el azul y el rojo"],[4,2,3,"V","OPERA","Obra teatral cantada con orquesta"],[5,4,0,"H","ANDES","Cordillera que bordea la Argentina por el oeste"],[6,6,0,"H","PARAGUAS","Protege de la lluvia"],[6,6,0,"V","PIRATA","Ladrón de los mares"],[7,6,6,"V","AJEDREZ","Juego de reyes, torres y alfiles"],[8,8,2,"H","DESIERTO","Región árida con muy poca lluvia"],[9,10,3,"H","PUERTA","Se abre para entrar"],[10,12,3,"H","PLAZA","Espacio público con bancos y árboles"]]},{"f":12,"c":11,"p":[[1,0,1,"V","RUGBY","Deporte donde juegan Los Pumas"],[2,1,3,"V","CARTERO","Reparte las cartas"],[3,2,0,"H","IGUAZU","Cataratas en el límite con Brasil"],[4,2,8,"V","VENTANA","Abertura de la pared con vidrio"],[5,3,10,"V","COCINERO","Prepara la comida en un restaurante"],[6,4,5,"H","CUENTO","Narración breve"],[7,6,1,"H","TORMENTA","Lluvia con truenos y relámpagos"],[7,6,1,"V","TAMBOR","Instrumento que se golpea"],[8,8,5,"H","YACARE","Reptil del litoral, parecido al cocodrilo"],[9,9,0,"H","ABEJA","Insecto que hace miel"],[10,11,0,"H","ARQUITECTO","Diseña edificios"]]},{"f":12,"c":11,"p":[[1,0,0,"H","PUENTE","Une dos orillas"],[1,0,0,"V","POETA","Autor de versos"],[2,2,0,"H","ESTOMAGO","Órgano que digiere"],[3,2,5,"V","AVION","Vuela con alas y motores"],[4,4,2,"V","MILANESA","Carne rebozada y frita"],[5,4,8,"V","JARDIN","Terreno con plantas junto a la casa"],[6,4,10,"V","ECLIPSE","Oscurecimiento del Sol por la Luna"],[7,5,1,"H","HISTORIA","Ciencia que estudia el pasado"],[8,8,0,"H","CONDOR","Gran ave de los Andes"],[9,9,6,"H","TENIS","Deporte de raqueta y red"],[10,11,2,"H","ARCOIRIS","Aparece tras la lluvia cuando sale el sol"]]},{"f":13,"c":11,"p":[[1,0,6,"V","PIANO","Instrumento de teclas blancas y negras"],[2,1,0,"V","OPERA","Obra teatral cantada con orquesta"],[3,1,4,"V","LECHUGA","Hoja verde de la ensalada"],[4,1,10,"V","ESCULTOR","Artista que talla estatuas"],[5,2,0,"H","PLANETA","Cuerpo que gira alrededor de una estrella"],[6,4,2,"V","PRINCIPE","Hijo del rey"],[7,5,8,"V","SOMBRERO","Prenda para la cabeza"],[8,6,1,"H","PINGUINO","Ave que no vuela y vive en el frío"],[9,8,5,"H","TAMBOR","Instrumento que se golpea"],[10,10,2,"H","PRIMAVERA","Estación de las flores"],[11,12,3,"H","MARIPOSA","Insecto de alas coloridas"]]},{"f":13,"c":10,"p":[[1,0,9,"V","DAMAS","Juego de fichas en un tablero"],[2,1,1,"V","CORAZON","Órgano que bombea sangre"],[3,1,3,"H","CALLE","Vía urbana entre edificios"],[4,1,4,"V","ARBITRO","Juez de un partido"],[5,3,6,"H","MAPA","Representa un territorio dibujado"],[6,3,7,"V","ALMOHADA","Se apoya la cabeza para dormir"],[7,6,0,"H","CONGRESO","Edificio donde se sancionan las leyes"],[8,8,6,"H","CAFE","Bebida oscura y estimulante"],[9,9,3,"V","ROSA","Flor con espinas"],[10,10,1,"H","CHOCOLATE","Dulce hecho con cacao"],[11,12,2,"H","PALABRA","Conjunto de letras con significado"]]}];

  function renderCrucigrama(cont, fecha, ciclo) {
    const P = CRUCIGRAMAS[ciclo % CRUCIGRAMAS.length];
    const palabras = P.p.map(([n, r, c, d, resp, pista]) => ({
      n, r, c, d, resp, pista,
      celdas: resp.split("").map((_, i) => ({ r: r + (d === "V" ? i : 0), c: c + (d === "H" ? i : 0) })),
    }));

    const info = {};
    palabras.forEach((w, i) => {
      w.celdas.forEach(({ r, c }, k) => {
        const o = info[r + "," + c] || (info[r + "," + c] = { letra: w.resp[k] });
        o[w.d] = i;
      });
      info[w.r + "," + w.c].num = w.n;
    });

    const clave = `${fecha}-crucigrama`;
    const guardado = leer(clave);
    const valores = guardado && typeof guardado === "object" && !Array.isArray(guardado) ? guardado : {};
    let activo = { r: palabras[0].r, c: palabras[0].c, dir: palabras[0].d };
    let revisando = false;
    let mensaje = "";

    const claveCelda = (r, c) => r + "," + c;
    const totalCeldas = Object.keys(info).length;
    const llenas = () => Object.keys(info).filter((k) => valores[k]).length;
    const correctas = () => Object.keys(info).filter((k) => valores[k] === info[k].letra).length;

    function palabraActiva() {
      const o = info[claveCelda(activo.r, activo.c)];
      if (o[activo.dir] === undefined) activo.dir = activo.dir === "H" ? "V" : "H";
      return palabras[o[activo.dir]];
    }

    function dibujar() {
      const w = palabraActiva();
      const enPalabra = new Set(w.celdas.map(({ r, c }) => claveCelda(r, c)));

      let grilla = "";
      for (let r = 0; r < P.f; r++) {
        for (let c = 0; c < P.c; c++) {
          const k = claveCelda(r, c);
          const o = info[k];
          if (!o) {
            grilla += '<div class="cru-bloque"></div>';
            continue;
          }
          const v = valores[k] || "";
          const clases = [
            "cru-celda",
            enPalabra.has(k) ? "resaltada" : "",
            activo.r === r && activo.c === c ? "activa" : "",
            revisando && v && v !== o.letra ? "incorrecta" : "",
          ].filter(Boolean).join(" ");
          grilla += `<button type="button" class="${clases}" data-r="${r}" data-c="${c}">${o.num ? `<span class="cru-num">${o.num}</span>` : ""}${v}</button>`;
        }
      }

      const lista = (dir) =>
        palabras
          .map((p, i) => ({ p, i }))
          .filter(({ p }) => p.d === dir)
          .map(({ p, i }) => `<button type="button" class="cru-pista ${p === w ? "actual" : ""}" data-pista="${i}"><b>${p.n}.</b> ${p.pista} <small>(${p.resp.length})</small></button>`)
          .join("");

      const completo = llenas() === totalCeldas && correctas() === totalCeldas;

      cont.innerHTML = `
        <p class="cru-barra"><b>${w.n} ${w.d === "H" ? "Horizontal" : "Vertical"}:</b> ${w.pista} <small>(${w.resp.length} letras)</small></p>
        <div class="cru-grilla" style="grid-template-columns: repeat(${P.c}, 1fr)">${grilla}</div>
        ${htmlTeclado({}, false)}
        <div class="sudoku-acciones">
          <button type="button" class="juego-boton" data-accion="revisar">Revisar</button>
          <button type="button" class="juego-boton juego-boton-secundario" data-accion="solucion">Mostrar solución</button>
        </div>
        <p class="${completo ? "juego-resultado" : "juego-aviso"}" aria-live="polite">${completo ? (valores._s ? "Esta era la solución. Mañana hay otro crucigrama." : "¡Crucigrama completo! 🎉") : mensaje}</p>
        <h3 class="cru-titulo">Horizontales</h3>
        <div class="cru-pistas">${lista("H")}</div>
        <h3 class="cru-titulo">Verticales</h3>
        <div class="cru-pistas">${lista("V")}</div>
      `;
    }

    function irA(r, c) {
      const o = info[claveCelda(r, c)];
      if (!o) return;
      if (activo.r === r && activo.c === c && o.H !== undefined && o.V !== undefined) activo.dir = activo.dir === "H" ? "V" : "H";
      else if (o[activo.dir] === undefined) activo.dir = activo.dir === "H" ? "V" : "H";
      activo.r = r;
      activo.c = c;
    }

    function moverEnPalabra(paso) {
      const w = palabraActiva();
      const i = w.celdas.findIndex(({ r, c }) => r === activo.r && c === activo.c);
      const n = w.celdas[i + paso];
      if (n) {
        activo.r = n.r;
        activo.c = n.c;
      }
    }

    function tecla(t) {
      mensaje = "";
      revisando = false;
      const k = claveCelda(activo.r, activo.c);
      if (t === "BORRAR") {
        if (valores[k]) delete valores[k];
        else {
          moverEnPalabra(-1);
          delete valores[claveCelda(activo.r, activo.c)];
        }
      } else if (t !== "ENTER") {
        valores[k] = t;
        moverEnPalabra(1);
      }
      guardar(clave, valores);
      dibujar();
    }

    cont.onclick = (e) => {
      const celda = e.target.closest("[data-r]");
      const t = e.target.closest("[data-tecla]");
      const pista = e.target.closest("[data-pista]");
      const accion = e.target.closest("[data-accion]");
      if (celda) {
        irA(Number(celda.dataset.r), Number(celda.dataset.c));
        dibujar();
      } else if (t) tecla(t.dataset.tecla);
      else if (pista) {
        const w = palabras[Number(pista.dataset.pista)];
        activo.dir = w.d;
        const vacia = w.celdas.find(({ r, c }) => !valores[claveCelda(r, c)]) || w.celdas[0];
        activo.r = vacia.r;
        activo.c = vacia.c;
        dibujar();
      } else if (accion && accion.dataset.accion === "revisar") {
        revisando = true;
        if (llenas() < totalCeldas) mensaje = "Todavía faltan letras. Las que están mal quedan en rojo.";
        else if (correctas() < totalCeldas) mensaje = "Hay letras que no van (en rojo).";
        dibujar();
      } else if (accion && accion.dataset.accion === "solucion") {
        Object.keys(info).forEach((k) => (valores[k] = info[k].letra));
        valores._s = true;
        revisando = false;
        guardar(clave, valores);
        dibujar();
      }
    };

    escucharTeclado(tecla);
    dibujar();
  }

  /* ---------- DIFERENCIAS ---------- */

  // Objetos de la escena: posición, tamaño y dos emojis posibles.
  const DIF_OBJETOS = [
    { x: 262, y: 42, t: 40, o: ["☀️", "🌤️"] },
    { x: 62, y: 40, t: 36, o: ["☁️", "⛅"] },
    { x: 170, y: 62, t: 30, o: ["☁️", "🌥️"] },
    { x: 132, y: 104, t: 26, o: ["🐦", "🕊️"], asim: true },
    { x: 28, y: 104, t: 30, o: ["🎈", "🎁"] },
    { x: 232, y: 100, t: 26, o: ["🦋", "🐝"], asim: true },
    { x: 82, y: 150, t: 56, o: ["🏠", "🏡"] },
    { x: 204, y: 146, t: 50, o: ["🌳", "🌲"] },
    { x: 288, y: 150, t: 46, o: ["🌲", "🌴"] },
    { x: 34, y: 206, t: 32, o: ["🌸", "🌼"] },
    { x: 132, y: 214, t: 30, o: ["🌷", "🌹"] },
    { x: 196, y: 208, t: 38, o: ["🐶", "🐱"], asim: true },
    { x: 276, y: 208, t: 38, o: ["🚗", "🚕"], asim: true },
    { x: 90, y: 224, t: 24, o: ["⚽", "🏀"] },
  ];
  const DIF_CANTIDAD = 6;

  function renderDiferencias(cont, fecha, semilla) {
    const rng = crearRng(semilla * 7919 + 13);
    const cielo = elegir(rng, ["#bfe3ff", "#ffe6c2", "#e0d9ff"]);
    const base = DIF_OBJETOS.map(() => (rng() < 0.5 ? 0 : 1));
    const tipos = ["cambiar", "quitar", "achicar", "mover", "espejo"];
    let quitar = 0;
    const difs = barajar(rng, DIF_OBJETOS.map((_, i) => i))
      .slice(0, DIF_CANTIDAD)
      .map((i) => {
        let t;
        do t = elegir(rng, tipos);
        while ((t === "espejo" && !DIF_OBJETOS[i].asim) || (t === "quitar" && quitar >= 2));
        if (t === "quitar") quitar++;
        return { i, t };
      });

    const clave = `${fecha}-diferencias`;
    const guardado = leer(clave);
    let encontradas = guardado && Array.isArray(guardado.e) ? guardado.e.filter((k) => Number.isInteger(k) && k >= 0 && k < DIF_CANTIDAD) : [];
    let reveladas = !!(guardado && guardado.r);
    let mensaje = "";

    function svgPanel(version) {
      let h = `<svg viewBox="0 0 320 240" class="dif-svg" data-panel="${version}" role="img" aria-label="Imagen ${version}"><rect width="320" height="150" fill="${cielo}"/><rect y="150" width="320" height="90" fill="#9fd89f"/>`;
      DIF_OBJETOS.forEach((s, i) => {
        let emoji = s.o[base[i]];
        let { x, y, t } = s;
        let transform = "";
        const d = version === "B" ? difs.find((q) => q.i === i) : null;
        if (d) {
          if (d.t === "quitar") return;
          if (d.t === "cambiar") emoji = s.o[1 - base[i]];
          else if (d.t === "achicar") t = Math.round(t * 0.62);
          else if (d.t === "mover") {
            x += x > 160 ? -16 : 16;
            y -= 12;
          } else if (d.t === "espejo") transform = ` transform="translate(${2 * x} 0) scale(-1 1)"`;
        }
        h += `<text x="${x}" y="${y}" font-size="${t}" text-anchor="middle" dy=".35em"${transform}>${emoji}</text>`;
      });
      encontradas.forEach((k) => {
        const s = DIF_OBJETOS[difs[k].i];
        h += `<circle cx="${s.x}" cy="${s.y}" r="${Math.max(24, Math.round(s.t * 0.75))}" fill="none" stroke="#e11d48" stroke-width="3.5"/>`;
      });
      return h + "</svg>";
    }

    function dibujar() {
      const termino = encontradas.length === DIF_CANTIDAD;
      const final = termino
        ? `<p class="juego-resultado">${reveladas ? "Estas eran las diferencias. Mañana hay otra imagen." : "¡Las encontraste todas! 🎉"}</p>`
        : "";
      cont.innerHTML = `
        <p class="juego-progreso">Hay ${DIF_CANTIDAD} diferencias entre las dos imágenes. Tocá en cualquiera de las dos donde veas una.</p>
        <p class="dif-contador">Encontradas: <b>${encontradas.length}</b> de ${DIF_CANTIDAD}</p>
        <div class="dif-imagenes">${svgPanel("A")}${svgPanel("B")}</div>
        <p class="juego-aviso" aria-live="polite">${mensaje}</p>
        ${final}
        ${termino ? "" : '<button type="button" class="juego-boton juego-boton-secundario" data-accion="mostrar">Mostrarme las que faltan</button>'}
      `;
    }

    cont.onclick = (e) => {
      const boton = e.target.closest("[data-accion]");
      if (boton) {
        difs.forEach((_, k) => {
          if (!encontradas.includes(k)) encontradas.push(k);
        });
        reveladas = true;
        guardar(clave, { e: encontradas, r: true });
        mensaje = "";
        dibujar();
        return;
      }
      const svg = e.target.closest(".dif-svg");
      if (!svg || encontradas.length === DIF_CANTIDAD) return;
      const rect = svg.getBoundingClientRect();
      const vx = ((e.clientX - rect.left) / rect.width) * 320;
      const vy = ((e.clientY - rect.top) / rect.height) * 240;
      const k = difs.findIndex((d, idx) => {
        if (encontradas.includes(idx)) return false;
        const s = DIF_OBJETOS[d.i];
        return Math.hypot(vx - s.x, vy - s.y) <= Math.max(26, s.t * 0.8);
      });
      if (k >= 0) {
        encontradas.push(k);
        mensaje = "¡Muy bien, esa era una diferencia!";
        guardar(clave, { e: encontradas, r: reveladas });
      } else mensaje = "Ahí no hay diferencia. Probá en otro lugar.";
      dibujar();
    };

    dibujar();
  }

  /* ---------- arranque ---------- */

  function iniciarJuegosLN() {
    const cont = document.getElementById("juego-ln-cuerpo");
    const titulo = document.getElementById("juego-ln-titulo");
    if (!cont) return;

    const fecha = fechaHoyART();
    const semilla = diasDesdeEpoch(fecha);
    const tipo = TIPOS_LN[semilla % TIPOS_LN.length];
    const ciclo = Math.floor(semilla / TIPOS_LN.length);

    limpiarViejos(fecha);
    titulo.textContent = NOMBRES_LN[tipo];

    if (tipo === "diferencias") renderDiferencias(cont, fecha, semilla);
    else if (tipo === "crucigrama") renderCrucigrama(cont, fecha, ciclo);
    else renderPalabraOculta(cont, fecha, ciclo);
  }

  document.addEventListener("DOMContentLoaded", iniciarJuegosLN);
})();
