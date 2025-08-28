# 🎨 Console de Conteúdo - Frontend

Frontend para o Console de Conteúdo da VeloAcademy.

## 📁 Estrutura

```
frontend/
├── index.html              # Página principal
├── pages/                  # Páginas específicas
│   ├── artigos.html       # Formulário de artigos
│   ├── velonews.html      # Formulário de velonews
│   └── bot-perguntas.html # Formulário de bot perguntas
├── assets/                # Recursos estáticos
│   ├── css/
│   │   └── styles.css     # Estilos principais
│   ├── js/
│   │   └── app.js         # JavaScript principal
│   └── images/
│       ├── console.png    # Logo
│       └── success.gif    # GIF de sucesso
├── package.json           # Configurações do projeto
├── vercel.json           # Configuração do Vercel
└── README.md             # Este arquivo
```

## 🚀 Como Executar

### Desenvolvimento Local
```bash
npm run dev
```

### Produção
```bash
npm start
```

## ⚙️ Configuração

### Variáveis de Ambiente
- `API_URL`: URL do backend (padrão: http://localhost:3002)

### Configuração da API
O frontend se conecta ao backend através da variável `API_BASE_URL` no arquivo `assets/js/app.js`.

## 🔧 Funcionalidades

- ✅ Formulários para Artigos, Velonews e Bot Perguntas
- ✅ Feedback visual com overlay animado
- ✅ Tema claro/escuro
- ✅ Validação de formulários
- ✅ Retry mechanism para falhas de conexão
- ✅ Design responsivo

## 📱 Páginas

1. **Página Principal** (`index.html`)
   - Dashboard com navegação
   - Links para todas as funcionalidades

2. **Artigos** (`pages/artigos.html`)
   - Formulário para criação de artigos
   - Categorias e palavras-chave

3. **Velonews** (`pages/velonews.html`)
   - Formulário para velonews
   - Opção de alerta urgente

4. **Bot Perguntas** (`pages/bot-perguntas.html`)
   - Formulário para perguntas do bot
   - Campos para contexto e imagens

## 🎨 Design

- Design moderno e responsivo
- Tema claro/escuro
- Animações suaves
- Feedback visual para todas as ações
- Interface intuitiva

## 🔗 Integração com Backend

O frontend se comunica com o backend através das seguintes APIs:

- `POST /api/submit` - Envio de dados
- `GET /api/test` - Teste de conexão
- `GET /api/data/:collection` - Busca de dados

## 📦 Deploy

### Vercel
1. Conecte o repositório ao Vercel
2. Configure a variável de ambiente `API_URL`
3. Deploy automático

### Outros
- Pode ser servido por qualquer servidor web estático
- Configure CORS adequadamente no backend
