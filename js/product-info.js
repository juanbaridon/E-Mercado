document.addEventListener("DOMContentLoaded", function () {

    // 1. URL
    let productInfoUrl = PRODUCT_INFO_URL + localStorage.getItem("productId") + EXT_TYPE;

    // 2. Hacer la solicitud
    async function getJson() {
      try{
        const response = await fetch(productInfoUrl);
        const json = await response.json();
        showData(json);
      }
      catch (error){
        //Mensaje de error
        console.error('Error al solicitar la información \n', error);
        divProductInfo.innerHTML = `
          <div class="bg-danger text-white text-center rounded p-4 m-4">
            <h5>Lo sentimos, ha ocurrido un error.</h5>
          </div>`
      }
    }
    getJson();

    //3. Mostrar la información
    const divProductInfo = document.getElementById('divProductInfo');
    const productImgs = document.getElementById('productImgs');

    function showData(data){
        divProductInfo.innerHTML = `
        <div class="text-center p-4"">
            <h2>${data.name}</h2></div>
        <div class="list-group">
            <div class="p-3 list-group-item">
                <h5><span class="h4">Descripción: </span>${data.description}</h5></div>
            <div class="p-3 list-group-item">
                <h5><span class="h4">Precio: </span>${data.cost} ${data.currency}</h5></div>
            <div class="p-3 list-group-item">
                <h5><span class="h4">Cantidad vendidos: </span>${data.soldCount}</h5></div>
            <div class="p-3 list-group-item">
                <h5><span class="h4">Categoría: </span>${data.category}</h5></div>
        <div>`
        data.images.forEach(imagen => {
            productImgs.innerHTML += `
                <div class="col">
                <img class="img-fluid border m-2" src="${imagen}" alt="${data.name}">
                </div>`
        })
    }
});
