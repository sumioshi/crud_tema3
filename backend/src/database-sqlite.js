const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Criar tabelas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS destinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS viagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    dataSaida TEXT NOT NULL,
    dataChegada TEXT NOT NULL,
    valor REAL NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS viagem_destinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    viagem_id INTEGER NOT NULL,
    destino_id INTEGER NOT NULL
  )`);
});

// DESTINOS
function getAllDestinos() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM destinos', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function createDestino(nome) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO destinos (nome) VALUES (?)', [nome], function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, nome: nome });
    });
  });
}

function updateDestino(id, nome) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE destinos SET nome = ? WHERE id = ?', [nome, id], function(err) {
      if (err) reject(err);
      else resolve({ id: id, nome: nome });
    });
  });
}

function deleteDestino(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM destinos WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve({ message: 'Destino removido' });
    });
  });
}

// VIAGENS
function getAllViagens() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM viagens', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Para cada viagem, buscar seus destinos
        const viagens = [];
        let count = 0;
        
        if (rows.length === 0) {
          resolve([]);
          return;
        }
        
        rows.forEach(viagem => {
          db.all('SELECT destino_id FROM viagem_destinos WHERE viagem_id = ?', [viagem.id], (err, destinos) => {
            if (err) {
              reject(err);
            } else {
              viagem.destinos = destinos.map(d => d.destino_id);
              viagens.push(viagem);
              count++;
              
              if (count === rows.length) {
                resolve(viagens);
              }
            }
          });
        });
      }
    });
  });
}

function createViagem(nome, dataSaida, dataChegada, valor, destinos) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO viagens (nome, dataSaida, dataChegada, valor) VALUES (?, ?, ?, ?)', 
      [nome, dataSaida, dataChegada, valor], function(err) {
      if (err) {
        reject(err);
      } else {
        const viagemId = this.lastID;
        
        // Adicionar destinos
        if (destinos && destinos.length > 0) {
          let count = 0;
          destinos.forEach(destinoId => {
            db.run('INSERT INTO viagem_destinos (viagem_id, destino_id) VALUES (?, ?)', 
              [viagemId, destinoId], (err) => {
              count++;
              if (count === destinos.length) {
                resolve({ id: viagemId, nome, dataSaida, dataChegada, valor, destinos });
              }
            });
          });
        } else {
          resolve({ id: viagemId, nome, dataSaida, dataChegada, valor, destinos: [] });
        }
      }
    });
  });
}

function updateViagem(id, nome, dataSaida, dataChegada, valor, destinos) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE viagens SET nome = ?, dataSaida = ?, dataChegada = ?, valor = ? WHERE id = ?', 
      [nome, dataSaida, dataChegada, valor, id], function(err) {
      if (err) {
        reject(err);
      } else {
        // Remover destinos antigos
        db.run('DELETE FROM viagem_destinos WHERE viagem_id = ?', [id], (err) => {
          if (err) {
            reject(err);
          } else {
            // Adicionar novos destinos
            if (destinos && destinos.length > 0) {
              let count = 0;
              destinos.forEach(destinoId => {
                db.run('INSERT INTO viagem_destinos (viagem_id, destino_id) VALUES (?, ?)', 
                  [id, destinoId], (err) => {
                  count++;
                  if (count === destinos.length) {
                    resolve({ id, nome, dataSaida, dataChegada, valor, destinos });
                  }
                });
              });
            } else {
              resolve({ id, nome, dataSaida, dataChegada, valor, destinos: [] });
            }
          }
        });
      }
    });
  });
}

function deleteViagem(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM viagens WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve({ message: 'Viagem removida' });
    });
  });
}

module.exports = {
  getAllDestinos,
  createDestino,
  updateDestino,
  deleteDestino,
  getAllViagens,
  createViagem,
  updateViagem,
  deleteViagem
};