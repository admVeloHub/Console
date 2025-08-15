// Script de teste para verificar integração com MongoDB
const { connectToDatabase } = require('./config/database');

async function testMongoDBIntegration() {
    console.log('🧪 Testando integração com MongoDB...\n');
    
    try {
        // Teste 1: Conectar ao MongoDB
        console.log('1️⃣ Testando conexão com MongoDB...');
        const { db } = await connectToDatabase();
        console.log('✅ Conexão estabelecida com sucesso!');
        
        // Teste 2: Inserir dados de teste
        console.log('\n2️⃣ Testando inserção de dados...');
        const testData = {
            categoria_id: "test_integration",
            categoria_titulo: "Teste de Integração",
            artigo_titulo: "Artigo de Teste - Integração MongoDB",
            artigo_conteudo: "<p>Este é um artigo de teste para verificar a integração com MongoDB.</p>",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const collection = db.collection('Artigos');
        const result = await collection.insertOne(testData);
        console.log(`✅ Dados inseridos com sucesso! ID: ${result.insertedId}`);
        
        // Teste 3: Buscar dados inseridos
        console.log('\n3️⃣ Testando busca de dados...');
        const foundData = await collection.findOne({ _id: result.insertedId });
        if (foundData) {
            console.log('✅ Dados encontrados com sucesso!');
            console.log(`   Título: ${foundData.artigo_titulo}`);
            console.log(`   Categoria: ${foundData.categoria_titulo}`);
        } else {
            throw new Error('Dados não encontrados após inserção');
        }
        
        // Teste 4: Atualizar dados
        console.log('\n4️⃣ Testando atualização de dados...');
        const updateResult = await collection.updateOne(
            { _id: result.insertedId },
            { 
                $set: { 
                    artigo_titulo: "Artigo Atualizado - Integração MongoDB",
                    updatedAt: new Date()
                }
            }
        );
        console.log(`✅ Dados atualizados! Modificados: ${updateResult.modifiedCount}`);
        
        // Teste 5: Deletar dados de teste
        console.log('\n5️⃣ Testando remoção de dados...');
        const deleteResult = await collection.deleteOne({ _id: result.insertedId });
        console.log(`✅ Dados removidos! Removidos: ${deleteResult.deletedCount}`);
        
        // Teste 6: Verificar contagem de documentos
        console.log('\n6️⃣ Verificando contagem de documentos...');
        const count = await collection.countDocuments();
        console.log(`📊 Total de documentos na coleção Artigos: ${count}`);
        
        console.log('\n🎉 Todos os testes passaram com sucesso!');
        console.log('✅ A integração com MongoDB está funcionando corretamente.');
        
    } catch (error) {
        console.error('\n❌ Erro durante os testes:', error.message);
        console.error('🔍 Verifique:');
        console.error('   - Se o MongoDB está rodando');
        console.error('   - Se as credenciais estão corretas');
        console.error('   - Se a conexão de internet está funcionando');
        process.exit(1);
    }
}

// Executar testes
testMongoDBIntegration();
