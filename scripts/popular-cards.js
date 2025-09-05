// /scripts/pagCursos.js

document.addEventListener('DOMContentLoaded', async () => {
  // 1) Detecta o segmento a partir do data-segmento no <body>
  const segmento = document.body.dataset.segmento;
  const url       = '../dados-cursos/cursos.json';
  let data;

  // 2) Fetch + tratamento de erro
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

  // 3) Referências ao template e ao modal
  const tpl       = document.getElementById('card-template').content;
  const modal     = document.getElementById('modal');
  const titleEl   = modal.querySelector('.modal__title');
  const descEl    = modal.querySelector('.modal__desc');
  const closeBtn  = modal.querySelector('.modal__close');
  closeBtn.addEventListener('click', () =>
    modal.classList.remove('modal--open')
  );

  // 4) Para cada seção de turno, renderiza somente os cursos deste segmento
  document.querySelectorAll('.turno-section').forEach(section => {
    const turno     = section.dataset.turno;       // "matutino" | "vespertino" | "noturno"
    const container = section.querySelector('.cursos');

    // filtra apenas cursos que combinam segmento + turno
    const lista = data.cursos.filter(c =>
      c.segmento === segmento && c.turno === turno
    );

    if (lista.length === 0) {
      container.innerHTML = '<p class="error">Nenhum curso disponível neste turno.</p>';
      return;
    }

    // clona template e preenche cada card
    lista.forEach(course => {
      const clone = tpl.cloneNode(true);

      clone.querySelector('[data-field="title"]').textContent =
        course.titulo;

      clone.querySelector('[data-field="hours"]').textContent =
        `Carga Horária: ${course.ch}h`;

      // formata valor em R$ com centavos
      const valorBRL = course.preco.toLocaleString('pt-BR', {
        style:    'currency',
        currency: 'BRL'
      });
      clone.querySelector('[data-field="price"]').textContent =
        `Valor: ${valorBRL}`;

      // configura botão “Sobre” para abrir modal
      clone
        .querySelector('[data-action="open-modal"]')
        .addEventListener('click', () => {
          titleEl.textContent = course.titulo;
          descEl.textContent  = course.descricao;
          modal.classList.add('modal--open');
        });

      container.appendChild(clone);
    });
  });
});

/*
document.addEventListener('DOMContentLoaded', async () => {
  // 1) Detecta automaticamente o segmento a partir de data-segmento no <body>
  const segmento = document.body.dataset.segmento;
  const url = '../dados-cursos/cursos.json';
  let data;

  // 2) Fetch + tratamento de erro
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

  // 3) Referências ao template e modal
  const tpl       = document.getElementById('card-template').content;
  const modal     = document.getElementById('modal');
  const titleEl   = modal.querySelector('.modal__title');
  const descEl    = modal.querySelector('.modal__desc');
  const closeBtn  = modal.querySelector('.modal__close');
  closeBtn.addEventListener('click', () => modal.classList.remove('modal--open'));

  // 4) Para cada seção de turno na página, renderiza somente os cursos deste segmento
  document.querySelectorAll('.turno-section').forEach(section => {
    const turno     = section.dataset.turno;               // "matutino" | "vespertino" | "noturno"
    const container = section.querySelector('.cursos');

    // filtra apenas os cursos que pertencem ao segmento desta página e ao turno atual
    const lista = data.courses.filter(c =>
      c.segmento === segmento && c.turno === turno
    );

    if (lista.length === 0) {
      container.innerHTML = '<p class="error">Nenhum curso disponível neste turno.</p>';
      return;
    }

    // clona o template para cada curso filtrado
    lista.forEach(course => {
      const clone = tpl.cloneNode(true);
      clone.querySelector('[data-field="title"]').textContent  = course.titulo;
      clone.querySelector('[data-field="hours"]').textContent  = `Carga Horária: ${course.ch}h`;
      clone.querySelector('[data-field="price"]').textContent  =
        `Valor: R$ ${course.preco.toLocaleString('pt-BR')}`;

      // link “Sobre” abre o modal preenchido
      clone
        .querySelector('[data-action="open-modal"]')
        .addEventListener('click', () => {
          titleEl.textContent = course.titulo;
          descEl.textContent  = course.descricao;
          modal.classList.add('modal--open');
        });

      container.appendChild(clone);
    });
  });
});



/*
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
*/