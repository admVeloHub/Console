# Guia de Migração - Google Sheets para MongoDB

Este guia explica como migrar todos os dados do Google Sheets para o MongoDB, preservando a formatação HTML.

## 📋 Pré-requisitos

### 1. Configurar Google Sheets API

1. **Acesse o Google Cloud Console**: https://console.cloud.google.com/
2. **Crie um novo projeto** ou use um existente
3. **Habilite a Google Sheets API**:
   - Vá para "APIs & Services" > "Library"
   - Procure por "Google Sheets API"
   - Clique em "Enable"
4. **Crie credenciais de conta de serviço**:
   - Vá para "APIs & Services" > "Credentials"
   - Clique em "Create Credentials" > "Service Account"
   - Preencha os dados da conta de serviço
   - Clique em "Create and Continue"
   - Clique em "Done"
5. **Baixe o arquivo JSON das credenciais**:
   - Clique na conta de serviço criada
   - Vá para a aba "Keys"
   - Clique em "Add Key" > "Create new key"
   - Selecione "JSON" e clique em "Create"
   - Salve o arquivo como `credentials.json` na raiz do projeto

### 2. Configurar a Planilha

1. **Compartilhe a planilha** com o email da conta de serviço (está no arquivo JSON)
2. **Dê permissão de leitura** para a conta de serviço
3. **Copie o ID da planilha** da URL:
   ```
   https://docs.google.com/spreadsheets/d/SEU_SPREADSHEET_ID_AQUI/edit
   ```

### 3. Configurar o Script

1. **Edite o arquivo `migrate-sheets-to-mongodb.js`**
2. **Substitua `SEU_SPREADSHEET_ID_AQUI`** pelo ID real da sua planilha
3. **Certifique-se de que o arquivo `credentials.json`** está na raiz do projeto

## 🚀 Executando a Migração

### Passo 1: Instalar dependências
```bash
npm install
```

### Passo 2: Verificar dados existentes (opcional)
```bash
npm run migrate
```

### Passo 3: Limpar MongoDB (se necessário)
```bash
npm run clear:confirm
```

### Passo 4: Executar migração
```bash
npm run migrate:confirm
```

## 📊 Estrutura dos Dados

### Aba "Artigos"
- `categoria_id`: ID da categoria
- `categoria_titulo`: Título da categoria
- `artigo_titulo`: Título do artigo
- `artigo_conteudo`: Conteúdo HTML do artigo

### Aba "Velonews"
- `title`: Título da notícia
- `content`: Conteúdo HTML da notícia
- `alerta_critico`: Indicador de alerta crítico (S/N)

### Aba "Bot_perguntas"
- `topico`: Tópico da pergunta
- `contexto`: Contexto HTML da pergunta
- `Palavras_chave`: Palavras-chave relacionadas
- `URLs de Imagens`: URLs das imagens relacionadas

## ✅ Verificação

Após a migração, você pode verificar os dados:

1. **Acesse o MongoDB Atlas** e verifique as coleções
2. **Use a API do servidor** para buscar dados:
   - `GET http://localhost:3000/api/central-agente`
   - `GET http://localhost:3000/api/data/Artigos`
   - `GET http://localhost:3000/api/data/Velonews`
   - `GET http://localhost:3000/api/data/Bot_perguntas`

## 🔧 Solução de Problemas

### Erro de autenticação
- Verifique se o arquivo `credentials.json` está correto
- Confirme se a planilha foi compartilhada com a conta de serviço

### Erro de ID da planilha
- Verifique se o ID da planilha está correto no script
- Confirme se a planilha existe e é acessível

### Erro de conexão MongoDB
- Verifique se o MongoDB Atlas está acessível
- Confirme se a string de conexão está correta

## 📝 Notas Importantes

- **Formatação HTML preservada**: Todo o conteúdo HTML será mantido
- **Timestamps adicionados**: Cada registro terá `createdAt` e `updatedAt`
- **Dados não duplicados**: O script adiciona dados sem verificar duplicatas
- **Backup recomendado**: Faça backup dos dados antes da migração

## 🎯 Próximos Passos

Após a migração bem-sucedida:

1. **Teste a API** para garantir que os dados estão acessíveis
2. **Atualize o frontend** para usar o MongoDB em vez do Google Sheets
3. **Configure sincronização** se necessário manter ambos atualizados
4. **Monitore o desempenho** da aplicação com o novo banco de dados
