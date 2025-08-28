document.addEventListener('DOMContentLoaded', async () => {
  const url = '../dados-cursos/tecnologia-cursos.json';
  let data;

  // 1) fetch + tratamento de erro
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.error('Erro ao carregar JSON:', err);
    document.querySelectorAll('.cursos').forEach(el => {
      el.innerHTML = '<p class="error">Não foi possível carregar os cursos.</p>';
    });
    return;
  }

  const tpl = document.getElementById('card-template').content;
  const modal = document.getElementById('modal');
  const titleEl = modal.querySelector('.modal__title');
  const descEl  = modal.querySelector('.modal__desc');
  const closeBtn = modal.querySelector('.modal__close');

  // 2) fechar modal
  closeBtn.addEventListener('click', () => modal.classList.remove('modal--open'));

  // 3) popular cada turno
  Object.entries(data).forEach(([turno, cursos]) => {
    const container = document.getElementById(turno);
    if (!container) return;

    cursos.forEach(course => {
      const clone = tpl.cloneNode(true);
      // preencher campos
      clone.querySelector('[data-field="title"]').textContent = course.title;
      clone.querySelector('[data-field="hours"]').textContent = 
        `Carga Horária: ${course.hours} horas`;
      clone.querySelector('[data-field="price"]').textContent = 
        `Valor: R$ ${course.price.toLocaleString('pt-BR')}`;

      // abrir modal com descrição
      clone.querySelector('[data-action="open-modal"]')
        .addEventListener('click', () => {
          titleEl.textContent = course.title;
          descEl.textContent  = course.description;
          modal.classList.add('modal--open');
        });

      container.appendChild(clone);
    });
  });
});
