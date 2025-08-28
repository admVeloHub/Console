require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'console_conteudo';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware de segurança
app.use(helmet());

// CORS configurado para o frontend
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite por IP
    message: {
        error: 'Muitas requisições. Tente novamente em 15 minutos.'
    }
});
app.use('/api/', limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));

// Variáveis globais para conexão persistente
let mongoClient = null;
let mongoDb = null;

// Função para conectar ao MongoDB com retry
async function connectDB() {
    const maxRetries = 5;
    let attempt = 0;
    
    while (attempt < maxRetries) {
        try {
            if (!mongoClient) {
                console.log(`🔗 Tentativa ${attempt + 1} de conexão MongoDB...`);
                mongoClient = new MongoClient(MONGODB_URI, {
                    maxPoolSize: 10,
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 45000,
                    retryWrites: true,
                    w: 'majority'
                });
                await mongoClient.connect();
                mongoDb = mongoClient.db(DB_NAME);
                console.log('✅ MongoDB conectado com sucesso');
            }
            return { client: mongoClient, db: mongoDb };
        } catch (error) {
            attempt++;
            console.error(`❌ Tentativa ${attempt} falhou:`, error.message);
            
            if (attempt === maxRetries) {
                console.error('❌ Todas as tentativas de conexão falharam');
                throw error;
            }
            
            // Aguardar antes de tentar novamente (backoff exponencial)
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: mongoClient ? 'connected' : 'disconnected'
    });
});

// API endpoint para inserir dados
app.post('/api/submit', async (req, res) => {
    try {
        console.log('📥 Recebendo requisição POST /api/submit');
        console.log('📋 Body da requisição:', JSON.stringify(req.body, null, 2));
        
        const { collection, data } = req.body;
        
        // Validação de entrada
        if (!collection || !data) {
            console.log('❌ Dados obrigatórios não fornecidos');
            return res.status(400).json({
                success: false,
                message: 'Dados obrigatórios não fornecidos',
                required: ['collection', 'data']
            });
        }

        // Validação da coleção
        const validCollections = ['Artigos', 'Velonews', 'Bot_perguntas'];
        if (!validCollections.includes(collection)) {
            return res.status(400).json({
                success: false,
                message: 'Coleção inválida',
                validCollections
            });
        }

        console.log('🔗 Conectando ao MongoDB...');
        const { db } = await connectDB();

        console.log(`📊 Inserindo na coleção: ${collection}`);
        const collectionObj = db.collection(collection);
        
        // Adicionar timestamps
        const documentToInsert = {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collectionObj.insertOne(documentToInsert);

        console.log('✅ Dados inseridos com sucesso. ID:', result.insertedId);
        res.json({
            success: true,
            id: result.insertedId,
            message: 'Dados salvos com sucesso',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Erro ao inserir:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
        });
    }
});

// API endpoint para buscar dados
app.get('/api/data/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        
        // Validação da coleção
        const validCollections = ['Artigos', 'Velonews', 'Bot_perguntas'];
        if (!validCollections.includes(collection)) {
            return res.status(400).json({
                success: false,
                message: 'Coleção inválida',
                validCollections
            });
        }

        const { db } = await connectDB();
        const collectionObj = db.collection(collection);
        
        // Buscar dados com ordenação por data de criação
        const data = await collectionObj.find({})
            .sort({ createdAt: -1 })
            .limit(100) // Limitar a 100 registros
            .toArray();
            
        res.json({
            success: true,
            data,
            count: data.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Erro ao buscar:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
        });
    }
});

// Rota de teste para verificar se a API está funcionando
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando!',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        environment: {
            hasMongoUri: !!MONGODB_URI,
            dbName: DB_NAME,
            nodeEnv: process.env.NODE_ENV,
            frontendUrl: FRONTEND_URL
        }
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint não encontrado',
        availableEndpoints: [
            'GET /health',
            'GET /api/test',
            'POST /api/submit',
            'GET /api/data/:collection'
        ]
    });
});

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
    console.error('❌ Erro não tratado:', error);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
    });
});

// Função para fechar conexão MongoDB
async function closeDB() {
    if (mongoClient) {
        console.log('🔌 Fechando conexão MongoDB...');
        await mongoClient.close();
        mongoClient = null;
        mongoDb = null;
    }
}

// Inicialização
async function startServer() {
    try {
        // Testar conexão com MongoDB
        await connectDB();
        
        const server = app.listen(PORT, () => {
            console.log(`🚀 Backend rodando na porta ${PORT}`);
            console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
            console.log(`📊 MongoDB: ${DB_NAME}`);
            console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
        });
        
        // Fechar conexão quando o servidor for encerrado
        process.on('SIGINT', async () => {
            console.log('\n🛑 Encerrando servidor...');
            await closeDB();
            server.close(() => {
                console.log('✅ Servidor encerrado');
                process.exit(0);
            });
        });
        
        process.on('SIGTERM', async () => {
            console.log('\n🛑 Recebido SIGTERM, encerrando servidor...');
            await closeDB();
            server.close(() => {
                console.log('✅ Servidor encerrado');
                process.exit(0);
            });
        });
        
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();
