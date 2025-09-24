document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const registerBtn = document.getElementById("registerBtn");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const btnText = document.querySelector(".btn-text");
  const successMessage = document.getElementById("successMessage");

  // Elementos del formulario
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const birthDate = document.getElementById("birthDate");
  const terms = document.getElementById("terms");

  // Toggles para mostrar/ocultar contraseñas
  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );

  // Validaciones en tiempo real
  fullName.addEventListener("input", validateFullName);
  email.addEventListener("input", validateEmail);
  username.addEventListener("input", validateUsername);
  password.addEventListener("input", function () {
    validatePassword();
    updatePasswordStrength();
    if (confirmPassword.value) validateConfirmPassword();
  });
  confirmPassword.addEventListener("input", validateConfirmPassword);
  birthDate.addEventListener("input", validateBirthDate);

  // Toggle de contraseñas
  togglePassword.addEventListener("click", function () {
    togglePasswordVisibility(password, togglePassword);
  });

  toggleConfirmPassword.addEventListener("click", function () {
    togglePasswordVisibility(confirmPassword, toggleConfirmPassword);
  });

  // Envío del formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      showLoading();

      // Simular proceso de registro
      setTimeout(() => {
        hideLoading();
        showSuccessMessage();

        setTimeout(() => {
          window.location.href = "LoginUser.html";
        }, 2000);
      }, 2000);
    }
  });

  // Funciones de validación
  function validateFullName() {
    const value = fullName.value.trim();
    const error = document.getElementById("fullNameError");

    if (value.length < 2) {
      showError(fullName, error, "El nombre debe tener al menos 2 caracteres");
      return false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
      showError(
        fullName,
        error,
        "El nombre solo puede contener letras y espacios"
      );
      return false;
    } else {
      hideError(fullName, error);
      return true;
    }
  }

  function validateEmail() {
    const value = email.value.trim();
    const error = document.getElementById("emailError");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      showError(email, error, "Por favor ingresa un email válido");
      return false;
    } else {
      hideError(email, error);
      return true;
    }
  }

  function validateUsername() {
    const value = username.value.trim();
    const error = document.getElementById("usernameError");

    if (value.length < 3) {
      showError(username, error, "El usuario debe tener al menos 3 caracteres");
      return false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      showError(username, error, "Solo letras, números y guiones bajos");
      return false;
    } else {
      hideError(username, error);
      return true;
    }
  }

  function validatePassword() {
    const value = password.value;
    const error = document.getElementById("passwordError");

    if (value.length < 8) {
      showError(
        password,
        error,
        "La contraseña debe tener al menos 8 caracteres"
      );
      return false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      showError(
        password,
        error,
        "Debe contener mayúsculas, minúsculas y números"
      );
      return false;
    } else {
      hideError(password, error);
      return true;
    }
  }

  function validateConfirmPassword() {
    const value = confirmPassword.value;
    const error = document.getElementById("confirmPasswordError");

    if (value !== password.value) {
      showError(confirmPassword, error, "Las contraseñas no coinciden");
      return false;
    } else {
      hideError(confirmPassword, error);
      return true;
    }
  }

  function validateBirthDate() {
    const value = new Date(birthDate.value);
    const today = new Date();
    const age = today.getFullYear() - value.getFullYear();
    const error = document.getElementById("birthDateError");

    if (age < 13) {
      showError(birthDate, error, "Debes ser mayor de 13 años");
      return false;
    } else {
      hideError(birthDate, error);
      return true;
    }
  }

  function validateForm() {
    const isValid =
      validateFullName() &&
      validateEmail() &&
      validateUsername() &&
      validatePassword() &&
      validateConfirmPassword() &&
      validateBirthDate();

    const termsError = document.getElementById("termsError");
    if (!terms.checked) {
      termsError.style.display = "block";
      return false;
    } else {
      termsError.style.display = "none";
    }

    return isValid;
  }

  function updatePasswordStrength() {
    const value = password.value;
    const strengthBar = document.querySelector(".strength-bar");
    const strengthText = document.querySelector(".strength-text");

    let strength = 0;

    if (value.length >= 8) strength++;
    if (/[a-z]/.test(value)) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/\d/.test(value)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) strength++;

    const strengthNames = [
      "Muy débil",
      "Débil",
      "Regular",
      "Buena",
      "Muy fuerte",
    ];
    const strengthColors = [
      "#e74c3c",
      "#e67e22",
      "#f39c12",
      "#f1c40f",
      "#27ae60",
    ];

    strengthBar.style.width = strength * 20 + "%";
    strengthBar.style.backgroundColor =
      strengthColors[strength - 1] || "#e74c3c";
    strengthText.textContent = strengthNames[strength - 1] || "Muy débil";
  }

  function showError(input, errorElement, message) {
    input.classList.add("error");
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  function hideError(input, errorElement) {
    input.classList.remove("error");
    errorElement.style.display = "none";
  }

  function togglePasswordVisibility(input, toggle) {
    if (input.type === "password") {
      input.type = "text";
      toggle.textContent = "X";
    } else {
      input.type = "password";
      toggle.textContent = "O";
    }
  }

  function showLoading() {
    registerBtn.disabled = true;
    btnText.style.opacity = "0";
    loadingSpinner.style.display = "block";
  }

  function hideLoading() {
    registerBtn.disabled = false;
    btnText.style.opacity = "1";
    loadingSpinner.style.display = "none";
  }

  function showSuccessMessage() {
    successMessage.style.display = "block";
    form.style.opacity = "0.5";
  }
});
