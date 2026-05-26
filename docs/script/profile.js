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
        const mockFetch = () => new Promise(resolve => 
            setTimeout(() => resolve({
                name: "Ana Beatriz Silva",
                sex: "Feminino",
                birth: "14/05/2005",
                class: "3º Ano - Técnico em Informática"
            }), 800)
        );

        const data = await mockFetch();

        if(document.getElementById('userName')) {
            document.getElementById('userName').value = data.name;
            document.getElementById('userSex').value = data.sex;
            document.getElementById('userBirth').value = data.birth;
            document.getElementById('userClass').value = data.class;
        }
        
    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
    }
}

window.onload = incluirPerfil;