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
    const yellowStar = '<span class="fa fa-star checked"></span>';
    const blackStar = '<span class="fa fa-star"></span>';

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
const comentarios = document.getElementById("comments");

function comJson(comments){
    for(let comment of comments){
        comentarios.innerHTML += `
        <div class="commentsHechos">
            <ul class='list-group'>
                <li class="list-group-item">
                    <div>
                        <strong>${comment.user}</strong>
                        <small class='text-muted'> &nbsp; - ${comment.dateTime} - &nbsp; </small>
                        ${estrellas(comment.score)}
                        <br>
                        ${comment.description}
                    </div>
                </li>
            </ul>
        </div>
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

// Inicio punto 4

function obtenerPuntuacionHTML(puntuacion) {
    let starClass = "";

    for (let i = 0; i < puntuacion; i++) {
        starClass += '<span class="fa fa-star checked"></span>';
    }
    for (let i = puntuacion; i < 5; i++) {
        starClass += '<span class="fa fa-star"></span>';
    }

    return starClass;
}

function agregarComentario(opinion, fechaFormateada, actualUser, puntuacion) {
    const comentarioHTML = `
    <li class="list-group-item">
        <div>
            <strong>${actualUser}</strong>
            <small class='text-muted'> &nbsp; - ${fechaFormateada} - &nbsp; </small>
            ${obtenerPuntuacionHTML(puntuacion)}
            <br>
            ${opinion}
        </div>
    </li>`;

    comentarios.innerHTML += comentarioHTML;
}

const commentForm = document.getElementById('commentForm');

commentForm.addEventListener('submit', e => {
    e.preventDefault();

    const puntuacion = document.getElementById('puntuacion').value;
    const opinion = document.getElementById('opinion').value;
    const fechaHora = new Date();
    const fechaFormateada = fechaHora.toISOString();
    const actualUser = localStorage.getItem('usuario');

    agregarComentario(opinion, fechaFormateada, actualUser, puntuacion);

    commentForm.reset();
});




// Fin punto 4
