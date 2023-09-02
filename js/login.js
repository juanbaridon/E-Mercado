let usuario = document.getElementById("usuario");
let contrasena = document.getElementById("contrasena");
let loginError = document.getElementById("loginError");
let errorMessage = "";

document.addEventListener("input", ()=>{
  //Mostrar que el usuario es válido
  if (!emailValido(usuario.value)) {
    usuario.classList.add('is-invalid');
    usuario.classList.remove('is-valid');
    }
  else{
    usuario.classList.add('is-valid');
    usuario.classList.remove('is-invalid');
  }
  //Mostrar que la contraseña es válida
  if (!contrasenaValida(contrasena.value)) {
    contrasena.classList.add('is-invalid');
    contrasena.classList.remove('is-valid');
    }
  else{
    contrasena.classList.add('is-valid');
    contrasena.classList.remove('is-invalid');
  }
})

//Guardar usuario
function submitForm(event){
    event.preventDefault();

  if (usuario.value !== "" && contrasena.value !== "") {

    if (emailValido(usuario.value) && contrasenaValida(contrasena.value)) { //linea agregada
          localStorage.setItem("usuario", usuario.value);
          window.location.href = "index.html";
    } else {
          errorMessage = "Datos de inicio de sesión no válidos"; //linea agregada
      }
  
  } else {
      errorMessage = "Usuario y contraseña requeridos";
  }

    loginError.innerHTML = errorMessage;
}

//Mostrar contraseña
function mostrarPassword() {
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


// inicio agregado
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
// final agregado


