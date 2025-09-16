const express = require('express');
const cors = require('cors');
const { 
  initializeDatabase,
  getAllDestinos,
  createDestino,
  updateDestino,
  deleteDestino,
  getAllViagens,
  createViagem,
  updateViagem,
  deleteViagem
} = require('./database-sqlite');

const app = express();

app.use(cors());
app.use(express.json());

// Inicializar banco de dados
initializeDatabase().then(() => {
  console.log('Banco de dados inicializado');
}).catch(err => {
  console.error('Erro ao inicializar banco:', err);
});

app.get('/destinos', async (req, res) => {
  try {
    const destinos = await getAllDestinos();
    res.json(destinos);
  } catch (error) {
    console.error('Erro ao buscar destinos:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

app.post('/destinos', async (req, res) => {
  try {
    const destino = await createDestino(req.body.nome);
    res.json(destino);
  } catch (error) {
    console.error('Erro ao criar destino:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

app.put('/destinos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const destino = await updateDestino(id, req.body.nome);
    res.json(destino);
  } catch (error) {
    console.error('Erro ao atualizar destino:', error);
    if (error.message === 'Destino não encontrado') {
      res.status(404).json({ erro: error.message });
    } else {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
});

app.delete('/destinos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await deleteDestino(id);
    res.json(result);
  } catch (error) {
    console.error('Erro ao deletar destino:', error);
    if (error.message === 'Destino não encontrado') {
      res.status(404).json({ erro: error.message });
    } else {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
});

app.get('/viagens', async (req, res) => {
  try {
    const viagens = await getAllViagens();
    res.json(viagens);
  } catch (error) {
    console.error('Erro ao buscar viagens:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

app.post('/viagens', async (req, res) => {
  try {
    const { nome, dataSaida, dataChegada, valor, destinos } = req.body;
    const viagem = await createViagem(nome, dataSaida, dataChegada, valor, destinos || []);
    res.json(viagem);
  } catch (error) {
    console.error('Erro ao criar viagem:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

app.put('/viagens/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, dataSaida, dataChegada, valor, destinos } = req.body;
    const viagem = await updateViagem(id, nome, dataSaida, dataChegada, valor, destinos || []);
    res.json(viagem);
  } catch (error) {
    console.error('Erro ao atualizar viagem:', error);
    if (error.message === 'Viagem não encontrada') {
      res.status(404).json({ erro: error.message });
    } else {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
});

app.delete('/viagens/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await deleteViagem(id);
    res.json(result);
  } catch (error) {
    console.error('Erro ao deletar viagem:', error);
    if (error.message === 'Viagem não encontrada') {
      res.status(404).json({ erro: error.message });
    } else {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});