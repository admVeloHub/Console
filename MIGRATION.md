# Migração para MongoDB

## O que mudou?

### Antes (Google Apps Script):
- Dados salvos em Google Sheets
- API hospedada no Google Apps Script
- Limitações de CORS e requisições

### Agora (MongoDB):
- Dados salvos no MongoDB Atlas
- API hospedada localmente com Express
- Sem limitações de CORS
- Melhor performance e escalabilidade

## Configuração Necessária

### 1. String de Conexão MongoDB
Você precisa da string de conexão do seu cluster MongoDB Atlas. Ela se parece com:
```
mongodb+srv://usuario:senha@cluster.mongodb.net/console_conteudo?retryWrites=true&w=majority
```

### 2. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com:
```
MONGODB_URI=sua_string_de_conexao_aqui
DB_NAME=console_conteudo
PORT=3000
NODE_ENV=development
```

## Como usar

### 1. Iniciar o servidor:
```bash
npm start
```

### 2. Acessar a aplicação:
- Abra: http://localhost:3000
- O frontend continuará funcionando normalmente
- Os dados agora são salvos no MongoDB

### 3. Verificar dados no MongoDB:
- Acesse o MongoDB Atlas
- Procure pela database `console_conteudo`
- As coleções serão criadas automaticamente:
  - `Artigos`
  - `Velonews`
  - `Bot_perguntas`

## Estrutura dos Dados

Cada documento no MongoDB terá:
```json
{
  "_id": "ObjectId",
  "campo1": "valor1",
  "campo2": "valor2",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Vantagens da Migração

✅ **Performance**: MongoDB é mais rápido que Google Sheets
✅ **Escalabilidade**: Suporta milhões de documentos
✅ **Flexibilidade**: Schema flexível para diferentes tipos de dados
✅ **Consultas**: Queries mais poderosas e flexíveis
✅ **Backup**: Backup automático no MongoDB Atlas
✅ **Segurança**: Autenticação e autorização robustas

## Próximos Passos

1. Configure a string de conexão no arquivo `.env`
2. Execute `npm start` para iniciar o servidor
3. Teste o envio de dados através do frontend
4. Verifique os dados no MongoDB Atlas

