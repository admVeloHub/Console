# Console de Conteúdo

Projeto de revisão com arquivos HTML, JavaScript e TypeScript, migrado para MongoDB.

## Pré-requisitos

- Node.js (versão 14.0.0 ou superior)
- npm (vem com o Node.js)
- MongoDB Atlas (cluster configurado)

## Instalação

1. Clone ou baixe este projeto
2. Abra o terminal na pasta do projeto
3. Execute o comando para instalar as dependências:

```bash
npm install
```

4. Configure as variáveis de ambiente:
   - Copie o arquivo `env.example` para `.env`
   - Substitua `MONGODB_URI` pela sua string de conexão do MongoDB Atlas

## Como usar

### Executar o servidor MongoDB:
```bash
npm start
```

ou

```bash
npm run dev
```

O servidor estará disponível em: http://localhost:3000

### Compilar o arquivo TypeScript:
```bash
npm run build
```

## Estrutura do projeto

- `server.js` - Servidor Express com MongoDB
- `config/database.js` - Configuração do MongoDB
- `front review.html` - Arquivo HTML do frontend
- `front review.ts` - Arquivo TypeScript
- `script review.js` - Script JavaScript original (legado)
- `back review.html` - Arquivo HTML do backend

## API Endpoints

- `POST /api/submit` - Enviar dados para MongoDB
- `GET /api/data/:sheetName` - Buscar dados de uma coleção
- `PUT /api/data/:sheetName/:id` - Atualizar dados
- `DELETE /api/data/:sheetName/:id` - Deletar dados

## Desenvolvimento

Para desenvolvimento, você pode usar:

```bash
npm run dev
```

Isso executará o script principal em modo de desenvolvimento.
