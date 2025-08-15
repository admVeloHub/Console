"use strict";
// Frontend TypeScript para Console de Conteúdo
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentSheet = exports.categoryMap = void 0;
exports.showFormFor = showFormFor;
exports.showNav = showNav;
exports.handleFormSubmit = handleFormSubmit;
var currentSheet = '';
exports.currentSheet = currentSheet;
var categoryMap = {
    "Antecipação": "01_antecipação",
    "Restituição e Declaração": "02_restituição",
    "Calculadora": "03_Calculadora e Darf",
    "Conta e Planos": "04_Conta",
    "POPs B2C": "05_POP",
    "Ferramentas do Agente": "06_ferramentas",
    "Manual de Voz e Estilo": "07_manual de voz"
};
exports.categoryMap = categoryMap;
// URL da API do Google Apps Script
var API_URL = 'URL_DA_SUA_IMPLANTAÇÃO_WEB_APP'; // <-- SUBSTITUA PELA SUA URL
// Função para mostrar formulário para diferentes tipos de conteúdo
function showFormFor(sheetName, title) {
    exports.currentSheet = currentSheet = sheetName;
    // Implementação da função showFormFor
    console.log("Mostrando formul\u00E1rio para ".concat(sheetName, ": ").concat(title));
}
// Função para mostrar navegação
function showNav() {
    // Implementação da função showNav
    console.log('Mostrando navegação');
}
// Função para lidar com envio de formulário
function handleFormSubmit(e) {
    e.preventDefault();
    var target = e.target;
    var editor = document.querySelector('.content-editor');
    if (editor) {
        var contentKey = editor.id.replace('_editor', '');
        var contentInput = document.getElementById(contentKey);
        if (contentInput) {
            contentInput.value = editor.innerHTML;
        }
    }
    var submitButton = target.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
    }
    var statusDiv = document.getElementById('status');
    if (statusDiv) {
        statusDiv.textContent = 'Enviando e formatando...';
        statusDiv.className = 'status';
    }
    var dataObject = {};
    var formData = new FormData(target);
    formData.forEach(function (value, key) {
        dataObject[key] = value.toString();
    });
    if (currentSheet === 'Velonews') {
        var checkbox = document.getElementById('alerta_critico_checkbox');
        if (checkbox) {
            dataObject['alerta_critico'] = checkbox.checked ? 'Y' : 'N';
            delete dataObject['alerta_critico_checkbox'];
        }
    }
    var submission = {
        sheetName: currentSheet,
        data: dataObject
    };
    // Envia dados via POST para o Apps Script
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(submission),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    })
        .then(function (response) {
        if (statusDiv) {
            statusDiv.textContent = 'Publicado com sucesso!';
            statusDiv.className = 'status success';
        }
        setTimeout(function () { return showNav(); }, 2000);
    })
        .catch(function (error) {
        console.error('Erro no Fetch:', error);
        if (statusDiv) {
            statusDiv.textContent = 'Erro de rede ao enviar. Verifique o console.';
            statusDiv.className = 'status error';
        }
        if (submitButton) {
            submitButton.disabled = false;
        }
    });
}
// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
    var btnArtigos = document.getElementById('btn-artigos');
    var btnVelonews = document.getElementById('btn-velonews');
    var btnBot = document.getElementById('btn-bot');
    var backToNav = document.getElementById('back-to-nav');
    var dataForm = document.getElementById('data-form');
    if (btnArtigos) {
        btnArtigos.addEventListener('click', function () { return showFormFor('Artigos', 'Novo Lançamento - Central de Artigos'); });
    }
    if (btnVelonews) {
        btnVelonews.addEventListener('click', function () { return showFormFor('Velonews', 'Novo Lançamento - Velonews'); });
    }
    if (btnBot) {
        btnBot.addEventListener('click', function () { return showFormFor('Bot_perguntas', 'Novo Lançamento - Bot de Processos'); });
    }
    if (backToNav) {
        backToNav.addEventListener('click', showNav);
    }
    if (dataForm) {
        dataForm.addEventListener('submit', handleFormSubmit);
    }
});
