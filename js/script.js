// ==================== BANCO DE DADOS LOCAL ====================
let users = JSON.parse(localStorage.getItem('evolva_users')) || [];

function criarUsuarioPadrao() {
    const adminExiste = users.find(u => u.email === 'admin@evolva.com');
    if (!adminExiste) {
        const adminUser = {
            id: 1,
            name: 'Administrador',
            email: 'admin@evolva.com',
            password: '123456'
        };
        users.push(adminUser);
        localStorage.setItem('evolva_users', JSON.stringify(users));
    }
}
criarUsuarioPadrao();

// ==================== FUNÇÕES DE AUTENTICAÇÃO ====================
function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

function switchTab(tab) {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('forgotForm').classList.remove('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (tab === 'login') {
        document.getElementById('loginForm').classList.add('active');
        document.querySelectorAll('.tab')[0].classList.add('active');
    } else if (tab === 'register') {
        document.getElementById('registerForm').classList.add('active');
        document.querySelectorAll('.tab')[1].classList.add('active');
    }
}

function showForgotPassword() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('forgotForm').classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
}

function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPass = document.getElementById('regConfirmPassword').value;

    if (!name || !email || !password || !confirmPass) {
        showMessage('Preencha todos os campos!', 'error');
        return;
    }
    if (password !== confirmPass) {
        showMessage('As senhas não coincidem!', 'error');
        return;
    }
    if (password.length < 6) {
        showMessage('A senha deve ter pelo menos 6 caracteres!', 'error');
        return;
    }
    if (users.find(u => u.email === email)) {
        showMessage('Este e-mail já está cadastrado!', 'error');
        return;
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password
    };
    users.push(newUser);
    localStorage.setItem('evolva_users', JSON.stringify(users));
    showMessage('Cadastro realizado com sucesso! Faça login.', 'success');
    switchTab('login');
    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regConfirmPassword').value = '';
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMessage('Preencha todos os campos!', 'error');
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('evolva_current_user', JSON.stringify(user));
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('welcomeUser').textContent = `Bem-vindo(a), ${user.name}! 👋`;
        document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
        mostrarDisciplina('portugues');
    } else {
        showMessage('E-mail ou senha incorretos!', 'error');
    }
}

function resetPassword() {
    const email = document.getElementById('forgotEmail').value;
    if (!email) {
        showMessage('Digite seu e-mail!', 'error');
        return;
    }
    const user = users.find(u => u.email === email);
    if (user) {
        showMessage(`Instruções enviadas para ${email}`, 'success');
    } else {
        showMessage('E-mail não encontrado!', 'error');
    }
}

function logout() {
    localStorage.removeItem('evolva_current_user');
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('conteudoArea').innerHTML = '';
    switchTab('login');
}

// ==================== VARIÁVEIS GLOBAIS ====================
let disciplinaAtual = 'portugues';
let currentPage = 1;
const questionsPerPage = 5;
let currentAulaId = '';
let exerciciosData = {};
let respostasUsuario = {};

