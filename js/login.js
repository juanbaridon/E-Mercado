function submitForm(event) {
    event.preventDefault();
    let usuario = document.getElementById("usuario").value;
    let contrasena = document.getElementById("contrasena").value;
    let loginError = document.getElementById("loginError");
    let errorMessage = "";
  
    if (usuario !== "" && contrasena !== "") {
      if (emailValido(usuario) && contrasenaValida(contrasena)) { //linea agregada
        localStorage.setItem("usuario", usuario);
        window.location.href = "index.html";
      } else {
        errorMessage = "Datos de inicio de sesión no válidos"; //linea agregada
      }
    } else {
      errorMessage = "Usuario y contraseña requeridos";
    }

    //comienzo agregado
    if (!emailValido(usuario)) {
        errorMessage += "<li class='small'>Formato de correo electrónico incorrecto</li>";

      }
    

  if (contrasena.length < 8) {
    errorMessage += "<li  class='small'>La contraseña debe tener al menos 8 caracteres</li>";
  }

  
   
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(contrasena)) {
      errorMessage += "<li class='small'>Debe incluir al menos un carácter especial </li>";
    }
  

    if (!/[A-Za-z]/.test(contrasena)) {
      errorMessage += "<li  class='small'>Debe incluir al menos una letra</li>";
    }
  
    
    if (!/\d/.test(contrasena)) {
      errorMessage += "<li  class='small'>Debe incluir al menos un número</li>";
    }
  
    // Muestra los errores
    loginError.innerHTML = "<ul>" + errorMessage + "</ul>";
  }
  
//fin agregado

// Mostrar contraseña
function mostrarPassword() {
  var contrasena = document.getElementById("contrasena");
  var show_eye = document.getElementById("show_eye");
  var hide_eye = document.getElementById("hide_eye");

  hide_eye.classList.remove("d-none");
  if (contrasena.type === "password") {
      contrasena.type = "text";
      show_eye.style.display = "none";
      hide_eye.style.display = "block";
  } else {
      contrasena.type = "password";
      show_eye.style.display = "block";
      hide_eye.style.display = "none";
  }
}

//comienzo agregado
  function emailValido(email) {
    // valida correo electrónico de la forma hola@gmail.com
    var condicionDeEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return condicionDeEmail.test(email);
}

function contrasenaValida(password) {
    // verifica que la contraseña tenga un mínimo de 8 caracteres, con al menos una letra y un número
    var condicionDecontrasena = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return condicionDecontrasena.test(password);
}

//fin agregado


