// SOLUÇÃO COMPLETA - API E CONSOLE V40
// ==================================================

// ==================================================
// FUNÇÃO doGet - SERVE A API OU O CONSOLE
// ==================================================
function doGet(e) {
  try {
    // Se o parâmetro 'console=true' estiver na URL, serve a interface do console.
    const isConsoleRequest = e && e.parameter && e.parameter.console === 'true';
    
    if (isConsoleRequest) {
      // Usa um template para o HTML, permitindo incluir CSS/JS de outros arquivos.
      const template = HtmlService.createTemplateFromFile('Console'); // Seu console frontend
      return template.evaluate()
        .setTitle('Console de Conteúdo')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
    } else {
      // Caso contrário, serve a API de dados como antes.
      return serveAPI();
    }
  } catch (error) {
    return createJsonResponse({ error: error.message, stack: error.stack, type: "doGet_error" });
  }
}

// ==================================================
// FUNÇÃO doPost - RECEBE DADOS DO FORMULÁRIO
// ==================================================
function doPost(e) {
  try {
    // Analisa o corpo da requisição POST, que vem como uma string JSON.
    const submission = JSON.parse(e.postData.contents);
    const { sheetName, data } = submission;

    if (!sheetName || !data) {
      throw new Error("Dados inválidos recebidos. 'sheetName' e 'data' são obrigatórios.");
    }

    // --- LÓGICA DE FORMATAÇÃO COM IA ---
    // Verifica se a aba é uma daquelas que precisam de formatação.
    const sheetsToFormat = ['Artigos', 'Velonews', 'Bot_perguntas'];
    if (sheetsToFormat.includes(sheetName)) {
      // Encontra a chave do conteúdo (ex: 'artigo_conteudo', 'content', 'contexto')
      let contentKey = null;
      if (data.artigo_conteudo) contentKey = 'artigo_conteudo';
      else if (data.content) contentKey = 'content';
      else if (data.contexto) contentKey = 'contexto';

      // Se encontrou conteúdo para formatar, chama a função da IA.
      if (contentKey && data[contentKey]) {
        Logger.log(`Formatando conteúdo para a aba '${sheetName}'...`);
        const formattedText = formatArticleContent(data[contentKey]);
        data[contentKey] = formattedText; // Substitui o conteúdo original pelo formatado.
      }
    }
    
    // --- INSERÇÃO DOS DADOS ---
    // Chama a função de inserção com os dados (já formatados, se aplicável).
    const result = insertData(sheetName, data);

    // Retorna o resultado da inserção para o frontend.
    return createJsonResponse(result);

  } catch (error) {
    Logger.log(`Erro em doPost: ${error.message}\nStack: ${error.stack}`);
    return createJsonResponse({ status: 'error', message: `Erro no servidor: ${error.message}` });
  }
}


// ==================================================
// FUNÇÕES DE LÓGICA PRINCIPAL
// ==================================================

/**
 * Insere os dados do formulário na planilha selecionada.
 * @param {string} sheetName - O nome da aba onde os dados serão inseridos.
 * @param {Object} data - O objeto com os dados do formulário.
 */
function insertData(sheetName, data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) throw new Error(`Aba "${sheetName}" não encontrada.`);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    // Mapeia os dados para a ordem correta das colunas, garantindo que campos vazios sejam ''.
    const newRow = headers.map(header => data[header] || "");

    // Insere a nova linha no topo da planilha (abaixo do cabeçalho).
    sheet.insertRowBefore(2);
    sheet.getRange(2, 1, 1, newRow.length).setValues([newRow]);
   
    Logger.log(`Dados inseridos com sucesso na aba: ${sheetName}`);
    return { status: 'success', message: `Publicado com sucesso na aba "${sheetName}"!` };
  } catch (e) {
    Logger.log(`Erro ao inserir dados: ${e.message}`);
    throw e; // Re-lança o erro para ser capturado pelo doPost
  }
}

/**
 * Formata o conteúdo de um artigo usando a API do Gemini.
 * @param {string} rawContent O texto original a ser formatado.
 * @returns {string} O conteúdo formatado pela IA.
 */
