(function() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.style.setProperty('--color-background', '#1a1a2e');
        document.documentElement.style.setProperty('--color-text', '#e0e0e0');
        document.documentElement.style.setProperty('background-color', '#1a1a2e');
        document.documentElement.style.setProperty('color', '#e0e0e0');
    }
})();
