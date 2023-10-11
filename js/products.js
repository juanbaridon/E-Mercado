//URL de la API;
const productInfoUrl = PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE;

var categoria = [];
let categoriaOriginal = [];
let favoritos = [];
const divProductos = document.getElementById('divProductos');
const nombreCategoria = document.getElementById('nombreCategoria');
const campoMin = document.getElementById("rangeFilterCountMin2");
const campoMax = document.getElementById("rangeFilterCountMax2");
const btnFiltrar = document.getElementById("rangeFilterCount2");
const btnLimpiar = document.getElementById("clearRangeFilter2");
const btnPrecioAsc = document.getElementById("sortAsc2");
const btnPrecioDesc = document.getElementById("sortDesc2");
const btnRelevancia = document.getElementById("sortByCount2");
const campoBusqueda = document.getElementById("buscador")

//Funcion que almacena el id del producto y redirecciona a product-info.html
function redirectProduct(prodId){
  localStorage.setItem("productId", prodId);
  window.location.href = "product-info.html";
};

//Función que muestra los productos;

function showData(dataArray) {
  if (nombreCategoria) {
    nombreCategoria.innerHTML = categoria.catName + ` <img src="img/cat${localStorage.getItem("catID")}_1.png" class="catIcon p-2 pt-1">`;
  }

  if (divProductos) {
    divProductos.innerHTML = "";

    if (dataArray.products && dataArray.products.length > 0) {
      dataArray.products.forEach((prod) => {
        divProductos.innerHTML +=
          `<div class="list-group-item list-group-item-action cursor-active bg-light">
            <div class="row">
              <div class="col-3">
                <img src="${prod.image}" class="img-thumbnail">
              </div>
              <div class="col">
                <div class="d-flex w-100 justify-content-between">
                  <h4 class="mb-1">${prod.name}</h4>
                  <button class="btn btn-outline-primary" id="addToFavorites_${prod.catId}-${prod.id}" onclick="toggleFavorito('${prod.catId}', '${prod.id}')">
                    <i class="fas fa-heart"></i> <!-- Icono de corazón -->
                  </button>
                </div>
                <small class="text-muted">${prod.soldCount} vendidos</small>
                <h5 class="mb-1">${prod.cost} ${prod.currency}</h5>
                <p class="mb-1">${prod.description}</p>
                <button class="btn btn-primary" onclick="redirectProduct('${prod.id}')">Ver Detalles</button> <!-- redirigir a products.info -->
              </div>
            </div>
          </div>`;
      });
    } else {
      divProductos.innerHTML += `
        <div class="text-center text-muted">
          <h4>No se encuentran productos</h4>
        </div>`;
    }
  }
  //Modo oscuro
  modeListado();
}

//Petición a la URL
async function getJson() {
  try{
    const response = await fetch(productInfoUrl);
    const json = await response.json();
    categoria = json;
    showData(categoria);
    categoriaOriginal = JSON.parse(JSON.stringify(categoria)); // Crea una copia completa del json en categoria
  }
  catch (error){
    //Mensaje de error
    console.error('Error al solicitar los productos \n', error);
    divProductos.innerHTML = `
      <div class="bg-danger text-white text-center rounded p-4 m-4">
        <h5>Lo sentimos, ha ocurrido un error.</h5>
      </div>`
  }
}
getJson();

//Buscador
//La función se ejecuta al utilizar el input
if (campoBusqueda) { 
campoBusqueda.addEventListener("input", ()=>{
  categoria = JSON.parse(JSON.stringify(categoriaOriginal));
  const busqueda = campoBusqueda.value.toLowerCase(); //Valor del input en minúsculas
  const filtrado = categoria.products.filter((element) => element.name.toLowerCase().includes(busqueda) || element.description.toLowerCase().includes(busqueda));
  //Filtro: si el valor del buscador está incluido en el nombre o descripción del producto
  categoria.products = filtrado
  showData(categoria)
})
}

