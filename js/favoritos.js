const divFavoritos = document.getElementById('divFavoritos');

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
  } else {
    storedFavoritos.splice(index, 1);
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
          `<div class="card bg-light m-3">
          <img onclick="redirectProduct('${prod.id}')" src="${prod.image}" class="card-img-top cursor-active" alt="imagen del producto">
          <div class="card-body">
            <h4 class="card-title text-center pb-2">${prod.name}</h4>
              <button type="button" class="btn btn-success">${prod.cost} ${prod.currency}</button>
            <div class="card-text">
              <p>${prod.description}</p>
              <small class="text-muted">${prod.soldCount} vendidos</small>
              <div class="btn-group mb-3 float-end" role="group" aria-label="Basic example">
                <button class="btn btn-danger" id="removeFromFavorites_${prod.catId}-${prod.id}" onclick="removeFromFavoritos('${prod.catId}', '${prod.id}')">
                    X
                </button>
                <button type="button" class="btn btn-danger border-0 cartIcon" onclick="addToCart('${prod.id}')"><i class="fa fa-shopping-cart"></i></button>
              </div>
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
   modeListado();
}


loadFavoritos();
