// Seleciona o container de login na navbar
const loginContainer = document.getElementById('login-container');

// Insere o botão de abrir e a estrutura da caixa de login (Modal)
loginContainer.innerHTML = `
    <button id="btn-login-open" class="btn-nav-login">Entrar</button>

    <div id="login-modal" class="modal-overlay">
        <div class="modal-box">
            <span id="btn-login-close" class="close-btn">&times;</span>
            <h2>Acessar Conta</h2>
            <form action="/login" method="POST">
                <div class="input-group">
                    <input type="email" placeholder="E-mail" required>
                </div>
                <div class="input-group">
                    <input type="password" placeholder="Senha" required>
                </div>
                <button type="submit" class="btn-submit">Entrar</button>
            </form>
        </div>
    </div>
`;


const modal = document.getElementById('login-modal');
const btnOpen = document.getElementById('btn-login-open');
const btnClose = document.getElementById('btn-login-close');


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