// ==================== FUNÇÕES DE NAVEGAÇÃO ====================
function mostrarDisciplina(disciplina) {
    disciplinaAtual = disciplina;
    currentPage = 1;
    let html = `<div class="niveis-container">`;
    if (disciplina === 'portugues') {
        html += `
            <div class="nivel-card nivel1" onclick="mostrarNivel(1)"><div class="nivel-icon">🔰</div><h3>Nível 1</h3><p>Ensino Fundamental Inicial</p><small>1º ao 5º ano</small></div>
            <div class="nivel-card nivel2" onclick="mostrarNivel(2)"><div class="nivel-icon">📚</div><h3>Nível 2</h3><p>Fundamental - Intermediário</p><small>6º ao 7º ano</small></div>
            <div class="nivel-card nivel3" onclick="mostrarNivel(3)"><div class="nivel-icon">🎯</div><h3>Nível 3</h3><p>Fundamental - Avançado</p><small>8º ao 9º ano</small></div>
            <div class="nivel-card nivel4" onclick="mostrarNivel(4)"><div class="nivel-icon">🚀</div><h3>Nível 4</h3><p>Ensino Médio</p><small>1º ao 3º ano</small></div>
        `;
    } else if (disciplina === 'matematica') {
        html += `
            <div class="nivel-card nivel1" onclick="mostrarNivel(5)"><div class="nivel-icon">🔢</div><h3>Matemática Básica</h3><p>Fundamental Inicial</p><small>Números e operações</small></div>
            <div class="nivel-card nivel2" onclick="mostrarNivel(6)"><div class="nivel-icon">📊</div><h3>Matemática Intermediária</h3><p>Fundamental - Intermediário</p><small>Frações, decimais, porcentagem</small></div>
            <div class="nivel-card nivel3" onclick="mostrarNivel(7)"><div class="nivel-icon">⚡</div><h3>Matemática Avançada</h3><p>Fundamental - Avançado</p><small>Expressões, potenciação, equações</small></div>
            <div class="nivel-card nivel4" onclick="mostrarNivel(8)"><div class="nivel-icon">🎓</div><h3>Matemática Superior</h3><p>Ensino Médio</p><small>Álgebra, geometria, trigonometria</small></div>
        `;
    } else if (disciplina === 'ingles') {
        html += `
            <div class="nivel-card nivel1" onclick="mostrarNivel(9)"><div class="nivel-icon">🔤</div><h3>Inglês Básico</h3><p>Iniciante</p><small>Alphabet, numbers, verb to be</small></div>
            <div class="nivel-card nivel2" onclick="mostrarNivel(10)"><div class="nivel-icon">📝</div><h3>Inglês Intermediário</h3><p>Intermediate</p><small>Tenses, sentence formation</small></div>
            <div class="nivel-card nivel3" onclick="mostrarNivel(11)"><div class="nivel-icon">🚀</div><h3>Inglês Avançado</h3><p>Advanced</p><small>Phrasal verbs, conditionals, idioms</small></div>
            <div class="nivel-card nivel4" onclick="mostrarNivel(12)"><div class="nivel-icon">🎯</div><h3>Inglês Fluente</h3><p>Fluent</p><small>Interpretation, writing, advanced grammar</small></div>
        `;
    }
    html += `</div>`;
    document.getElementById('conteudoArea').innerHTML = html;
}

function getTituloNivel(nivel) {
    const titulos = {
        1: '📖 Nível 1 - Português Básico',
        2: '📖 Nível 2 - Português Intermediário',
        3: '📖 Nível 3 - Português Avançado',
        4: '📖 Nível 4 - Português Ensino Médio',
        5: '🔢 Matemática Básica',
        6: '📊 Matemática Intermediária',
        7: '⚡ Matemática Avançada',
        8: '🎓 Matemática Ensino Médio',
        9: '🔤 Inglês Básico',
        10: '📝 Inglês Intermediário',
        11: '🚀 Inglês Avançado',
        12: '🎯 Inglês Fluente'
    };
    return titulos[nivel] || '';
}

function getTagNivel(nivel) {
    const tags = {
        1: '1º ao 5º ano',
        2: '6º/7º ano',
        3: '8º/9º ano',
        4: '1º ao 3º ano',
        5: 'Fundamental Inicial',
        6: 'Intermediário',
        7: 'Avançado',
        8: 'Ensino Médio',
        9: 'Beginner',
        10: 'Intermediate',
        11: 'Advanced',
        12: 'Fluent'
    };
    return tags[nivel] || '';
}

