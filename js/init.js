const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

//Guarda el usuario en localStorage y lo muestra en el menú
document.addEventListener("DOMContentLoaded", function () {
  var usuario = localStorage.getItem("usuario");
  if (usuario === null) {
    window.location.href = "login.html";
  } else {
    document.getElementById("emailButton").innerHTML = localStorage.getItem("usuario");
  }
});

//Borra el usuario del localStorage
const cerrarSesion = document.getElementById('cerrarSesion');
cerrarSesion.addEventListener("click", () => {
  localStorage.removeItem("usuario");
})


let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

/*  Modo oscuro  */

//Botón light
var lightMode = document.getElementById('lightMode');

lightMode.addEventListener("click", () => {
  localStorage.setItem("mode", "light");
  changeMode()
})

//Botón dark
var darkMode = document.getElementById('darkMode');

darkMode.addEventListener("click", () => {
  localStorage.setItem("mode", "dark");
  changeMode()
})

function changeMode() {
  //Elementos
  var lightElementsBg = document.querySelectorAll(".bg-white, .bg-light, .btn-light");
  var darkElementsBg = document.querySelectorAll(".bg-dark, .btn-dark");
  var lightElementsText = document.querySelectorAll(".text-dark");
  var darkElementsText = document.querySelectorAll(".text-light, .text-white");
  var navElement = document.getElementById("mainNav");            //**********************************************
  var navLinks = navElement.querySelectorAll("a");                //**********************************************
  var dropdownMenu = document.querySelectorAll(".dropdown-menu"); //**********************************************
  var rangeFilterCount = document.getElementById("rangeFilterCount");  //*******************
  var rangeFilterCount = document.getElementById("rangeFilterCount2");  //*******************
  var clearRangeFilter = document.getElementById("clearRangeFilter"); //*******************
  var clearRangeFilter = document.getElementById("clearRangeFilter2");

  //Dark
  if (localStorage.getItem("mode") == "dark") {
    lightElementsBg.forEach((element) => {
      element.classList.remove('bg-light', 'bg-white', 'btn-light');
      element.classList.add('bg-dark', 'text-light');
      navElement.style.backgroundColor = "#9e764c";   //**********************************************
      navElement.style.color = "#ffffff"; //**********************************************
      dropdownMenu.forEach(menu => {  //**********************************************
        menu.style.backgroundColor = "#9e764c";
      });
      document.getElementById('emailButton').style.color = "#ffffff";   //**********************************************
    });
    lightElementsText.forEach((element) => {
      element.classList.remove('text-dark');
      element.classList.add('text-white');
    });
    navLinks.forEach(link => {  //**********************************************
      link.style.color = "#ffffff";
    });
    //Background
    document.querySelector('body').style.backgroundColor = "#0d1117";
    //Color botón
    lightMode.classList.remove('btn-primary');
    darkMode.classList.add('btn-primary');
    rangeFilterCount.style.backgroundColor = "#5251a3"; //filter 
    clearRangeFilter.style.backgroundColor = "#9d4040"; //remove 
  }

  //Light
  else {
    darkElementsBg.forEach((element) => {
      element.classList.remove('bg-dark', 'btn-dark');
      element.classList.add('bg-light', 'text-dark');
      navElement.style.backgroundColor = "#ef9333";   //**********************************************
      navElement.style.color = "#ef9333"; //**********************************************
      dropdownMenu.forEach(menu => {  //**********************************************
        menu.style.backgroundColor = "#ef9333";
      });
      document.getElementById('emailButton').style.color = "#282828";   //**********************************************
    });
    darkElementsText.forEach((element) => {
      element.classList.remove('text-white', 'text-light');
      element.classList.add('text-dark');
    });
    navLinks.forEach(link => {  //**********************************************
      link.style.color = "#282828";
    });
    //Background
    document.querySelector('body').style.backgroundColor = "#e2e2e2";
    //Color botón
    lightMode.classList.add('btn-primary');
    darkMode.classList.remove('btn-primary');
    
    rangeFilterCount.style.backgroundColor = "#0d6efd"; //filter 
    clearRangeFilter.style.backgroundColor = "#dc3545"; //remove 
  }
}

changeMode()

function modeListado() {
  let categoryItem = document.querySelectorAll('.list-group-item, .card');
  if (localStorage.getItem("mode") == "dark") {
    categoryItem.forEach((element) => {
      element.classList.add('bg-dark', 'text-white');
      element.classList.remove('bg-light', 'text-dark')
    })
  }
  else {
    categoryItem.forEach((element) => {
      element.classList.remove('bg-dark', 'text-white');
      element.classList.add('bg-light', 'text-dark')
    })
  }
}

//Botón favoritos
function btnFavorite(prodId) {
  const favoriteElement = localStorage.getItem('favoritos')
  if (favoriteElement) {
    const heartIcon = document.querySelectorAll('.favoriteBtn');
    heartIcon.forEach((element) => {
      element.addEventListener('click', () => {
        element.classList.toggle('text-danger')
      })
      if (favoriteElement.includes(prodId)) {
        element.classList.add('text-danger')
      }
    })
  }
}
//Botón carrito
function btnCart(prodId) {
  const cartElement = localStorage.getItem('cartList')
  if (cartElement) {
    const cartIcon = document.querySelectorAll('.cartIcon');
    cartIcon.forEach((element) => {
      element.addEventListener('click', () => {
        element.classList.add('text-danger');
        element.classList.remove('text-white');
      })
      if (cartElement.includes(prodId)) {
        element.classList.add('text-danger');
        element.classList.remove('text-white');
      }
    })
  }
}
