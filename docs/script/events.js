async function loadEvents() {
    const eventsContainer = document.querySelector('.events-container');
    if (!eventsContainer) return;

    try {

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const hasAdminPrivileges = user.role === 'ADMIN' || user.role === 'DIRECTOR' || user.role === 'COORDINATOR' || 
                                      user.role === 'admin' || user.role === 'director' || user.role === 'coordinator';

        const postsResponse = await fetch('http://localhost:3000/api/posts');
        const posts = await postsResponse.json();

        const academicEventsResponse = await fetch('http://localhost:3000/api/academic-events');
        const academicEvents = await academicEventsResponse.json();

        const allEvents = [];

        posts.forEach(post => {
            if (post.category === 'INTERNSHIP' || post.category === 'EVENT' || post.category === 'PRESENTATION' || post.category === 'ANNOUNCEMENT') {
                allEvents.push({
                    type: 'post',
                    id: post.id,
                    title: post.title,
                    description: post.summary || post.content,
                    date: post.createdAt,
                    category: post.category
                });
            }
        });

        academicEvents.forEach(event => {
            allEvents.push({
                type: 'academic',
                id: event.id,
                title: event.title,
                description: event.description,
                date: event.date,
                category: event.type,
                location: event.location
            });
        });

        eventsContainer.innerHTML = '';

        if (allEvents.length === 0) {
            eventsContainer.innerHTML = '<p>Nenhum evento encontrado.</p>';
            return;
        }

        allEvents.forEach(event => {
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

            eventCard.innerHTML = `
                <img src="./assets/images/download.jfif" alt="${event.title}">
                <h2>${event.title}</h2>
                <p>${event.description}</p>
                <p>Data: ${formattedDate}</p>
                ${event.location ? `<p>Local: ${event.location}</p>` : ''}
                <p>Categoria: ${event.category}</p>
                ${deleteButton}
            `;

            eventsContainer.appendChild(eventCard);
        });

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

    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        eventsContainer.innerHTML = '<p>Erro ao carregar eventos.</p>';
    }
}


window.addEventListener('DOMContentLoaded', loadEvents);