//Rango de precio
if (btnFiltrar) {
btnFiltrar.addEventListener("click", function(){
  const min = parseInt(campoMin.value, 10); 
  const max = parseInt(campoMax.value, 10); 
  const productosOriginales = categoriaOriginal.products;
  const productosFiltrados = [];
  
  for (const producto of productosOriginales) {
    if (min <= max && producto.cost >= min && producto.cost <= max) {
      productosFiltrados.push(producto);
    }
  } 
  
  categoria.products = productosFiltrados;
  showData(categoria);
});
}


//Limpiar
if (btnLimpiar) { 
btnLimpiar.addEventListener("click", function() { 
  campoMin.value = null;
  campoMax.value = null;
  campoBusqueda.value = null
  categoria = JSON.parse(JSON.stringify(categoriaOriginal)); // Guarda en categoria una copia de categoriaOriginal, asi quedan ambas en su estado original.
  showData(categoria);
}) 
}

//Precio ascendente
if (btnPrecioAsc) { 
btnPrecioAsc.addEventListener("click", function(){
  const productosOrdenados = categoria.products.sort((a, b) => a.cost - b.cost); 
  categoria.products = productosOrdenados;
  showData(categoria);
})
}

//Precio descendente
if (btnPrecioDesc) { 
btnPrecioDesc.addEventListener("click", function() {
  const productosOrdenados = categoria.products.sort((a, b) => b.cost - a.cost); 
  categoria.products = productosOrdenados;
  showData(categoria);
})
}
//Relevancia
if (btnRelevancia) { 
btnRelevancia.addEventListener("click", function() {
  const productosOrdenados = categoria.products.sort((a, b) => b.soldCount - a.soldCount); 
  categoria.products = productosOrdenados;
  showData(categoria);
})
}



//  BUSQUEDA POR VOZ

document.addEventListener('DOMContentLoaded', function () {
  if (voiceSearchButton) {
    voiceSearchButton.addEventListener('click', startVoiceSearch);
  }
});

function startVoiceSearch() {
  console.log('Iniciando búsqueda por voz...');
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = 'es-ES'; 

  recognition.start();

  recognition.onresult = function(event) {
    const voiceResult = event.results[0][0].transcript;
    campoBusqueda.value = voiceResult;
    executeSearch(voiceResult);
  };
  recognition.onend = function() {
    recognition.stop();
  };
}

function executeSearch(query) {
 
  // Filtra y muestra los resultados de búsqueda según la consulta de voz
  categoria = JSON.parse(JSON.stringify(categoriaOriginal));
  const busqueda = query.toLowerCase();
  const filtrado = categoria.products.filter(
    (element) =>
      element.name.toLowerCase().includes(busqueda) ||
      element.description.toLowerCase().includes(busqueda)
  );
  categoria.products = filtrado;
  showData(categoria);
}


//FAVORITOS

  const divFavoritos = document.getElementById('divFavoritos');

// Función para aplicar estilo de favorito
function applyFavoritoStyle(icon) {
  if (icon) {
    icon.classList.add('favorito');
    icon.parentElement.classList.add('favorito-button');
  }
}

// Función para quitar estilo de favorito
function removeFavoritoStyle(icon) {
  if (icon) {
    icon.classList.remove('favorito');
    icon.parentElement.classList.remove('favorito-button');
  }
}

// función para agregar o quitar un producto de favoritos
function toggleFavorito(catId, prodId) {
  const storedCatId = parseInt(localStorage.getItem("catID"), 10); 
  const storedProdId = parseInt(prodId, 10); 
  const button = document.getElementById(`addToFavorites_${catId}-${prodId}`);

  if (!button) {
    return;
  }

  const heartIcon = button.querySelector("i.fa-heart");
  const storedFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  const index = storedFavoritos.findIndex(item => item.catId === storedCatId && item.prodId === storedProdId);

  if (index === -1) {
    storedFavoritos.push({ catId: storedCatId, prodId: storedProdId });
    button.classList.add("favorito");
    if (heartIcon) {
      applyFavoritoStyle(heartIcon);
    }
  } else {
    storedFavoritos.splice(index, 1);
    button.classList.remove("favorito");
    if (heartIcon) {
      removeFavoritoStyle(heartIcon);
    }
  }

  localStorage.setItem("favoritos", JSON.stringify(storedFavoritos));
}

