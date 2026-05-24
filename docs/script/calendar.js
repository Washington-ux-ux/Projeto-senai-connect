const monthYear = document.getElementById("monthYear");
const calendarDates = document.getElementById("calendarDates");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentDate = new Date();

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

    // espaços vazios antes do primeiro dia

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.style.background = "transparent";
        calendarDates.appendChild(empty);
    }

    // dias do mês

    for (let day = 1; day <= lastDate; day++) {

        const dayElement = document.createElement("div");

        dayElement.textContent = day;

        // dia atual

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayElement.classList.add("today");
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

renderCalendar();