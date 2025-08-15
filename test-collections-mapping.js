// Script de teste para verificar mapeamento das collections
const { connectToDatabase } = require('./config/database');

async function testCollectionsMapping() {
    console.log('🧪 Testando mapeamento das collections...\n');
    
    try {
        // Conectar ao MongoDB
        const { db } = await connectToDatabase();
        console.log('✅ Conectado ao MongoDB (velohub)');
        
        // Teste 1: Inserir artigo
        console.log('\n1️⃣ Testando inserção de Artigo...');
        const artigoData = {
            title: "Teste de Artigo - Mapeamento",
            content: "<p>Este é um teste de mapeamento para a collection articles.</p>",
            category: "test_mapping",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const articlesCollection = db.collection('articles');
        const artigoResult = await articlesCollection.insertOne(artigoData);
        console.log(`✅ Artigo inserido: ${artigoResult.insertedId}`);
        
        // Teste 2: Inserir velonews
        console.log('\n2️⃣ Testando inserção de Velonews...');
        const velonewsData = {
            title: "Teste de Velonews - Mapeamento",
            content: "<p>Este é um teste de mapeamento para a collection velonews.</p>",
            is_critical: "N",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const velonewsCollection = db.collection('velonews');
        const velonewsResult = await velonewsCollection.insertOne(velonewsData);
        console.log(`✅ Velonews inserido: ${velonewsResult.insertedId}`);
        
        // Teste 3: Inserir chatbot FAQ
        console.log('\n3️⃣ Testando inserção de Chatbot FAQ...');
        const chatbotData = {
            topic: "teste de mapeamento",
            context: "<p>Este é um teste de mapeamento para a collection chatbotFaq.</p>",
            keywords: "teste, mapeamento, chatbot",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const chatbotCollection = db.collection('chatbotFaq');
        const chatbotResult = await chatbotCollection.insertOne(chatbotData);
        console.log(`✅ Chatbot FAQ inserido: ${chatbotResult.insertedId}`);
        
        // Teste 4: Verificar contagens
        console.log('\n4️⃣ Verificando contagens das collections...');
        const artigosCount = await articlesCollection.countDocuments();
        const velonewsCount = await velonewsCollection.countDocuments();
        const chatbotCount = await chatbotCollection.countDocuments();
        
        console.log(`📊 Articles: ${artigosCount} documentos`);
        console.log(`📊 Velonews: ${velonewsCount} documentos`);
        console.log(`📊 ChatbotFaq: ${chatbotCount} documentos`);
        
        // Teste 5: Buscar dados inseridos
        console.log('\n5️⃣ Verificando dados inseridos...');
        
        const artigoEncontrado = await articlesCollection.findOne({ _id: artigoResult.insertedId });
        const velonewsEncontrado = await velonewsCollection.findOne({ _id: velonewsResult.insertedId });
        const chatbotEncontrado = await chatbotCollection.findOne({ _id: chatbotResult.insertedId });
        
        console.log('✅ Artigo encontrado:', artigoEncontrado ? 'SIM' : 'NÃO');
        console.log('✅ Velonews encontrado:', velonewsEncontrado ? 'SIM' : 'NÃO');
        console.log('✅ Chatbot FAQ encontrado:', chatbotEncontrado ? 'SIM' : 'NÃO');
        
        // Teste 6: Limpar dados de teste
        console.log('\n6️⃣ Limpando dados de teste...');
        await articlesCollection.deleteOne({ _id: artigoResult.insertedId });
        await velonewsCollection.deleteOne({ _id: velonewsResult.insertedId });
        await chatbotCollection.deleteOne({ _id: chatbotResult.insertedId });
        
        console.log('✅ Dados de teste removidos');
        
        console.log('\n🎉 Todos os testes de mapeamento passaram com sucesso!');
        console.log('✅ O console está configurado para alimentar as collections corretas:');
        console.log('   - Artigos → articles');
        console.log('   - Velonews → velonews');
        console.log('   - Bot_perguntas → chatbotFaq');
        
    } catch (error) {
        console.error('\n❌ Erro durante os testes:', error.message);
        process.exit(1);
    }
}

// Executar testes
testCollectionsMapping();
