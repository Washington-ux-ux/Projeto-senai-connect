const token = localStorage.getItem("token");
if (token) {
    window.location.href = "./html/pages/inicio.html";
}

const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const matricula = document.getElementById("matricula").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:3000/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ matricula, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                window.location.href = "./html/pages/inicio.html";
            } else {
                loginError.textContent = data.message || "Email ou senha incorretos";
                loginError.style.display = "block";
            }
        } catch (error) {
            loginError.textContent = "Erro de conexão com o servidor";
            loginError.style.display = "block";
        }
    });
}