function getMateriasPorNivel(nivel) {
    const materias = {
        // Português Nível 1
        1: [
            { id: 'fonetica1', icone: '🔊', nome: 'Fonética e Fonologia', descricao: 'Sons das letras, vogais, consoantes, encontros vocálicos', cor: '#4CAF50' },
            { id: 'morfologia1', icone: '📝', nome: 'Morfologia', descricao: 'Substantivo, adjetivo, verbo, artigo, numeral', cor: '#4CAF50' },
            { id: 'sintaxe1', icone: '🔤', nome: 'Sintaxe', descricao: 'Frases, orações, sujeito e predicado simples', cor: '#4CAF50' },
            { id: 'ortografia1', icone: '✍️', nome: 'Ortografia', descricao: 'Uso do S/Z, M/N, C/QU, G/J', cor: '#4CAF50' },
            { id: 'semantica1', icone: '💭', nome: 'Semântica', descricao: 'Sinônimos, antônimos, sentido das palavras', cor: '#4CAF50' },
            { id: 'pontuacao1', icone: '❗', nome: 'Pontuação Básica', descricao: 'Ponto final, vírgula, interrogação e exclamação', cor: '#4CAF50' }
        ],
        // Português Nível 2
        2: [
            { id: 'estruturaPalavras2', icone: '📚', nome: 'Estrutura das Palavras', descricao: 'Radical, afixos, desinências, vogal temática', cor: '#FF9800' },
            { id: 'classesGramaticais2', icone: '🔤', nome: 'Classes Gramaticais', descricao: 'Substantivo, adjetivo, verbo, advérbio, preposição, conjunção', cor: '#FF9800' },
            { id: 'verbos2', icone: '🎯', nome: 'Verbos', descricao: 'Conjugação, tempos verbais, modos indicativo/subjuntivo', cor: '#FF9800' },
            { id: 'formacaoPalavras2', icone: '📝', nome: 'Formação de Palavras', descricao: 'Derivação, composição, onomatopeia, abreviação', cor: '#FF9800' },
            { id: 'pronomes2', icone: '👤', nome: 'Pronomes', descricao: 'Pessoais, possessivos, demonstrativos, indefinidos, relativos', cor: '#FF9800' },
            { id: 'adverbios2', icone: '⚡', nome: 'Advérbios', descricao: 'Lugar, tempo, modo, intensidade, afirmação, negação, dúvida', cor: '#FF9800' }
        ],
        // Português Nível 3
        3: [
            { id: 'sintaxe3', icone: '🔗', nome: 'Sintaxe', descricao: 'Termos essenciais, integrantes e acessórios da oração', cor: '#f44336' },
            { id: 'periodoComposto3', icone: '📐', nome: 'Período Composto', descricao: 'Coordenação e subordinação, orações desenvolvidas', cor: '#f44336' },
            { id: 'verbos3', icone: '⚡', nome: 'Verbos', descricao: 'Vozes verbais, tempos compostos, formas nominais', cor: '#f44336' },
            { id: 'concordancia3', icone: '🤝', nome: 'Concordância', descricao: 'Concordância verbal e nominal básica', cor: '#f44336' },
            { id: 'regencia3', icone: '🎯', nome: 'Regência', descricao: 'Regência verbal e nominal', cor: '#f44336' },
            { id: 'pontuacao3', icone: '❗', nome: 'Pontuação', descricao: 'Uso da vírgula, ponto e vírgula, dois pontos, aspas, travessão', cor: '#f44336' }
        ],
        // Português Nível 4
        4: [
            { id: 'concordancia4', icone: '🤝', nome: 'Concordância', descricao: 'Casos especiais de concordância verbal e nominal', cor: '#9C27B0' },
            { id: 'regencia4', icone: '🎯', nome: 'Regência', descricao: 'Regência verbal e nominal completa', cor: '#9C27B0' },
            { id: 'crase4', icone: '📌', nome: 'Crase', descricao: 'Uso da crase, casos obrigatórios e facultativos', cor: '#9C27B0' },
            { id: 'colocacao4', icone: '📍', nome: 'Colocação Pronominal', descricao: 'Próclise, mesóclise, ênclise', cor: '#9C27B0' },
            { id: 'semantica4', icone: '💭', nome: 'Semântica', descricao: 'Polissemia, homonímia, paronímia, conotação/denotação', cor: '#9C27B0' },
            { id: 'figuras4', icone: '🎨', nome: 'Figuras de Linguagem', descricao: 'Metáfora, metonímia, antítese, paradoxo, hipérbole, eufemismo', cor: '#9C27B0' }
        ],
        // Matemática Nível 5 (Básica)
        5: [
            { id: 'numeros', icone: '🔢', nome: 'Números', descricao: 'Naturais, inteiros, ordinais', cor: '#FF9800' },
            { id: 'operacoes', icone: '➕', nome: 'Operações Básicas', descricao: 'Adição, subtração, multiplicação, divisão', cor: '#FF9800' },
            { id: 'tabuada', icone: '✖️', nome: 'Tabuada', descricao: 'Tabuada do 1 ao 10', cor: '#FF9800' },
            { id: 'ordem', icone: '📏', nome: 'Ordem Crescente/Decrescente', descricao: 'Comparar e ordenar números', cor: '#FF9800' },
            { id: 'ordinais', icone: '🥇', nome: 'Números Ordinais', descricao: '1º, 2º, 3º...', cor: '#FF9800' },
            { id: 'decimal', icone: '💧', nome: 'Sistema Decimal', descricao: 'Unidades, dezenas, centenas, milhares', cor: '#FF9800' }
        ],
        // Matemática Nível 6 (Intermediária)
        6: [
            { id: 'fracoes', icone: '🥧', nome: 'Frações', descricao: 'Frações equivalentes, operações com frações', cor: '#FF9800' },
            { id: 'decimais', icone: '🔟', nome: 'Números Decimais', descricao: 'Décimos, centésimos, milésimos, operações', cor: '#FF9800' },
            { id: 'porcentagem', icone: '💯', nome: 'Porcentagem', descricao: 'Cálculo de porcentagem, aumentos e descontos', cor: '#FF9800' },
            { id: 'razao', icone: '⚖️', nome: 'Razão e Proporção', descricao: 'Razões, proporções, escala', cor: '#FF9800' },
            { id: 'regra3', icone: '📐', nome: 'Regra de Três', descricao: 'Simples, composta, direta e inversa', cor: '#FF9800' }
        ],
        // Matemática Nível 7 (Avançada)
        7: [
            { id: 'expressoes', icone: '📝', nome: 'Expressões Numéricas', descricao: 'Ordem das operações, parênteses, colchetes, chaves', cor: '#f44336' },
            { id: 'potenciacao', icone: '🔺', nome: 'Potenciação', descricao: 'Potências, propriedades, expoentes', cor: '#f44336' },
            { id: 'radiciacao', icone: '√', nome: 'Radiciação', descricao: 'Raízes quadradas, cúbicas, propriedades', cor: '#f44336' },
            { id: 'equacoes', icone: '⚖️', nome: 'Equações', descricao: 'Equações do 1º e 2º grau, sistemas', cor: '#f44336' }
        ],
        // Matemática Nível 8 (Ensino Médio)
        8: [
            { id: 'algebra', icone: '🔣', nome: 'Álgebra Avançada', descricao: 'Polinômios, sistemas lineares, matrizes, determinantes', cor: '#9C27B0' },
            { id: 'geometria', icone: '📐', nome: 'Geometria', descricao: 'Plana, espacial, analítica, fórmulas de área e volume', cor: '#9C27B0' },
            { id: 'trigonometria', icone: '🔄', nome: 'Trigonometria', descricao: 'Seno, cosseno, tangente, círculo trigonométrico', cor: '#9C27B0' },
            { id: 'estatistica', icone: '📊', nome: 'Estatística', descricao: 'Média, mediana, moda, desvio padrão, gráficos', cor: '#9C27B0' },
            { id: 'probabilidade', icone: '🎲', nome: 'Probabilidade', descricao: 'Eventos, espaço amostral, probabilidade condicional', cor: '#9C27B0' }
        ],
        // Inglês Nível 9 (Básico)
        9: [
            { id: 'alphabet', icone: '🔤', nome: 'Alphabet', descricao: 'Letters and pronunciation', cor: '#2196F3' },
            { id: 'numbers', icone: '🔢', nome: 'Numbers', descricao: 'Cardinal and ordinal numbers', cor: '#2196F3' },
            { id: 'vocabulary1', icone: '📚', nome: 'Basic Vocabulary', descricao: 'Greetings, colors, family, animals, days, months', cor: '#2196F3' },
            { id: 'verbtobe', icone: '👤', nome: 'Verb to Be', descricao: 'Am, is, are - affirmative, negative, questions', cor: '#2196F3' },
            { id: 'pronouns', icone: '👥', nome: 'Personal Pronouns', descricao: 'Subject and object pronouns', cor: '#2196F3' },
            { id: 'articles', icone: '📝', nome: 'Articles', descricao: 'Definite and indefinite articles (a, an, the)', cor: '#2196F3' }
        ],
        // Inglês Nível 10 (Intermediário)
        10: [
            { id: 'present', icone: '⏰', nome: 'Present Tenses', descricao: 'Simple present, present continuous', cor: '#2196F3' },
            { id: 'past', icone: '⌛', nome: 'Past Tenses', descricao: 'Simple past, past continuous', cor: '#2196F3' },
            { id: 'future', icone: '🔮', nome: 'Future Tenses', descricao: 'Will, going to, present continuous for future', cor: '#2196F3' },
            { id: 'sentence', icone: '📄', nome: 'Sentence Formation', descricao: 'Word order, questions, negatives, imperatives', cor: '#2196F3' },
            { id: 'vocabulary2', icone: '📖', nome: 'Intermediate Vocabulary', descricao: 'Daily activities, work, travel, food, weather', cor: '#2196F3' },
            { id: 'prepositions', icone: '📍', nome: 'Prepositions', descricao: 'Time, place, movement prepositions', cor: '#2196F3' }
        ],
        // Inglês Nível 11 (Avançado)
        11: [
            { id: 'phrasal', icone: '🔗', nome: 'Phrasal Verbs', descricao: 'Common phrasal verbs and meanings', cor: '#2196F3' },
            { id: 'conditionals', icone: '⚖️', nome: 'Conditionals', descricao: 'Zero, first, second, third conditionals', cor: '#2196F3' },
            { id: 'idioms', icone: '💬', nome: 'Idioms', descricao: 'Common English expressions and sayings', cor: '#2196F3' },
            { id: 'modal', icone: '🎯', nome: 'Modal Verbs', descricao: 'Can, could, may, might, must, should, would', cor: '#2196F3' },
            { id: 'passive', icone: '🔄', nome: 'Passive Voice', descricao: 'Active to passive transformation', cor: '#2196F3' }
        ],
        // Inglês Nível 12 (Fluente)
        12: [
            { id: 'interpretation', icone: '📖', nome: 'Reading Interpretation', descricao: 'Text comprehension and analysis', cor: '#2196F3' },
            { id: 'writing', icone: '✍️', nome: 'Writing', descricao: 'Essays, emails, reports, formal letters', cor: '#2196F3' },
            { id: 'advancedgrammar', icone: '📚', nome: 'Advanced Grammar', descricao: 'Complex structures, inversions, reported speech', cor: '#2196F3' },
            { id: 'collocations', icone: '🤝', nome: 'Collocations', descricao: 'Common word partnerships', cor: '#2196F3' },
            { id: 'slang', icone: '💭', nome: 'Slang & Expressions', descricao: 'Informal language, modern expressions', cor: '#2196F3' }
        ]
    };
    return materias[nivel] || [];
}

