const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginBtn = document.getElementById("loginBtn");
const loading = document.getElementById("loading");
const btnText = document.getElementById("btnText");
const successMessage = document.getElementById("successMessage");

// Usuarios demo para prueba
const demoUsers = [
  { email: "admin@test.com", password: "123456", name: "Administrador" },
  { email: "user@test.com", password: "password", name: "Usuario Demo" },
  { email: "demo", password: "demo", name: "Usuario Demo" },
];

// ===============================
//  FUNCIONES UTILITARIAS
// ===============================

/**
 * Muestra un mensaje de error en el campo especificado
 * @param {string} field - ID del campo
 * @param {string} message - Mensaje de error
 */
function showError(field, message) {
  const input = document.getElementById(field);
  const errorDiv = document.getElementById(field + "Error");

  input.classList.add("error");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

/**
 * Limpia los errores del campo especificado
 * @param {string} field - ID del campo
 */
function clearError(field) {
  const input = document.getElementById(field);
  const errorDiv = document.getElementById(field + "Error");

  input.classList.remove("error");
  errorDiv.style.display = "none";
}

/**
 * Valida si un email tiene formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


async function performLogin(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = demoUsers.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (user) {
        resolve({ success: true, user: user });
      } else {
        resolve({ success: false, message: "Email o contraseña incorrectos" });
      }
    }, 1500);
  });
}

// ===============================
//  EVENT LISTENERS
// ===============================

// Toggle mostrar/ocultar contraseña
togglePassword.addEventListener("click", function () {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  this.textContent = type === "password" ? "O" : "X";
});

// Validación en tiempo real
emailInput.addEventListener("input", function () {
  clearError("email");
});

passwordInput.addEventListener("input", function () {
  clearError("password");
});

// Manejo del formulario de login
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  let hasErrors = false;

  // Limpiar errores previos
  clearError("email");
  clearError("password");

  // Validaciones
  if (!email) {
    showError("email", "Por favor ingresa tu email o usuario");
    hasErrors = true;
  } else if (email.includes("@") && !isValidEmail(email)) {
    showError("email", "Por favor ingresa un email válido");
    hasErrors = true;
  }

  if (!password) {
    showError("password", "Por favor ingresa tu contraseña");
    hasErrors = true;
  } else if (password.length < 3) {
    showError("password", "La contraseña debe tener al menos 3 caracteres");
    hasErrors = true;
  }

  if (hasErrors) return;

  loginBtn.disabled = true;
  loading.style.display = "inline-block";
  btnText.textContent = "Iniciando sesión...";

  try {
    const result = await performLogin(email, password);

    if (result.success) {
      successMessage.style.display = "block";
      btnText.textContent = "¡Exito!";

      if (document.getElementById("remember").checked) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({
            email: email,
            name: result.user.name,
          })
        );
      }

      // Simular redirección
      setTimeout(() => {
        alert(
          `¡Bienvenido ${result.user.name}!\n\nEn un sitio real, serías redirigido al dashboard.`
        );
        // window.location.href = '/dashboard';
      }, 2000);
    } else {
      // Login fallido
      showError("password", result.message);
    }
  } catch (error) {
    showError("password", "Error de conexión. Inténtalo de nuevo.");
  } finally {
    // Ocultar estado de carga
    setTimeout(() => {
      loginBtn.disabled = false;
      loading.style.display = "none";
      btnText.textContent = "Iniciar Sesión";
    }, 1000);
  }
});

// ===============================
//  INICIALIZACIÓN
// ===============================

// Cargar usuario recordado al cargar la página
window.addEventListener("load", function () {
  const rememberedUser = localStorage.getItem("rememberedUser");
  if (rememberedUser) {
    const user = JSON.parse(rememberedUser);
    emailInput.value = user.email;
    document.getElementById("remember").checked = true;
  }
});

// Recuperar contraseña
document
  .getElementById("forgotPassword")
  .addEventListener("click", function (e) {
    e.preventDefault();
    alert(
      "Funcionalidad de recuperación de contraseña. "
    );
  });

// Enlace de registro
document.getElementById("registerLink").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "RegisterUser.html";

});

// Login con Google
document.getElementById("googleLogin").addEventListener("click", function (e) {
  e.preventDefault();
  alert(
    "Login con Google.\n\n esto es un ejemplo profesor."
  );
});

console.log("=== USUARIOS DE PRUEBA ===");
console.log("Email: admin@test.com | Contraseña: 123456");
console.log("Email: user@test.com | Contraseña: password");
console.log("Usuario: demo | Contraseña: demo");
