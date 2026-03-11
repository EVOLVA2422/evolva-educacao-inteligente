// Banco de dados local
let users = JSON.parse(localStorage.getItem('evolva_users')) || [];

// CRIAR USUÁRIO ADMIN PADRÃO
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

// FUNÇÕES DE AUTENTICAÇÃO
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

let disciplinaAtual = 'portugues';

function mostrarDisciplina(disciplina) {
    disciplinaAtual = disciplina;
    
    let html = `
        <div class="niveis-container">
    `;
    
    if (disciplina === 'portugues') {
        html += `
            <div class="nivel-card nivel1" onclick="mostrarNivel(1)">
                <div class="nivel-icon">🔰</div>
                <h3>Nível 1</h3>
                <p>Ensino Fundamental Inicial</p>
                <small>1º ao 5º ano</small>
            </div>
            <div class="nivel-card nivel2" onclick="mostrarNivel(2)">
                <div class="nivel-icon">📚</div>
                <h3>Nível 2</h3>
                <p>Fundamental - Intermediário</p>
                <small>6º ao 7º ano</small>
            </div>
            <div class="nivel-card nivel3" onclick="mostrarNivel(3)">
                <div class="nivel-icon">🎯</div>
                <h3>Nível 3</h3>
                <p>Fundamental - Avançado</p>
                <small>8º ao 9º ano</small>
            </div>
            <div class="nivel-card nivel4" onclick="mostrarNivel(4)">
                <div class="nivel-icon">🚀</div>
                <h3>Nível 4</h3>
                <p>Ensino Médio</p>
                <small>1º