function mostrarNivel(nivel) {
    const materias = getMateriasPorNivel(nivel);
    let html = `
        <div class="materias-section">
            <div class="materias-header">
                <h2>${getTituloNivel(nivel)}</h2>
                <span class="nivel-tag">${getTagNivel(nivel)}</span>
            </div>
            <div class="materias-grid">
    `;
    materias.forEach(materia => {
        html += `
            <div class="materia-item" style="border-left-color: ${materia.cor}" onclick="mostrarAula('${materia.id}')">
                <h4>${materia.icone} ${materia.nome}</h4>
                <p>${materia.descricao}</p>
                <span class="materia-tag">30 exercícios</span>
            </div>
        `;
    });
    html += `</div></div>`;
    document.getElementById('conteudoArea').innerHTML = html;
}

function getNivelFromId(aulaId) {
    const mapa = {
        'fonetica1': 1, 'morfologia1': 1, 'sintaxe1': 1, 'ortografia1': 1, 'semantica1': 1, 'pontuacao1': 1,
        'estruturaPalavras2': 2, 'classesGramaticais2': 2, 'verbos2': 2, 'formacaoPalavras2': 2, 'pronomes2': 2, 'adverbios2': 2,
        'sintaxe3': 3, 'periodoComposto3': 3, 'verbos3': 3, 'concordancia3': 3, 'regencia3': 3, 'pontuacao3': 3,
        'concordancia4': 4, 'regencia4': 4, 'crase4': 4, 'colocacao4': 4, 'semantica4': 4, 'figuras4': 4,
        'numeros': 5, 'operacoes': 5, 'tabuada': 5, 'ordem': 5, 'ordinais': 5, 'decimal': 5,
        'fracoes': 6, 'decimais': 6, 'porcentagem': 6, 'razao': 6, 'regra3': 6,
        'expressoes': 7, 'potenciacao': 7, 'radiciacao': 7, 'equacoes': 7,
        'algebra': 8, 'geometria': 8, 'trigonometria': 8, 'estatistica': 8, 'probabilidade': 8,
        'alphabet': 9, 'numbers': 9, 'vocabulary1': 9, 'verbtobe': 9, 'pronouns': 9, 'articles': 9,
        'present': 10, 'past': 10, 'future': 10, 'sentence': 10, 'vocabulary2': 10, 'prepositions': 10,
        'phrasal': 11, 'conditionals': 11, 'idioms': 11, 'modal': 11, 'passive': 11,
        'interpretation': 12, 'writing': 12, 'advancedgrammar': 12, 'collocations': 12, 'slang': 12
    };
    return mapa[aulaId] || 1;
}