function removeFromFavoritos(catId, prodId) {
  const storedCatId = parseInt(localStorage.getItem("catID"), 10); 
  const storedProdId = parseInt(prodId, 10); 
  const button = document.getElementById(`removeFromFavorites_${catId}-${prodId}`);

  if (!button) {
    return;
  }

  const storedFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  const index = storedFavoritos.findIndex(item => item.catId === storedCatId && item.prodId === storedProdId);

  if (index !== -1) {
    // Elimina el producto de la lista de favoritos
    storedFavoritos.splice(index, 1);
    localStorage.setItem("favoritos", JSON.stringify(storedFavoritos));

    loadFavoritos();
  }
}

// carga los productos favoritos de la api 
async function loadFavoritos() {
  const storedFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  if (storedFavoritos.length === 0) {
    showFavoritos([]); 
    return;
  }

  const promises = storedFavoritos.map(async (favorito) => {
    const catId = favorito.catId;
    const prodId = favorito.prodId;
    const categoryUrl = `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`;

    try {
      const categoryResponse = await fetch(categoryUrl);
      const categoryData = await categoryResponse.json();
      const productoFavorito = categoryData.products.find((prod) => prod.id === parseInt(prodId)); // Convertir prodId a número
      
      if (productoFavorito) {
        return productoFavorito;
      } else {
        console.log(`No se encontró el producto favorito con id ${prodId} en la categoría con catId ${catId}.`);
      }
    } catch (error) {
      console.error(`Error al cargar la categoría con catId ${catId}: ${error}`);
    }
  });

  Promise.all(promises)
    .then(productosFavoritos => {
      productosFavoritos = productosFavoritos.filter(producto => producto);
      showFavoritos(productosFavoritos);
    })
    .catch(error => {
      console.error('Error al cargar productos favoritos:', error);
    });
}

function showFavoritos(productosFavoritos) { // los muestra 
  if (divFavoritos) {
    divFavoritos.innerHTML = "";

    if (productosFavoritos.length > 0) {
      productosFavoritos.forEach((prod) => {
        divFavoritos.innerHTML +=
          `<div class="list-group-item list-group-item-action cursor-active bg-light">
            <div class="row">
              <div class="col-3">
                <img src="${prod.image}" class="img-thumbnail">
              </div>
              <div class="col">
                <div class="d-flex w-100 justify-content-between">
                  <h4 class="mb-1">${prod.name}</h4>
                  <button class="btn btn-danger" id="removeFromFavorites_${prod.catId}-${prod.id}" onclick="removeFromFavoritos('${prod.catId}', '${prod.id}')">
                    Eliminar de mis Favoritos
                  </button>
                </div>
                <small class="text-muted">${prod.soldCount} vendidos</small>
                <h5 class="mb-1">${prod.cost} ${prod.currency}</h5>
                <p class="mb-1">${prod.description}</p>
                <button class="btn btn-primary" onclick="redirectProduct('${prod.id}')">Ver Detalles</button>
              </div>
            </div>
          </div>`;
      });
    } else {
      divFavoritos.innerHTML += `
      <hr>
      <div class="text-center text-muted">
      <h4>No tienes productos favoritos.</h4>
      <p>¿Quieres agregar productos favoritos? <a href="categories.html">Explora productos</a></p>
    </div>`;
    }
  }
}


// en construccion
function updateFavoriteUI() {
  const storedFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const favoritoButtons = document.querySelectorAll('[id^="addToFavorites_"]');

  favoritoButtons.forEach(button => {
    const [catId, prodId] = button.id.split("_")[1].split("-");
    const catIdNum = parseInt(catId, 10);
    const prodIdNum = parseInt(prodId, 10);

    // Verifica si existe un objeto en los favoritos con catId y prodId correspondientes
    const isFavorite = storedFavoritos.some(item => item.catId === catIdNum && item.prodId === prodIdNum);

    if (isFavorite) {
      button.classList.add("favorito");
      applyFavoritoStyle(button.querySelector("i.fa-heart"));
    } else {
      button.classList.remove("favorito");
      removeFavoritoStyle(button.querySelector("i.fa-heart"));
    }
  });
}

updateFavoriteUI();

loadFavoritos();

