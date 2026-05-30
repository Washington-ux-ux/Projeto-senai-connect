document.addEventListener('DOMContentLoaded', () => {
    const btnAddLink = document.getElementById('btn-add-link');
    const addLinkModal = document.getElementById('add-link-modal');
    const btnAddLinkClose = document.getElementById('btn-add-link-close');
    const addLinkForm = document.getElementById('add-link-form');
    const addLinkError = document.getElementById('add-link-error');
    const linksTable = document.getElementById('links-table');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const hasAdminPrivileges = user.role === 'ADMIN' || user.role === 'DIRECTOR' || user.role === 'COORDINATOR' || 
                                  user.role === 'admin' || user.role === 'director' || user.role === 'coordinator';

    if (hasAdminPrivileges && btnAddLink) {
        btnAddLink.style.display = 'block';
    }

    loadLinks();

    if (btnAddLink) {
        btnAddLink.addEventListener('click', () => {
            addLinkModal.classList.add('active');
        });
    }

    if (btnAddLinkClose) {
        btnAddLinkClose.addEventListener('click', () => {
            addLinkModal.classList.remove('active');
            addLinkForm.reset();
            addLinkError.textContent = '';
        });
    }

    if (addLinkForm) {
        addLinkForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const linkData = {
                name: document.getElementById('link-name').value,
                description: document.getElementById('link-description').value,
                url: document.getElementById('link-url').value
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/links', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(linkData)
                });

                const data = await response.json();

                if (response.ok) {
                    addLinkModal.classList.remove('active');
                    addLinkForm.reset();
                    addLinkError.textContent = '';
                    alert('Link adicionado com sucesso!');
                   
                    window.location.reload();
                } else {
                    addLinkError.textContent = data.message || 'Erro ao adicionar link';
                }
            } catch (error) {
                addLinkError.textContent = 'Erro de conexão com o servidor';
            }
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === addLinkModal) {
            addLinkModal.classList.remove('active');
            addLinkForm.reset();
            addLinkError.textContent = '';
        }
    });
});

async function loadLinks() {
    const linksTable = document.getElementById('links-table');
    if (!linksTable) return;

    try {
        const response = await fetch('http://localhost:3000/api/links');
        const links = await response.json();
        
        const headerRow = linksTable.querySelector('tr');
        linksTable.innerHTML = '';
        if (headerRow) {
            linksTable.appendChild(headerRow);
        }

        links.forEach(link => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${link.name}</td>
                <td>${link.description}</td>
                <td><a href="${link.url}" target="_blank" rel="noopener noreferrer">Acessar</a></td>
            `;
            linksTable.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar links:', error);
    }
}
