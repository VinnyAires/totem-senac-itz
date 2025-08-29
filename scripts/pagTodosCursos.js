document.addEventListener('DOMContentLoaded', async () => {
  const url = '../dados-cursos/all-courses.json';
  let data;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.error('Erro ao carregar JSON:', err);
    document.getElementById('main-content').innerHTML =
      '<p class="error">Não foi possível carregar os cursos.</p>';
    return;
  }

  const tpl       = document.getElementById('card-template').content;
  const main      = document.getElementById('main-content');
  const modal     = document.getElementById('modal');
  const titleEl   = modal.querySelector('.modal__title');
  const descEl    = modal.querySelector('.modal__desc');
  const closeBtn  = modal.querySelector('.modal__close');

  closeBtn.addEventListener('click', () => modal.classList.remove('modal--open'));

  // para cada turno, cria seção e renderiza cards
  Object.keys(data.turnoLabels).forEach(turno => {
    const label = data.turnoLabels[turno];
    const section = document.createElement('section');
    section.className = 'turno-section';
    section.innerHTML = `<h2>${turno.charAt(0).toUpperCase() + turno.slice(1)} – ${label}</h2>
                         <div class="cursos" id="${turno}"></div>`;
    main.appendChild(section);

    const container = section.querySelector('.cursos');
    data.courses
      .filter(c => c.turno === turno)
      .forEach(course => {
        const card = tpl.cloneNode(true);
        card.querySelector('[data-field="title"]').textContent  = course.titulo;
        card.querySelector('[data-field="hours"]').textContent  = `Carga Horária: ${course.ch}h`;
        card.querySelector('[data-field="price"]').textContent  =
          `Valor: R$ ${course.preco.toLocaleString('pt-BR')}`;

        card.querySelector('[data-action="open-modal"]')
          .addEventListener('click', () => {
            titleEl.textContent = course.titulo;
            descEl.textContent  = course.descricao;
            modal.classList.add('modal--open');
          });

        container.appendChild(card);
      });
  });
});
