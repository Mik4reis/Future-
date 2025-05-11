document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const msg = document.getElementById("loginMessage");
  msg.classList.remove("error", "success");

  const data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      msg.textContent = "Login realizado! Redirecionando...";
      msg.classList.add("success");

      setTimeout(() => {
        window.location.href = "../doacao.html";
      }, 1000);
    } else {
      msg.textContent = `Erro: ${result.detail || "credenciais inválidas"}`;
      msg.classList.add("error");
    }
  } catch (err) {
    msg.textContent = "Erro de conexão.";
    msg.classList.add("error");
    console.error(err);
  }
});
