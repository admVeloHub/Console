# 🚀 Deploy no Vercel - Console de Conteúdo

## 📋 Pré-requisitos

- ✅ Conta no [Vercel](https://vercel.com)
- ✅ Conta no [GitHub](https://github.com)
- ✅ Repositório conectado ao GitHub
- ✅ MongoDB Atlas configurado

## 🛠️ Configuração do Deploy

### 1. **Conectar ao Vercel**

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Importe o repositório: `admVeloHub/Console`

### 2. **Configurar Variáveis de Ambiente**

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```env
MONGODB_URI=mongodb+srv://lucasgravina:nKQu8bSN6iZl8FPo@clustercentral.quqgq6x.mongodb.net/console_conteudo?retryWrites=true&w=majority&appName=ClusterCentral
DB_NAME=console_conteudo
NODE_ENV=production
```

### 3. **Configurações do Projeto**

- **Framework Preset**: Node.js
- **Build Command**: `npm run build`
- **Output Directory**: `.`
- **Install Command**: `npm install`

### 4. **Deploy**

Clique em **Deploy** e aguarde a conclusão.

## 🌐 URLs do Deploy

Após o deploy, você terá acesso a:

- **URL Principal**: `https://console-admvelohub.vercel.app`
- **URL de Preview**: `https://console-admvelohub-git-master-admvelohub.vercel.app`

## 🔧 Configurações Específicas

### Arquivo `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

### Scripts no `package.json`
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'Build completed'",
    "vercel-build": "echo 'Vercel build completed'"
  }
}
```

## 🧪 Testando o Deploy

### 1. **Verificar Status da API**
```bash
curl https://console-admvelohub.vercel.app/api/status
```

### 2. **Testar Inserção de Dados**
```bash
curl -X POST https://console-admvelohub.vercel.app/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "sheetName": "Artigos",
    "data": {
      "categoria_id": "test_deploy",
      "categoria_titulo": "Teste Deploy",
      "artigo_titulo": "Teste de Deploy no Vercel",
      "artigo_conteudo": "<p>Teste de deploy funcionando!</p>"
    }
  }'
```

## 🚨 Troubleshooting

### Erro de Conexão com MongoDB
1. Verifique se as variáveis de ambiente estão configuradas
2. Confirme se o MongoDB Atlas permite conexões do Vercel
3. Teste a conexão localmente primeiro

### Erro de Build
1. Verifique se todas as dependências estão no `package.json`
2. Confirme se o script de build está correto
3. Verifique os logs do build no Vercel

### Erro de CORS
1. O CORS já está configurado no servidor
2. Se necessário, adicione domínios específicos no `server.js`

## 📊 Monitoramento

### Logs do Vercel
- Acesse o painel do Vercel
- Vá em **Functions** para ver os logs
- Monitore o uso de recursos

### Métricas
- **Requests**: Número de requisições
- **Duration**: Tempo de resposta
- **Errors**: Erros de execução

## 🔄 Deploy Automático

O Vercel faz deploy automático quando:
- ✅ Push para a branch `master`
- ✅ Pull Request é criado
- ✅ Branch é deletada

## 🎯 Próximos Passos

1. **Custom Domain**: Configure um domínio personalizado
2. **SSL**: Certificado SSL automático
3. **CDN**: Distribuição global automática
4. **Analytics**: Adicione analytics do Vercel

## 📞 Suporte

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: [github.com/admVeloHub/Console/issues](https://github.com/admVeloHub/Console/issues)
- **MongoDB Atlas**: [cloud.mongodb.com](https://cloud.mongodb.com)
