const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL =
  "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL =
  "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";
const spinnerWrapper = document.getElementById("spinner-wrapper");

let getJSONData = function (url) {
  let result = {};
  try {
    showSpinner();
  } catch {}
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      try {
        hideSpinner();
      } catch {}
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      try {
        hideSpinner();
      } catch {}
      return result;
    });
};

//Buscador nav
const searchNav = document.getElementById("searchNav");
const datalist = document.getElementById("optionsList");
const searchButton = document.getElementById("searchButton");
let listOptions = {};
let page = "";

// Fetch de categorias
getJSONData(CATEGORIES_URL).then(function (resultObj) {
  categories = resultObj.data;
  datalist.innerHTML += `<a><li class="ps-3 p-2 pe-0 optionTitle optionItem">Categorias</li>`;
// Agrega el nombre de la categoria a las opciones.
  categories.forEach((option) => {
    datalist.innerHTML += `<li><a class="dropdown-item optionItem" data-id="${option.id}" data-page="categories">${option.name}</a></li>`;
  // Cada opción guarda el ID de la categoria.
  });
  categories.forEach((option) => {
  // Fetch de productos
    getJSONData(PRODUCTS_URL + option.id + EXT_TYPE).then(function (resultObj) {
      products = resultObj.data;
      datalist.innerHTML += `<a><li class="ps-3 p-2 pe-0 optionTitle optionItem">${option.name}</li>`;
    // Agrega el nombre del producto a las opciones.
      products.products.forEach((option) => {
        datalist.innerHTML += `<li><a class="dropdown-item optionItem" data-id="${option.id}" data-page="products" data-catid="${products.catID}">${option.name}</a></li>`;
      // Cada opción guarda el ID del producto y de la categoria.
      });
      listOptions = document.querySelectorAll(".optionItem");
      listOptions.forEach((element) => {
        element.addEventListener("click", () => {
          searchNav.value = element.innerHTML;
          if (element.dataset.page == "products") {
          // Redirige a la página del producto.
            localStorage.setItem("productId", element.dataset.id);
            localStorage.setItem("catID", element.dataset.catid);
            page = "product-info.html";
          } else if (element.dataset.page == "categories") {
          // Redirige a la página de la categoria.
            localStorage.setItem("catID", element.dataset.id);
            page = "products.html";
          }
        });
      });
    });
  });
});

searchButton.addEventListener("click", () => {
  window.location.href = page;
});

searchNav.addEventListener("input", () => {
// Muestra las opciones que coinciden con la busqueda
  const busqueda = searchNav.value.toLowerCase();
  listOptions.forEach((element) => {
    if (!element.innerHTML.toLowerCase().includes(busqueda)) {
      element.style.display = "none";
    } else {
      element.style.display = "block";
    }
  // Verifica si lo que se escribe coinside con una opción
    if (element.innerHTML.toLowerCase() == searchNav.value.toLowerCase()) {
      if (element.dataset.page == "products") {
        localStorage.setItem("productId", element.dataset.id);
        page = "product-info.html";
      } else if (element.dataset.page == "categories") {
        localStorage.setItem("catID", element.dataset.id);
        page = "products.html";
      }
    }
  });
  document.querySelectorAll('.optionTitle').forEach(element => {
    element.style.display = "none";
    if (searchNav.value == "") {
      element.style.display = "block";
    }
  });
});

//-----

let showSpinner = function () {
  spinnerWrapper.style.display = "block";
};

let hideSpinner = function () {
  spinnerWrapper.style.display = "none";
};

//Save the user in localStorage and show it in the menu
document.addEventListener("DOMContentLoaded", function () {
  var user = localStorage.getItem("user");
  if (user === null) {
    window.location.href = "login.html";
  } else {
    document.getElementById("emailButton").innerHTML =
      localStorage.getItem("user");
  }
});

//Delete user from localStorage
const logoutSession = document.getElementById("logoutSession");
logoutSession.addEventListener("click", () => {
  localStorage.removeItem("user");
});

//Dark Mode

//Light Button
var lightMode = document.getElementById("lightMode");

lightMode.addEventListener("click", () => {
  localStorage.setItem("mode", "light");
  changeMode();
});

//Dark Button
var darkMode = document.getElementById("darkMode");

