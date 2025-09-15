# Sistema CRUD - Viagens e Destinos

Sistema CRUD em TypeScript para gerenciar viagens e destinos.

## Funcionalidades

### Destinos
- Create, Read, Update, Delete

### Viagens  
- Create, Read, Update, Delete
- Relacionamento com destinos

## Como Usar

```bash
npm install
npm run dev
```

### Executar o sistema
```bash
# Usando ts-node (recomendado para desenvolvimento)
npm run dev

# Ou compilar e executar
npm run build
npm start
```

### Menu Principal
O sistema apresenta um menu interativo com duas opções principais:

1. **Gerenciar Destinos**
   - Criar destino
   - Listar destinos
   - Buscar destino
   - Atualizar destino
   - Remover destino

2. **Gerenciar Viagens**
   - Criar viagem
   - Listar viagens
   - Buscar viagem
   - Atualizar viagem
   - Remover viagem
   - Adicionar destino à viagem
   - Remover destino da viagem

## 💾 Persistência de Dados

Os dados são armazenados em arquivos JSON na pasta `data/`:
- `destinos.json`: Lista de destinos
- `viagens.json`: Lista de viagens com seus destinos

## 📝 Exemplos de Uso

### Exemplo de Fluxo Completo

1. **Criar destinos**:
   - "Paris"
   - "Londres" 
   - "Roma"

2. **Criar viagem**:
   - Nome: "Europa 2024"
   - Data saída: "2024-06-15"
   - Data chegada: "2024-06-30"
   - Valor: 5000.00

3. **Adicionar destinos à viagem**:
   - Adicionar "Paris" à "Europa 2024"
   - Adicionar "Londres" à "Europa 2024"

4. **Listar viagens**: Ver a viagem com destinos associados

## 🔧 Scripts Disponíveis

- `npm run build`: Compila TypeScript para JavaScript
- `npm run dev`: Executa em modo desenvolvimento com ts-node
- `npm start`: Executa versão compilada

## 🏛️ Estrutura do Código

### Classes Principais

#### Destino
```typescript
class Destino {
    public nome: string;
    
    constructor(nome: string)
    toJSON(): any
    static fromJSON(data: any): Destino
}
```

#### Viagem
```typescript
class Viagem {
    public nome: string;
    public dataSaida: Date;
    public dataChegada: Date;
    public valor: number;
    public destinos: Destino[];
    
    constructor(nome: string, dataSaida: Date, dataChegada: Date, valor: number)
    addDestino(destino: Destino): void
    removeDestino(nomeDestino: string): boolean
    toJSON(): any
    static fromJSON(data: any): Viagem
}
```

## ✅ Validações Implementadas

### Destinos
- Nome não pode ser vazio
- Não permite destinos duplicados

### Viagens
- Nome não pode ser vazio
- Data de saída deve ser anterior à data de chegada
- Valor deve ser positivo
- Não permite viagens duplicadas
- Destino deve existir antes de ser adicionado à viagem

## 🎯 Todas as Operações CRUD Funcionando

✅ **Create** - Criação de destinos e viagens
✅ **Read** - Listagem e busca de destinos e viagens  
✅ **Update** - Atualização de destinos e viagens
✅ **Delete** - Remoção de destinos e viagens

O sistema está completamente funcional e pronto para uso!