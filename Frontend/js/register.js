document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const data = {
      email: document.getElementById("email").value,
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      first_name: document.getElementById("firstName").value,
      last_name: document.getElementById("lastName").value,
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        document.getElementById("registerMessage").textContent = "Cadastro realizado com sucesso! Redirecionando...";
        
        // Aguarda 1.5 segundos e redireciona para login
        setTimeout(() => {
          window.location.href = "../Pages/login.html"; // ou "../Pages/login.html" se necessário
        }, 500);
      } else {
        document.getElementById("registerMessage").textContent =
          `Erro: ${result.detail || "verifique os dados preenchidos"}`;
      }
    } catch (err) {
      document.getElementById("registerMessage").textContent = "Erro de conexão.";
      console.error(err);
    }
  });
  