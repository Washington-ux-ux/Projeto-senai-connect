const monthYear = document.getElementById("monthYear");
const calendarDates = document.getElementById("calendarDates");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentDate = new Date();
let eventsData = [];
let modifiedWeekendDays = JSON.parse(localStorage.getItem('modifiedWeekendDays') || '{}');

async function loadEvents() {
    try {
        const response = await fetch('https://projeto-senai-connect.onrender.com/api/posts');
        const posts = await response.json();
        
        eventsData = posts.filter(post => 
            post.category === 'EVENT' || post.category === 'ANNOUNCEMENT'
        ).map(post => ({
            date: post.eventDate || post.createdAt,
            title: post.title,
            summary: post.summary
        }));
        
        renderCalendar();
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
    }
}

function renderCalendar() {

    calendarDates.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const lastDate = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    const monthNames = [
        "Janeiro", "Fevereiro", "Março",
        "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro",
        "Outubro", "Novembro", "Dezembro"
    ];

    monthYear.textContent = `${monthNames[month]} ${year}`;

   

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.style.background = "transparent";
        calendarDates.appendChild(empty);
    }


    for (let day = 1; day <= lastDate; day++) {

        const dayElement = document.createElement("div");

        dayElement.textContent = day;

        const dayOfWeek = new Date(year, month, day).getDay();
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const isModifiedNormal = modifiedWeekendDays[dateString] === 'normal';

        if ((dayOfWeek === 0 || dayOfWeek === 6) && !isModifiedNormal) {
            dayElement.classList.add("weekend");
        }

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayElement.classList.add("today");
        }

        const dayEvents = eventsData.filter(event => {
            const eventDate = event.date.split('T')[0];
            return eventDate === dateString;
        });

        if (dayEvents.length > 0) {
            dayElement.classList.add("event-day");
            const eventIndicator = document.createElement("span");
            eventIndicator.className = "event-indicator";
            eventIndicator.innerHTML = "★";
            dayElement.appendChild(eventIndicator);

            dayElement.title = dayEvents.map(e => `${e.title}: ${e.summary}`).join('\n');
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const hasAdminPrivileges =
            user.role === "ADMIN" ||
            user.role === "COORDINATOR" ||
            user.role === "admin" ||
            user.role === "coordinator";

        if (hasAdminPrivileges && (dayOfWeek === 0 || dayOfWeek === 6)) {
            dayElement.style.cursor = "pointer";
            dayElement.title = isModifiedNormal ? 
                "Clique para marcar como fim de semana" : 
                "Clique para marcar como dia normal";
            
            dayElement.addEventListener("click", () => {
                if (isModifiedNormal) {
                    delete modifiedWeekendDays[dateString];
                } else {
                    modifiedWeekendDays[dateString] = 'normal';
                }
                localStorage.setItem('modifiedWeekendDays', JSON.stringify(modifiedWeekendDays));
                renderCalendar();
            });
        }

        calendarDates.appendChild(dayElement);
    }
}

prevMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

loadEvents();