async function mostrarAula(aulaId) {
    currentAulaId = aulaId;
    currentPage = 1;
    const nivel = getNivelFromId(aulaId);
    const disciplina = aulaId.includes('fonetica') || aulaId.includes('morfologia') || aulaId.includes('sintaxe') || aulaId.includes('ortografia') || aulaId.includes('semantica') || aulaId.includes('pontuacao') ||
                       aulaId.includes('estrutura') || aulaId.includes('classes') || aulaId.includes('verbos') || aulaId.includes('formacao') || aulaId.includes('pronomes') || aulaId.includes('adverbios') ||
                       aulaId.includes('periodo') || aulaId.includes('concordancia') || aulaId.includes('regencia') || aulaId.includes('crase') || aulaId.includes('colocacao') || aulaId.includes('figuras') ? 'portugues' :
                       (aulaId.includes('numeros') || aulaId.includes('operacoes') || aulaId.includes('tabuada') || aulaId.includes('ordem') || aulaId.includes('ordinais') || aulaId.includes('decimal') ||
                        aulaId.includes('fracoes') || aulaId.includes('decimais') || aulaId.includes('porcentagem') || aulaId.includes('razao') || aulaId.includes('regra3') ||
                        aulaId.includes('expressoes') || aulaId.includes('potenciacao') || aulaId.includes('radiciacao') || aulaId.includes('equacoes') ||
                        aulaId.includes('algebra') || aulaId.includes('geometria') || aulaId.includes('trigonometria') || aulaId.includes('estatistica') || aulaId.includes('probabilidade') ? 'matematica' : 'ingles');
    const caminho = `data/${disciplina}/nivel${nivel}/${aulaId}.json`;

    let html = `
        <div class="aula-container">
            <button class="back-btn" onclick="voltarParaNivel()">← Voltar para matérias</button>
            <div class="aula-content">
                <h2>📚 Carregando...</h2>
                <div class="exercicios-section" id="exercicios-${aulaId}">
                    <div class="exercicios-header">
                        <h3>📝 Carregando exercícios...</h3>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('conteudoArea').innerHTML = html;

    try {
        const response = await fetch(caminho);
        if (!response.ok) throw new Error('Arquivo não encontrado');
        const data = await response.json();
        exerciciosData[aulaId] = data.questoes;
        const total = data.questoes.length;
        respostasUsuario[aulaId] = Array(total).fill(null);

        const conteudoAula = data.materia ? `<h2>${data.materia}</h2>` : `<h2>${aulaId}</h2>`;
        html = `
            <div class="aula-container">
                <button class="back-btn" onclick="voltarParaNivel()">← Voltar para matérias</button>
                <div class="aula-content">
                    ${conteudoAula}
                    <div class="exercicios-section" id="exercicios-${aulaId}">
                        <div class="exercicios-header">
                            <h3>📝 ${total} Exercícios</h3>
                            <div class="progress-bar"><div class="progress-fill" id="progress-${aulaId}" style="width: 0%"></div></div>
                        </div>
                        <div class="questoes-container" id="questoes-container-${aulaId}"></div>
                        <div class="navegacao-exercicios">
                            <button class="btn-nav" id="prev-${aulaId}" onclick="mudarPagina('${aulaId}', -1)" disabled>← Anterior</button>
                            <span class="pagina-indicador" id="pagina-${aulaId}">Página 1/${Math.ceil(total/questionsPerPage)}</span>
                            <button class="btn-nav" id="next-${aulaId}" onclick="mudarPagina('${aulaId}', 1)">Próxima →</button>
                        </div>
                        <div style="text-align: center;">
                            <button class="btn-exercicio" onclick="corrigirPaginaAtual('${aulaId}')">Corrigir página</button>
                            <button class="btn-exercicio secondary" onclick="corrigirTodos('${aulaId}')">Corrigir todos</button>
                            <button class="btn-exercicio secondary" onclick="resetarExercicios('${aulaId}')">Resetar</button>
                        </div>
                        <div id="resultado-${aulaId}" class="resultado-exercicio" style="display: none;"></div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('conteudoArea').innerHTML = html;
        atualizarQuestoes(aulaId);
        atualizarProgresso(aulaId);
    } catch (error) {
        console.error('Erro ao carregar exercícios:', error);
        document.getElementById(`exercicios-${aulaId}`).innerHTML = '<p style="color:red;">Erro ao carregar exercícios. Verifique o console.</p>';
    }
}

