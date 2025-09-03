/*  <!-- DEBUG: garanta que o browser aplique esta regra -->
  <style>
    html, body, .page-container {
      outline: 2px dashed magenta !important;
      /* também tente border se outline não aparecer *
      border: 2px dotted lime !important;
    }
  </style> */

  (function(){
  const badge = document.createElement('div');
  Object.assign(badge.style, {
    position: 'fixed',
    bottom: '0',
    right: '0',
    padding: '4px 8px',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: '12px',
    zIndex: 9999
  });
  document.body.appendChild(badge);
  function update() {
    badge.textContent = `W: ${window.innerWidth}px  H: ${window.innerHeight}px`;
  }
  window.addEventListener('resize', update);
  update();
})();