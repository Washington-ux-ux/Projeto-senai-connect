const sunIcon = document.querySelector('.fa-sun');
const moonIcon = document.querySelector('.fa-moon');
const body = document.body;


const currentTheme = localStorage.getItem('theme') || 'light';


if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
} else {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
}


sunIcon.addEventListener('click', () => {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
});

    
moonIcon.addEventListener('click', () => {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
});
