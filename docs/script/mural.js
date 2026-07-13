document.addEventListener('DOMContentLoaded', () => {
    const btnAddLink = document.getElementById('btn-add-link');
    const addLinkModal = document.getElementById('add-link-modal');
    const btnAddLinkClose = document.getElementById('btn-add-link-close');
    const addLinkForm = document.getElementById('add-link-form');
    const addLinkError = document.getElementById('add-link-error');
    const linksTable = document.getElementById('links-table');
    const editLinkModal = document.getElementById('edit-link-modal');
    const btnEditLinkClose = document.getElementById('btn-edit-link-close');
    const editLinkForm = document.getElementById('edit-link-form');
    const editLinkError = document.getElementById('edit-link-error');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const hasAdminPrivileges = user.role === 'ADMIN' || user.role === 'COORDINATOR' || 
                                  user.role === 'admin' || user.role === 'coordinator';

    if (hasAdminPrivileges && btnAddLink) {
        btnAddLink.style.display = 'block';
    }

    window.currentPage = 1;
    window.itemsPerPage = 10;
    window.allLinks = [];

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

    if (btnEditLinkClose) {
        btnEditLinkClose.addEventListener('click', () => {
            editLinkModal.classList.remove('active');
            editLinkForm.reset();
            editLinkError.textContent = '';
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
                const response = await fetch(`${window.API_BASE_URL}/api/links`, {
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

    if (editLinkForm) {
        editLinkForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const linkId = document.getElementById('edit-link-id').value;
            const linkData = {
                name: document.getElementById('edit-link-name').value,
                description: document.getElementById('edit-link-description').value,
                url: document.getElementById('edit-link-url').value
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${window.API_BASE_URL}/api/links/${linkId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(linkData)
                });

                const data = await response.json();

                if (response.ok) {
                    editLinkModal.classList.remove('active');
                    editLinkForm.reset();
                    editLinkError.textContent = '';
                    alert('Link atualizado com sucesso!');
                    loadLinks();
                } else {
                    editLinkError.textContent = data.message || 'Erro ao atualizar link';
                }
            } catch (error) {
                editLinkError.textContent = 'Erro de conexão com o servidor';
            }
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === addLinkModal) {
            addLinkModal.classList.remove('active');
            addLinkForm.reset();
            addLinkError.textContent = '';
        }
        if (event.target === editLinkModal) {
            editLinkModal.classList.remove('active');
            editLinkForm.reset();
            editLinkError.textContent = '';
        }
    });
});

async function loadLinks() {
    const linksTable = document.getElementById('links-table');
    if (!linksTable) return;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const hasAdminPrivileges = user.role === 'ADMIN' || user.role === 'COORDINATOR' ||
                                  user.role === 'admin' || user.role === 'coordinator';

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/links`);
        const links = await response.json();

        window.allLinks = links.sort((a, b) => a.name.localeCompare(b.name));

        const headerRow = linksTable.querySelector('tr');
        linksTable.innerHTML = '';

        if (headerRow) {
            const newHeaderRow = document.createElement('tr');
            if (hasAdminPrivileges) {
                newHeaderRow.innerHTML = `
                    <th>#</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Link</th>
                    <th>Ações</th>
                `;
            } else {
                newHeaderRow.innerHTML = `
                    <th>#</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Link</th>
                `;
            }
            linksTable.appendChild(newHeaderRow);
        }

        const startIndex = (window.currentPage - 1) * window.itemsPerPage;
        const endIndex = startIndex + window.itemsPerPage;
        const paginatedLinks = window.allLinks.slice(startIndex, endIndex);

        paginatedLinks.forEach((link, index) => {
            const row = document.createElement('tr');
            if (hasAdminPrivileges) {
                row.innerHTML = `
                    <td>${startIndex + index + 1}</td>
                    <td>${link.name}</td>
                    <td>${link.description}</td>
                    <td><a href="${link.url}" target="_blank" rel="noopener noreferrer">Acessar</a></td>
                    <td class="actions-cell">
                        <button class="btn-edit-link" data-id="${link.id}">Editar</button>
                        <button class="btn-delete-link" data-id="${link.id}">Excluir</button>
                    </td>
                `;
            } else {
                row.innerHTML = `
                    <td>${startIndex + index + 1}</td>
                    <td>${link.name}</td>
                    <td>${link.description}</td>
                    <td><a href="${link.url}" target="_blank" rel="noopener noreferrer">Acessar</a></td>
                `;
            }
            linksTable.appendChild(row);
        });

        renderPagination(window.allLinks.length, hasAdminPrivileges);

        if (hasAdminPrivileges) {
            const editButtons = document.querySelectorAll('.btn-edit-link');
            const deleteButtons = document.querySelectorAll('.btn-delete-link');

            editButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const linkId = button.getAttribute('data-id');
                    openEditModal(linkId);
                });
            });

            deleteButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const linkId = button.getAttribute('data-id');

                    if (typeof openDeleteConfirmModal === 'function') {
                        openDeleteConfirmModal(linkId, 'link', async (id, type) => {
                            const token = localStorage.getItem('token');

                            try {
                                const response = await fetch(`${window.API_BASE_URL}/api/links/${id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });

                                if (response.ok) {
                                    window.currentPage = 1;
                                    loadLinks();
                                } else {
                                    const data = await response.json();
                                    alert(data.message || 'Erro ao excluir link');
                                }
                            } catch (error) {
                                alert('Erro de conexão com o servidor');
                            }
                        });
                    }
                });
            });
        }
    } catch (error) {
        console.error('Erro ao carregar links:', error);
    }
}

function renderPagination(totalItems, hasAdminPrivileges) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(totalItems / window.itemsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <button id="prev-page" ${window.currentPage === 1 ? 'disabled' : ''}>Anterior</button>
        <span class="page-info">Página ${window.currentPage} de ${totalPages}</span>
        <button id="next-page" ${window.currentPage === totalPages ? 'disabled' : ''}>Próxima</button>
    `;

    pagination.innerHTML = paginationHTML;

    document.getElementById('prev-page').addEventListener('click', () => {
        if (window.currentPage > 1) {
            window.currentPage--;
            loadLinks();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (window.currentPage < totalPages) {
            window.currentPage++;
            loadLinks();
        }
    });
}

async function openEditModal(linkId) {
    const editLinkModal = document.getElementById('edit-link-modal');
    const editLinkForm = document.getElementById('edit-link-form');
    
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/links`);
        const links = await response.json();
        const link = links.find(l => l.id === linkId);
        
        if (link) {
            document.getElementById('edit-link-id').value = link.id;
            document.getElementById('edit-link-name').value = link.name;
            document.getElementById('edit-link-description').value = link.description;
            document.getElementById('edit-link-url').value = link.url;
            editLinkModal.classList.add('active');
        }
    } catch (error) {
        console.error('Erro ao carregar link:', error);
    }
}
