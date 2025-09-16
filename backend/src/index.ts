const express = require('express');
const cors = require('cors');
const { 
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
const port: number = 3001;

console.log('Servidor iniciado na porta 3001');
app.use(cors());
app.use(express.json());

app.get('/destinos', async (req: any, res: any) => {
  try {
    const destinos = await getAllDestinos();
    res.json(destinos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar destinos' });
  }
});

app.post('/destinos', async (req: any, res: any) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }
    const destino = await createDestino(nome);
    res.status(201).json(destino);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar destino' });
  }
});

app.put('/destinos/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }
    const destino = await updateDestino(parseInt(id), nome);
    res.json(destino);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar destino' });
  }
});

app.delete('/destinos/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const resultado = await deleteDestino(parseInt(id));
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover destino' });
  }
});

app.get('/viagens', async (req: any, res: any) => {
  try {
    const viagens = await getAllViagens();
    res.json(viagens);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar viagens' });
  }
});

app.post('/viagens', async (req: any, res: any) => {
  try {
    const { nome, dataSaida, dataChegada, valor, destinos } = req.body;
    if (!nome || !dataSaida || !dataChegada || valor === undefined) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }
    const viagem = await createViagem(nome, dataSaida, dataChegada, valor, destinos || []);
    res.status(201).json(viagem);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar viagem' });
  }
});

app.put('/viagens/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { nome, dataSaida, dataChegada, valor, destinos } = req.body;
    if (!nome || !dataSaida || !dataChegada || valor === undefined) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }
    const viagem = await updateViagem(parseInt(id), nome, dataSaida, dataChegada, valor, destinos || []);
    res.json(viagem);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar viagem' });
  }
});

app.delete('/viagens/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const resultado = await deleteViagem(parseInt(id));
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover viagem' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});