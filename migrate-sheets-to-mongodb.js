const { connectToDatabase } = require('./config/database');
const { google } = require('googleapis');

// Configuração do Google Sheets API
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID_AQUI'; // Substitua pelo ID da sua planilha

// Função para autenticar com o Google Sheets
async function getGoogleSheetsAuth() {
    // Para usar este script, você precisa:
    // 1. Criar um projeto no Google Cloud Console
    // 2. Habilitar a Google Sheets API
    // 3. Criar credenciais de conta de serviço
    // 4. Baixar o arquivo JSON das credenciais
    
    const auth = new google.auth.GoogleAuth({
        keyFile: './credentials.json', // Arquivo de credenciais da conta de serviço
        scopes: SCOPES,
    });
    
    return auth;
}

// Função para ler dados de uma aba específica
async function readSheetData(auth, sheetName) {
    const sheets = google.sheets({ version: 'v4', auth });
    
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: sheetName,
        });
        
        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log(`Nenhum dado encontrado na aba: ${sheetName}`);
            return [];
        }
        
        const headers = rows[0];
        const data = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            return obj;
        });
        
        console.log(`✅ ${data.length} registros lidos da aba: ${sheetName}`);
        return data;
    } catch (error) {
        console.error(`❌ Erro ao ler aba ${sheetName}:`, error.message);
        return [];
    }
}

// Função para migrar dados para MongoDB
async function migrateToMongoDB() {
    try {
        console.log('🚀 Iniciando migração do Google Sheets para MongoDB...');
        
        // Conectar ao MongoDB
        const { db } = await connectToDatabase();
        
        // Autenticar com Google Sheets
        const auth = await getGoogleSheetsAuth();
        
        // Migrar Artigos
        console.log('\n📄 Migrando Artigos...');
        const artigosData = await readSheetData(auth, 'Artigos');
        if (artigosData.length > 0) {
            const artigosCollection = db.collection('Artigos');
            const artigosResult = await artigosCollection.insertMany(
                artigosData.map(artigo => ({
                    ...artigo,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }))
            );
            console.log(`✅ ${artigosResult.insertedCount} artigos migrados`);
        }
        
        // Migrar Velonews
        console.log('\n📰 Migrando Velonews...');
        const velonewsData = await readSheetData(auth, 'Velonews');
        if (velonewsData.length > 0) {
            const velonewsCollection = db.collection('Velonews');
            const velonewsResult = await velonewsCollection.insertMany(
                velonewsData.map(velonews => ({
                    ...velonews,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }))
            );
            console.log(`✅ ${velonewsResult.insertedCount} velonews migrados`);
        }
        
        // Migrar Bot_perguntas
        console.log('\n🤖 Migrando Bot_perguntas...');
        const botPerguntasData = await readSheetData(auth, 'Bot_perguntas');
        if (botPerguntasData.length > 0) {
            const botPerguntasCollection = db.collection('Bot_perguntas');
            const botPerguntasResult = await botPerguntasCollection.insertMany(
                botPerguntasData.map(pergunta => ({
                    ...pergunta,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }))
            );
            console.log(`✅ ${botPerguntasResult.insertedCount} perguntas do bot migradas`);
        }
        
        console.log('\n🎉 Migração concluída com sucesso!');
        
        // Mostrar estatísticas
        const artigosCount = await db.collection('Artigos').countDocuments();
        const velonewsCount = await db.collection('Velonews').countDocuments();
        const botPerguntasCount = await db.collection('Bot_perguntas').countDocuments();
        
        console.log('\n📊 Estatísticas finais:');
        console.log(`   Artigos: ${artigosCount} registros`);
        console.log(`   Velonews: ${velonewsCount} registros`);
        console.log(`   Bot_perguntas: ${botPerguntasCount} registros`);
        
    } catch (error) {
        console.error('❌ Erro durante a migração:', error);
        throw error;
    }
}

// Função para verificar dados existentes
async function checkExistingData() {
    try {
        const { db } = await connectToDatabase();
        
        const artigosCount = await db.collection('Artigos').countDocuments();
        const velonewsCount = await db.collection('Velonews').countDocuments();
        const botPerguntasCount = await db.collection('Bot_perguntas').countDocuments();
        
        console.log('\n📊 Dados existentes no MongoDB:');
        console.log(`   Artigos: ${artigosCount} registros`);
        console.log(`   Velonews: ${velonewsCount} registros`);
        console.log(`   Bot_perguntas: ${botPerguntasCount} registros`);
        
        return { artigosCount, velonewsCount, botPerguntasCount };
    } catch (error) {
        console.error('❌ Erro ao verificar dados existentes:', error);
        throw error;
    }
}

// Executar migração se o script for chamado diretamente
if (require.main === module) {
    checkExistingData()
        .then(() => {
            console.log('\n⚠️  ATENÇÃO: Este script irá adicionar dados ao MongoDB.');
            console.log('   Se você quiser limpar os dados existentes primeiro, use: node clear-mongodb.js');
            console.log('\n   Para continuar com a migração, execute: node migrate-sheets-to-mongodb.js --confirm');
        })
        .catch(console.error);
}

module.exports = {
    migrateToMongoDB,
    checkExistingData,
    readSheetData
};
