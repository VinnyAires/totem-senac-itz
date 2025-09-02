/* / js/carrosel.js
document.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.getElementById('imgs');
  const slides = Array.from(slidesContainer.children);
  const total = slides.length;
  let currentIndex = 0;
  const intervalTime = 3000;
  let slideInterval;

  // 1) Ajusta a largura do container e de cada slide
  function setWidths() {
    // container com largura = total × 100%
    slidesContainer.style.width = `${total * 100}%`;
    // cada slide ocupa (100/total)% do container
    slides.forEach(slide => {
      slide.style.width = `${100 / total}%`;
    });
    // reposiciona no slide atual
    goToSlide(currentIndex);
  }

  // 2) Move até o slide index
  function goToSlide(index) {
    slidesContainer.style.transform = `translateX(-${index * (100 / total)}%)`;
  }

  // 3) Próximo slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % total;
    goToSlide(currentIndex);
  }

  // 4) Autoplay
  function startAutoplay() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }
  function stopAutoplay() {
    clearInterval(slideInterval);
  }

  // 5) Eventos
  window.addEventListener('resize', setWidths);
  const carouselEl = document.querySelector('.carrossel');
  carouselEl.addEventListener('mouseenter', stopAutoplay);
  carouselEl.addEventListener('mouseleave', startAutoplay);

  // 6) Inicialização
  setWidths();
  startAutoplay();
});
/

document.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.getElementById('slides');
  const slides = Array.from(slidesContainer.children);
  const total = slides.length;
  let index = 0;

  // Ajusta a largura do container e de cada slide
  function setWidths() {
    // Container: total slides × 100%
    slidesContainer.style.width = `${total * 100}%`;

    // Cada slide: (100 / total)% do container
    slides.forEach(slide => {
      slide.style.width = `${100 / total}%`;
    });

    // Reposiciona no slide atual
    goTo(index);
  }

  // Move para o slide de índice n
  function goTo(n) {
    const offset = n * (100 / total);
    slidesContainer.style.transform = `translateX(-${offset}%)`;
  }

  function next() {
    index = (index + 1) % total;
    goTo(index);
  }

  let timer = setInterval(next, 3000);

  // Pausa/reinicia ao passar o mouse (desktop)
  const carouselEl = document.querySelector('.carrossel');
  carouselEl.addEventListener('mouseenter', () => clearInterval(timer));
  carouselEl.addEventListener('mouseleave', () => {
    timer = setInterval(next, 3000);
  });

  // Reajusta tudo ao redimensionar
  window.addEventListener('resize', setWidths);

  // Inicia
  setWidths();
});
*/

document.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.getElementById('imgs');
  const slides = Array.from(slidesContainer.children); // .imagensSel
  const total = slides.length;
  let index = 0;
  let timer;

  // 1) define largura total do container e de cada slide
  slidesContainer.style.width = `${total * 100}%`;
  slides.forEach(slide => {
    slide.style.width = `${100 / total}%`;
  });

  // 2) exibe slide de índice n
  function goTo(n) {
    slidesContainer.style.transform = `translateX(-${n * 100}%)`;
  }

  // 3) avança ciclicamente
  function next() {
    index = (index + 1) % total;
    goTo(index);
  }

  // 4) autoplay e pausa no hover
  function start() { timer = setInterval(next, 3000); }
  function stop()  { clearInterval(timer); }

  slidesContainer.parentElement.addEventListener('mouseenter', stop);
  slidesContainer.parentElement.addEventListener('mouseleave', start);

  // inicializa
  goTo(0);
  start();

  // se redimensionar, reposiciona (opcional)
  window.addEventListener('resize', () => goTo(index));
});
