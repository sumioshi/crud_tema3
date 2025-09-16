const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');

// Criar conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco SQLite:', err.message);
  } else {
    console.log('Conectado ao banco SQLite com sucesso');
  }
});

// Criar tabelas se não existirem
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabela de destinos
      db.run(`CREATE TABLE IF NOT EXISTS destinos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Erro ao criar tabela destinos:', err.message);
          reject(err);
        }
      });

      // Tabela de viagens
      db.run(`CREATE TABLE IF NOT EXISTS viagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        dataSaida TEXT NOT NULL,
        dataChegada TEXT NOT NULL,
        valor REAL NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Erro ao criar tabela viagens:', err.message);
          reject(err);
        }
      });

      // Tabela de relacionamento viagem-destino (muitos para muitos)
      db.run(`CREATE TABLE IF NOT EXISTS viagem_destinos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        viagem_id INTEGER NOT NULL,
        destino_id INTEGER NOT NULL,
        FOREIGN KEY (viagem_id) REFERENCES viagens (id) ON DELETE CASCADE,
        FOREIGN KEY (destino_id) REFERENCES destinos (id) ON DELETE CASCADE
      )`, (err) => {
        if (err) {
          console.error('Erro ao criar tabela viagem_destinos:', err.message);
          reject(err);
        } else {
          console.log('Todas as tabelas foram criadas com sucesso');
          resolve();
        }
      });
    });
  });
}

// Funções para destinos
function getAllDestinos() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM destinos ORDER BY id', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function createDestino(nome) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO destinos (nome) VALUES (?)', [nome], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, nome: nome });
      }
    });
  });
}

function updateDestino(id, nome) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE destinos SET nome = ? WHERE id = ?', [nome, id], function(err) {
      if (err) {
        reject(err);
      } else if (this.changes === 0) {
        reject(new Error('Destino não encontrado'));
      } else {
        resolve({ id: id, nome: nome });
      }
    });
  });
}

function deleteDestino(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM destinos WHERE id = ?', [id], function(err) {
      if (err) {
        reject(err);
      } else if (this.changes === 0) {
        reject(new Error('Destino não encontrado'));
      } else {
        resolve({ message: 'Destino removido' });
      }
    });
  });
}

// Funções para viagens
function getAllViagens() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT v.*, GROUP_CONCAT(vd.destino_id) as destino_ids
      FROM viagens v
      LEFT JOIN viagem_destinos vd ON v.id = vd.viagem_id
      GROUP BY v.id
      ORDER BY v.id
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Converter string de IDs em array de números
        const viagens = rows.map(row => ({
          ...row,
          destinos: row.destino_ids ? row.destino_ids.split(',').map(Number) : []
        }));
        delete viagens.forEach(v => delete v.destino_ids);
        resolve(viagens);
      }
    });
  });
}

function createViagem(nome, dataSaida, dataChegada, valor, destinos = []) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO viagens (nome, dataSaida, dataChegada, valor) VALUES (?, ?, ?, ?)', 
      [nome, dataSaida, dataChegada, valor], function(err) {
      if (err) {
        reject(err);
      } else {
        const viagemId = this.lastID;
        
        // Inserir destinos da viagem
        if (destinos.length > 0) {
          const stmt = db.prepare('INSERT INTO viagem_destinos (viagem_id, destino_id) VALUES (?, ?)');
          destinos.forEach(destinoId => {
            stmt.run(viagemId, destinoId);
          });
          stmt.finalize();
        }
        
        resolve({ 
          id: viagemId, 
          nome, 
          dataSaida, 
          dataChegada, 
          valor, 
          destinos 
        });
      }
    });
  });
}

function updateViagem(id, nome, dataSaida, dataChegada, valor, destinos = []) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE viagens SET nome = ?, dataSaida = ?, dataChegada = ?, valor = ? WHERE id = ?', 
      [nome, dataSaida, dataChegada, valor, id], function(err) {
      if (err) {
        reject(err);
      } else if (this.changes === 0) {
        reject(new Error('Viagem não encontrada'));
      } else {
        // Atualizar destinos da viagem
        db.run('DELETE FROM viagem_destinos WHERE viagem_id = ?', [id], (err) => {
          if (err) {
            reject(err);
          } else {
            if (destinos.length > 0) {
              const stmt = db.prepare('INSERT INTO viagem_destinos (viagem_id, destino_id) VALUES (?, ?)');
              destinos.forEach(destinoId => {
                stmt.run(id, destinoId);
              });
              stmt.finalize();
            }
            
            resolve({ 
              id, 
              nome, 
              dataSaida, 
              dataChegada, 
              valor, 
              destinos 
            });
          }
        });
      }
    });
  });
}

function deleteViagem(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM viagens WHERE id = ?', [id], function(err) {
      if (err) {
        reject(err);
      } else if (this.changes === 0) {
        reject(new Error('Viagem não encontrada'));
      } else {
        resolve({ message: 'Viagem removida' });
      }
    });
  });
}

module.exports = {
  db,
  initializeDatabase,
  getAllDestinos,
  createDestino,
  updateDestino,
  deleteDestino,
  getAllViagens,
  createViagem,
  updateViagem,
  deleteViagem
};