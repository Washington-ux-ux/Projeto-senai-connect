let allEventsData = [];
let eventsPerPage = 6;
let currentEventsPage = 1;

async function loadEvents() {
    const eventsContainer = document.querySelector('.events-container');
    if (!eventsContainer) return;

    try {

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const hasAdminPrivileges = user.role === 'ADMIN' || user.role === 'COORDINATOR' || user.role === 'admin' || user.role === 'coordinator';

        const postsResponse = await fetch('http://localhost:3000/api/posts');
        const posts = await postsResponse.json();

        const academicEventsResponse = await fetch('http://localhost:3000/api/academic-events');
        const academicEvents = await academicEventsResponse.json();

        allEventsData = [];

        posts.forEach(post => {
            if (post.category === 'INTERNSHIP' || post.category === 'EVENT' || post.category === 'PRESENTATION' || post.category === 'ANNOUNCEMENT') {
               
                const postVisibility = Array.isArray(post.visibility) ? post.visibility : [post.visibility];
                const canView = !postVisibility || 
                                postVisibility.includes('ALL') || 
                                postVisibility.includes(user.role) || 
                                user.role === 'ADMIN' || 
                                user.role === 'COORDINATOR';
                
                if (canView) {
                    allEventsData.push({
                        type: 'post',
                        id: post.id,
                        title: post.title,
                        description: post.summary || post.content,
                        date: post.eventDate || post.createdAt,
                        category: post.category,
                        imageUrl: post.imageUrl || 'aviso1.png',
                        location: post.location || 'SENAI Areias'
                    });
                }
            }
        });

        academicEvents.forEach(event => {
            allEventsData.push({
                type: 'academic',
                id: event.id,
                title: event.title,
                description: event.description,
                date: event.date,
                category: event.type,
                location: event.location
            });
        });

        allEventsData.sort((a, b) => new Date(b.date) - new Date(a.date));

        currentEventsPage = 1;
        renderEvents(eventsContainer, hasAdminPrivileges);

    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        eventsContainer.innerHTML = '<p>Erro ao carregar eventos.</p>';
    }
}

function renderEvents(eventsContainer, hasAdminPrivileges) {
    eventsContainer.innerHTML = '';

    if (allEventsData.length === 0) {
        eventsContainer.innerHTML = '<p>Nenhum evento encontrado.</p>';
        return;
    }

    const startIndex = 0;
    const endIndex = currentEventsPage * eventsPerPage;
    const eventsToShow = allEventsData.slice(startIndex, endIndex);

    eventsToShow.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        const formattedDate = new Date(event.date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        let deleteButton = '';
        if (hasAdminPrivileges && (event.type === 'post' || event.type === 'academic')) {
            deleteButton = `<button class="btn-delete-event" data-id="${event.id}" data-type="${event.type}">Excluir</button>`;
        }

        const imageUrl = event.type === 'post' ? event.imageUrl : 'aviso1.png';
        eventCard.innerHTML = `
            <img src="./assets/images/${imageUrl}" alt="${event.title}">
            <h2>${event.title}</h2>
            <p>${event.description}</p>
            <p>Data: ${formattedDate}</p>
            ${event.location ? `<p>Local: ${event.location}</p>` : ''}
            <p>Categoria: ${event.category}</p>
            ${deleteButton}
        `;

        eventsContainer.appendChild(eventCard);
    });

  
    if (allEventsData.length > eventsPerPage * currentEventsPage) {
        const loadMoreButton = document.createElement('button');
        loadMoreButton.className = 'btn-load-more';
        loadMoreButton.textContent = 'Mostrar mais eventos';
        loadMoreButton.addEventListener('click', () => {
            currentEventsPage++;
            renderEvents(eventsContainer, hasAdminPrivileges);
        });
        eventsContainer.appendChild(loadMoreButton);
    }

    if (hasAdminPrivileges) {
        const deleteButtons = document.querySelectorAll('.btn-delete-event');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const eventId = button.getAttribute('data-id');
                const eventType = button.getAttribute('data-type');
                
                if (confirm('Tem certeza que deseja excluir este post/evento?')) {
                    const token = localStorage.getItem('token');
                    
                    try {
                        let apiUrl;
                        if (eventType === 'post') {
                            apiUrl = `http://localhost:3000/api/posts/${eventId}`;
                        } else if (eventType === 'academic') {
                            apiUrl = `http://localhost:3000/api/academic-events/${eventId}`;
                        } else {
                            alert('Tipo de evento desconhecido');
                            return;
                        }

                        const response = await fetch(apiUrl, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (response.ok) {
                            alert('Post/Evento excluído com sucesso!');
                            loadEvents(); 
                        } else {
                            const data = await response.json();
                            alert(data.message || 'Erro ao excluir post/evento');
                        }
                    } catch (error) {
                        alert('Erro de conexão com o servidor');
                    }
                }
            });
        });
    }
}


window.addEventListener('DOMContentLoaded', loadEvents);
