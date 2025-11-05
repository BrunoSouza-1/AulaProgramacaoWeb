// ==================== Menu Mobile ====================
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}

// ==================== Scroll Suave ====================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const headerHeight = 70; // altura do header fixa
    const sectionPosition = section.offsetTop - headerHeight;

    window.scrollTo({ top: sectionPosition, behavior: 'smooth' });

    // Fecha o menu mobile após clicar
    const menu = document.getElementById('navMenu');
    menu.classList.remove('active');
}

// ==================== Cadastro ====================
function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('volunteerForm');

    // 1. Coleta e Validação
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();

    if (!nome || !email) {
        alert('Por favor, preencha os campos Nome e Email.');
        return;
    }

    // 2. Coleta de Múltipla Seleção
    const atividadesSelecionadas = []; 
    const selectAtividades = form.atividades; 
    
    for (let i = 0; i < selectAtividades.options.length; i++) {
        if (selectAtividades.options[i].selected) {
            atividadesSelecionadas.push(selectAtividades.options[i].text);
        }
    }

    // 3. Monta o Objeto de Dados
    const formData = {
        nome: nome,
        email: email,
        telefone: form.telefone.value.trim(),
        idade: form.idade.value.trim(),
        disponibilidade: form.disponibilidade.value.trim(),
        areaInteresse: atividadesSelecionadas.join(', '),
        experiencia: form.experiencia.value.trim(),
        motivacao: form.motivacao.value.trim(),
        dataCadastro: new Date().toLocaleString()
    };

    // 4. Salva no Local Storage (Sem redeclaração de 'voluntarios')
    let voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];
    voluntarios.push(formData);
    localStorage.setItem('voluntarios', JSON.stringify(voluntarios));

    // 5. Exibe Mensagem de Sucesso (Sem redeclaração de 'successMessage')
    const successMessage = document.getElementById('successMessage'); 
    
    // Verificação de segurança: Apenas executa se a mensagem for encontrada
    if (successMessage) { 
        successMessage.classList.add('show');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Limpa e esconde após o timeout
        setTimeout(() => form.reset(), 2000);
        setTimeout(() => successMessage.classList.remove('show'), 5000);
    } else {
        // Se a div de sucesso não foi encontrada, apenas limpa o form
        form.reset();
    }

    // 6. Atualiza a Tabela
    exibirVoluntarios();
}

// ==================== Exibir Voluntários ====================
function exibirVoluntarios() {
    const voluntarios = JSON.parse(localStorage.getItem('voluntarios') || '[]');
    const tabelaContainer = document.getElementById('tabelaVoluntarios');

    if (!tabelaContainer) return;

    if (voluntarios.length === 0) {
        tabelaContainer.innerHTML = '<p>Nenhum voluntário cadastrado ainda.</p>';
        return;
    }

    let html = '<table border="1" cellpadding="5" cellspacing="0">';
    html += '<tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Idade</th><th>Disponibilidade</th><th>Área de Interesse</th><th>Data Cadastro</th></tr>';

    voluntarios.forEach(v => {
        html += `<tr>
            <td>${v.nome}</td>
            <td>${v.email}</td>
            <td>${v.telefone}</td>
            <td>${v.idade}</td>
            <td>${v.disponibilidade}</td>
            <td>${v.areaInteresse}</td>
            <td>${v.dataCadastro}</td>
        </tr>`;
    });

    html += '</table>';
    tabelaContainer.innerHTML = html;
}

// ==================== Animação ao Scroll ====================
window.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.card, .project-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (cardTop < windowHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// ==================== Máscara de Telefone (CORRIGIDO PARA O ESCOPO) ====================
function aplicarMascaraTelefone() {
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            } else if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length > 0) {
                value = `(${value}`;
            }

            e.target.value = value;
        });
    }
}

function loadPage(url) {
    const mainContent = document.querySelector('main');
fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newMain = doc.querySelector('main');
            if (newMain) {
                mainContent.innerHTML = newMain.innerHTML;
                document.title = doc.querySelector('title').textContent;
                initListeners();
            } else {
                console.error("Erro SPA: Tag <main> não encontrada na página carregada:", url);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar a página:', error);
            window.location.href = url;
            });
}
function initListeners() {
    const formCadastro = document.getElementById('volunteerForm');
    if (formCadastro) {
        formCadastro.addEventListener('submit', handleSubmit);
    }
    aplicarMascaraTelefone();
    exibirVoluntarios();
    }
document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (link && link.href.includes(window.location.host) && link.href.endsWith('.html')) {
        event.preventDefault();
        const targetUrl = link.href;
        history.pushState(null, '', targetUrl);
        loadPage(targetUrl);
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
});

// Inicializa TUDO ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Inicialização da Animação
    const cards = document.querySelectorAll('.card, .project-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Chama a função da máscara
    aplicarMascaraTelefone();

    // Mostra voluntários já cadastrados
    exibirVoluntarios();
});

