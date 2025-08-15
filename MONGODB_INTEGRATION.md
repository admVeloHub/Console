# Integração com MongoDB - Console de Conteúdo

## 🚀 Status da Integração

✅ **INTEGRAÇÃO COMPLETA** - O console agora está totalmente integrado com MongoDB!

## 📋 O que foi implementado

### 1. **Servidor Node.js com MongoDB**
- ✅ Servidor Express configurado
- ✅ Conexão com MongoDB Atlas
- ✅ APIs RESTful para CRUD
- ✅ Fallback para armazenamento local

### 2. **APIs Disponíveis**
- `POST /api/submit` - Inserir dados
- `GET /api/data/:sheetName` - Buscar dados
- `PUT /api/data/:sheetName/:id` - Atualizar dados
- `DELETE /api/data/:sheetName/:id` - Deletar dados
- `GET /api/status` - Status do sistema
- `GET /api/central-agente` - Dados da Central do Agente

### 3. **Coleções MongoDB**
- `Artigos` - Artigos do sistema
- `Velonews` - Notícias e alertas
- `Bot_perguntas` - Perguntas do chatbot

## 🛠️ Como usar

### 1. **Iniciar o servidor**
```bash
npm start
# ou
npm run dev
```

### 2. **Testar a integração**
```bash
npm test
# ou
npm run test:integration
```

### 3. **Acessar o console**
Abra no navegador: `http://localhost:3000`

## 📊 Estrutura dos Dados

### Artigos
```json
{
  "categoria_id": "01_antecipação",
  "categoria_titulo": "Antecipação",
  "artigo_titulo": "Título do artigo",
  "artigo_conteudo": "<p>Conteúdo HTML...</p>",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Velonews
```json
{
  "title": "Título da notícia",
  "content": "<p>Conteúdo HTML...</p>",
  "alerta_critico": "Y",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Bot_perguntas
```json
{
  "topico": "Tópico da pergunta",
  "contexto": "<p>Contexto HTML...</p>",
  "Palavras_chave": "palavra1, palavra2, palavra3",
  "URLs_de_Imagens": "url1, url2, url3",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/console_conteudo?retryWrites=true&w=majority
DB_NAME=console_conteudo

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Dependências
Todas as dependências necessárias já estão no `package.json`:
- `express` - Servidor web
- `mongodb` - Driver do MongoDB
- `cors` - Cross-origin resource sharing
- `dotenv` - Variáveis de ambiente

## 🧪 Testes

### Teste de Integração
```bash
npm run test:integration
```

Este teste verifica:
- ✅ Conexão com MongoDB
- ✅ Inserção de dados
- ✅ Busca de dados
- ✅ Atualização de dados
- ✅ Remoção de dados
- ✅ Contagem de documentos

### Teste Manual
1. Inicie o servidor: `npm start`
2. Acesse: `http://localhost:3000`
3. Preencha um formulário e envie
4. Verifique se os dados aparecem no MongoDB

## 📁 Arquivos Principais

- `server.js` - Servidor principal
- `config/database.js` - Configuração do MongoDB
- `console-standalone.html` - Interface principal
- `back review.html` - Backend atualizado (não mais usa Google Apps Script)
- `test-mongodb-integration.js` - Script de teste

## 🔄 Migração de Dados

### Migração Manual
```bash
npm run migrate:manual
```

### Migração com Dados de Exemplo
```bash
npm run migrate:sample
```

### Limpar Banco de Dados
```bash
npm run clear:confirm
```

## 🚨 Troubleshooting

### Erro de Conexão
1. Verifique se o MongoDB Atlas está acessível
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão: `npm test`

### Erro de CORS
1. Verifique se o servidor está rodando na porta correta
2. Confirme se o CORS está configurado no servidor

### Dados não aparecem
1. Verifique se o MongoDB está conectado: `GET /api/status`
2. Confirme se os dados estão sendo salvos no local storage como fallback

## 🎯 Próximos Passos

1. **Monitoramento** - Adicionar logs mais detalhados
2. **Validação** - Implementar validação de dados
3. **Autenticação** - Adicionar sistema de login
4. **Backup** - Implementar backup automático
5. **Performance** - Otimizar consultas

## 📞 Suporte

Se encontrar problemas:
1. Execute `npm test` para verificar a integração
2. Verifique os logs do servidor
3. Confirme se todas as dependências estão instaladas: `npm install`
