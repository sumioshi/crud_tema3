## Sistema de Gerenciamento de Viagens - CRUD

### Aluno: Rodrigo Shodi Sumioshi - RA: 220141912


Sistema completo em TypeScript para gerenciar viagens e destinos com operações CRUD.

localhost na porta 3001.

#### Abrir o Frontend
pelo live preview ou abrir direto "frontend/index.html" no navegador.
### Relacionamento
- Cada viagem pode ter múltiplos destinos
- Interface permite selecionar destinos para viagens

## Banco de Dados SQLITE como se conectar:

- Só inserir o caminho no Dbeaver:
>C:\Users\shodi\Documents\GitHub\ENG-SOFTWARE\crud_tema3\backend\src\database.db

## testes:

-- CREATE (Inserir)
INSERT INTO destinos (nome) VALUES ('Rio de Janeiro');

-- READ (Consultar)
SELECT * FROM destinos;

-- UPDATE (Atualizar)
UPDATE destinos SET nome = 'Rio de Janeiro - RJ' WHERE id = 1;

-- DELETE (Deletar)
DELETE FROM destinos WHERE id = 1;

## Tecnologias Utilizadas

 Backend: Node.js, Express, TypeScript
 Frontend*: HTML, CSS, TypeScript
 Banco de Dados: SQLITE