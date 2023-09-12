document.addEventListener("DOMContentLoaded", function () {

    // 1. Obtener el ID del producto en el local storage
    let productId = localStorage.getItem("productId");
    console.log(productId)


    // 2. Fetch
    let productInfoUrl = PRODUCT_INFO_URL + productId + EXT_TYPE;

    // 3. Hacer la solicitud y mostrar la información
    fetch(productInfoUrl)
        .then(response => response.json())
        .then(data => {

            document.getElementById("productName").innerHTML = `${data.name}`;
            document.getElementById("productDescription").innerHTML = data.description;
            document.getElementById("productPrice").innerHTML = `${data.cost} ${data.currency}`;
            document.getElementById("productSoldCount").innerHTML = `${data.soldCount}`;
            document.getElementById("productCategory").innerHTML = `${data.category}`;

            let imagesContainer = document.getElementById("productImage");

            data.images.forEach(imagen => {
                let img = document.createElement("img");
                img.src = imagen;
                img.alt = data.name;
                img.classList.add("img-fluid", "border", "m-2");

                // Contenedor de columnas para las imágenes
                let colDiv = document.createElement("div");
                colDiv.classList.add("col");
                colDiv.appendChild(img);

                imagesContainer.appendChild(colDiv);
            });

        });
});