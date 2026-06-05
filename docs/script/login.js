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
    console.log('Usuário logado:', user);
    console.log('Role do usuário:', user.role);
    const hasAdminPrivileges = user.role === 'ADMIN' || user.role === 'COORDINATOR' || 
                                  user.role === 'admin' || user.role === 'coordinator';
    console.log('Tem privilégios de admin?', hasAdminPrivileges);
    
    let dropdownContent = '';
    
    if (hasAdminPrivileges) {
        dropdownContent = `
            <a href="#" id="btn-create-post">Criar Post/Evento</a>
            <a href="#" id="btn-create-user">Registrar Novo Usuário</a>
            <a href="#" id="btn-logout">Sair</a>
        `;
    } else {
        dropdownContent = `
            <a href="#" id="btn-logout">Sair</a>
        `;
    }
    
    loginContainer.innerHTML = `
        <div class="user-menu">
            <button id="btn-user-menu" class="btn-nav-user">
                <i class="fa-solid fa-user"></i>
                <span>${user.name || 'Usuário'}</span>
            </button>
            <div id="user-dropdown" class="dropdown-menu">
                ${dropdownContent}
            </div>
        </div>
        
        <!-- Modal para criar post/evento -->
        <div id="create-post-modal" class="modal-overlay">
            <div class="modal-box">
                <span id="btn-create-post-close" class="close-btn">&times;</span>
                <h2>Criar Post/Evento</h2>
                <form id="create-post-form">
                    <div class="input-group">
                        <label>Selecione a imagem:</label>
                        <div class="image-selector">
                            <label class="image-checkbox">
                                <input type="checkbox" name="post-image" value="aviso1.png" checked>
                                <img src="./assets/images/aviso1.png" alt="Aviso 1">
                                <span>Aviso 1</span>
                            </label>
                            <label class="image-checkbox">
                                <input type="checkbox" name="post-image" value="aviso2.png">
                                <img src="./assets/images/aviso2.png" alt="Aviso 2">
                                <span>Aviso 2</span>
                            </label>
                            <label class="image-checkbox">
                                <input type="checkbox" name="post-image" value="aviso3.png">
                                <img src="./assets/images/aviso3.png" alt="Aviso 3">
                                <span>Aviso 3</span>
                            </label>
                        </div>
                    </div>
                    <div class="input-group">
                        <input type="text" id="post-title" placeholder="Título" required>
                    </div>
                    <div class="input-group">
                        <textarea id="post-summary" placeholder="Aviso" required></textarea>
                    </div>
                    <div class="input-group">
                        <label>Data do evento:</label>
                        <input type="date" id="post-date" required>
                    </div>
                    <div class="input-group">
                        <label>Local do evento:</label>
                        <input type="text" id="post-location" value="SENAI Areias">
                    </div>
                    <div class="input-group">
                        <label>Selecione a categoria:</label>
                        <div class="category-selector">
                            <label class="category-checkbox">
                                <input type="checkbox" name="post-category" value="EVENT" checked>
                                <span>Evento</span>
                            </label>
                            <label class="category-checkbox">
                                <input type="checkbox" name="post-category" value="INTERNSHIP">
                                <span>Estágio</span>
                            </label>
                            <label class="category-checkbox">
                                <input type="checkbox" name="post-category" value="PRESENTATION">
                                <span>Apresentação</span>
                            </label>
                            <label class="category-checkbox">
                                <input type="checkbox" name="post-category" value="ANNOUNCEMENT">
                                <span>Anúncio</span>
                            </label>
                        </div>
                    </div>
                    <label>Selecione a visibilidade:</label>
                    <div class="visibility-container">
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="post-visibility" value="ALL">
                            <span>Todos</span>
                        </label>
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="post-visibility" value="STUDENT">
                            <span>Alunos</span>
                        </label>
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="post-visibility" value="TEACHER">
                            <span>Professores</span>
                        </label>
                        <label class="visibility-checkbox">
                            <input type="checkbox" name="post-visibility" value="COORDINATOR">
                            <span>Coordenadores</span>
                        </label>
                    </div>
                    <button type="submit" class="btn-submit">Criar</button>
                </form>
                <p id="create-post-error" class="error-message"></p>
            </div>
        </div>
        
        <!-- Modal para criar aluno -->
        <div id="create-user-modal" class="modal-overlay">
            <div class="modal-box">
                <span id="btn-create-user-close" class="close-btn">&times;</span>
                <h2>Registrar Novo Usuário</h2>
                <form id="create-user-form">
                    <div class="input-group">
                        <input type="text" id="user-name" placeholder="Nome completo" required>
                    </div>
                    <div class="input-group">
                        <input type="email" id="user-email" placeholder="E-mail" required>
                    </div>
                    <div class="input-group">
                        <input type="password" id="user-password" placeholder="Senha" required>
                    </div>
                    <div class="input-group">
                        <input type="text" id="user-cpf" placeholder="CPF" required>
                    </div>
                    <div class="input-group">
                        <input type="text" id="user-registration" placeholder="Matrícula" required>
                    </div>
                    <div class="input-group">
                        <select id="user-role" required>
                            <option value="">Selecione o cargo</option>
                            <option value="STUDENT">Aluno</option>
                            <option value="TEACHER">Professor</option>
                            <option value="COORDINATOR">Coordenador</option>
                        </select>
                    </div>
                    <div class="input-group" id="user-course-group">
                        <input type="text" id="user-course" placeholder="Curso">
                    </div>
                    <div class="input-group">
                        <select id="user-gender">
                            <option value="">Selecione o sexo</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                            <option value="Não informado">Não informado</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <input type="date" id="user-birthdate" placeholder="Data de Nascimento">
                    </div>
                    <button type="submit" class="btn-submit">Criar</button>
                </form>
                <p id="create-user-error" class="error-message"></p>
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

    if (hasAdminPrivileges) {
        const btnCreatePost = document.getElementById('btn-create-post');
        const btnCreateUser = document.getElementById('btn-create-user');
        const createPostModal = document.getElementById('create-post-modal');
        const createUserModal = document.getElementById('create-user-modal');
        const btnCreatePostClose = document.getElementById('btn-create-post-close');
        const btnCreateUserClose = document.getElementById('btn-create-user-close');
        const createPostForm = document.getElementById('create-post-form');
        const createUserForm = document.getElementById('create-user-form');
        const createPostError = document.getElementById('create-post-error');
        const createUserError = document.getElementById('create-user-error');

        btnCreatePost.addEventListener('click', (e) => {
            e.preventDefault();
            userDropdown.classList.remove('active');
            createPostModal.classList.add('active');
            
            // Preencher data de hoje automaticamente
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('post-date').value = today;
        });

        btnCreateUser.addEventListener('click', (e) => {
            e.preventDefault();
            userDropdown.classList.remove('active');
            createUserModal.classList.add('active');
        });

        btnCreatePostClose.addEventListener('click', () => {
            createPostModal.classList.remove('active');
            createPostForm.reset();
            createPostError.textContent = '';
        });


        const visibilityCheckboxes = document.querySelectorAll('input[name="post-visibility"]');
        visibilityCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.value === 'ALL' && e.target.checked) {
                    visibilityCheckboxes.forEach(cb => {
                        if (cb.value !== 'ALL') {
                            cb.checked = false;
                        }
                    });
                } else if (e.target.value !== 'ALL' && e.target.checked) {

                    const allCheckbox = document.querySelector('input[name="post-visibility"][value="ALL"]');
                    if (allCheckbox) {
                        allCheckbox.checked = false;
                    }
                }
            });
        });

       
        const imageCheckboxes = document.querySelectorAll('input[name="post-image"]');
        imageCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    imageCheckboxes.forEach(cb => {
                        if (cb !== e.target) {
                            cb.checked = false;
                        }
                    });
                }
            });
        });

       
        const categoryCheckboxes = document.querySelectorAll('input[name="post-category"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    categoryCheckboxes.forEach(cb => {
                        if (cb !== e.target) {
                            cb.checked = false;
                        }
                    });
                }
            });
        });

        btnCreateUserClose.addEventListener('click', () => {
            createUserModal.classList.remove('active');
            createUserForm.reset();
            createUserError.textContent = '';
        });

      
        const userRoleSelect = document.getElementById('user-role');
        const userCourseGroup = document.getElementById('user-course-group');
        
        if (userRoleSelect && userCourseGroup) {
            const toggleCourseField = () => {
                const selectedRole = userRoleSelect.value;
                if (selectedRole === 'STUDENT') {
                    userCourseGroup.style.display = 'block';
                    document.getElementById('user-course').required = true;
                } else {
                    userCourseGroup.style.display = 'none';
                    document.getElementById('user-course').required = false;
                    document.getElementById('user-course').value = '';
                }
            };
            
            userRoleSelect.addEventListener('change', toggleCourseField);
            toggleCourseField(); 
        }

        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const token = localStorage.getItem('token');
            const visibilityCheckboxes = document.querySelectorAll('input[name="post-visibility"]:checked');
            const visibilityArray = Array.from(visibilityCheckboxes).map(cb => cb.value);
            
            if (visibilityArray.length === 0) {
                createPostError.textContent = 'Selecione pelo menos uma visibilidade';
                return;
            }
            
            const selectedImageCheckbox = document.querySelector('input[name="post-image"]:checked');
            const selectedImage = selectedImageCheckbox ? selectedImageCheckbox.value : 'aviso1.png';
            
            const selectedCategoryCheckbox = document.querySelector('input[name="post-category"]:checked');
            const selectedCategory = selectedCategoryCheckbox ? selectedCategoryCheckbox.value : 'EVENT';
            
            const postData = {
                title: document.getElementById('post-title').value,
                summary: document.getElementById('post-summary').value,
                category: selectedCategory,
                visibility: visibilityArray,
                imageUrl: selectedImage,
                eventDate: document.getElementById('post-date').value,
                location: document.getElementById('post-location').value
            };

            try {
                const response = await fetch('http://localhost:3000/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(postData)
                });

                const data = await response.json();

                if (response.ok) {
                    createPostModal.classList.remove('active');
                    createPostForm.reset();
                    createPostError.textContent = '';
                    alert('Post/Evento criado com sucesso!');
                    if (window.location.pathname.includes('eventos.html')) {
                        window.location.reload();
                    }
                } else {
                    createPostError.textContent = data.message || 'Erro ao criar post/evento';
                }
            } catch (error) {
                createPostError.textContent = 'Erro de conexão com o servidor';
            }
        });

        createUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userData = {
                name: document.getElementById('user-name').value,
                email: document.getElementById('user-email').value,
                password: document.getElementById('user-password').value,
                cpf: document.getElementById('user-cpf').value,
                registration: document.getElementById('user-registration').value,
                role: document.getElementById('user-role').value,
                course: document.getElementById('user-course').value,
                gender: document.getElementById('user-gender').value,
                birthdate: document.getElementById('user-birthdate').value
            };

            try {
                const response = await fetch('http://localhost:3000/api/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();

                if (response.ok) {
                    createUserModal.classList.remove('active');
                    createUserForm.reset();
                    createUserError.textContent = '';
                    alert('Usuário registrado com sucesso!');
                } else {
                    createUserError.textContent = data.message || 'Erro ao registrar usuário';
                }
            } catch (error) {
                createUserError.textContent = 'Erro de conexão com o servidor';
            }
        });

        window.addEventListener('click', (event) => {
            if (event.target === createPostModal) {
                createPostModal.classList.remove('active');
                createPostForm.reset();
                createPostError.textContent = '';
            }
            if (event.target === createUserModal) {
                createUserModal.classList.remove('active');
                createUserForm.reset();
                createUserError.textContent = '';
            }
        });
    }

    window.addEventListener('click', (event) => {
        if (!event.target.closest('.user-menu')) {
            userDropdown.classList.remove('active');
        }
    });
}