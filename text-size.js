// Regulador de tamaño de texto ("Aa"), estilo Apple Books.
// Toda la página está medida en rem, así que alcanza con cambiar la base del <html>.

(function () {
  const MIN = 16;
  const MAX = 32;
  const PASO = 2;
  const POR_DEFECTO = 20;
  const CLAVE = "canillita-tamano-texto";

  function leerGuardado() {
    try {
      const valor = Number(localStorage.getItem(CLAVE));
      return valor >= MIN && valor <= MAX ? valor : POR_DEFECTO;
    } catch {
      return POR_DEFECTO;
    }
  }

  function guardar(valor) {
    try {
      localStorage.setItem(CLAVE, String(valor));
    } catch {
      // sin almacenamiento: el tamaño vale solo para esta visita
    }
  }

  let actual = leerGuardado();
  document.documentElement.style.fontSize = actual + "px";

  function aplicar(valor, slider) {
    actual = Math.min(MAX, Math.max(MIN, valor));
    document.documentElement.style.fontSize = actual + "px";
    if (slider) slider.value = String(actual);
    guardar(actual);
  }

  function crearControl() {
    const boton = document.createElement("button");
    boton.className = "tamano-boton";
    boton.type = "button";
    boton.setAttribute("aria-label", "Cambiar el tamaño del texto");
    boton.setAttribute("aria-expanded", "false");
    boton.innerHTML = '<span class="tamano-a-chica">A</span><span class="tamano-a-grande">A</span>';

    const panel = document.createElement("div");
    panel.className = "tamano-panel";
    panel.hidden = true;
    panel.innerHTML = `
      <div class="tamano-fila">
        <button type="button" class="tamano-paso" data-delta="-1" aria-label="Achicar el texto"><span class="tamano-a-chica">A</span></button>
        <input type="range" class="tamano-slider" min="${MIN}" max="${MAX}" step="${PASO}" value="${actual}" aria-label="Tamaño del texto" />
        <button type="button" class="tamano-paso" data-delta="1" aria-label="Agrandar el texto"><span class="tamano-a-grande">A</span></button>
      </div>
      <button type="button" class="tamano-restablecer">Volver al tamaño normal</button>
    `;

    const slider = panel.querySelector(".tamano-slider");
    slider.addEventListener("input", () => aplicar(Number(slider.value), null));

    panel.querySelectorAll(".tamano-paso").forEach((paso) => {
      paso.addEventListener("click", () => aplicar(actual + Number(paso.dataset.delta) * PASO, slider));
    });

    panel.querySelector(".tamano-restablecer").addEventListener("click", () => aplicar(POR_DEFECTO, slider));

    function alternar(abrir) {
      panel.hidden = !abrir;
      boton.setAttribute("aria-expanded", String(abrir));
    }

    boton.addEventListener("click", () => alternar(panel.hidden));

    document.addEventListener("click", (e) => {
      if (!panel.hidden && !panel.contains(e.target) && !boton.contains(e.target)) alternar(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) alternar(false);
    });

    document.body.append(panel, boton);
  }

  document.addEventListener("DOMContentLoaded", crearControl);
})();
