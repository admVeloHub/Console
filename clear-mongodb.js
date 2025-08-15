const { connectToDatabase } = require('./config/database');

async function clearMongoDB() {
    try {
        console.log('🧹 Iniciando limpeza do MongoDB...');
        
        const { db } = await connectToDatabase();
        
        // Limpar todas as coleções
        const collections = ['Artigos', 'Velonews', 'Bot_perguntas'];
        
        for (const collectionName of collections) {
            const collection = db.collection(collectionName);
            const result = await collection.deleteMany({});
            console.log(`✅ ${result.deletedCount} registros removidos da coleção: ${collectionName}`);
        }
        
        console.log('\n🎉 Limpeza concluída com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro durante a limpeza:', error);
        throw error;
    }
}

// Executar limpeza se o script for chamado diretamente
if (require.main === module) {
    console.log('⚠️  ATENÇÃO: Este script irá REMOVER TODOS os dados do MongoDB!');
    console.log('   Coleções que serão limpas: Artigos, Velonews, Bot_perguntas');
    console.log('\n   Para confirmar a limpeza, execute: node clear-mongodb.js --confirm');
    
    // Verificar se o usuário confirmou
    if (process.argv.includes('--confirm')) {
        clearMongoDB()
            .then(() => {
                console.log('\n✅ MongoDB limpo com sucesso!');
                process.exit(0);
            })
            .catch((error) => {
                console.error('\n❌ Erro ao limpar MongoDB:', error);
                process.exit(1);
            });
    } else {
        console.log('\n❌ Limpeza cancelada. Use --confirm para executar.');
        process.exit(0);
    }
}

module.exports = { clearMongoDB };
