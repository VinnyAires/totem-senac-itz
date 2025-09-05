document.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.getElementById('slides');
  if (!slidesContainer) {
    console.error('Container de slides não encontrado (id="slides")');
    return;
  }

  const slides = Array.from(slidesContainer.children); // .imagensSel
  const total  = slides.length;
  let index    = 0;
  let timer;

  // 1) Ajusta largura total do container (total×100%) 
  //    e define cada slide com 1/total dessa largura.
  const wrapperWidth = slidesContainer.parentElement.clientWidth;
  slidesContainer.style.width = `${total * 100}%`;
  slides.forEach(slide => {
    slide.style.width = `${100 / total}%`;
  });

  // 2) Move até o slide n
  function goTo(n) {
    slidesContainer.style.transform = 
      `translateX(-${n * (100 / total)}%)`;
  }

  // 3) Próximo slide (loopando)
  function next() {
    index = (index + 1) % total;
    goTo(index);
  }

  // 4) Autoplay e pausa no hover
  function start() {
    timer = setInterval(next, 3000);
  }
  function stop() {
    clearInterval(timer);
  }

  slidesContainer.parentElement.addEventListener('mouseenter', stop);
  slidesContainer.parentElement.addEventListener('mouseleave', start);

  // 5) Reajusta ao mudar o tamanho da janela
  window.addEventListener('resize', () => {
    slidesContainer.style.width = `${total * 100}%`;
    slides.forEach(slide => slide.style.width = `${100 / total}%`);
    goTo(index);
  });

  // 6) Inicializa
  goTo(0);
  start();
});

/*.  ############## MOSTRA O TAMAHO DA JANELA NAVEGADO#############
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
*/