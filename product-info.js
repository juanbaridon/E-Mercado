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

            // 4. Cargar los comentarios de la api (punto 3)
            const URLCOM = "https://japceibal.github.io/emercado-api/products_comments/" + productId + ".json";
            cargarComments(URLCOM);
        })
        .catch(error => {
            console.error("Error al obtener la información del producto:", error);
        });
});

// funcion de score y stars negras y amarillas 

function estrellas(score) {
    let stars = '';
    const maxStars = 5;
    const yellowStar = '⭐';
    const blackStar = '★';

    for (let i = 0; i < maxStars; i++) {
        if (i < score) {
            stars += yellowStar;
        } else {
            stars += blackStar;
        }
    }
    return stars;
}

// function que muestra los comentarios que vienen del JSON
function comJson(comments){
    let comentarios = document.getElementById("comments");
    for(let comment of comments){
        comentarios.innerHTML += `
        <div class="commentsHechos">
          <div>
            <p><strong>${comment.user}</strong></p>
          </div>  
          <div class="text-muted">
            <small> &nbsp; - ${comment.dateTime} - &nbsp; </small>
          </div>
          <div>${estrellas(comment.score)}</div>
        </div>
        <div>${comment.description}</div> 
        <hr>
    ` 
    }
}

// function que carga los comentarios pertenecientes al json 
async function cargarComments(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        comJson(data);
    } catch (error) {
        console.error("Imposible cargar los comentarios, ha ocurrido un error inesperado:", error);
    }
}