// Contenedor donde se mostrarán las películas
const carteleraDiv = document.querySelector(".cartelera");

let peliculas = [];

// Función para cargar el JSON y renderizar
function cargarPeliculas() {
    fetch("peliculas.json")
        .then(response => response.json())
        .then(data => {
            peliculas = data;
            renderizarPeliculas();
        })
        .catch(error => {
            console.error("Error cargando peliculas.json:", error);
            carteleraDiv.innerHTML = "<p>Error al cargar las películas.</p>";
        });
}

// Función para crear las tarjetas HTML de cada película
function renderizarPeliculas() {
    carteleraDiv.innerHTML = ""; // limpiar

    peliculas.forEach(peli => {
        const article = document.createElement("article");
        article.classList.add("pelicula");

        // Imagen (solo para ejemplo, puedes adaptar o agregar url en JSON)
        let imgSrc = obtenerImagenPorTitulo(peli.titulo);

        article.innerHTML = `
            <img src="${imgSrc}" alt="${peli.titulo}" />
            <h3>${peli.titulo}</h3>
            <p>${peli.descripcion}</p>
            <div class="botones">
                <button class="btn-info">Más info</button>
                <button class="btn-compra">Comprar boleto</button>
            </div>
        `;

        // Añadir eventos a botones
        article.querySelector(".btn-info").addEventListener("click", () => abrirInfo(peli.titulo));
        article.querySelector(".btn-compra").addEventListener("click", () => abrirCompra(peli.titulo));

        carteleraDiv.appendChild(article);
    });
}

// Función para obtener imagen por título (puedes ampliarla o manejarlo desde JSON)
function obtenerImagenPorTitulo(titulo) {
    const urls = {
        "La Mujer Rey": "https://image.tmdb.org/t/p/w300/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
        "Top Gun: Maverick": "https://image.tmdb.org/t/p/w300/6kbAMLteGO8yyewYau6bJ683sw7.jpg",
        "Avatar: El camino del agua": "https://image.tmdb.org/t/p/w300/7qiNvx78d10RTQ4fMNtQIPp16NM.jpg",
        "Misión imposible: Sentencia mortal": "https://image.tmdb.org/t/p/w300/6trMROtrqvo8j6tBqreT4jdw7tV.jpg",
        "Black Panther: Wakanda Forever": "https://image.tmdb.org/t/p/w300/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
        "John Wick 4": "https://image.tmdb.org/t/p/w300/7Rkgm1LlwrhVnWbY0VhUqP9CBKp.jpg",
        "Doctor Strange: Multiverso de la Locura": "https://image.tmdb.org/t/p/w300/qsdjk9oAKSQMWs0Vt5Pyfh6O4GZ.jpg",
        "Jurassic World: Dominion": "https://image.tmdb.org/t/p/w300/eNI7PtK6DEYgZmHWP9gQNuff8pv.jpg",
        "The Batman": "https://image.tmdb.org/t/p/w300/lyP4WNmUiiOgl4g2z7ywE0z6SGF.jpg"
    };
    return urls[titulo] || "https://via.placeholder.com/300x450?text=Sin+Imagen";
}

// Función para abrir modal info
function abrirInfo(titulo) {
    const peli = peliculas.find(p => p.titulo === titulo);
    if (!peli) return;

    document.getElementById("titulo-info").textContent = peli.titulo;
    document.getElementById("duracion-info").textContent = peli.duracion;
    document.getElementById("descripcion-info").textContent = peli.descripcion;

    document.getElementById("modal-info").style.display = "block";
}

// Función para abrir modal compra
function abrirCompra(titulo) {
    const peli = peliculas.find(p => p.titulo === titulo);
    if (!peli) return;

    document.getElementById("titulo-compra").textContent = peli.titulo;

    // Cargar salas
    const salasSelect = document.getElementById("salas-select");
    salasSelect.innerHTML = "";
    peli.salas.forEach(sala => {
        const option = document.createElement("option");
        option.textContent = sala;
        salasSelect.appendChild(option);
    });

    // Cargar horarios
    const horariosSelect = document.getElementById("horarios-select");
    horariosSelect.innerHTML = "";
    peli.horarios.forEach(horario => {
        const option = document.createElement("option");
        option.textContent = horario;
        horariosSelect.appendChild(option);
    });

    document.getElementById("modal-compra").style.display = "block";
}

// Función para cerrar modales
function cerrarModal(id) {
    document.getElementById(id).style.display = "none";
}

// Inicializa la carga al abrir la página
document.addEventListener("DOMContentLoaded", cargarPeliculas);
