/* Refu — asistente con IA de El Refugio de Chilla.
 *
 * Carga el widget de chat del Agent Builder con la identidad visual de esta web.
 * Configurado para el chat público real de Refu en Agent Builder.
 * El dominio de pruebas autorizado es refugio-de-chilla.francopdimauro.workers.dev.
 * Antes de cambiar al dominio definitivo, añade ese origen al chat en Agent Builder.
 */
(() => {
  'use strict';

  const REFU = {
    api: 'https://agent-factory-free.francopdimauro.workers.dev',
    chatId: '479ea264-dee5-4b81-9477-8d9af08f5b24',
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
