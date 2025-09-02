// /scripts/pagTodosCursos.js   // Caminho do arquivo JS, apenas informativo

// Executa o código assim que o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async () => {
  const url  = '../dados-cursos/cursos.json'; // Caminho do arquivo JSON com os cursos
  let data;                                   // Variável para armazenar os dados carregados

  // Fetch + tratamento de erro
  try {
    const res = await fetch(url);             // Faz requisição HTTP para buscar o arquivo JSON
    if (!res.ok) throw new Error(`HTTP ${res.status}`); // Verifica se a resposta é válida, senão gera erro
    data = await res.json();                  // Converte a resposta para objeto JavaScript
  } catch (err) {
    console.error('Erro ao carregar JSON:', err); // Mostra o erro no console
    document.getElementById('main-content').innerHTML =
      '<p class="error">Não foi possível carregar os cursos.</p>'; // Exibe mensagem de erro na tela
    return;                                   // Interrompe a execução se não conseguiu carregar
  }

  const main      = document.getElementById('main-content'); // Elemento principal onde será montada a página
  const tpl       = document.getElementById('card-template').content; // Template HTML para os cards de cursos
  const modal     = document.getElementById('modal');        // Modal de detalhes do curso
  const titleEl   = modal.querySelector('.modal__title');    // Elemento título dentro do modal
  const descEl    = modal.querySelector('.modal__desc');     // Elemento descrição dentro do modal
  const closeBtn  = modal.querySelector('.modal__close');    // Botão de fechar o modal

  // Adiciona evento ao botão de fechar modal
  closeBtn.addEventListener('click', () =>
    modal.classList.remove('modal--open')    // Remove a classe que mantém o modal aberto
  );

  // Função auxiliar: capitaliza a primeira letra de uma string
  const capitalize = str =>
    str.charAt(0).toUpperCase() + str.slice(1); // Transforma "manha" em "Manha"

  // 1) Percorre cada turno definido no JSON (data.turnoLabels)
  Object.entries(data.turnoLabels).forEach(([turno, label]) => {
    // Cria a seção para o turno (ex: Manhã – Matutino)
    const section = document.createElement('section'); // Cria <section>
    section.className = 'turno-section';               // Define a classe CSS
    section.innerHTML = `<h2>${capitalize(turno)} – ${label}</h2>`; // Coloca título da seção
    main.appendChild(section);                         // Insere a seção no elemento principal

    // Filtra todos os cursos pertencentes a este turno
    const cursosDoTurno = data.cursos.filter(c => c.turno === turno);

    // Agrupa os cursos por segmento (ex: Tecnologia, Saúde, etc.)
    const porSegmento = cursosDoTurno.reduce((acc, curso) => {
      if (!acc[curso.segmento]) acc[curso.segmento] = []; // Se não existe ainda, cria lista
      acc[curso.segmento].push(curso);                    // Adiciona o curso dentro do segmento
      return acc;                                         // Retorna acumulador
    }, {});

    // 2) Percorre cada segmento dentro do turno
    Object.entries(porSegmento).forEach(([segmento, listaCursos]) => {
      // Cria wrapper da seção de segmento
      const segDiv = document.createElement('div'); // Cria <div>
      segDiv.className = 'segmento-section';        // Define a classe CSS
      segDiv.innerHTML = `<h3>${capitalize(segmento)}</h3>
                          <div class="cursos"></div>`; // Título + container dos cursos
      section.appendChild(segDiv);                       // Insere dentro da seção do turno

      const container = segDiv.querySelector('.cursos'); // Container para receber os cards

      // 3) Cria os cards de cursos dentro do segmento
      listaCursos.forEach(curso => {
        const clone = tpl.cloneNode(true);               // Clona o conteúdo do template do card
        clone.querySelector('[data-field="title"]').textContent =
          curso.titulo;                                  // Define título do curso
        clone.querySelector('[data-field="hours"]').textContent =
          `Carga Horária: ${curso.ch}h`;                 // Define carga horária

        // Formata o preço em Real (R$)
        const valorBRL = curso.preco.toLocaleString('pt-BR', {
          style:    'currency',                          // Estilo moeda
          currency: 'BRL'                                // Moeda brasileira
        });
        clone.querySelector('[data-field="price"]').textContent =
          `Valor: ${valorBRL}`;                          // Define preço formatado

        // Adiciona evento ao botão para abrir modal com mais informações
        clone
          .querySelector('[data-action="open-modal"]')
          .addEventListener('click', () => {
            titleEl.textContent = curso.titulo;          // Preenche título do modal
            descEl.textContent  = curso.descricao;       // Preenche descrição
            modal.classList.add('modal--open');          // Abre modal (adiciona classe CSS)
          });

        container.appendChild(clone);                    // Adiciona o card dentro do container
      });
    });
  });
});


/* /scripts/pagTodosCursos.js

document.addEventListener('DOMContentLoaded', async () => {
  const url  = '../dados-cursos/cursos.json';
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

  const main      = document.getElementById('main-content');
  const tpl       = document.getElementById('card-template').content;
  const modal     = document.getElementById('modal');
  const titleEl   = modal.querySelector('.modal__title');
  const descEl    = modal.querySelector('.modal__desc');
  const closeBtn  = modal.querySelector('.modal__close');

  closeBtn.addEventListener('click', () =>
    modal.classList.remove('modal--open')
  );

  const capitalize = str =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Para cada turno, renderiza uma seção com um único grid `.cursos`
  Object.entries(data.turnoLabels).forEach(([turno, label]) => {
    const section = document.createElement('section');
    section.className = 'turno-section';
    section.innerHTML = `<h2>${capitalize(turno)} – ${label}</h2>`;
    main.appendChild(section);

    // Um único container para todos os cursos do turno
    const grid = document.createElement('div');
    grid.className = 'cursos';
    section.appendChild(grid);

    // Filtra e ordena por segmento (e por título para estabilidade)
    const cursosDoTurno = data.cursos
      .filter(c => c.turno === turno)
      .sort((a, b) => {
        const s = a.segmento.localeCompare(b.segmento);
        return s !== 0 ? s : a.titulo.localeCompare(b.titulo);
      });

    let segmentoAtual;

    cursosDoTurno.forEach(curso => {
      // Insere um cabeçalho de segmento apenas quando muda
      if (curso.segmento !== segmentoAtual) {
        segmentoAtual = curso.segmento;
        const header = document.createElement('h3');
        header.className = 'segmento-divider';
        header.textContent = capitalize(segmentoAtual);
        grid.appendChild(header);
      }

      // Cria o card a partir do template
      const frag = tpl.cloneNode(true);

      const titleNode = frag.querySelector('[data-field="title"]');
      if (titleNode) titleNode.textContent = curso.titulo;

      const hoursNode = frag.querySelector('[data-field="hours"]');
      if (hoursNode) hoursNode.textContent = `Carga Horária: ${curso.ch}h`;

      const priceNode = frag.querySelector('[data-field="price"]');
      if (priceNode) {
        const valorBRL = Number(curso.preco).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
        priceNode.textContent = `Valor: ${valorBRL}`;
      }

      const btn = frag.querySelector('[data-action="open-modal"]');
      if (btn) {
        btn.addEventListener('click', () => {
          titleEl.textContent = curso.titulo;
          descEl.textContent  = curso.descricao;
          modal.classList.add('modal--open');
        });
      }

      // Anexa o fragmento (que contém o card) no grid único
      grid.appendChild(frag);
    });
  });
});
*/