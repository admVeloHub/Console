const fs = require('fs');
const path = require('path');

// Arquivo para armazenar dados localmente
const DATA_FILE = path.join(__dirname, '../data/local-storage.json');

// Garantir que o diretório existe
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Inicializar arquivo de dados se não existir
if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
        Artigos: [],
        Velonews: [],
        Bot_perguntas: [],
        lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Função para ler dados
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Erro ao ler dados locais:', error);
        return {
            Artigos: [],
            Velonews: [],
            Bot_perguntas: [],
            lastUpdated: new Date().toISOString()
        };
    }
}

// Função para escrever dados
function writeData(data) {
    try {
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('❌ Erro ao escrever dados locais:', error);
        return false;
    }
}

// Função para inserir dados em uma coleção
function insertData(collectionName, newData) {
    const data = readData();
    
    if (!data[collectionName]) {
        data[collectionName] = [];
    }
    
    const record = {
        _id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...newData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    data[collectionName].push(record);
    
    if (writeData(data)) {
        return {
            success: true,
            message: 'Dados salvos localmente com sucesso!',
            id: record._id
        };
    } else {
        return {
            success: false,
            message: 'Erro ao salvar dados localmente'
        };
    }
}

// Função para buscar dados de uma coleção
function findData(collectionName) {
    const data = readData();
    return data[collectionName] || [];
}

// Função para buscar todos os dados
function findAllData() {
    const data = readData();
    return {
        artigos: data.Artigos || [],
        velonews: data.Velonews || [],
        botPerguntas: data.Bot_perguntas || []
    };
}

// Função para atualizar dados
function updateData(collectionName, id, updateData) {
    const data = readData();
    
    if (!data[collectionName]) {
        return { success: false, message: 'Coleção não encontrada' };
    }
    
    const index = data[collectionName].findIndex(item => item._id === id);
    if (index === -1) {
        return { success: false, message: 'Registro não encontrado' };
    }
    
    data[collectionName][index] = {
        ...data[collectionName][index],
        ...updateData,
        updatedAt: new Date().toISOString()
    };
    
    if (writeData(data)) {
        return { success: true, message: 'Dados atualizados com sucesso!' };
    } else {
        return { success: false, message: 'Erro ao atualizar dados' };
    }
}

// Função para deletar dados
function deleteData(collectionName, id) {
    const data = readData();
    
    if (!data[collectionName]) {
        return { success: false, message: 'Coleção não encontrada' };
    }
    
    const index = data[collectionName].findIndex(item => item._id === id);
    if (index === -1) {
        return { success: false, message: 'Registro não encontrado' };
    }
    
    data[collectionName].splice(index, 1);
    
    if (writeData(data)) {
        return { success: true, message: 'Dados deletados com sucesso!' };
    } else {
        return { success: false, message: 'Erro ao deletar dados' };
    }
}

// Função para contar documentos
function countDocuments(collectionName) {
    const data = readData();
    return (data[collectionName] || []).length;
}

// Função para migrar dados locais para MongoDB (quando disponível)
async function migrateToMongoDB(mongoDBConnection) {
    try {
        const data = readData();
        const { db } = mongoDBConnection;
        
        console.log('🔄 Migrando dados locais para MongoDB...');
        
        for (const [collectionName, documents] of Object.entries(data)) {
            if (collectionName === 'lastUpdated') continue;
            
            if (documents.length > 0) {
                const collection = db.collection(collectionName);
                const result = await collection.insertMany(documents);
                console.log(`✅ ${result.insertedCount} documentos migrados para ${collectionName}`);
            }
        }
        
        console.log('🎉 Migração concluída!');
        return true;
    } catch (error) {
        console.error('❌ Erro na migração:', error);
        return false;
    }
}

module.exports = {
    insertData,
    findData,
    findAllData,
    updateData,
    deleteData,
    countDocuments,
    migrateToMongoDB,
    readData,
    writeData
};
