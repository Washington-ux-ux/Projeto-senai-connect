const token = localStorage.getItem("token");
if (token) {
    window.location.href = "./inicio.html";
}

const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("https://projeto-senai-connect.onrender.com/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                
                window.location.href = "./inicio.html";
            } else {
                loginError.textContent = data.message || "Erro ao fazer login";
            }
        } catch (error) {
            loginError.textContent = "Erro de conexão com o servidor";
        }
    });
}
