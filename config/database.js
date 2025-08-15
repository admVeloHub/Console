const { MongoClient } = require('mongodb');

// Configuração do MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lucasgravina:nKQu8bSN6iZl8FPo@clustercentral.quqgq6x.mongodb.net/console_conteudo?retryWrites=true&w=majority&appName=ClusterCentral';
const DB_NAME = process.env.DB_NAME || 'velohub';

let client;
let db;

async function connectToDatabase() {
    try {
        if (client && db) {
            return { client, db };
        }

        client = new MongoClient(MONGODB_URI);

        await client.connect();
        console.log('✅ Conectado ao MongoDB com sucesso!');
        
        db = client.db(DB_NAME);
        return { client, db };
    } catch (error) {
        console.error('❌ Erro ao conectar ao MongoDB:', error);
        throw error;
    }
}

async function closeConnection() {
    if (client) {
        await client.close();
        console.log('🔌 Conexão com MongoDB fechada');
    }
}

module.exports = {
    connectToDatabase,
    closeConnection,
    getDb: () => db,
    getClient: () => client
};
