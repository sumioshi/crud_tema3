"use strict";
// evitar problemas de portas sendo usadas no w11
const API_URL = 'http://localhost:3001';
let destinos = [];
let viagens = [];
function mostrarTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    document.querySelector(`[onclick="mostrarTab('${tabName}')"]`)?.classList.add('active');
    document.getElementById(`${tabName}-tab`)?.classList.add('active');
}
async function carregarDestinos() {
    try {
        const response = await fetch(`${API_URL}/destinos`);
        destinos = await response.json();
        renderizarDestinos();
        atualizarSelectDestinos();
    }
    catch (error) {
        console.error('Erro ao carregar destinos:', error);
    }
}
async function carregarViagens() {
    try {
        const response = await fetch(`${API_URL}/viagens`);
        viagens = await response.json();
        renderizarViagens();
    }
    catch (error) {
        console.error('Erro ao carregar viagens:', error);
    }
}
function renderizarDestinos() {
    const lista = document.getElementById('destinos-lista');
    lista.innerHTML = '';
    for (let i = 0; i < destinos.length; i++) {
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
function renderizarViagens() {
    const lista = document.getElementById('viagens-lista');
    lista.innerHTML = '';
    for (let i = 0; i < viagens.length; i++) {
        const viagem = viagens[i];
        let destinosTexto = '';
        for (let j = 0; j < viagem.destinos.length; j++) {
            const destinoId = viagem.destinos[j];
            for (let k = 0; k < destinos.length; k++) {
                if (destinos[k].id === destinoId) {
                    if (destinosTexto !== '') {
                        destinosTexto += ', ';
                    }
                    destinosTexto += destinos[k].nome;
                    break;
                }
            }
        }
        if (destinosTexto === '') {
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
function atualizarSelectDestinos() {
    const select = document.getElementById('viagem-destinos');
    select.innerHTML = '';
    for (let i = 0; i < destinos.length; i++) {
        const option = document.createElement('option');
        option.value = destinos[i].id.toString();
        option.textContent = destinos[i].nome;
        select.appendChild(option);
    }
}
async function salvarDestino(event) {
    event.preventDefault();
    const form = event.target;
    const id = document.getElementById('destino-id').value;
    const nome = document.getElementById('destino-nome').value;
    const destino = { nome: nome };
    try {
        if (id) {
            await fetch(`${API_URL}/destinos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(destino)
            });
        }
        else {
            await fetch(`${API_URL}/destinos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(destino)
            });
        }
        form.reset();
        cancelarEdicaoDestino();
        carregarDestinos();
    }
    catch (error) {
        console.error('Erro ao salvar destino:', error);
    }
}
async function salvarViagem(event) {
    event.preventDefault();
    const form = event.target;
    const id = document.getElementById('viagem-id').value;
    const nome = document.getElementById('viagem-nome').value;
    const dataSaida = document.getElementById('viagem-data-saida').value;
    const dataChegada = document.getElementById('viagem-data-chegada').value;
    const valor = parseFloat(document.getElementById('viagem-valor').value);
    const selectDestinos = document.getElementById('viagem-destinos');
    let destinosSelecionados = [];
    for (let i = 0; i < selectDestinos.options.length; i++) {
        if (selectDestinos.options[i].selected) {
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
        }
        else {
            await fetch(`${API_URL}/viagens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(viagem)
            });
        }
        form.reset();
        cancelarEdicaoViagem();
        carregarViagens();
    }
    catch (error) {
        console.error('Erro ao salvar viagem:', error);
    }
}
function editarDestino(id) {
    let destinoEncontrado = null;
    for (let i = 0; i < destinos.length; i++) {
        if (destinos[i].id === id) {
            destinoEncontrado = destinos[i];
            break;
        }
    }
    if (!destinoEncontrado)
        return;
    document.getElementById('destino-id').value = id.toString();
    document.getElementById('destino-nome').value = destinoEncontrado.nome;
    document.getElementById('destino-submit').textContent = 'Atualizar Destino';
    document.getElementById('destino-cancel').style.display = 'inline-block';
}
function editarViagem(id) {
    let viagemEncontrada = null;
    for (let i = 0; i < viagens.length; i++) {
        if (viagens[i].id === id) {
            viagemEncontrada = viagens[i];
            break;
        }
    }
    if (!viagemEncontrada)
        return;
    document.getElementById('viagem-id').value = id.toString();
    document.getElementById('viagem-nome').value = viagemEncontrada.nome;
    document.getElementById('viagem-data-saida').value = viagemEncontrada.dataSaida;
    document.getElementById('viagem-data-chegada').value = viagemEncontrada.dataChegada;
    document.getElementById('viagem-valor').value = viagemEncontrada.valor.toString();
    const select = document.getElementById('viagem-destinos');
    for (let i = 0; i < select.options.length; i++) {
        const optionValue = parseInt(select.options[i].value);
        let encontrou = false;
        for (let j = 0; j < viagemEncontrada.destinos.length; j++) {
            if (viagemEncontrada.destinos[j] === optionValue) {
                encontrou = true;
                break;
            }
        }
        select.options[i].selected = encontrou;
    }
    document.getElementById('viagem-submit').textContent = 'Atualizar Viagem';
    document.getElementById('viagem-cancel').style.display = 'inline-block';
}
async function excluirDestino(id) {
    if (!confirm('Tem certeza que deseja excluir este destino?'))
        return;
    try {
        await fetch(`${API_URL}/destinos/${id}`, {
            method: 'DELETE'
        });
        carregarDestinos();
    }
    catch (error) {
        console.error('Erro ao excluir destino:', error);
    }
}
async function excluirViagem(id) {
    if (!confirm('Tem certeza que deseja excluir esta viagem?'))
        return;
    try {
        await fetch(`${API_URL}/viagens/${id}`, {
            method: 'DELETE'
        });
        carregarViagens();
    }
    catch (error) {
        console.error('Erro ao excluir viagem:', error);
    }
}
function cancelarEdicaoDestino() {
    document.getElementById('destino-id').value = '';
    document.getElementById('destino-nome').value = '';
    document.getElementById('destino-submit').textContent = 'Adicionar Destino';
    document.getElementById('destino-cancel').style.display = 'none';
}
function cancelarEdicaoViagem() {
    document.getElementById('viagem-id').value = '';
    document.getElementById('viagem-nome').value = '';
    document.getElementById('viagem-data-saida').value = '';
    document.getElementById('viagem-data-chegada').value = '';
    document.getElementById('viagem-valor').value = '';
    const select = document.getElementById('viagem-destinos');
    for (let i = 0; i < select.options.length; i++) {
        select.options[i].selected = false;
    }
    document.getElementById('viagem-submit').textContent = 'Adicionar Viagem';
    document.getElementById('viagem-cancel').style.display = 'none';
}
// usando as funções no window para usar no html
window.mostrarTab = mostrarTab;
window.editarDestino = editarDestino;
window.editarViagem = editarViagem;
window.excluirDestino = excluirDestino;
window.excluirViagem = excluirViagem;
window.cancelarEdicaoDestino = cancelarEdicaoDestino;
window.cancelarEdicaoViagem = cancelarEdicaoViagem;
document.addEventListener('DOMContentLoaded', () => {
    carregarDestinos();
    carregarViagens();
    document.getElementById('destino-form')?.addEventListener('submit', salvarDestino);
    document.getElementById('viagem-form')?.addEventListener('submit', salvarViagem);
});