darkMode.addEventListener("click", () => {
  localStorage.setItem("mode", "dark");
  changeMode();
});

function changeMode() {
  //Elements
  var lightElementsBg = document.querySelectorAll(
    ".bg-white, .bg-light, .btn-light"
  );
  var darkElementsBg = document.querySelectorAll(".bg-dark, .btn-dark");
  var lightElementsText = document.querySelectorAll(".text-dark");
  var darkElementsText = document.querySelectorAll(".text-light, .text-white");
  var navElement = document.getElementById("mainNav");
  var navLinks = navElement.querySelectorAll("a");
  var dropdownMenu = document.querySelectorAll(".dropdown-menu");
  let btnPrimary = document.querySelectorAll(".btn-primary");
  let btnDanger = document.querySelectorAll(".btn-danger");

  //Dark
  if (localStorage.getItem("mode") == "dark") {
    lightElementsBg.forEach((element) => {
      element.classList.remove("bg-light", "bg-white", "btn-light");
      element.classList.add("bg-dark", "text-light");
    });
    lightElementsText.forEach((element) => {
      element.classList.remove("text-dark");
      element.classList.add("text-white");
    });
    dropdownMenu.forEach((menu) => {
      menu.classList.add("dropdown-menu-dark");
    });
    document.getElementById("emailButton").style.color = "#161616";
    /**/ navLinks.forEach((link) => {
      link.style.color = "#282828";
    });
    btnPrimary.forEach((element) => {
      element.style.filter = "saturate(.7)";
    });
    btnDanger.forEach((element) => {
      element.style.filter = "saturate(.7)";
    });
    //Background
    document.querySelector("body").style.backgroundColor = "#0d1117";
    //Color Button
    lightMode.classList.add("modeNoselect");
    darkMode.classList.remove("modeNoselect");
  }

  //Light
  else {
    darkElementsBg.forEach((element) => {
      element.classList.remove("bg-dark", "btn-dark");
      element.classList.add("bg-light", "text-dark");
    });
    darkElementsText.forEach((element) => {
      element.classList.remove("text-white", "text-light");
      element.classList.add("text-dark");
    });
    dropdownMenu.forEach((menu) => {
      menu.classList.remove("dropdown-menu-dark");
    });
    document.getElementById("emailButton").style.color = "#282828";
    navLinks.forEach((link) => {
      link.style.color = "#282828";
    });
    //Background
    document.querySelector("body").style.backgroundColor = "#e2e2e2";
    //Color botón
    darkMode.classList.add("modeNoselect");
    lightMode.classList.remove("modeNoselect");
    btnPrimary.forEach((element) => {
      element.style.filter = "saturate(1)";
    });
    btnDanger.forEach((element) => {
      element.style.filter = "saturate(1)";
    });
  }
}

changeMode();

function modeList() {
  let categoryItem = document.querySelectorAll(".list-group-item, .card");
  if (localStorage.getItem("mode") == "dark") {
    categoryItem.forEach((element) => {
      element.classList.add("bg-dark", "text-white");
      element.classList.remove("bg-light", "text-dark");
    });
  } else {
    categoryItem.forEach((element) => {
      element.classList.remove("bg-dark", "text-white");
      element.classList.add("bg-light", "text-dark");
    });
  }
}

//Favorites Button
function btnFavorite(prodId) {
  const favoriteElement = localStorage.getItem(
    "favoritos-" + localStorage.getItem("user")
  );
  if (favoriteElement) {
    const heartIcon = document.querySelectorAll(".favoriteBtn");
    heartIcon.forEach((element) => {
      element.addEventListener("click", () => {
        element.classList.toggle("text-danger");
      });
      if (favoriteElement.includes(prodId)) {
        element.classList.add("text-danger");
      }
    });
  }
}
//Chart Button
function btnCart(prodId) {
  const cartElement = localStorage.getItem(
    "cartList-" + localStorage.getItem("user")
  );
  if (cartElement) {
    const cartIcon = document.querySelectorAll(".cartIcon");
    cartIcon.forEach((element) => {
      element.addEventListener("click", () => {
        element.classList.add("text-danger");
        element.classList.remove("text-white");
      });
      if (cartElement.includes(prodId)) {
        element.classList.add("text-danger");
        element.classList.remove("text-white");
      }
    });
  }
}
