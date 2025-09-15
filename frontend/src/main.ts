interface Destino {
  id: number;
  nome: string;
}

interface Viagem {
  id: number;
  nome: string;
  dataSaida: string;
  dataChegada: string;
  valor: number;
  destinos: number[];
}

const API_URL = 'http://localhost:3000';

let destinos: Destino[] = [];
let viagens: Viagem[] = [];

function mostrarTab(tabName: string): void {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => tab.classList.remove('active'));
  contents.forEach(content => content.classList.remove('active'));

  document.querySelector(`[onclick="mostrarTab('${tabName}')"]`)?.classList.add('active');
  document.getElementById(`${tabName}-tab`)?.classList.add('active');
}

async function carregarDestinos(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/destinos`);
    destinos = await response.json();
    renderizarDestinos();
    atualizarSelectDestinos();
  } catch (error) {
    console.error('Erro ao carregar destinos:', error);
  }
}

async function carregarViagens(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/viagens`);
    viagens = await response.json();
    renderizarViagens();
  } catch (error) {
    console.error('Erro ao carregar viagens:', error);
  }
}

function renderizarDestinos(): void {
  const lista = document.getElementById('destinos-lista') as HTMLElement;
  lista.innerHTML = '';

  for(let i = 0; i < destinos.length; i++) {
    const destino = destinos[i];
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h4>${destino.nome}</h4>
      <div class="acoes">
        <button class="edit" onclick="editarDestino(${destino.id})">Editar</button>
        <button class="danger" onclick="excluirDestino(${destino.id})">Excluir</button>
      </div>
    `;
    lista.appendChild(div);
  }
}

function renderizarViagens(): void {
  const lista = document.getElementById('viagens-lista') as HTMLElement;
  lista.innerHTML = '';

  for(let i = 0; i < viagens.length; i++) {
    const viagem = viagens[i];
    
    let destinosTexto = '';
    for(let j = 0; j < viagem.destinos.length; j++) {
      const destinoId = viagem.destinos[j];
      
      for(let k = 0; k < destinos.length; k++) {
        if(destinos[k].id === destinoId) {
          if(destinosTexto !== '') {
            destinosTexto += ', ';
          }
          destinosTexto += destinos[k].nome;
          break;
        }
      }
    }
    
    if(destinosTexto === '') {
      destinosTexto = 'Nenhum destino';
    }

    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h4>${viagem.nome}</h4>
      <p><strong>Data de Saída:</strong> ${viagem.dataSaida}</p>
      <p><strong>Data de Chegada:</strong> ${viagem.dataChegada}</p>
      <p><strong>Valor:</strong> R$ ${viagem.valor}</p>
      <p><strong>Destinos:</strong> ${destinosTexto}</p>
      <div class="acoes">
        <button class="edit" onclick="editarViagem(${viagem.id})">Editar</button>
        <button class="danger" onclick="excluirViagem(${viagem.id})">Excluir</button>
      </div>
    `;
    lista.appendChild(div);
  }
}

function atualizarSelectDestinos(): void {
  const select = document.getElementById('viagem-destinos') as HTMLSelectElement;
  select.innerHTML = '';

  for(let i = 0; i < destinos.length; i++) {
    const option = document.createElement('option');
    option.value = destinos[i].id.toString();
    option.textContent = destinos[i].nome;
    select.appendChild(option);
  }
}

async function salvarDestino(event: Event): Promise<void> {
  event.preventDefault();
  
  const form = event.target as HTMLFormElement;
  const id = (document.getElementById('destino-id') as HTMLInputElement).value;
  const nome = (document.getElementById('destino-nome') as HTMLInputElement).value;

  const destino = { nome: nome };

  try {
    if (id) {
      await fetch(`${API_URL}/destinos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destino)
      });
    } else {
      await fetch(`${API_URL}/destinos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destino)
      });
    }

    form.reset();
    cancelarEdicaoDestino();
    carregarDestinos();
  } catch (error) {
    console.error('Erro ao salvar destino:', error);
  }
}

async function salvarViagem(event: Event): Promise<void> {
  event.preventDefault();
  
  const form = event.target as HTMLFormElement;
  const id = (document.getElementById('viagem-id') as HTMLInputElement).value;
  const nome = (document.getElementById('viagem-nome') as HTMLInputElement).value;
  const dataSaida = (document.getElementById('viagem-data-saida') as HTMLInputElement).value;
  const dataChegada = (document.getElementById('viagem-data-chegada') as HTMLInputElement).value;
  const valor = parseFloat((document.getElementById('viagem-valor') as HTMLInputElement).value);
  const selectDestinos = document.getElementById('viagem-destinos') as HTMLSelectElement;
  
  let destinosSelecionados: number[] = [];
  for(let i = 0; i < selectDestinos.options.length; i++) {
    if(selectDestinos.options[i].selected) {
      destinosSelecionados.push(parseInt(selectDestinos.options[i].value));
    }
  }

  const viagem = {
    nome: nome,
    dataSaida: dataSaida,
    dataChegada: dataChegada,
    valor: valor,
    destinos: destinosSelecionados
  };

  try {
    if (id) {
      await fetch(`${API_URL}/viagens/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(viagem)
      });
    } else {
      await fetch(`${API_URL}/viagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(viagem)
      });
    }

    form.reset();
    cancelarEdicaoViagem();
    carregarViagens();
  } catch (error) {
    console.error('Erro ao salvar viagem:', error);
  }
}

