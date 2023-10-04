//URL de la API;
const cartInfoUrl = CART_INFO_URL + 25801 + EXT_TYPE;
const cartProducts = document.getElementById('cartProducts');

//Lista de productos guardados;
function showData(dataArray) {
    dataArray.articles.forEach((element)=>{
        cartProducts.innerHTML +=`
            <div class="card bg-light m-3">
                <img src="${element.image}" class="card-img-top" alt="imagen del producto">
                <div class="card-body">
                <h5 class="card-title text-center pb-2">${element.name}</h5>
                <div class="card-text">
                    <p>Costo: ${element.unitCost + element.currency}</p>
                    <p>Cantidad: <input type="number" min="1" value="${element.count}" class="cartProductCount text-center"></p>
                    <p class="subTotal btn btn-success">Subtotal:  ${(element.unitCost * element.count) + element.currency}</p>
                </div>
                <a href="#" class="btn btn-primary">Comprar</a>
                <a href="#" class="btn btn-danger">Quitar</a>
                </div>
            </div>
            `
    })

    //Modificación del subtotal (temporal);
    let inputCount = document.querySelectorAll('.cartProductCount');
    let subTotal = document.querySelectorAll('.subTotal');
    let cantidades = []
    for (let i = 0; i < inputCount.length; i++) {
        cantidades.push(inputCount[i].value);
        inputCount[i].addEventListener('input', ()=>{
            cantidades[i] = inputCount[i].value;
            subTotal[i].innerHTML = 'Subtotal: '+dataArray.articles[i].unitCost * cantidades[i] + dataArray.articles[i].currency;
        })
        
    }
    //Modo oscuro
    modeListado()
}

async function getJson() {
    try{
      const response = await fetch(cartInfoUrl);
      const json = await response.json();
      showData(json);
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