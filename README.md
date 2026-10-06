# Canillita 2.0

Una sola pantalla con el clima de Buenos Aires y las noticias del día, pensada para
leer cómodo desde el celular. Se actualiza sola, todas las mañanas y un par de veces
más durante el día, y es 100% gratis.

## Qué hay en esta carpeta

- `index.html`, `styles.css`, `app.js`: la página en sí.
- `text-size.js`: el botón "AA" para agrandar o achicar el texto (como en Apple
  Books). Se acuerda del tamaño elegido en cada celular.
- `games.js`: el "Juego de hoy" (trivia, sopa de letras, memoria y sudoku, van
  rotando de a uno por día). Corre entero en el celular, no depende del robot.
- `juegos-ln.js`: la sección "Juegos La Nación" (Diferencias, Crucigrama y Palabra
  oculta, uno por día). Son versiones propias, con contenido original: no usan nada
  del diario. También corre entero en el celular y guarda el avance del día.
- `data/data.json`: el clima y las noticias del momento (incluye la sección
  Opinión, con columnistas de los mismos diarios). Lo genera el robot automático,
  no hace falta tocarlo a mano.
- `scripts/update.mjs`: el programa que busca el clima (en Open-Meteo, gratis y sin
  clave) y las noticias (en los RSS públicos de Clarín, La Nación, Infobae, Página/12,
  Perfil y TN) y arma `data/data.json`.
- `.github/workflows/actualizar.yml`: la tarea automática de GitHub que corre ese
  programa solo, todos los días.
- `manifest.webmanifest` + `icons/`: para que se pueda agregar como ícono a la
  pantalla de inicio del celular.

## Cómo probarla en tu computadora

```bash
python3 -m http.server 5500
```

Y abrís `http://localhost:5500` en el navegador.

Para traer noticias y clima nuevos a mano:

```bash
node scripts/update.mjs
```

## Publicarla gratis en GitHub Pages

1. En [github.com](https://github.com), creá un repositorio nuevo, vacío (sin README),
   por ejemplo `noticias-clima`.
2. En esta carpeta, conectalo y subilo:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/noticias-clima.git
   git branch -M main
   git push -u origin main
   ```
3. En GitHub, andá a **Settings → Pages** del repositorio, y en "Build and deployment"
   elegí **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guardá.
4. A los pocos minutos la página va a estar en
   `https://TU-USUARIO.github.io/noticias-clima/`.
5. En **Settings → Actions → General**, revisá que los "Workflow permissions" estén en
   **Read and write permissions** (para que el robot pueda guardar las noticias nuevas
   solo). Si no está así, cambialo y guardá.

## Agregar el ícono a la pantalla de inicio

- **Android (Chrome):** abrí el link, tocá los tres puntitos de arriba a la derecha y
  elegí "Agregar a pantalla de inicio" (o "Instalar app").
- **iPhone (Safari):** abrí el link, tocá el ícono de compartir (el cuadradito con la
  flecha) y elegí "Agregar a inicio".

## Cambiar algo simple

- **Horarios de actualización:** en `.github/workflows/actualizar.yml`, la línea del
  `cron`. Las horas están en UTC (Argentina = UTC menos 3 horas).
- **Medios o temas:** en `scripts/update.mjs`, las listas `DIRECT_FEEDS` y
  `GENERAL_FEEDS`.
- **Juegos:** en `games.js`, el banco de preguntas `TRIVIA_BANCO`, los temas de
  `SOPA_TEMAS`, los puzzles de `SUDOKU_BANCO` y los emojis de `MEMORIA_POOL`. El
  orden en que rotan los cuatro juegos está en la función `tipoDeHoy`.
