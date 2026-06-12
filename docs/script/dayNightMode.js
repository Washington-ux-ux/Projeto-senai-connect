const sunIcon = document.querySelector(".fa-sun");
const moonIcon = document.querySelector(".fa-moon");
const body = document.body;
const html = document.documentElement;
const connectLogo = document.querySelector('img[alt="Logo do senai connect"]');
const lightLogoSrc = "./assets/images/senai-connect.png";
const darkLogoSrc = "./assets/images/connectDark.png";

const currentTheme = localStorage.getItem("theme") || "light";

function updateLogoTheme() {
  if (!connectLogo) return;
  connectLogo.src = html.classList.contains("dark-mode")
    ? darkLogoSrc
    : lightLogoSrc;
}

if (currentTheme === "dark") {
  html.classList.add("dark-mode");
  body.classList.add("dark-mode");
  sunIcon.style.display = "block";
  moonIcon.style.display = "none";
} else {
  sunIcon.style.display = "none";
  moonIcon.style.display = "block";
}

updateLogoTheme();

sunIcon.addEventListener("click", () => {
  html.classList.remove("dark-mode");
  body.classList.remove("dark-mode");
  html.style.removeProperty('--color-background');
  html.style.removeProperty('--color-text');
  html.style.removeProperty('background-color');
  html.style.removeProperty('color');
  localStorage.setItem("theme", "light");
  sunIcon.style.display = "none";
  moonIcon.style.display = "block";
  updateLogoTheme();
});

moonIcon.addEventListener("click", () => {
  html.classList.add("dark-mode");
  body.classList.add("dark-mode");
  localStorage.setItem("theme", "dark");
  moonIcon.style.display = "none";
  sunIcon.style.display = "block";
  updateLogoTheme();
});
