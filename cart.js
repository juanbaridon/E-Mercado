const cartProducts = document.getElementById('cartProducts');
const exchangeRate = 0.04;

//Adds an item to the shopping cart by storing its ID in the cart list stored in the browser's local storage.
function addToCart(itemId) {
  const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
  if (!cartList.includes(itemId)) {
    cartList.push(itemId);
    localStorage.setItem("cartList", JSON.stringify(cartList));
  }
}

async function fetchCart() {
  const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
  try {
    for (const element of cartList) {
      const response = await fetch(`${PRODUCT_INFO_URL}${element}${EXT_TYPE}`);
      if (!response.ok) {
        throw new Error('Error de respuesta de la red');
      }
      const data = await response.json();
      showCart(data);
    }
  } catch (error) {
    console.error('Error de fetch:', error);
    cartProducts.innerHTML = `
      <div class="bg-danger text-white text-center rounded p-4 m-4">
        <h5>Lo sentimos, ha ocurrido un error.</h5>
      </div>`;
  }
}

fetchCart();

//Displays and updates product details, including the subtotal, in a table row, considering the currency exchange rate for UYU.
function showCart(data) {
  const cost = (data.currency === "UYU") ? parseFloat(data.cost) * exchangeRate : parseFloat(data.cost);
  const subtotal = cost.toFixed(0);
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <th scope="row"><img src="${data.images[0]}" style="height: 60px; min-width: 60px;" class="img-thumbnail" alt="imagen del producto"></th>
    <td class="text-dark">${data.name}</td>
    <td class="text-dark">${data.currency} ${data.cost}</td>
    <td class="text-dark"><input min="0" name="quantity" value="1" type="number" oninput="updateSubtotal(this, ${cost})" class="form-control form-control-sm"></td>
    <td class="text-dark"><span class="currency">USD</span> <span class="subtotal">${subtotal}</span></td>
    <td><button class="btn btn-danger" onclick="removeCartItem(this.parentNode.parentNode, '${data.id}')">Eliminar</button></td>
  `;
  cartProducts.appendChild(newRow);
  updateGeneralSubtotal();
  updateTotal();
  modeList();
}

//Removes a product's row from the cart, updates the cart list in local storage, and refreshes the general subtotal, delivery cost, and total.
function removeCartItem(row, id) {
  cartProducts.removeChild(row);
  const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
  const index = cartList.indexOf(id);
  if (index !== -1) {
    cartList.splice(index, 1);
    localStorage.setItem("cartList", JSON.stringify(cartList));
  }
  updateGeneralSubtotal();
  updateDeliveryCost();
  updateTotal();
}

//Recalculates the subtotal, and updates the overall subtotal, delivery cost, and total.
function updateSubtotal(input, cost) {
  const quantity = parseInt(input.value);
  const subtotal = quantity * cost;
  const subtotalElement = input.closest("tr").querySelector(".subtotal");
  subtotalElement.textContent = `${subtotal}`;
  updateGeneralSubtotal();
  updateDeliveryCost();
  updateTotal();
}

//Calculates the delivery cost basado on the general subtotal, updates the displayed delivery cost, and also triggers the update of the total.
function updateDeliveryCost() {
  const subtotalGeneral = parseFloat(document.getElementById("subtotalGen").textContent.replace(/[^\d.-]/g, "")) || 0;
  const selectedDelivery = document.querySelector('input[name="flexRadioDefault"]:checked');
  const percentageDelivery = parseFloat(selectedDelivery.getAttribute("data-percentage"));
  const deliveryCost = (subtotalGeneral * percentageDelivery) / 100;
  const deliveryCostContainer = document.getElementById("deliveryCost");
  deliveryCostContainer.textContent = `USD ${deliveryCost.toFixed(0)}`;
  updateTotal();
}

//Calculates the general subtotal by summing individual subtotals and updates the total.
function updateGeneralSubtotal() {
  const subtotalElements = document.querySelectorAll(".subtotal");
  let subtotalGeneral = 0;
  subtotalElements.forEach((element) => {
    const subtotalValue = parseFloat(element.textContent.replace(/[^\d.-]/g, "")) || 0;
    subtotalGeneral += subtotalValue;
  });
  const subtotalGeneralElement = document.getElementById("subtotalGen");
  subtotalGeneralElement.textContent = `USD ${subtotalGeneral.toFixed(0)}`;
  updateTotal();
}

//calcula the total cost by adding the general subtotal and delivery cost, and updates the displayed total.
function updateTotal() {
  const subtotalGeneral = parseFloat(document.getElementById("subtotalGen").textContent.replace(/[^\d.-]/g, "")) || 0;
  const deliveryCost = parseFloat(document.getElementById("deliveryCost").textContent.replace(/[^\d.-]/g, "")) || 0;
  const total = subtotalGeneral + deliveryCost;
  const finalPriceContainer = document.getElementById("finalPrice");
  finalPriceContainer.textContent = `USD ${total.toFixed(0)}`;
}

