# El Refugio de Chilla — web oficial de trabajo

Esta es la **web original proporcionada por el cliente**, restaurada desde el archivo `EL REFUGIO DE CHILLA.zip` el 15 de noviembre de 2026. Se aloja en un Worker independiente del constructor [Agent Builder](https://github.com/francopdimauro-cyber/Agent-Builder).

## Enlaces

- **Web pública:** https://refugio-de-chilla.francopdimauro.workers.dev/
- **Repositorio:** https://github.com/francopdimauro-cyber/Refugio-de-Chilla
- **Motor de IA:** https://agent-factory-free.francopdimauro.workers.dev/

## Estructura original

- `index.html`: página completa, incluyendo navegación, carta, formulario de reservas y mapa.
- `css/styles.css`: estilos originales, temas claro/oscuro y responsive.
- `js/main.js`: interactividad y envío del formulario de reservas.
- `js/refu.js`: integración del widget de chat de Refu.
- `img/`: **cuatro fotografías originales** del ZIP.
- `agents/refu.json`: configuración del agente, no publicada como activo público.
- `scripts/build.mjs`: copia únicamente `index.html`, `css/`, `js/` e `img/` a `dist/`.

La rama `main` está conectada a Cloudflare Builds, que ejecuta `npm run build` y `npx wrangler deploy`.

## Estado del chat de Refu

El archivo `js/refu.js` ya apunta al Worker real del motor. El campo `chatId` **aún está vacío**: el chat no aparece hasta crear un chat público en Agent Builder y obtener un identificador real. Esto evita mostrar un widget averiado.

Para activarlo: accede a Agent Builder, importa `agents/refu.json` si Refu todavía no existe, actívalo, crea un chat público y autoriza el origen `https://refugio-de-chilla.francopdimauro.workers.dev` (sin ruta). Copia el ID al campo `chatId` de `js/refu.js`. Guarda; el push a `main` actualizará la web.

## Reservas

El diseño original incluye un formulario que utiliza **FormSubmit** hacia `elrefugiodechilla@gmail.com`; no se ha modificado. Comprueba con el propietario que la dirección receptora esté autorizada y que FormSubmit esté activado. Una solicitud de reserva no es una confirmación automática de disponibilidad.

## Seguridad del despliegue

Solo se sirven los archivos de la web incluidos en `dist/`. El JSON de configuración de Refu y otros archivos internos quedan fuera de los activos públicos de Cloudflare.
