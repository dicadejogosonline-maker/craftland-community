// ==================== AUTHENTICATION ====================

function register() {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const messageEl = document.getElementById('registerMessage');

    // Validation
    if (!username || !email || !password || !passwordConfirm) {
        showMessage(messageEl, 'Por favor, preencha todos os campos.', 'error');
        return;
    }

    if (password !== passwordConfirm) {
        showMessage(messageEl, 'As senhas não correspondem.', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(messageEl, 'A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(messageEl, 'Por favor, insira um email válido.', 'error');
        return;
    }

    // Check if user already exists
    if (storage.getUser(email)) {
        showMessage(messageEl, 'Este email já está registrado.', 'error');
        return;
    }

    // Create user
    const userData = {
        email: email,
        username: username,
        password: hashPassword(password),
        isAdmin: false,
        createdAt: new Date().toISOString(),
        avatar: null,
        bio: ''
    };

    storage.saveUser(email, userData);
    showMessage(messageEl, 'Conta criada com sucesso! Faça login agora.', 'success');

    // Clear form
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerPasswordConfirm').value = '';

    // Switch to login
    setTimeout(() => {
        switchAuthTab('login');
    }, 1500);
}

function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');

    if (!email || !password) {
        showMessage(messageEl, 'Por favor, preencha email e senha.', 'error');
        return;
    }

    const user = storage.getUser(email);

    if (!user) {
        showMessage(messageEl, 'Email não encontrado.', 'error');
        return;
    }

    if (!comparePassword(password, user.password)) {
        showMessage(messageEl, 'Senha incorreta.', 'error');
        return;
    }

    // Login successful
    storage.setCurrentUser(email);
    showMessage(messageEl, 'Login realizado com sucesso!', 'success');
    showToast('Bem-vindo, ' + user.username + '!', 'success');

    // Clear form
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';

    // Redirect to home
    setTimeout(() => {
        updateAuthUI();
        navigateTo('home');
    }, 1000);
}

function resetPassword() {
    const email = document.getElementById('resetEmail').value.trim();
    const newPassword = document.getElementById('resetNewPassword').value;
    const newPasswordConfirm = document.getElementById('resetNewPasswordConfirm').value;
    const messageEl = document.getElementById('resetMessage');

    if (!email || !newPassword || !newPasswordConfirm) {
        showMessage(messageEl, 'Por favor, preencha todos os campos.', 'error');
        return;
    }

    if (newPassword !== newPasswordConfirm) {
        showMessage(messageEl, 'As novas senhas não correspondem.', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage(messageEl, 'A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }

    const user = storage.getUser(email);

    if (!user) {
        showMessage(messageEl, 'Email não encontrado.', 'error');
        return;
    }

    // Update password
    user.password = hashPassword(newPassword);
    storage.saveUser(email, user);
    showMessage(messageEl, 'Senha resetada com sucesso!', 'success');
    showToast('Sua senha foi alterada!', 'success');

    // Clear form
    document.getElementById('resetEmail').value = '';
    document.getElementById('resetNewPassword').value = '';
    document.getElementById('resetNewPasswordConfirm').value = '';

    // Switch to login
    setTimeout(() => {
        switchAuthTab('login');
    }, 1500);
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        storage.clearCurrentUser();
        showToast('Você saiu com sucesso!', 'success');
        updateAuthUI();
        navigateTo('home');
    }
}

function updateAuthUI() {
    const currentUser = storage.getCurrentUser();
    const authNav = document.getElementById('authNav');
    const logoutNav = document.getElementById('logoutNav');
    const publishNav = document.getElementById('publishNav');
    const profileNav = document.getElementById('profileNav');
    const adminNav = document.getElementById('adminNav');

    if (currentUser) {
        const user = storage.getUser(currentUser);
        authNav.style.display = 'none';
        logoutNav.style.display = 'block';
        publishNav.style.display = 'block';
        profileNav.style.display = 'block';

        if (user && user.isAdmin) {
            adminNav.style.display = 'block';
        } else {
            adminNav.style.display = 'none';
        }
    } else {
        authNav.style.display = 'block';
        logoutNav.style.display = 'none';
        publishNav.style.display = 'none';
        profileNav.style.display = 'none';
        adminNav.style.display = 'none';
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.querySelectorAll('.auth-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    if (tab === 'login') {
        document.getElementById('loginForm').classList.add('active');
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
    } else if (tab === 'register') {
        document.getElementById('registerForm').classList.add('active');
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
    } else if (tab === 'reset') {
        document.getElementById('resetForm').classList.add('active');
        document.querySelectorAll('.auth-tab')[2].classList.add('active');
    }
}