function voltarParaNivel() {
    mostrarDisciplina(disciplinaAtual);
}

function atualizarQuestoes(aulaId) {
    const questoes = exerciciosData[aulaId];
    if (!questoes) return;
    const startIdx = (currentPage - 1) * questionsPerPage;
    const endIdx = Math.min(startIdx + questionsPerPage, questoes.length);
    const container = document.getElementById(`questoes-container-${aulaId}`);
    if (!container) return;

    let html = '';
    for (let i = startIdx; i < endIdx; i++) {
        const q = questoes[i];
        const questaoId = `q${i}`;
        const respostaSalva = respostasUsuario[aulaId] ? respostasUsuario[aulaId][i] : null;
        let opcoesHtml = '';
        for (let j = 0; j < q.opcoes.length; j++) {
            const checked = respostaSalva === j ? 'checked' : '';
            const letra = String.fromCharCode(97 + j);
            opcoesHtml += `
                <div class="opcao">
                    <input type="radio" name="${questaoId}" value="${j}" id="${questaoId}${j}" ${checked} onchange="salvarResposta('${aulaId}', ${i}, ${j})">
                    <label for="${questaoId}${j}"><strong>${letra})</strong> ${q.opcoes[j]}</label>
                </div>
            `;
        }
        html += `
            <div class="questao ativa" id="questao-${aulaId}-${i}">
                <p><strong>${i+1}.</strong> ${q.pergunta}</p>
                <div class="opcoes">${opcoesHtml}</div>
                <div class="feedback" id="feedback-${aulaId}-${i}"></div>
            </div>
        `;
    }
    container.innerHTML = html;

    const totalPages = Math.ceil(questoes.length / questionsPerPage);
    document.getElementById(`pagina-${aulaId}`).textContent = `Página ${currentPage}/${totalPages}`;
    document.getElementById(`prev-${aulaId}`).disabled = currentPage === 1;
    document.getElementById(`next-${aulaId}`).disabled = currentPage === totalPages;
}

