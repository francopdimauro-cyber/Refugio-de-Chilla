/* Refu — asistente con IA de El Refugio de Chilla.
 *
 * Carga el widget de chat del Agent Builder con la identidad visual de esta web.
 * Para activarlo, rellena los dos valores de abajo con lo que muestra Agent Builder
 * en la pestaña «Chat web» (código para pegar en la web):
 *   - api:    la URL del Worker, p. ej. https://agent-factory-free.TU-SUBDOMINIO.workers.dev
 *   - chatId: el valor de data-chat
 * Mientras estén vacíos, la web funciona igual y no se muestra el chat.
 */
(() => {
  'use strict';

  const REFU = {
    api: 'https://agent-factory-free.francopdimauro.workers.dev',
    chatId: '',
  };

  if (!REFU.api || !REFU.chatId) return;

  let api;
  try {
    api = new URL(REFU.api).origin;
  } catch (_) {
    console.warn('[Refu] La URL del Worker no es válida.');
    return;
  }

  const s = document.createElement('script');
  s.src = `${api}/widget.js`;
  s.defer = true;
  s.dataset.chat = REFU.chatId;
  s.dataset.accent = '#c8324b';      // remolacha, el acento de la web
  s.dataset.accentText = '#ffffff';
  s.dataset.theme = 'auto';          // sigue el modo claro/oscuro de la web
  s.dataset.font = "Inter, ui-sans-serif, system-ui, sans-serif";
  s.dataset.label = 'Pregunta a Refu';
  document.body.appendChild(s);
})();
