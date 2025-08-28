// Configuração da API
const API_BASE_URL = window.API_URL || 'http://localhost:3002';

console.log('🚀 Script app.js carregado');
console.log('🔗 API URL:', API_BASE_URL);

// Funções globais
function navigateTo(page) {
    window.location.href = `./${page}.html`;
}

// Função para mostrar tabs
function showTab(tabName) {
    // Esconder todas as tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remover classe active de todos os botões
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));
    
    // Mostrar tab selecionada
    document.getElementById(tabName).classList.add('active');
    
    // Adicionar classe active ao botão clicado
    event.target.classList.add('active');
}

// Função para mostrar status
function showStatus(message, type = 'success') {
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
    
    // Limpar status após 5 segundos
    setTimeout(() => {
        statusDiv.innerHTML = '';
    }, 5000);
}

// Função para mostrar toast de erro
function showErrorToast(message) {
    // Remover toast existente se houver
    const existingToast = document.querySelector('.error-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Criar novo toast
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remover toast após 5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}

// Função para mostrar feedback visual
function showFeedback(type) {
    console.log('showFeedback chamado com tipo:', type);
    
    const overlay = document.getElementById('feedback-overlay');
    const icon = document.getElementById('feedback-icon');
    const message = document.getElementById('feedback-message');
    const subtitle = document.getElementById('feedback-subtitle');
    const spinner = document.getElementById('spinner');
    
    console.log('Elementos encontrados:', { 
        overlay: !!overlay, 
        icon: !!icon, 
        message: !!message, 
        subtitle: !!subtitle, 
        spinner: !!spinner 
    });
    
    if (!overlay || !icon || !message || !subtitle || !spinner) {
        console.error('Elementos de feedback não encontrados:', {
            overlay: overlay,
            icon: icon,
            message: message,
            subtitle: subtitle,
            spinner: spinner
        });
        return;
    }
    
    // Limpar conteúdo anterior
    icon.innerHTML = '';
    
    if (type === 'loading') {
        // Mostrar spinner
        spinner.style.display = 'block';
        message.textContent = 'Enviando...';
        subtitle.textContent = 'Aguarde um momento';
    } else if (type === 'success') {
        // Mostrar ícone de sucesso
        spinner.style.display = 'none';
        icon.innerHTML = '<i class="fas fa-check-circle" style="font-size: 4rem; color: #28a745;"></i>';
        message.textContent = 'Enviado com sucesso!';
        subtitle.textContent = 'Seus dados foram salvos';
    } else if (type === 'error') {
        // Mostrar ícone de erro
        spinner.style.display = 'none';
        icon.innerHTML = '<i class="fas fa-times-circle" style="font-size: 4rem; color: #dc3545;"></i>';
        message.textContent = 'Erro ao enviar';
        subtitle.textContent = 'Tente novamente';
    }
    
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    overlay.style.pointerEvents = 'auto';
    
    const container = overlay.querySelector('.feedback-container');
    if (container) {
        container.style.transform = 'scale(1)';
    }
    
    console.log('Feedback overlay exibido');
}

// Função para esconder feedback
function hideFeedback() {
    const overlay = document.getElementById('feedback-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlay.style.pointerEvents = 'none';
        
        const container = overlay.querySelector('.feedback-container');
        if (container) {
            container.style.transform = 'scale(0.8)';
        }
    }
}

// Função para fazer fade out do formulário
function fadeOutForm() {
    const form = document.querySelector('.dashboard-card');
    form.classList.add('form-fade-out');
}

// Função para enviar dados
async function submitData(collection, data) {
    try {
        // Mostrar loading
        showFeedback('loading');
        
        // Fade out do formulário
        setTimeout(fadeOutForm, 300);
        
        const response = await fetch(`${API_BASE_URL}/api/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ collection, data })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Mostrar sucesso com GIF
            setTimeout(() => {
                showFeedback('success');
            }, 1000);
            
            // Esconder feedback após 3 segundos
            setTimeout(() => {
                hideFeedback();
                // Resetar formulário
                const form = document.querySelector('form');
                if (form) form.reset();
                // Remover fade out
                const card = document.querySelector('.dashboard-card');
                if (card) card.classList.remove('form-fade-out');
            }, 3000);
            
            return true;
        } else {
            // Esconder loading
            hideFeedback();
            // Mostrar toast de erro
            showErrorToast(result.message || 'Falha ao salvar dados');
            // Remover fade out
            const card = document.querySelector('.dashboard-card');
            if (card) card.classList.remove('form-fade-out');
            
            return false;
        }
    } catch (error) {
        // Esconder loading
        hideFeedback();
        // Mostrar toast de erro
        showErrorToast('Erro de conexão. Tente novamente.');
        // Remover fade out
        const card = document.querySelector('.dashboard-card');
        if (card) card.classList.remove('form-fade-out');
        
        return false;
    }
}

// Função de teste para feedback
function testFeedback() {
    console.log('🧪 Testando feedback...');
    showFeedback('loading');
    
    setTimeout(() => {
        showFeedback('success');
        setTimeout(() => {
            hideFeedback();
        }, 2000);
    }, 2000);
}

// Função de teste direto do overlay
function testDirectOverlay() {
    console.log('🔧 Testando overlay diretamente...');
    
    const overlay = document.getElementById('feedback-overlay');
    if (overlay) {
        console.log('✅ Overlay encontrado, exibindo...');
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
        overlay.style.pointerEvents = 'auto';
        
        const container = overlay.querySelector('.feedback-container');
        if (container) {
            container.style.transform = 'scale(1)';
        }
        
        setTimeout(() => {
            console.log('🔧 Escondendo overlay...');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
            
            if (container) {
                container.style.transform = 'scale(0.8)';
            }
        }, 3000);
    } else {
        console.error('❌ Overlay não encontrado!');
    }
}

// Aguardar o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM carregado completamente');
    
    // Toggle de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        console.log('✅ Theme toggle encontrado');
        themeToggle.addEventListener('click', function() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
        });
    } else {
        console.log('❌ Theme toggle não encontrado');
    }

    // Formulário Artigos
    const formArtigos = document.getElementById('form-artigos');
    if (formArtigos) {
        console.log('✅ Formulário Artigos encontrado');
        formArtigos.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const keywords = document.getElementById('artigo-keywords').value;
            const keywordsArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
            
            const categoryValue = document.getElementById('artigo-category').value;
            const categoryText = document.getElementById('artigo-category').options[document.getElementById('artigo-category').selectedIndex].text;
            
            const data = {
                title: document.getElementById('artigo-title').value,
                content: document.getElementById('artigo-content').value,
                category: categoryText,
                category_id: categoryValue,
                keywords: keywordsArray
            };
            
            const success = await submitData('Artigos', data);
            if (success) {
                this.reset();
            }
        });
    } else {
        console.log('❌ Formulário Artigos não encontrado');
    }

    // Formulário Velonews
    const formVelonews = document.getElementById('form-velonews');
    if (formVelonews) {
        console.log('✅ Formulário Velonews encontrado');
        formVelonews.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const data = {
                title: document.getElementById('velonews-title').value,
                content: document.getElementById('velonews-content').value,
                is_critical: document.getElementById('velonews-critical').checked ? 'Y' : 'N'
            };
            
            const success = await submitData('Velonews', data);
            if (success) {
                this.reset();
                document.getElementById('velonews-critical').checked = false;
            }
        });
    } else {
        console.log('❌ Formulário Velonews não encontrado');
    }

    // Formulário Bot Perguntas
    const formBotPerguntas = document.getElementById('form-bot-perguntas');
    if (formBotPerguntas) {
        console.log('✅ Formulário Bot Perguntas encontrado');
        formBotPerguntas.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const data = {
                topic: document.getElementById('bot-topic').value,
                context: document.getElementById('bot-context').value,
                keywords: document.getElementById('bot-keywords').value,
                question: document.getElementById('bot-question').value,
                imageUrls: document.getElementById('bot-image-urls').value
            };
            
            const success = await submitData('Bot_perguntas', data);
            if (success) {
                this.reset();
            }
        });
    } else {
        console.log('❌ Formulário Bot Perguntas não encontrado');
    }
});
