// Frontend TypeScript para Console de Conteúdo

interface CategoryMap {
    [key: string]: string;
}

interface DataObject {
    [key: string]: string;
}

interface Submission {
    sheetName: string;
    data: DataObject;
}

interface MongoDBDocument {
    _id: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
}

interface CentralAgenteData {
    artigos: MongoDBDocument[];
    velonews: MongoDBDocument[];
    botPerguntas: MongoDBDocument[];
}

interface APIResponse {
    success: boolean;
    message?: string;
    data?: any;
    error?: string;
}

let currentSheet: string = '';
const categoryMap: CategoryMap = {
    "Antecipação": "01_antecipação", 
    "Restituição e Declaração": "02_restituição",
    "Calculadora": "03_Calculadora e Darf", 
    "Conta e Planos": "04_Conta",
    "POPs B2C": "05_POP", 
    "Ferramentas do Agente": "06_ferramentas",
    "Manual de Voz e Estilo": "07_manual de voz"
};

// URLs das APIs do MongoDB (servidor local)
const API_URL: string = 'http://localhost:3000/api/submit';
const CENTRAL_AGENTE_URL: string = 'http://localhost:3000/api/central-agente';
const DATA_URL: string = 'http://localhost:3000/api/data';

// Função para mostrar formulário para diferentes tipos de conteúdo
function showFormFor(sheetName: string, title: string): void {
    currentSheet = sheetName;
    // Implementação da função showFormFor
    console.log(`Mostrando formulário para ${sheetName}: ${title}`);
}

// Função para mostrar navegação
function showNav(): void {
    // Implementação da função showNav
    console.log('Mostrando navegação');
}

// Função para lidar com envio de formulário
function handleFormSubmit(e: Event): void {
    e.preventDefault();
    
    const target = e.target as HTMLFormElement;
    const editor = document.querySelector('.content-editor') as HTMLElement;
    
    if (editor) {
        const contentKey = editor.id.replace('_editor', '');
        const contentInput = document.getElementById(contentKey) as HTMLInputElement;
        if (contentInput) {
            contentInput.value = editor.innerHTML;
        }
    }

    const submitButton = target.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
        submitButton.disabled = true;
    }
    
    const statusDiv = document.getElementById('status') as HTMLElement;
    if (statusDiv) {
        statusDiv.textContent = 'Enviando e formatando...';
        statusDiv.className = 'status';
    }
    
    const dataObject: DataObject = {};
    const formData = new FormData(target);
    formData.forEach((value, key) => { 
        dataObject[key] = value.toString(); 
    });
    
    if (currentSheet === 'Velonews') {
        const checkbox = document.getElementById('alerta_critico_checkbox') as HTMLInputElement;
        if (checkbox) {
            dataObject['alerta_critico'] = checkbox.checked ? 'Y' : 'N';
            delete dataObject['alerta_critico_checkbox'];
        }
    }
    
    const submission: Submission = { 
        sheetName: currentSheet, 
        data: dataObject 
    };

    // Envia dados via POST para o Apps Script
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(submission),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    })
    .then(response => {
        if (statusDiv) {
            statusDiv.textContent = 'Publicado com sucesso!';
            statusDiv.className = 'status success';
        }
        setTimeout(() => showNav(), 2000);
    })
    .catch(error => {
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
document.addEventListener("DOMContentLoaded", function(): void {
    const btnArtigos = document.getElementById('btn-artigos');
    const btnVelonews = document.getElementById('btn-velonews');
    const btnBot = document.getElementById('btn-bot');
    const backToNav = document.getElementById('back-to-nav');
    const dataForm = document.getElementById('data-form') as HTMLFormElement;

    if (btnArtigos) {
        btnArtigos.addEventListener('click', () => showFormFor('Artigos', 'Novo Lançamento - Central de Artigos'));
    }
    
    if (btnVelonews) {
        btnVelonews.addEventListener('click', () => showFormFor('Velonews', 'Novo Lançamento - Velonews'));
    }
    
    if (btnBot) {
        btnBot.addEventListener('click', () => showFormFor('Bot_perguntas', 'Novo Lançamento - Bot de Processos'));
    }
    
    if (backToNav) {
        backToNav.addEventListener('click', showNav);
    }
    
    if (dataForm) {
        dataForm.addEventListener('submit', handleFormSubmit);
    }
});

// Exportar funções para uso em outros módulos
export { showFormFor, showNav, handleFormSubmit, categoryMap, currentSheet };
