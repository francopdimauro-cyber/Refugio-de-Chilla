# El Refugio de Chilla · web original restaurada (staging)

Esta es la web original del restaurante, restaurada desde el ZIP `EL REFUGIO DE CHILLA.zip`, con su diseño y recursos originales. **Actualmente vive solo en Cloudflare Workers como entorno de pruebas**. No se ha cambiado el dominio ni la web anterior del restaurante.

- **Probar la web:** https://refugio-de-chilla.francopdimauro.workers.dev/
- **Código:** https://github.com/francopdimauro-cyber/Refugio-de-Chilla
- **Agent Builder (backend de Refu):** https://agent-factory-free.francopdimauro.workers.dev/

## Archivos

- `index.html`: sitio original, carta, reserva, mapa y secciones.
- `css/styles.css`: diseño y temas claro/oscuro.
- `js/main.js`: interacciones y formulario.
- `js/refu.js`: configuración del widget Refu con ID real.
- `img/`: cuatro fotografías originales, conservadas byte por byte.
- `agents/refu.json`: plantilla de configuración del asistente (no publicada como activo público).
- `_headers`: evita indexar la URL de staging en Workers mediante `X-Robots-Tag` solo en ese dominio.
- `scripts/build.mjs`: copia la web, sus activos y las cabeceras a `dist/` sin incluir `agents/`.

Cada push a `main` se despliega automáticamente mediante Cloudflare Builds (`npm run build` y `npx wrangler deploy`).

## Refu — integrado y probado

Refu está **activo** en Agent Builder y el chat público está habilitado para el origen `https://refugio-de-chilla.francopdimauro.workers.dev`. El identificador instalado en `js/refu.js` es:

`479ea264-dee5-4b81-9477-8d9af08f5b24`

La prueba automatizada verifica la carga del script, el acceso CORS desde staging y una respuesta real de la IA:
https://github.com/francopdimauro-cyber/Refugio-de-Chilla/actions/runs/43704238085

El motor y la base de datos del chat pertenecen al Worker de Agent Builder; esta web únicamente carga su widget, con un tema adaptado a su estética.

## Reservas

El formulario original envía solicitudes a `elrefugiodechilla@gmail.com` utilizando FormSubmit. Se ha preservado íntegro; **no se ha comprobado que el propietario haya validado la recepción de correos**. La solicitud no confirma disponibilidad ni crea una reserva por sí misma.

## Paso futuro: convertir esta versión en la web oficial

**No realizar el cambio de dominio hasta que el propietario dé el visto bueno.**

1. Confirmar el dominio exacto, su registrador, DNS, hosting y si ya está bajo Cloudflare.
2. Hacer copia del sitio actual y documentar sus URLs indexadas, formularios y contenido.
3. Revisar en staging fotografía por fotografía, responsive, accesibilidad, textos, horarios, correo de reservas y experiencia real de Refu.
4. **Antes del cambio de dominio:** incorporar el nuevo origen HTTPS a la lista de `allowed_origins` del chat público de Refu, manteniendo temporalmente el de pruebas; confirmar TLS y formulario.
5. Configurar el dominio personalizado del Worker `refugio-de-chilla` con los DNS adecuados, solo tras autorizar la migración.
6. Revisar metadatos SEO, canonical, robots, sitemap, redirecciones 301 de rutas antiguas y Analytics/Search Console. La regla `X-Robots-Tag` de `_headers` es **exclusiva del host staging**, no del futuro dominio oficial.
7. Comprobar la nueva web en el dominio final y conservar opción de reversión. No cancelar el hosting antiguo hasta verificarlo todo.

Agent Builder permanece aislado y puede seguir sirviendo a otros clientes.
