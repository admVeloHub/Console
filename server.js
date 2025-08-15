// Carregar variáveis de ambiente
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectToDatabase, closeConnection } = require('./config/database');
const localStorage = require('./config/local-storage');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir arquivos estáticos

// Verificar conexão com MongoDB
let mongoConnected = false;
connectToDatabase()
    .then(() => {
        mongoConnected = true;
        console.log('🚀 Servidor iniciado com MongoDB conectado!');
    })
    .catch(err => {
        console.log('⚠️ MongoDB não disponível, usando armazenamento local');
        console.log('📁 Dados serão salvos em: data/local-storage.json');
        mongoConnected = false;
    });

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/console-standalone.html');
});

// Rota para verificar status do sistema
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        mongoConnected: mongoConnected,
        storage: mongoConnected ? 'mongodb' : 'local',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.post('/api/submit', async (req, res) => {
    try {
        const { sheetName, data } = req.body;
        
        if (mongoConnected) {
            // Usar MongoDB se disponível
            const { db } = await connectToDatabase();
            const collection = db.collection(sheetName);
            const result = await collection.insertOne({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            console.log(`✅ Dados inseridos no MongoDB (${sheetName}):`, result.insertedId);
            
            res.json({
                success: true,
                message: 'Dados salvos no MongoDB com sucesso!',
                id: result.insertedId,
                storage: 'mongodb'
            });
        } else {
            // Usar armazenamento local
            const result = localStorage.insertData(sheetName, data);
            
            if (result.success) {
                console.log(`✅ Dados salvos localmente (${sheetName}):`, result.id);
                res.json({
                    success: true,
                    message: 'Dados salvos localmente com sucesso!',
                    id: result.id,
                    storage: 'local'
                });
            } else {
                throw new Error(result.message);
            }
        }
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para buscar dados
app.get('/api/data/:sheetName', async (req, res) => {
    try {
        const { sheetName } = req.params;
        
        if (mongoConnected) {
            // Usar MongoDB se disponível
            const { db } = await connectToDatabase();
            const collection = db.collection(sheetName);
            const data = await collection.find({}).toArray();
            
            res.json({
                success: true,
                data: data,
                storage: 'mongodb'
            });
        } else {
            // Usar armazenamento local
            const data = localStorage.findData(sheetName);
            
            res.json({
                success: true,
                data: data,
                storage: 'local'
            });
        }
    } catch (error) {
        console.error('❌ Erro ao buscar dados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota específica para Central do Agente - buscar todos os dados
app.get('/api/central-agente', async (req, res) => {
    try {
        if (mongoConnected) {
            // Usar MongoDB se disponível
            const { db } = await connectToDatabase();
            
            const artigos = await db.collection('Artigos').find({}).toArray();
            const velonews = await db.collection('Velonews').find({}).toArray();
            const botPerguntas = await db.collection('Bot_perguntas').find({}).toArray();
            
            res.json({
                success: true,
                data: {
                    artigos: artigos,
                    velonews: velonews,
                    botPerguntas: botPerguntas
                },
                storage: 'mongodb'
            });
        } else {
            // Usar armazenamento local
            const data = localStorage.findAllData();
            
            res.json({
                success: true,
                data: data,
                storage: 'local'
            });
        }
    } catch (error) {
        console.error('❌ Erro ao buscar dados da Central do Agente:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para atualizar dados
app.put('/api/data/:sheetName/:id', async (req, res) => {
    try {
        const { sheetName, id } = req.params;
        const updateData = req.body;
        const { db } = await connectToDatabase();
        
        const collection = db.collection(sheetName);
        const result = await collection.updateOne(
            { _id: require('mongodb').ObjectId(id) },
            { 
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            }
        );
        
        res.json({
            success: true,
            message: 'Dados atualizados com sucesso!',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('❌ Erro ao atualizar dados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para deletar dados
app.delete('/api/data/:sheetName/:id', async (req, res) => {
    try {
        const { sheetName, id } = req.params;
        const { db } = await connectToDatabase();
        
        const collection = db.collection(sheetName);
        const result = await collection.deleteOne({ _id: require('mongodb').ObjectId(id) });
        
        res.json({
            success: true,
            message: 'Dados deletados com sucesso!',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('❌ Erro ao deletar dados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Recebido SIGINT. Fechando servidor...');
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Recebido SIGTERM. Fechando servidor...');
    await closeConnection();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
});