function editarDestino(id: number): void {
  let destinoEncontrado = null;
  
  for(let i = 0; i < destinos.length; i++) {
    if(destinos[i].id === id) {
      destinoEncontrado = destinos[i];
      break;
    }
  }
  
  if (!destinoEncontrado) return;

  (document.getElementById('destino-id') as HTMLInputElement).value = id.toString();
  (document.getElementById('destino-nome') as HTMLInputElement).value = destinoEncontrado.nome;
  (document.getElementById('destino-submit') as HTMLButtonElement).textContent = 'Atualizar Destino';
  (document.getElementById('destino-cancel') as HTMLButtonElement).style.display = 'inline-block';
}

function editarViagem(id: number): void {
  let viagemEncontrada = null;
  
  for(let i = 0; i < viagens.length; i++) {
    if(viagens[i].id === id) {
      viagemEncontrada = viagens[i];
      break;
    }
  }
  
  if (!viagemEncontrada) return;

  (document.getElementById('viagem-id') as HTMLInputElement).value = id.toString();
  (document.getElementById('viagem-nome') as HTMLInputElement).value = viagemEncontrada.nome;
  (document.getElementById('viagem-data-saida') as HTMLInputElement).value = viagemEncontrada.dataSaida;
  (document.getElementById('viagem-data-chegada') as HTMLInputElement).value = viagemEncontrada.dataChegada;
  (document.getElementById('viagem-valor') as HTMLInputElement).value = viagemEncontrada.valor.toString();
  
  const select = document.getElementById('viagem-destinos') as HTMLSelectElement;
  for(let i = 0; i < select.options.length; i++) {
    const optionValue = parseInt(select.options[i].value);
    let encontrou = false;
    
    for(let j = 0; j < viagemEncontrada.destinos.length; j++) {
      if(viagemEncontrada.destinos[j] === optionValue) {
        encontrou = true;
        break;
      }
    }
    
    select.options[i].selected = encontrou;
  }

  (document.getElementById('viagem-submit') as HTMLButtonElement).textContent = 'Atualizar Viagem';
  (document.getElementById('viagem-cancel') as HTMLButtonElement).style.display = 'inline-block';
}

async function excluirDestino(id: number): Promise<void> {
  if (!confirm('Tem certeza que deseja excluir este destino?')) return;

  try {
    await fetch(`${API_URL}/destinos/${id}`, {
      method: 'DELETE'
    });
    carregarDestinos();
  } catch (error) {
    console.error('Erro ao excluir destino:', error);
  }
}

async function excluirViagem(id: number): Promise<void> {
  if (!confirm('Tem certeza que deseja excluir esta viagem?')) return;

  try {
    await fetch(`${API_URL}/viagens/${id}`, {
      method: 'DELETE'
    });
    carregarViagens();
  } catch (error) {
    console.error('Erro ao excluir viagem:', error);
  }
}

function cancelarEdicaoDestino(): void {
  (document.getElementById('destino-id') as HTMLInputElement).value = '';
  (document.getElementById('destino-nome') as HTMLInputElement).value = '';
  (document.getElementById('destino-submit') as HTMLButtonElement).textContent = 'Adicionar Destino';
  (document.getElementById('destino-cancel') as HTMLButtonElement).style.display = 'none';
}

function cancelarEdicaoViagem(): void {
  (document.getElementById('viagem-id') as HTMLInputElement).value = '';
  (document.getElementById('viagem-nome') as HTMLInputElement).value = '';
  (document.getElementById('viagem-data-saida') as HTMLInputElement).value = '';
  (document.getElementById('viagem-data-chegada') as HTMLInputElement).value = '';
  (document.getElementById('viagem-valor') as HTMLInputElement).value = '';
  
  const select = document.getElementById('viagem-destinos') as HTMLSelectElement;
  for(let i = 0; i < select.options.length; i++) {
    select.options[i].selected = false;
  }
  
  (document.getElementById('viagem-submit') as HTMLButtonElement).textContent = 'Adicionar Viagem';
  (document.getElementById('viagem-cancel') as HTMLButtonElement).style.display = 'none';
}

// Colocar funções no window para usar no HTML
(window as any).mostrarTab = mostrarTab;
(window as any).editarDestino = editarDestino;
(window as any).editarViagem = editarViagem;
(window as any).excluirDestino = excluirDestino;
(window as any).excluirViagem = excluirViagem;
(window as any).cancelarEdicaoDestino = cancelarEdicaoDestino;
(window as any).cancelarEdicaoViagem = cancelarEdicaoViagem;

document.addEventListener('DOMContentLoaded', () => {
  carregarDestinos();
  carregarViagens();

  document.getElementById('destino-form')?.addEventListener('submit', salvarDestino);
  document.getElementById('viagem-form')?.addEventListener('submit', salvarViagem);
});