document.addEventListener('DOMContentLoaded', async () => {
  // 1) Detecta o segmento a partir do atributo data-segmento no <body>
  const segmento = document.body.dataset.segmento;
  const url = '../dados-cursos/cursos.json';
  let data;

  // 2) Carrega os dados do JSON com tratamento de erro
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
  const overlay   = document.getElementById('modal-overlay'); // NOVO: fundo desfocado
  const titleEl   = modal.querySelector('.modal__title');
  const descEl    = modal.querySelector('.modal__desc');
  const closeBtn  = modal.querySelector('.modal__close');
  let modalTimeout; // NOVO: controle de tempo para fechamento automático

  // Evento para fechar o modal manualmente
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('modal--open');
    overlay.classList.remove('active');
    clearTimeout(modalTimeout); // cancela o fechamento automático
  });

  // 4) Para cada seção de turno, renderiza os cursos do segmento correspondente
  document.querySelectorAll('.turno-section').forEach(section => {
    const turno     = section.dataset.turno; // "matutino" | "vespertino" | "noturno"
    const container = section.querySelector('.cursos');

    // Filtra cursos que combinam segmento + turno
    const lista = data.cursos.filter(c =>
      c.segmento === segmento && c.turno === turno
    );

    if (lista.length === 0) {
      container.innerHTML = '<p class="error">Nenhum curso disponível neste turno.</p>';
      return;
    }

    // Para cada curso, clona o template e preenche os dados
    lista.forEach(course => {
      const clone = tpl.cloneNode(true);

      clone.querySelector('[data-field="title"]').textContent = course.titulo;
      clone.querySelector('[data-field="hours"]').textContent = `Carga Horária: ${course.ch}h`;

      // Calcula e formata os preços com 30% de desconto
      const precoOriginal = course.preco;
      const precoDesconto = precoOriginal * 0.7;

      const valorOriginalBRL = precoOriginal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      const valorDescontoBRL = precoDesconto.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const priceEl = clone.querySelector('[data-field="price"]');
      priceEl.innerHTML = `
        <span class="original-price" style="text-decoration: line-through; color: #ccc;">
          ${valorOriginalBRL}
        </span>
        <span class="discounted-price" style="margin-left: 0.5rem; font-weight: bold; color: #f97316;">
          ${valorDescontoBRL}
        </span>
      `;

      /*=================VERSÃO SEM DESCONTO=============================
      const valorBRL = course.preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      clone.querySelector('[data-field="price"]').textContent =
        `Valor: ${valorBRL}`;
      //=============FIM================================================*/

      // Configura botão “Sobre” para abrir modal com fundo desfocado e timeout
      clone.querySelector('[data-action="open-modal"]').addEventListener('click', () => {
        titleEl.textContent = course.titulo;
        descEl.textContent  = course.descricao;
        modal.classList.add('modal--open');
        overlay.classList.add('active');

        clearTimeout(modalTimeout); // limpa timeout anterior
        modalTimeout = setTimeout(() => {
          modal.classList.remove('modal--open');
          overlay.classList.remove('active');
        }, 60000); // 1 minuto
      });

      container.appendChild(clone);
    });
  });
});
