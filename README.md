# Sistema de Gerenciamento de Viagens - CRUD

Sistema completo em TypeScript para gerenciar viagens e destinos com operações CRUD.

O servidor rodará na porta 3000.

#### 2. Abrir o Frontend
Abrir o arquivo `frontend/index.html` no navegador.
### Relacionamento
- Cada viagem pode ter múltiplos destinos
- Interface permite selecionar destinos para viagens

## Endpoints da API

### Destinos
- `GET /destinos` - Listar destinos
- `POST /destinos` - Criar destino
- `PUT /destinos/:id` - Atualizar destino
- `DELETE /destinos/:id` - Excluir destino

### Viagens
- `GET /viagens` - Listar viagens
- `POST /viagens` - Criar viagem
- `PUT /viagens/:id` - Atualizar viagem
- `DELETE /viagens/:id` - Excluir viagem

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: HTML, CSS, TypeScript
- **Banco de Dados**: Arquivo JSON simples
- **CORS**: Habilitado para comunicação entre frontend e backend
