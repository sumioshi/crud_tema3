const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath: string = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// inicializar as tabelas caso n existam ainda 
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

// destinos
function getAllDestinos(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM destinos', (err: any, rows: any) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function createDestino(nome: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO destinos (nome) VALUES (?)', [nome], function(err: any) {
      if (err) reject(err);
      else resolve({ id: (this as any).lastID, nome: nome });
    });
  });
}

function updateDestino(id: number, nome: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run('UPDATE destinos SET nome = ? WHERE id = ?', [nome, id], function(err: any) {
      if (err) reject(err);
      else resolve({ id: id, nome: nome });
    });
  });
}

function deleteDestino(id: number): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM destinos WHERE id = ?', [id], function(err: any) {
      if (err) reject(err);
      else resolve({ message: 'Destino removido' });
    });
  });
}

// viagens
function getAllViagens(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM viagens', (err: any, rows: any) => {
      if (err) {
        reject(err);
      } else {
       // p cada viagem a gnt busca os destinos associados
        const viagens: any[] = [];
        let count = 0;
        
        if (rows.length === 0) {
          resolve([]);
          return;
        }
        
        rows.forEach((viagem: any) => {
          db.all('SELECT destino_id FROM viagem_destinos WHERE viagem_id = ?', [viagem.id], (err: any, destinos: any) => {
            if (err) {
              reject(err);
            } else {
              viagem.destinos = destinos.map((d: any) => d.destino_id);
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

function createViagem(nome: string, dataSaida: string, dataChegada: string, valor: number, destinos: number[]): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO viagens (nome, dataSaida, dataChegada, valor) VALUES (?, ?, ?, ?)', 
      [nome, dataSaida, dataChegada, valor], function(err: any) {
      if (err) {
        reject(err);
      } else {
        const viagemId = (this as any).lastID;
        
        // aq é a logica para add os destinos associados
        if (destinos && destinos.length > 0) {
          let count = 0;
          destinos.forEach((destinoId: number) => {
            db.run('INSERT INTO viagem_destinos (viagem_id, destino_id) VALUES (?, ?)', 
              [viagemId, destinoId], (err: any) => {
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

function updateViagem(id: number, nome: string, dataSaida: string, dataChegada: string, valor: number, destinos: number[]): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run('UPDATE viagens SET nome = ?, dataSaida = ?, dataChegada = ?, valor = ? WHERE id = ?', 
      [nome, dataSaida, dataChegada, valor, id], function(err: any) {
      if (err) {
        reject(err);
      } else {
        // pegar os destinos antigos e remover
        db.run('DELETE FROM viagem_destinos WHERE viagem_id = ?', [id], (err: any) => {
          if (err) {
            reject(err);
          } else {
            // ent aqui vamos adicionar os novos destinos
            if (destinos && destinos.length > 0) {
              let count = 0;
              destinos.forEach((destinoId: number) => {
                db.run('INSERT INTO viagem_destinos (viagem_id, destino_id) VALUES (?, ?)', 
                  [id, destinoId], (err: any) => {
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

function deleteViagem(id: number): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM viagens WHERE id = ?', [id], function(err: any) {
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