function mudarPagina(aulaId, direcao) {
    const totalPages = Math.ceil(exerciciosData[aulaId].length / questionsPerPage);
    const novaPagina = currentPage + direcao;
    if (novaPagina >= 1 && novaPagina <= totalPages) {
        currentPage = novaPagina;
        atualizarQuestoes(aulaId);
    }
}

function salvarResposta(aulaId, questaoIndex, valor) {
    if (!respostasUsuario[aulaId]) respostasUsuario[aulaId] = [];
    respostasUsuario[aulaId][questaoIndex] = parseInt(valor);
    atualizarProgresso(aulaId);
}

function atualizarProgresso(aulaId) {
    const respostas = respostasUsuario[aulaId] || [];
    const respondidas = respostas.filter(r => r !== null).length;
    const total = exerciciosData[aulaId] ? exerciciosData[aulaId].length : 0;
    const percentual = total ? (respondidas / total) * 100 : 0;
    const progressBar = document.getElementById(`progress-${aulaId}`);
    if (progressBar) progressBar.style.width = `${percentual}%`;
}

function corrigirPaginaAtual(aulaId) {
    const questoes = exerciciosData[aulaId];
    if (!questoes) return;
    const startIdx = (currentPage - 1) * questionsPerPage;
    const endIdx = Math.min(startIdx + questionsPerPage, questoes.length);
    let acertos = 0;
    let total = 0;

    for (let i = startIdx; i < endIdx; i++) {
        const resposta = respostasUsuario[aulaId] ? respostasUsuario[aulaId][i] : null;
        const feedbackDiv = document.getElementById(`feedback-${aulaId}-${i}`);
        if (resposta !== null) {
            total++;
            const correta = questoes[i].correta;
            const letraCorreta = String.fromCharCode(97 + correta);
            if (resposta === correta) {
                feedbackDiv.textContent = `✅ Correto! ${questoes[i].explicacao || ''}`;
                feedbackDiv.className = 'feedback correto';
                acertos++;
            } else {
                feedbackDiv.textContent = `❌ Incorreto. Resposta correta: ${letraCorreta}) ${questoes[i].opcoes[correta]}. ${questoes[i].explicacao || ''}`;
                feedbackDiv.className = 'feedback incorreto';
            }
        } else {
            feedbackDiv.textContent = '⚠️ Responda esta questão!';
            feedbackDiv.className = 'feedback incorreto';
        }
    }
    if (total > 0) {
        const resultadoDiv = document.getElementById(`resultado-${aulaId}`);
        resultadoDiv.style.display = 'block';
        resultadoDiv.textContent = `Você acertou ${acertos} de ${total} questões nesta página!`;
    }
}

