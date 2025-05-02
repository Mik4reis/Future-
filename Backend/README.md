# 🔐 Future- Backend | API de Autenticação com Django + JWT

Este repositório contém o backend do projeto **Future-**, desenvolvido com **Django REST Framework**, que fornece endpoints seguros de **registro e login** usando autenticação por **JWT (JSON Web Tokens)**.

---

## 🧩 Tecnologias Utilizadas

- Python 3.11+
- Django 4.x
- Django REST Framework
- djangorestframework-simplejwt
- drf-yasg (Swagger)
- django-cors-headers

---

## ⚙️ Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/Mik4reis/Future-.git
cd Future-/Backend
```

---

### 2. Criar e ativar o ambiente virtual

```bash
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Linux/macOS
```

---

### 3. Instalar dependências

```bash
pip install -r requirements.txt
```

---

### 4. Aplicar as migrações

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 5. Criar superusuário (opcional)

```bash
python manage.py createsuperuser
```

---

### 6. Iniciar o servidor

```bash
python manage.py runserver
```

Acesse em: [http://localhost:8000/swagger/](http://localhost:8000/swagger/) para usar a documentação interativa.

---

## 🔑 Endpoints Principais

| Rota             | Método | Descrição                   |
|------------------|--------|-----------------------------|
| `/api/register/` | POST   | Cadastra novo usuário       |
| `/api/login/`    | POST   | Gera tokens JWT (login)     |

---

## 🧪 Exemplo de Login (POST `/api/login/`)

### Requisição:
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

### Resposta:
```json
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token"
}
```

Use o token `access` para autenticar outras requisições protegidas.

---

## 🔐 Segurança

- Autenticação JWT (sem sessão)
- Tokens curtos + token de refresh
- Proteção CORS via `django-cors-headers`

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---