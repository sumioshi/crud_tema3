const express = require('express');
const cors = require('cors');
const { lerDatabase, salvarDatabase, proximoId } = require('./database');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/destinos', (req, res) => {
  const db = lerDatabase();
  res.json(db.destinos);
});

app.post('/destinos', (req, res) => {
  const db = lerDatabase();
  const destino = {
    id: proximoId(db.destinos),
    nome: req.body.nome
  };
  
  db.destinos.push(destino);
  salvarDatabase(db);
  res.json(destino);
});

app.put('/destinos/:id', (req, res) => {
  const db = lerDatabase();
  const id = parseInt(req.params.id);
  
  for(let i = 0; i < db.destinos.length; i++) {
    if(db.destinos[i].id === id) {
      db.destinos[i].nome = req.body.nome;
      salvarDatabase(db);
      res.json(db.destinos[i]);
      return;
    }
  }
  
  res.status(404).json({ erro: 'Destino não encontrado' });
});

app.delete('/destinos/:id', (req, res) => {
  const db = lerDatabase();
  const id = parseInt(req.params.id);
  
  for(let i = 0; i < db.destinos.length; i++) {
    if(db.destinos[i].id === id) {
      db.destinos.splice(i, 1);
      salvarDatabase(db);
      res.json({ mensagem: 'Destino removido' });
      return;
    }
  }
  
  res.status(404).json({ erro: 'Destino não encontrado' });
});

app.get('/viagens', (req, res) => {
  const db = lerDatabase();
  res.json(db.viagens);
});

app.post('/viagens', (req, res) => {
  const db = lerDatabase();
  const viagem = {
    id: proximoId(db.viagens),
    nome: req.body.nome,
    dataSaida: req.body.dataSaida,
    dataChegada: req.body.dataChegada,
    valor: req.body.valor,
    destinos: req.body.destinos || []
  };
  
  db.viagens.push(viagem);
  salvarDatabase(db);
  res.json(viagem);
});

app.put('/viagens/:id', (req, res) => {
  const db = lerDatabase();
  const id = parseInt(req.params.id);
  
  for(let i = 0; i < db.viagens.length; i++) {
    if(db.viagens[i].id === id) {
      db.viagens[i].nome = req.body.nome;
      db.viagens[i].dataSaida = req.body.dataSaida;
      db.viagens[i].dataChegada = req.body.dataChegada;
      db.viagens[i].valor = req.body.valor;
      db.viagens[i].destinos = req.body.destinos || [];
      salvarDatabase(db);
      res.json(db.viagens[i]);
      return;
    }
  }
  
  res.status(404).json({ erro: 'Viagem não encontrada' });
});

app.delete('/viagens/:id', (req, res) => {
  const db = lerDatabase();
  const id = parseInt(req.params.id);
  
  for(let i = 0; i < db.viagens.length; i++) {
    if(db.viagens[i].id === id) {
      db.viagens.splice(i, 1);
      salvarDatabase(db);
      res.json({ mensagem: 'Viagem removida' });
      return;
    }
  }
  
  res.status(404).json({ erro: 'Viagem não encontrada' });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});