function corrigirTodos(aulaId) {
    const questoes = exerciciosData[aulaId];
    if (!questoes) return;
    let acertos = 0;
    for (let i = 0; i < questoes.length; i++) {
        const resposta = respostasUsuario[aulaId] ? respostasUsuario[aulaId][i] : null;
        if (resposta === questoes[i].correta) acertos++;
    }
    const resultadoDiv = document.getElementById(`resultado-${aulaId}`);
    resultadoDiv.style.display = 'block';
    resultadoDiv.textContent = `Você acertou ${acertos} de ${questoes.length} questões.`;
}

function resetarExercicios(aulaId) {
    if (respostasUsuario[aulaId]) {
        respostasUsuario[aulaId] = Array(exerciciosData[aulaId].length).fill(null);
    }
    for (let i = 0; i < exerciciosData[aulaId].length; i++) {
        const feedbackDiv = document.getElementById(`feedback-${aulaId}-${i}`);
        if (feedbackDiv) {
            feedbackDiv.textContent = '';
            feedbackDiv.className = 'feedback';
        }
    }
    document.getElementById(`resultado-${aulaId}`).style.display = 'none';
    currentPage = 1;
    atualizarQuestoes(aulaId);
    atualizarProgresso(aulaId);
}

window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem('evolva_current_user'));
    if (currentUser) {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('welcomeUser').textContent = `Bem-vindo(a), ${currentUser.name}! 👋`;
        document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
        mostrarDisciplina('portugues');
    }
};
