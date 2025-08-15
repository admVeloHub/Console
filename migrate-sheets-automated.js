const { connectToDatabase } = require('./config/database');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Configuração do Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwuX73q38Ypdpigm0TG1AOMj5wNeDHjRi0PhZFI4F_SxA572btd8l2KVYUPEkQFpT9vyw/exec';

// Configuração do servidor local
const LOCAL_SERVER_URL = 'http://localhost:3000';

// Função para buscar dados do Google Sheets via Apps Script
async function fetchGoogleSheetsData() {
    try {
        console.log('📊 Buscando dados do Google Sheets...');
        
        const response = await fetch(GOOGLE_SCRIPT_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Dados do Google Sheets obtidos com sucesso!');
        
        return data;
    } catch (error) {
        console.error('❌ Erro ao buscar dados do Google Sheets:', error);
        throw error;
    }
}

// Função para publicar dados no MongoDB via console
async function publishToMongoDB(collectionName, data) {
    try {
        const response = await fetch(`${LOCAL_SERVER_URL}/api/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sheetName: collectionName,
                data: data
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`❌ Erro ao publicar em ${collectionName}:`, error);
        throw error;
    }
}

// Função para processar dados de Artigos
async function processArtigos(artigosData) {
    console.log('\n📄 Processando Artigos...');
    
    if (!artigosData || typeof artigosData !== 'object') {
        console.log('⚠️ Nenhum dado de artigos encontrado');
        return;
    }
    
    let processedCount = 0;
    let errorCount = 0;
    
    for (const [categoriaId, categoria] of Object.entries(artigosData)) {
        if (!categoria.articles || !Array.isArray(categoria.articles)) {
            continue;
        }
        
        for (const artigo of categoria.articles) {
            try {
                const artigoData = {
                    categoria_id: categoriaId,
                    categoria_titulo: categoria.title || '',
                    artigo_titulo: artigo.title || '',
                    artigo_conteudo: artigo.content || ''
                };
                
                const result = await publishToMongoDB('Artigos', artigoData);
                
                if (result.success) {
                    console.log(`✅ Artigo publicado: ${artigo.title}`);
                    processedCount++;
                } else {
                    console.log(`❌ Erro ao publicar artigo: ${artigo.title}`);
                    errorCount++;
                }
                
                // Pequena pausa para não sobrecarregar o servidor
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.log(`❌ Erro ao processar artigo: ${artigo.title}`, error.message);
                errorCount++;
            }
        }
    }
    
    console.log(`📊 Artigos processados: ${processedCount} sucessos, ${errorCount} erros`);
}

// Função para processar dados de Velonews
async function processVelonews(velonewsData) {
    console.log('\n📰 Processando Velonews...');
    
    if (!velonewsData || !Array.isArray(velonewsData)) {
        console.log('⚠️ Nenhum dado de velonews encontrado');
        return;
    }
    
    let processedCount = 0;
    let errorCount = 0;
    
    for (const velonews of velonewsData) {
        try {
            const velonewsData = {
                title: velonews.title || '',
                content: velonews.content || '',
                alerta_critico: velonews.is_critical === 'Y' ? 'Y' : 'N'
            };
            
            const result = await publishToMongoDB('Velonews', velonewsData);
            
            if (result.success) {
                console.log(`✅ Velonews publicado: ${velonews.title}`);
                processedCount++;
            } else {
                console.log(`❌ Erro ao publicar velonews: ${velonews.title}`);
                errorCount++;
            }
            
            // Pequena pausa para não sobrecarregar o servidor
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.log(`❌ Erro ao processar velonews: ${velonews.title}`, error.message);
            errorCount++;
        }
    }
    
    console.log(`📊 Velonews processados: ${processedCount} sucessos, ${errorCount} erros`);
}

// Função para processar dados de Bot_perguntas
async function processBotPerguntas(botPerguntasData) {
    console.log('\n🤖 Processando Bot_perguntas...');
    
    if (!botPerguntasData || !Array.isArray(botPerguntasData)) {
        console.log('⚠️ Nenhum dado de bot_perguntas encontrado');
        return;
    }
    
    let processedCount = 0;
    let errorCount = 0;
    
    for (const pergunta of botPerguntasData) {
        try {
            const perguntaData = {
                topico: pergunta.topic || '',
                contexto: pergunta.context || '',
                Palavras_chave: pergunta.keywords || '',
                URLs_de_Imagens: pergunta.imageUrls || ''
            };
            
            const result = await publishToMongoDB('Bot_perguntas', perguntaData);
            
            if (result.success) {
                console.log(`✅ Pergunta do bot publicada: ${pergunta.topic}`);
                processedCount++;
            } else {
                console.log(`❌ Erro ao publicar pergunta: ${pergunta.topic}`);
                errorCount++;
            }
            
            // Pequena pausa para não sobrecarregar o servidor
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.log(`❌ Erro ao processar pergunta: ${pergunta.topic}`, error.message);
            errorCount++;
        }
    }
    
    console.log(`📊 Bot_perguntas processados: ${processedCount} sucessos, ${errorCount} erros`);
}

// Função principal de migração
async function migrateSheetsToMongoDB() {
    try {
        console.log('🚀 Iniciando migração automatizada do Google Sheets para MongoDB...');
        
        // Verificar se o servidor local está rodando
        try {
            const statusResponse = await fetch(`${LOCAL_SERVER_URL}/api/status`);
            if (!statusResponse.ok) {
                throw new Error('Servidor local não está respondendo');
            }
            console.log('✅ Servidor local está funcionando');
        } catch (error) {
            throw new Error('Servidor local não está disponível. Execute "npm start" primeiro.');
        }
        
        // Buscar dados do Google Sheets
        const sheetsData = await fetchGoogleSheetsData();
        
        // Processar cada tipo de dados
        await processArtigos(sheetsData.artigos);
        await processVelonews(sheetsData.velonews);
        await processBotPerguntas(sheetsData.chatbotFaq);
        
        console.log('\n🎉 Migração automatizada concluída!');
        
        // Mostrar estatísticas finais
        try {
            const finalData = await fetch(`${LOCAL_SERVER_URL}/api/central-agente`);
            const finalStats = await finalData.json();
            
            if (finalStats.success) {
                console.log('\n📊 Estatísticas finais:');
                console.log(`   Artigos: ${finalStats.data.artigos.length} registros`);
                console.log(`   Velonews: ${finalStats.data.velonews.length} registros`);
                console.log(`   Bot_perguntas: ${finalStats.data.botPerguntas.length} registros`);
            }
        } catch (error) {
            console.log('⚠️ Não foi possível obter estatísticas finais');
        }
        
    } catch (error) {
        console.error('❌ Erro durante a migração:', error);
        throw error;
    }
}

// Função para verificar dados existentes
async function checkExistingData() {
    try {
        const response = await fetch(`${LOCAL_SERVER_URL}/api/central-agente`);
        const data = await response.json();
        
        if (data.success) {
            console.log('\n📊 Dados existentes:');
            console.log(`   Artigos: ${data.data.artigos.length} registros`);
            console.log(`   Velonews: ${data.data.velonews.length} registros`);
            console.log(`   Bot_perguntas: ${data.data.botPerguntas.length} registros`);
        }
        
        return data;
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
    } else if (args.includes('--migrate')) {
        console.log('⚠️ ATENÇÃO: Este script irá migrar TODOS os dados do Google Sheets para o MongoDB.');
        console.log('   Para confirmar, execute: node migrate-sheets-automated.js --migrate --confirm');
        
        if (args.includes('--confirm')) {
            migrateSheetsToMongoDB()
                .then(() => {
                    console.log('\n✅ Migração concluída com sucesso!');
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
        console.log('📋 Script de Migração Automatizada');
        console.log('\nComandos disponíveis:');
        console.log('  --check     : Verificar dados existentes');
        console.log('  --migrate   : Migrar dados do Google Sheets para MongoDB');
        console.log('  --confirm   : Confirmar operação');
        console.log('\nExemplos:');
        console.log('  node migrate-sheets-automated.js --check');
        console.log('  node migrate-sheets-automated.js --migrate --confirm');
    }
}

module.exports = {
    migrateSheetsToMongoDB,
    checkExistingData,
    fetchGoogleSheetsData
};