function formatArticleContent(rawContent) {
  const API_KEY = "SUA_CHAVE_DA_API_GEMINI_AQUI"; // <-- COLOQUE SUA CHAVE AQUI
  const GEMINI_PROMPT = `Atue como um assistente de formatação de conteúdo para uma base de conhecimento interna. Sua única tarefa é pegar um texto e convertê-lo para HTML, pronto para ser colado em uma célula de planilha.
REGRAS OBRIGATÓRIAS:
1.  **Parágrafos**: Envolva parágrafos (texto separado por linha em branco) com as tags <p> e </p>.
2.  **Quebras de Linha Simples**: Para quebras de linha que NÃO formam um novo parágrafo (como em uma lista), insira os caracteres \\n no final da linha.
3.  **Destaques**: Envolva títulos, subtítulos ou texto que precise de ênfase com as tags <strong> e </strong>.
4.  **Links**: Converta URLs para o formato <a href="URL_COMPLETA" target="_blank">Texto do Link</a>.
5.  **Tags Existentes**: Se o texto já contiver alguma tag HTML (como <strong>), respeite-a e não a duplique.
6.  **Sem Adições**: Não adicione conteúdo, comentários ou explicações. Apenas o HTML formatado.

O texto a ser formatado é:`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
  const payload = { "contents": [{ "parts": [{ "text": GEMINI_PROMPT + "\n\n" + rawContent }] }] };
  const options = { 'method': 'post', 'contentType': 'application/json', 'payload': JSON.stringify(payload ), 'muteHttpExceptions': true };

  try {
    const response = UrlFetchApp.fetch(apiUrl, options);
    const responseBody = response.getContentText();
    if (response.getResponseCode() === 200) {
      const result = JSON.parse(responseBody);
      if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
        Logger.log("Conteúdo formatado com sucesso pela IA.");
        return result.candidates[0].content.parts[0].text;
      }
    }
    // Se a formatação falhar por qualquer motivo, retorna o conteúdo original para não perder os dados.
    Logger.log(`Falha na formatação da IA. Resposta: ${responseBody}. Usando texto original.`);
    return rawContent;
  } catch (e) {
    Logger.log(`Exceção ao chamar a API: ${e.toString()}. Usando texto original.`);
    return rawContent; // Retorna o original em caso de erro de conexão.
  }
}


// ==================================================
// FUNÇÕES AUXILIARES E DA API (Sem alterações)
// ==================================================

/** Cria uma resposta JSON padrão. */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Serve os dados da API (chamado por doGet). */
function serveAPI() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const apiData = {
    artigos: processArtigos(spreadsheet.getSheetByName("Artigos")),
    velonews: processVelonews(spreadsheet.getSheetByName("Velonews")),
    chatbotFaq: processBotPerguntas(spreadsheet.getSheetByName("Bot_perguntas"))
  };
  return createJsonResponse(apiData);
}

/** Processa a aba "Artigos". */
function processArtigos(sheet) {
  if (!sheet) return { error: "Aba 'Artigos' não encontrada." };
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const colIndex = {
    categoria_id: headers.indexOf('categoria_id'),
    categoria_titulo: headers.indexOf('categoria_titulo'),
    artigo_titulo: headers.indexOf('artigo_titulo'),
    artigo_conteudo: headers.indexOf('artigo_conteudo')
  };
  const artigosAgrupados = {};
  data.forEach(row => {
    const categoriaId = row[colIndex.categoria_id];
    if (!categoriaId) return;
    if (!artigosAgrupados[categoriaId]) {
      artigosAgrupados[categoriaId] = { title: row[colIndex.categoria_titulo], articles: [] };
    }
    artigosAgrupados[categoriaId].articles.push({
      title: row[colIndex.artigo_titulo],
      content: row[colIndex.artigo_conteudo]
    });
  });
  return artigosAgrupados;
}

/** Processa a aba "Velonews". */
function processVelonews(sheet) {
  if (!sheet) return [{ error: "Aba 'Velonews' não encontrada." }];
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const colIndex = {
    titulo: headers.indexOf('title'),
    conteudo: headers.indexOf('content'),
    alerta_critico: headers.indexOf('alerta_critico')
  };
  return data.map(row => ({
    title: row[colIndex.titulo] || "Sem título",
    content: row[colIndex.conteudo] || "Sem conteúdo",
    is_critical: row[colIndex.alerta_critico] || "N"
  }));
}

/** Processa a aba "Bot_perguntas". */
function processBotPerguntas(sheet) {
  if (!sheet) return [{ error: "Aba 'Bot_perguntas' não encontrada." }];
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const colIndex = {
    topico: headers.indexOf('topico'),
    contexto: headers.indexOf('contexto'),
    palavras_chave: headers.indexOf('Palavras_chave'),
    urls_imagens: headers.indexOf('URLs de Imagens')
  };
  return data.map(row => ({
    topic: row[colIndex.topico],
    context: row[colIndex.contexto],
    keywords: row[colIndex.palavras_chave],
    imageUrls: row[colIndex.urls_imagens]
  }));
}

