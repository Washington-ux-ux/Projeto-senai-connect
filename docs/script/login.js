const loginContainer = document.getElementById('login-container');

const token = localStorage.getItem('token');
if (token) {
    showLoggedInUser();
} else {
    showLoginForm();
}

function showLoginForm() {
    loginContainer.innerHTML = `
        <button id="btn-login-open" class="btn-nav-login">Entrar</button>

        <div id="login-modal" class="modal-overlay">
            <div class="modal-box">
                <span id="btn-login-close" class="close-btn">&times;</span>
                <h2>Acessar Conta</h2>
                <form id="login-form">
                    <div class="input-group">
                        <input type="email" id="login-email" placeholder="E-mail" required>
                    </div>
                    <div class="input-group">
                        <input type="password" id="login-password" placeholder="Senha" required>
                    </div>
                    <button type="submit" class="btn-submit">Entrar</button>
                </form>
                <p id="login-error" class="error-message"></p>
            </div>
        </div>
    `;

    const modal = document.getElementById('login-modal');
    const btnOpen = document.getElementById('btn-login-open');
    const btnClose = document.getElementById('btn-login-close');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    btnOpen.addEventListener('click', () => {
        modal.classList.add('active');
    });

    btnClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://localhost:3000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                modal.classList.remove('active');
                window.location.reload();
            } else {
                loginError.textContent = data.message || 'Erro ao fazer login';
            }
        } catch (error) {
            loginError.textContent = 'Erro de conexão com o servidor';
        }
    });
}

function showLoggedInUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    loginContainer.innerHTML = `
        <div class="user-menu">
            <button id="btn-user-menu" class="btn-nav-user">
                <i class="fa-solid fa-user"></i>
                <span>${user.name || 'Usuário'}</span>
            </button>
            <div id="user-dropdown" class="dropdown-menu">
                <a href="#" id="btn-logout">Sair</a>
            </div>
        </div>
    `;

    const btnUserMenu = document.getElementById('btn-user-menu');
    const userDropdown = document.getElementById('user-dropdown');
    const btnLogout = document.getElementById('btn-logout');

    btnUserMenu.addEventListener('click', () => {
        userDropdown.classList.toggle('active');
    });

    btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    });

    window.addEventListener('click', (event) => {
        if (!event.target.closest('.user-menu')) {
            userDropdown.classList.remove('active');
        }
    });
}