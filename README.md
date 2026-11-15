# El Refugio de Chilla — web independiente

Web estática de **El Refugio de Chilla (Candeleda, Ávila)**. Este repositorio está separado de [Agent Builder](https://github.com/francopdimauro-cyber/Agent-Builder), que proporciona el backend del agente de conversación **Refu**.

## Archivos

- `index.html` — página web completa, con estilos incorporados.
- `agents/refu.json` — configuración de Refu para importar en Agent Builder.

## Estado

La web está **publicada en Cloudflare Workers** como servicio independiente, con despliegue automático al actualizar la rama `main`.

El código de integración está preparado en `index.html` y obtiene `widget.js` del Worker real:

```html
<script
  src="https://agent-factory-free.francopdimauro.workers.dev/widget.js"
  data-chat="PENDIENTE_ID_CHAT"
  data-label="Pregunta a Refu"
  data-accent="#1f5c4a"
  defer
></script>
```

**Importante:** `PENDIENTE_ID_CHAT` no es un identificador funcional. Hasta sustituirlo por el ID real, el widget no se inicia. No confundir «script integrado» con «chat activo».

## Activar el chat

1. Acceder a [Agent Builder](https://agent-factory-free.francopdimauro.workers.dev), iniciar sesión e importar `agents/refu.json` desde **Agentes**.
2. Guardar y activar el agente Refu.
3. En **Chat web**, crear un chat público asociado a Refu.
4. Añadir a sus **webs autorizadas** el origen exacto del sitio publicado, exactamente `https://refugio-de-chilla.francopdimauro.workers.dev` (sin barra final ni rutas).
5. Copiar el identificador real del chat y reemplazar `PENDIENTE_ID_CHAT` en `index.html`. Guardar los cambios y desplegar de nuevo.
6. Probar el chat desde el dominio autorizado, verificando una respuesta del backend.

## Publicación

La web se aloja como sitio estático en el Worker independiente **`refugio-de-chilla`**. URL publicada: **https://refugio-de-chilla.francopdimauro.workers.dev/**. Cloudflare Builds está vinculado a este repositorio y ejecuta `npm run build` seguido de `npx wrangler deploy` al recibir cambios en `main`. El Worker del Agent Builder sigue sirviendo la API y el widget; **no se despliega esta web sobre `agent-factory-free`**. El proceso `scripts/build.mjs` solo copia `index.html` a `dist/` para evitar exponer `agents/refu.json` u otros archivos internos.

Antes de publicarla para clientes, verificar el contenido editorial: horarios, carta, datos de contacto y disponibilidad real de servicios. No hay formulario de reservas operativo; la página dirige las reservas al teléfono.

## Desarrollo local

Abre `index.html` en un navegador para revisar el diseño estático. Para verificar el chat hace falta el ID de chat real y un origen autorizado por Agent Builder.
