const sunIcon = document.querySelector(".fa-sun");
const moonIcon = document.querySelector(".fa-moon");
const body = document.body;
const html = document.documentElement;
const lightLogoSrc = "../../assets/images/senai-connect.png";
const darkLogoSrc = "../../assets/images/connectDark.png";
const currentTheme = localStorage.getItem("theme") || "light";

function getConnectLogo() {
  return document.getElementById("connect-logo");
}

function updateLogoTheme() {
  const connectLogo = getConnectLogo();
  if (!connectLogo) return;
  const isDarkMode = html.classList.contains("dark-mode");
  const correctSrc = isDarkMode ? darkLogoSrc : lightLogoSrc;
  
  if (connectLogo.src !== correctSrc) {
    connectLogo.src = correctSrc;
  }
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

document.addEventListener("DOMContentLoaded", () => {
  updateLogoTheme();
});

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
