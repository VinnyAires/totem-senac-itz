// js/carrosel.js
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
