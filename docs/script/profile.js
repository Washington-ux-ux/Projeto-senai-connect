async function incluirPerfil() {
    const placeholder = document.getElementById("perfil-placeholder");
    if (!placeholder) return; 

    try {
        const response = await fetch("perfil.html");
        const html = await response.text();
     
        placeholder.innerHTML = html;

        await loadUserData();
        
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
                document.getElementById('userSex').value = "-";
                document.getElementById('userBirth').value = "-";
                document.getElementById('userClass').value = "-";
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
            document.getElementById('userSex').value = 'Não informado';
            document.getElementById('userBirth').value = 'Não informado';
            document.getElementById('userClass').value = data.course || 'Não informado';
        }
        
    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        if(document.getElementById('userName')) {
            document.getElementById('userName').value = "Erro ao carregar";
            document.getElementById('userSex').value = "-";
            document.getElementById('userBirth').value = "-";
            document.getElementById('userClass').value = "-";
        }
    }
}

window.onload = incluirPerfil;