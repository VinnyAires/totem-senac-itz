// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', async () => {

  // Caminho do arquivo JSON contendo os cursos
  const url = '../dados-cursos/cursos.json';
  let data; // Variável que armazenará os dados carregados

  // Tenta carregar os dados via fetch
  try {
    const res = await fetch(url); // Faz a requisição HTTP
    if (!res.ok) throw new Error(`HTTP ${res.status}`); // Se a resposta não for OK, lança erro
    data = await res.json(); // Converte a resposta para objeto JavaScript
  } catch (err) {
    // Em caso de erro, exibe mensagem e interrompe execução
    console.error('Erro ao carregar JSON:', err);
    document.getElementById('main-content').innerHTML =
      '<p class="error">Não foi possível carregar os cursos.</p>';
    return;
  }

  // Referências aos elementos principais da página
  const main      = document.getElementById('main-content'); // Área onde os cursos serão exibidos
  const tpl       = document.getElementById('card-template').content; // Template HTML para cada card
  const modal     = document.getElementById('modal'); // Modal de detalhes do curso
  const overlay   = document.getElementById('modal-overlay'); // Fundo desfocado atrás do modal
  const titleEl   = modal.querySelector('.modal__title'); // Título dentro do modal
  const descEl    = modal.querySelector('.modal__desc'); // Descrição dentro do modal
  const closeBtn  = modal.querySelector('.modal__close'); // Botão de fechar o modal
  let modalTimeout; // Controle de tempo para fechamento automático do modal

  // Evento para fechar o modal ao clicar no botão “×”
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('modal--open'); // Fecha o modal
    overlay.classList.remove('active'); // Remove o fundo desfocado
    clearTimeout(modalTimeout); // Cancela o fechamento automático
  });

  // Função auxiliar para capitalizar a primeira letra de uma string
  const capitalize = str =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Percorre cada turno definido no JSON (ex: matutino, vespertino, noturno)
  Object.entries(data.turnoLabels).forEach(([turno, label]) => {
    // Cria uma seção para o turno
    const section = document.createElement('section');
    section.className = 'turno-section'; // Classe para estilização
    section.innerHTML = `<h2>${capitalize(turno)} – ${label}</h2>`; // Título da seção
    main.appendChild(section); // Adiciona a seção ao conteúdo principal

    // Cria um container para os cards de cursos
    const container = document.createElement('div');
    container.className = 'cursos'; // Classe para grid de cards
    section.appendChild(container); // Adiciona o container à seção

    // Filtra os cursos que pertencem ao turno atual
    const cursosDoTurno = data.cursos.filter(c => c.turno === turno);

    // Para cada curso do turno, cria um card
    cursosDoTurno.forEach(curso => {
      const clone = tpl.cloneNode(true); // Clona o template do card

      // Preenche o título do curso
      clone.querySelector('[data-field="title"]').textContent = curso.titulo;

      // Preenche a carga horária
      clone.querySelector('[data-field="hours"]').textContent = `Carga Horária: ${curso.ch}h`;

      // Calcula o preço com desconto de 30%
      const precoOriginal = curso.preco;
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
      const priceNode = clone.querySelector('[data-field="price"]');
      priceNode.innerHTML = `
        <span class="original-price" style="text-decoration: line-through; color: #999;">
          ${valorOriginalBRL}
        </span>
        <span class="discounted-price" style="margin-left: 0.5rem; font-weight: bold; color: #f97316;">
          ${valorDescontoBRL}
        </span>
      `;

      /*===============CASO SEJA DEIXAR APENAS O VALOR SEM DESCONTO ==============
      const priceNode = clone.querySelector('[data-field="price"]');
      priceNode.textContent = `Valor: ${valorOriginalBRL}`;
      //===============FIM SEM DESCONTO========================================*/

      // Configura o botão “Sobre” para abrir o modal com detalhes
      clone.querySelector('[data-action="open-modal"]').addEventListener('click', () => {
        titleEl.textContent = curso.titulo; // Título do curso no modal
        descEl.textContent  = curso.descricao; // Descrição do curso no modal
        modal.classList.add('modal--open'); // Exibe o modal
        overlay.classList.add('active'); // Ativa o fundo desfocado

        clearTimeout(modalTimeout); // Limpa qualquer timeout anterior
        modalTimeout = setTimeout(() => {
          modal.classList.remove('modal--open'); // Fecha o modal automaticamente
          overlay.classList.remove('active'); // Remove o fundo desfocado
        }, 60000); // 1 minuto
      });

      // Adiciona o card ao container da seção
      container.appendChild(clone);
    });
  });
});
