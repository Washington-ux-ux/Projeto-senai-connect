async function loadEvents() {
    const eventsContainer = document.querySelector('.events-container');
    if (!eventsContainer) return;

    try {
        const postsResponse = await fetch('http://localhost:3000/api/posts');
        const posts = await postsResponse.json();

        const academicEventsResponse = await fetch('http://localhost:3000/api/academic-events');
        const academicEvents = await academicEventsResponse.json();

        const allEvents = [];

        posts.forEach(post => {
            if (post.category === 'INTERNSHIP' || post.category === 'EVENT') {
                allEvents.push({
                    type: 'post',
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

            eventCard.innerHTML = `
                <img src="./assets/images/download.jfif" alt="${event.title}">
                <h2>${event.title}</h2>
                <p>${event.description}</p>
                <p>Data: ${formattedDate}</p>
                ${event.location ? `<p>Local: ${event.location}</p>` : ''}
                <p>Categoria: ${event.category}</p>
            `;

            eventsContainer.appendChild(eventCard);
        });

    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        eventsContainer.innerHTML = '<p>Erro ao carregar eventos.</p>';
    }
}


window.addEventListener('DOMContentLoaded', loadEvents);
