document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

//Dark Mode
var headerImg = document.querySelector('.jumbotron');

var lightMode = document.getElementById('lightMode');

lightMode.addEventListener("click", ()=>{
  headerImg.style.backgroundImage = "url('img/cover_back_light.png')";
})

var darkMode = document.getElementById('darkMode');

darkMode.addEventListener("click", ()=>{
  headerImg.style.backgroundImage = "url('img/cover_back_dark.png')";
})

if (localStorage.getItem("mode") == "dark") {
    headerImg.style.backgroundImage = "url('img/cover_back_dark.png')";
}
else{
    headerImg.style.backgroundImage = "url('img/cover_back_light.png')";
}


//Responsive Jumbotron

var headerImgResponsive = document.querySelector('.jumbotron-responsive');


lightMode.addEventListener("click", ()=>{
  headerImgrResponsive.style.backgroundImage = "url('img/cover_back_light_responsive.png')";      // GASTÓN - IMAGEN RESPONSIVE
})

darkMode.addEventListener("click", ()=>{
  headerImgResponsive.style.backgroundImage = "url('img/cover_back_dark_responsive.png')";        // GASTÓN - IMAGEN RESPONSIVE
})

if (localStorage.getItem("mode") == "dark") {
    headerImgResponsive.style.backgroundImage = "url('img/cover_back_dark_responsive.png')";      // GASTÓN - IMAGEN RESPONSIVE
}
else{
    headerImgResponsive.style.backgroundImage = "url('img/cover_back_light_responsive.png')";     // GASTÓN - IMAGEN RESPONSIVE
}