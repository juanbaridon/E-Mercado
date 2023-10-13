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
const campoBusqueda = document.getElementById("buscador");

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
        const isFavorito = isProductInFavoritos(prod.catId, prod.id); // Verifica si el producto está en favoritos
        const favoritoClass = isFavorito ? "favorito" : "";

        divProductos.innerHTML +=
          `<div class="card bg-light m-3">
          <img onclick="redirectProduct('${prod.id}')" src="${prod.image}" class="card-img-top cursor-active" alt="imagen del producto">
          <div class="card-body">
            <h4 class="card-title text-center pb-2">${prod.name}</h4>
              <button type="button" class="btn btn-success">${prod.cost} ${prod.currency}</button>
            <div class="card-text">
              <p>${prod.description}</p>
              <small class="text-muted">${prod.soldCount} vendidos</small>
              <div class="btn-group mb-3 float-end" role="group" aria-label="Basic example">
                <button class="btn btn-primary" id="addToFavorites_${prod.catId}-${prod.id}" onclick="toggleFavorito('${prod.catId}', '${prod.id}')">
                  <i class="fas fa-heart ${favoritoClass}"></i> <!-- Icono de corazón -->
                </button>
                <button type="button" class="btn btn-danger border-0 cartIcon" onclick="addToCart('${prod.id}')"><i class="fa fa-shopping-cart"></i></button>
              </div>
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

// Función para verificar si un producto está en la lista de favoritos
function isProductInFavoritos(catId, prodId) {
  const storedFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  return storedFavoritos.some(item => item.catId === catId && item.prodId === prodId);
}

//Petición a la URL
async function getJson() {
  try{
    const response = await fetch(productInfoUrl);
    const json = await response.json();
    categoria = json;
    showData(categoria);
    categoriaOriginal = JSON.parse(JSON.stringify(categoria)); // Crea una copia profunda del json en categoria
  }
  catch (error){
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
const voiceSearchButton = document.getElementById('voiceSearch');
voiceSearchButton.addEventListener('click', startVoiceSearch);

// Define la función startVoiceSearch para iniciar la búsqueda por voz
function startVoiceSearch() {
  console.log('Iniciando búsqueda por voz...');
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = 'es-ES'; //  el idioma de reconocimiento

  // Inicia el reconocimiento de voz
  recognition.start();

  // Evento que se dispara cuando se obtiene un resultado
  recognition.onresult = function(event) {
    const voiceResult = event.results[0][0].transcript;
    // Establece el valor del campo de búsqueda con el resultado de voz
    campoBusqueda.value = voiceResult;
    // Ejecuta la búsqueda
    executeSearch(voiceResult);
  };

  // Evento que se dispara cuando se detiene el reconocimiento de voz
  recognition.onend = function() {
    recognition.stop();
  };
}

// Define la función executeSearch que realiza la búsqueda basada en el texto proporcionado
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

