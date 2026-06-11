const sunIcon = document.querySelector(".fa-sun");
const moonIcon = document.querySelector(".fa-moon");
const body = document.body;
const connectLogo = document.querySelector('img[alt="Logo do senai connect"]');
const lightLogoSrc = "./assets/images/senai-connect.png";
const darkLogoSrc = "./assets/images/connectDark.png";

const currentTheme = localStorage.getItem("theme") || "light";

function updateLogoTheme() {
  if (!connectLogo) return;
  connectLogo.src = body.classList.contains("dark-mode")
    ? darkLogoSrc
    : lightLogoSrc;
}

if (currentTheme === "dark") {
  body.classList.add("dark-mode");
  sunIcon.style.display = "block";
  moonIcon.style.display = "none";
} else {
  sunIcon.style.display = "none";
  moonIcon.style.display = "block";
}

updateLogoTheme();

sunIcon.addEventListener("click", () => {
  body.classList.remove("dark-mode");
  localStorage.setItem("theme", "light");
  sunIcon.style.display = "none";
  moonIcon.style.display = "block";
  updateLogoTheme();
});

moonIcon.addEventListener("click", () => {
  body.classList.add("dark-mode");
  localStorage.setItem("theme", "dark");
  moonIcon.style.display = "none";
  sunIcon.style.display = "block";
  updateLogoTheme();
});
