const { connectToDatabase } = require('./config/database');

// Dados de exemplo para migração manual
// Você pode substituir estes dados pelos dados reais da sua planilha

const sampleData = {
    Artigos: [
        {
            categoria_id: "01_antecipação",
            categoria_titulo: "Antecipação",
            artigo_titulo: "Como fazer antecipação de recebíveis",
            artigo_conteudo: "<p><strong>Antecipação de Recebíveis</strong></p><p>Para fazer a antecipação de recebíveis, siga os passos:</p><ul><li>Acesse o portal do cliente</li><li>Selecione os recebíveis desejados</li><li>Confirme a operação</li></ul>"
        },
        {
            categoria_id: "02_restituição",
            categoria_titulo: "Restituição e Declaração",
            artigo_titulo: "Processo de restituição de IR",
            artigo_conteudo: "<p><strong>Restituição de Imposto de Renda</strong></p><p>O processo de restituição inclui:</p><ul><li>Verificação da declaração</li><li>Análise pela Receita Federal</li><li>Pagamento automático</li></ul>"
        }
    ],
    Velonews: [
        {
            title: "Nova funcionalidade disponível",
            content: "<p><strong>Atualização do Sistema</strong></p><p>Uma nova funcionalidade foi implementada para melhorar a experiência do usuário.</p>",
            alerta_critico: "N"
        },
        {
            title: "Manutenção programada",
            content: "<p><strong>Manutenção do Sistema</strong></p><p>O sistema ficará indisponível para manutenção programada.</p>",
            alerta_critico: "Y"
        }
    ],
    Bot_perguntas: [
        {
            topico: "Antecipação",
            contexto: "<p><strong>Como funciona a antecipação?</strong></p><p>A antecipação permite receber valores antes do vencimento.</p>",
            Palavras_chave: "antecipação, recebíveis, pagamento",
            URLs_de_Imagens: "https://exemplo.com/imagem1.jpg, https://exemplo.com/imagem2.jpg"
        },
        {
            topico: "Restituição",
            contexto: "<p><strong>Quando recebo minha restituição?</strong></p><p>A restituição é processada pela Receita Federal.</p>",
            Palavras_chave: "restituição, IR, imposto",
            URLs_de_Imagens: "https://exemplo.com/imagem3.jpg"
        }
    ]
};

// Função para migrar dados para MongoDB
async function migrateToMongoDB(data = sampleData) {
    try {
        console.log('🚀 Iniciando migração manual para MongoDB...');
        
        // Conectar ao MongoDB
        const { db } = await connectToDatabase();
        
        // Migrar Artigos
        console.log('\n📄 Migrando Artigos...');
        if (data.Artigos && data.Artigos.length > 0) {
            const artigosCollection = db.collection('Artigos');
            const artigosResult = await artigosCollection.insertMany(
                data.Artigos.map(artigo => ({
                    ...artigo,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }))
            );
            console.log(`✅ ${artigosResult.insertedCount} artigos migrados`);
        }
        
        // Migrar Velonews
        console.log('\n📰 Migrando Velonews...');
        if (data.Velonews && data.Velonews.length > 0) {
            const velonewsCollection = db.collection('Velonews');
            const velonewsResult = await velonewsCollection.insertMany(
                data.Velonews.map(velonews => ({
                    ...velonews,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }))
            );
            console.log(`✅ ${velonewsResult.insertedCount} velonews migrados`);
        }
        
        // Migrar Bot_perguntas
        console.log('\n🤖 Migrando Bot_perguntas...');
        if (data.Bot_perguntas && data.Bot_perguntas.length > 0) {
            const botPerguntasCollection = db.collection('Bot_perguntas');
            const botPerguntasResult = await botPerguntasCollection.insertMany(
                data.Bot_perguntas.map(pergunta => ({
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

// Função para inserir dados personalizados
async function insertCustomData(customData) {
    try {
        console.log('📝 Inserindo dados personalizados...');
        await migrateToMongoDB(customData);
        console.log('✅ Dados personalizados inseridos com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inserir dados personalizados:', error);
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
    const args = process.argv.slice(2);
    
    if (args.includes('--check')) {
        checkExistingData()
            .then(() => process.exit(0))
            .catch((error) => {
                console.error('❌ Erro:', error);
                process.exit(1);
            });
    } else if (args.includes('--sample')) {
        console.log('⚠️  ATENÇÃO: Este script irá inserir dados de exemplo no MongoDB.');
        console.log('   Para confirmar, execute: node migrate-manual.js --sample --confirm');
        
        if (args.includes('--confirm')) {
            migrateToMongoDB()
                .then(() => {
                    console.log('\n✅ Migração de dados de exemplo concluída!');
                    process.exit(0);
                })
                .catch((error) => {
                    console.error('\n❌ Erro na migração:', error);
                    process.exit(1);
                });
        } else {
            console.log('\n❌ Migração cancelada. Use --confirm para executar.');
            process.exit(0);
        }
    } else {
        console.log('📋 Script de Migração Manual');
        console.log('\nComandos disponíveis:');
        console.log('  --check     : Verificar dados existentes');
        console.log('  --sample    : Inserir dados de exemplo');
        console.log('  --confirm   : Confirmar operação');
        console.log('\nExemplos:');
        console.log('  node migrate-manual.js --check');
        console.log('  node migrate-manual.js --sample --confirm');
    }
}

module.exports = {
    migrateToMongoDB,
    insertCustomData,
    checkExistingData,
    sampleData
};
