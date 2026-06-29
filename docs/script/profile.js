async function incluirPerfil() {
    const placeholder = document.getElementById("perfil-placeholder");
    if (!placeholder) return;

    try {
        // Detectar o contexto para usar o caminho correto
        const currentPath = window.location.pathname;
        let perfilPath = "../utils/perfil.html";
        
        // Se estiver em docs/html/utils/, usar caminho relativo local
        if (currentPath.includes('/html/utils/')) {
            perfilPath = "./perfil.html";
        }
        
        const response = await fetch(perfilPath);
        const html = await response.text();

        placeholder.innerHTML = html;

        await loadUserData();

        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                const modal = document.getElementById('changePasswordModal');
                if (modal) {
                    modal.classList.add('open');
                }
            });
        }

        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                const modal = document.getElementById('changePasswordModal');
                if (modal) {
                    modal.classList.remove('open');
                }
            });
        }

        const changePasswordForm = document.getElementById('changePasswordForm');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const currentPassword = document.getElementById('current-password-modal').value;
                const newPassword = document.getElementById('new-password-modal').value;
                const confirmPassword = document.getElementById('confirm-password-modal').value;
                const messageDiv = document.getElementById('changePasswordMessage');

                if (newPassword !== confirmPassword) {
                    messageDiv.style.color = '#ff4757';
                    messageDiv.textContent = 'As senhas não coincidem!';
                    messageDiv.style.display = 'block';
                    return;
                }

                if (newPassword.length < 6) {
                    messageDiv.style.color = '#ff4757';
                    messageDiv.textContent = 'A senha deve ter pelo menos 6 caracteres!';
                    messageDiv.style.display = 'block';
                    return;
                }

                try {
                    const token = localStorage.getItem('token');

                    const response = await fetch('http://localhost:3000/api/auth/change-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            currentPassword,
                            newPassword
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        messageDiv.style.color = '#27ae60';
                        messageDiv.textContent = data.message || 'Senha alterada com sucesso!';
                        changePasswordForm.reset();
                        setTimeout(() => {
                            const modal = document.getElementById('changePasswordModal');
                            if (modal) {
                                modal.classList.remove('open');
                            }
                        }, 2000);
                    } else {
                        messageDiv.style.color = '#ff4757';
                        messageDiv.textContent = data.error || 'Erro ao alterar senha. Verifique sua senha atual.';
                    }

                    messageDiv.style.display = 'block';
                } catch (error) {
                    messageDiv.style.color = '#ff4757';
                    messageDiv.textContent = 'Erro de conexão. Tente novamente.';
                    messageDiv.style.display = 'block';
                }
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Detectar contexto para usar o caminho correto
                const currentPath = window.location.pathname;
                let indexPath = '../../index.html';
                
                // Se estiver em docs/html/utils/, usar caminho relativo local
                if (currentPath.includes('/html/utils/')) {
                    indexPath = '../../index.html';
                }
                
                window.location.href = indexPath;
            });
        }

    } catch (error) {
        console.error("Erro ao carregar o componente de perfil:", error);
    }
}


function toggleMenu() {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("open");
}

document.addEventListener("click", function (event) {
    const container = document.getElementById("profileContainer");
    const menu = document.getElementById("profileMenu");

    if (container && menu) {
        if (!container.contains(event.target)) {
            menu.classList.remove("open");
        }
    }
});

async function loadUserData() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error("Usuário não está logado");
            if(document.getElementById('userName')) {
                document.getElementById('userName').value = "Não logado";
                document.getElementById('userRole').value = "Não logado";
                document.getElementById('userSex').value = "Não logado";
                document.getElementById('userClass').value = "Não logado";
                document.getElementById('userCreatedAt').value = "Não logado";
            }
            return;
        }

        const response = await fetch('http://localhost:3000/api/user/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados do usuário');
        }

        const data = await response.json();
        console.log('Dados do usuário recebidos:', data);

        if(document.getElementById('userName')) {
            document.getElementById('userName').value = data.name || 'Não disponível';
            
            const roleMap = {
                'ADMIN': 'Administrador',
                'COORDINATOR': 'Coordenador',
                'TEACHER': 'Professor',
                'STUDENT': 'Aluno',
                'admin': 'Administrador',
                'coordinator': 'Coordenador',
                'teacher': 'Professor',
                'student': 'Aluno'
            };
            document.getElementById('userRole').value = roleMap[data.role] || data.role || 'Não informado';
            
            document.getElementById('userSex').value = data.gender || 'Não informado';
            
            
            
            document.getElementById('userClass').value = data.course || 'Não informado';
            
            const userClassField = document.getElementById('userClass');
            const userClassLabel = userClassField?.previousElementSibling;
            if (userClassField && userClassLabel) {
                const rolesWithoutClass = ['ADMIN', 'COORDINATOR', 'TEACHER', 'admin', 'coordinator', 'teacher'];
                if (rolesWithoutClass.includes(data.role)) {
                    userClassField.style.display = 'none';
                    userClassLabel.style.display = 'none';
                } else {
                    userClassField.style.display = 'block';
                    userClassLabel.style.display = 'block';
                }
            }
            
            if (data.createdAt) {
                const createdAt = new Date(data.createdAt);
                document.getElementById('userCreatedAt').value = createdAt.toLocaleDateString('pt-BR');
            } else {
                document.getElementById('userCreatedAt').value = 'Não informado';
            }
        }
        
    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        if(document.getElementById('userName')) {
            document.getElementById('userName').value = "Erro ao carregar";
            document.getElementById('userRole').value = "-";
            document.getElementById('userSex').value = "-";
            document.getElementById('userClass').value = "-";
            document.getElementById('userCreatedAt').value = "-";
        }
    }
}

window.onload = incluirPerfil;