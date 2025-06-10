import { jsPDF } from "./jspdf.umd.min.js";

const apiKey = "TU_API_KEY_TMDB"; // Consigue una API Key gratuita en TMDB
const urlPeliculas = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=es-ES&page=1`;

const contenedor = document.getElementById("contenedor-peliculas");
const selectPeliculas = document.getElementById("pelicula-select");
const selectHorarios = document.getElementById("horario-select");
const formulario = document.getElementById("formulario");

async function cargarPeliculas() {
  const res = await fetch(urlPeliculas);
  const data = await res.json();

  data.results.forEach(pelicula => {
    const card = document.createElement("div");
    card.className = "pelicula";
    card.innerHTML = `
      <h3>${pelicula.title}</h3>
      <img src="https://image.tmdb.org/t/p/w200${pelicula.poster_path}" alt="${pelicula.title}"/>
      <p>${pelicula.overview.substring(0, 100)}...</p>
    `;
    contenedor.appendChild(card);

    const option = document.createElement("option");
    option.value = pelicula.title;
    option.textContent = pelicula.title;
    selectPeliculas.appendChild(option);
  });
}

async function cargarHorarios() {
  const res = await fetch("horarios.json");
  const data = await res.json();
  data.horarios.forEach(horario => {
    const option = document.createElement("option");
    option.value = horario;
    option.textContent = horario;
    selectHorarios.appendChild(option);
  });
}

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const pelicula = selectPeliculas.value;
  const horario = selectHorarios.value;

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("🎟️ Boleto de Cine", 20, 20);
  doc.setFontSize(12);
  doc.text(`Nombre: ${nombre}`, 20, 40);
  doc.text(`Película: ${pelicula}`, 20, 50);
  doc.text(`Horario: ${horario}`, 20, 60);
  doc.text("¡Disfruta la función!", 20, 80);
  doc.save("boleto.pdf");
});

cargarPeliculas();
cargarHorarios();
