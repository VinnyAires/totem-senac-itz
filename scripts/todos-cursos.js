// /scripts/pagTodosCursos.js

document.addEventListener('DOMContentLoaded', async () => {
  const url  = '../dados-cursos/cursos.json';
  let data;

  // Fetch + tratamento de erro
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

  const main      = document.getElementById('main-content');
  const tpl       = document.getElementById('card-template').content;
  const modal     = document.getElementById('modal');
  const titleEl   = modal.querySelector('.modal__title');
  const descEl    = modal.querySelector('.modal__desc');
  const closeBtn  = modal.querySelector('.modal__close');

  closeBtn.addEventListener('click', () =>
    modal.classList.remove('modal--open')
  );

  // Helper: capitaliza a primeira letra
  const capitalize = str =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // 1) Para cada turno (na ordem de turnoLabels)
  Object.entries(data.turnoLabels).forEach(([turno, label]) => {
    // cria seção do turno
    const section = document.createElement('section');
    section.className = 'turno-section';
    section.innerHTML = `<h2>${capitalize(turno)} – ${label}</h2>`;
    main.appendChild(section);

    // filtra todos os cursos desse turno
    const cursosDoTurno = data.cursos.filter(c => c.turno === turno);

    // agrupa por segmento
    const porSegmento = cursosDoTurno.reduce((acc, curso) => {
      if (!acc[curso.segmento]) acc[curso.segmento] = [];
      acc[curso.segmento].push(curso);
      return acc;
    }, {});

    // 2) Para cada segmento dentro do turno
    Object.entries(porSegmento).forEach(([segmento, listaCursos]) => {
      // wrapper do segmento
      const segDiv = document.createElement('div');
      segDiv.className = 'segmento-section';
      segDiv.innerHTML = `<h3>${capitalize(segmento)}</h3>
                          <div class="cursos"></div>`;
      section.appendChild(segDiv);

      const container = segDiv.querySelector('.cursos');

      // 3) Popula cards
      listaCursos.forEach(curso => {
        const clone = tpl.cloneNode(true);
        clone.querySelector('[data-field="title"]').textContent =
          curso.titulo;
        clone.querySelector('[data-field="hours"]').textContent =
          `Carga Horária: ${curso.ch}h`;

        const valorBRL = curso.preco.toLocaleString('pt-BR', {
          style:    'currency',
          currency: 'BRL'
        });
        clone.querySelector('[data-field="price"]').textContent =
          `Valor: ${valorBRL}`;

        clone
          .querySelector('[data-action="open-modal"]')
          .addEventListener('click', () => {
            titleEl.textContent = curso.titulo;
            descEl.textContent  = curso.descricao;
            modal.classList.add('modal--open');
          });

        container.appendChild(clone);
      });
    });
  });
});
