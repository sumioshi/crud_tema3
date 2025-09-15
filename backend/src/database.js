const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');

function lerDatabase() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { viagens: [], destinos: [] };
  }
}

function salvarDatabase(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function proximoId(lista) {
  if (lista.length === 0) {
    return 1;
  }
  
  let maiorId = 0;
  for(let i = 0; i < lista.length; i++) {
    if(lista[i].id > maiorId) {
      maiorId = lista[i].id;
    }
  }
  return maiorId + 1;
}

module.exports = {
  lerDatabase,
  salvarDatabase,
  proximoId
};