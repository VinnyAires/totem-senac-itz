// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', async () => {

  // 1) Detecta o segmento atual a partir do atributo data-segmento no <body>
  const segmento = document.body.dataset.segmento;

  // Caminho do arquivo JSON com os dados dos cursos
  const url = '../dados-cursos/cursos.json';
  let data; // Variável que armazenará os dados carregados

  // 2) Tenta carregar os dados via fetch com tratamento de erro
  try {
    const res = await fetch(url); // Faz a requisição HTTP
    if (!res.ok) throw new Error(`HTTP ${res.status}`); // Se a resposta não for OK, lança erro
    data = await res.json(); // Converte a resposta para objeto JavaScript
  } catch (err) {
    // Em caso de erro, exibe mensagem em todas as seções de cursos
    console.error('Erro ao carregar JSON:', err);
    document.querySelectorAll('.cursos').forEach(el => {
      el.innerHTML = '<p class="error">Não foi possível carregar os cursos.</p>';
    });
    return; // Interrompe execução
  }

  // 3) Referências ao template de card e ao modal de detalhes
  const tpl       = document.getElementById('card-template').content;
  const modal     = document.getElementById('modal');
  const overlay   = document.getElementById('modal-overlay'); // Fundo desfocado atrás do modal
  const titleEl   = modal.querySelector('.modal__title');
  const descEl    = modal.querySelector('.modal__desc');
  const closeBtn  = modal.querySelector('.modal__close');
  let modalTimeout; // Controle de tempo para fechamento automático do modal

  // 4) Referências ao iframe de inscrição
  const iframeContainer = document.getElementById('iframe-container'); // Container do iframe
  const iframeFrame     = document.getElementById('form-frame');       // Elemento <iframe>
  const iframeCloseBtn  = document.getElementById('iframe-close');     // Botão de fechar o iframe

  // Evento para fechar o iframe manualmente
  iframeCloseBtn.addEventListener('click', () => {
    iframeContainer.classList.remove('active'); // Esconde o iframe
    iframeFrame.src = ''; // Limpa o conteúdo carregado
  });

  // Evento para fechar o modal manualmente
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('modal--open'); // Fecha o modal
    overlay.classList.remove('active');    // Remove o fundo desfocado
    clearTimeout(modalTimeout);            // Cancela o fechamento automático
  });

  // 5) Para cada seção de turno, renderiza os cursos do segmento correspondente
  document.querySelectorAll('.turno-section').forEach(section => {
    const turno     = section.dataset.turno; // "matutino" | "vespertino" | "noturno"
    const container = section.querySelector('.cursos'); // Container onde os cards serão inseridos

    // Filtra os cursos que combinam segmento + turno
    const lista = data.cursos.filter(c =>
      c.segmento === segmento && c.turno === turno
    );

    // Se não houver cursos, exibe mensagem
    if (lista.length === 0) {
      container.innerHTML = '<p class="error">Nenhum curso disponível neste turno.</p>';
      return;
    }

    // Para cada curso, clona o template e preenche os dados
    lista.forEach(course => {
      const clone = tpl.cloneNode(true); // Clona o conteúdo do template

      // Preenche o título e carga horária
      clone.querySelector('[data-field="title"]').textContent = course.titulo;
      clone.querySelector('[data-field="hours"]').textContent = `Carga Horária: ${course.ch}h`;

      // Calcula o preço com desconto de 30%
      const precoOriginal = course.preco;
      const precoDesconto = precoOriginal * 0.7;

      // Formata os valores em moeda brasileira
      const valorOriginalBRL = precoOriginal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      const valorDescontoBRL = precoDesconto.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      // Preenche os preços no card (original tachado + com desconto)
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
        titleEl.textContent = course.titulo;      // Título do curso no modal
        descEl.textContent  = course.descricao;   // Descrição do curso no modal
        modal.classList.add('modal--open');       // Exibe o modal
        overlay.classList.add('active');          // Ativa o fundo desfocado

        clearTimeout(modalTimeout);               // Limpa timeout anterior
        modalTimeout = setTimeout(() => {
          modal.classList.remove('modal--open');  // Fecha o modal automaticamente
          overlay.classList.remove('active');     // Remove o fundo desfocado
        }, 120000); // 2 minutos = 120.000 milissegundos
      });

      // Configura botão “Inscreva-se” para abrir o formulário em iframe
      clone.querySelector('.inscrever').addEventListener('click', (e) => {
        e.preventDefault(); // Impede navegação direta
        iframeFrame.src = e.currentTarget.href; // Define o link do formulário
        iframeContainer.classList.add('active'); // Exibe o iframe sobre a página
      });

      // Adiciona o card ao container da seção
      container.appendChild(clone);
    });
  });
});
