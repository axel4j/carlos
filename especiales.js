
const combos = [
  {
    id: 1,
    nombre: "Combo 1",
    descripcion: "Palomitas + Refresco grande",
    precio: 120,
    img: "combo1.jpg"
  },
  {
    id: 2,
    nombre: "Combo 2",
    descripcion: "Hotdog + Palomitas + Refresco",
    precio: 150,
    img: "combo2.jpg"
  },
  {
    id: 3,
    nombre: "Combo 3",
    descripcion: "Nachos + Refresco",
    precio: 130,
    img: "combo3.jpg"
  },
  {
    id: 4,
    nombre: "Combo 4",
    descripcion: "2 Hotdogs + Palomitas + 2 Refrescos",
    precio: 180,
    img: "combo4.jpg"
  },
  {
    id: 5,
    nombre: "Combo 5",
    descripcion: "Palomitas + Nachos",
    precio: 110,
    img: "combo5.jpg"
  },
];

const alimentos = [
  { id: 101, nombre: "Palomitas", precio: 60, img: "ali1.jpg" },
  { id: 102, nombre: "Refresco", precio: 40, img: "ali2.jpg" },
  { id: 103, nombre: "Hotdog", precio: 50, img: "ali3.jpg" },
  { id: 104, nombre: "Nachos", precio: 50, img: "ali4.jpg" },
  { id: 105, nombre: "Chocolate", precio: 30, img: "ali5.jpg" },
  { id: 106, nombre: "Pizza", precio: 90, img: "ali6.jpg" },
  { id: 107, nombre: "Helado", precio: 45, img: "ali7.jpg" },
  { id: 108, nombre: "Agua", precio: 25, img: "ali8.jpg" },
  { id: 109, nombre: "Cerveza", precio: 70, img: "ali9.jpg" },
  { id: 110, nombre: "Galletas", precio: 35, img: "ali10.jpg" },
];


function crearProductoHTML(producto) {
  return `
    <div class="producto" data-id="${producto.id}" data-precio="${producto.precio}" data-nombre="${producto.nombre}">
      <img src="${producto.img}" alt="${producto.nombre}" />
      <div class="producto-name">${producto.nombre}</div>
      <div class="producto-precio">$${producto.precio}</div>
      <div class="cantidad-container">
        <label for="cantidad-${producto.id}">Cantidad:</label>
        <input type="number" min="0" value="0" id="cantidad-${producto.id}" />
      </div>
    </div>
  `;
}

function cargarProductos() {
  const combosContainer = document.getElementById("combos-container");
  combosContainer.innerHTML = combos.map(crearProductoHTML).join("");

  const alimentosContainer = document.getElementById("alimentos-container");
  alimentosContainer.innerHTML = alimentos.map(crearProductoHTML).join("");

  // Agregar eventos para recalcular total al cambiar cantidad
  const inputsCantidad = document.querySelectorAll(".cantidad-container input");
  inputsCantidad.forEach(input => {
    input.addEventListener("input", calcularTotal);
  });
}

function calcularTotal() {
  let total = 0;
  const productos = document.querySelectorAll(".producto");
  productos.forEach(prod => {
    const cantidad = parseInt(prod.querySelector("input").value) || 0;
    const precio = parseFloat(prod.getAttribute("data-precio"));
    total += cantidad * precio;
  });
  document.getElementById("total-container").textContent = `Total a pagar: $${total}`;
  return total;
}

document.getElementById("btn-pagar").addEventListener("click", () => {
  const total = calcularTotal();
  if (total <= 0) {
    alert("Selecciona al menos un producto con cantidad mayor a cero.");
    return;
  }
  document.getElementById("form-pago").style.display = "flex";
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});

document.getElementById("form-pago").addEventListener("submit", function(e) {
  e.preventDefault();

  const total = calcularTotal();
  if (total <= 0) {
    alert("Selecciona al menos un producto con cantidad mayor a cero.");
    return;
  }

  const nombreTarjeta = document.getElementById("nombre").value.trim();
  const numeroTarjeta = document.getElementById("numero").value.trim();
  const vencimiento = document.getElementById("vencimiento").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  if (!nombreTarjeta || !numeroTarjeta || !vencimiento || !cvv) {
    alert("Completa todos los datos de la tarjeta.");
    return;
  }

  // Recolectar productos comprados y cantidades
  const productosComprados = [];
  document.querySelectorAll(".producto").forEach(prod => {
    const cantidad = parseInt(prod.querySelector("input").value) || 0;
    if (cantidad > 0) {
      productosComprados.push({
        nombre: prod.getAttribute("data-nombre"),
        precio: parseFloat(prod.getAttribute("data-precio")),
        cantidad
      });
    }
  });

  // Generar PDF con jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Recibo de compra - Tu Cine", 20, 20);

  doc.setFontSize(12);
  doc.text(`Nombre en tarjeta: ${nombreTarjeta}`, 20, 30);
  doc.text("Productos comprados:", 20, 40);

  let y = 50;
  productosComprados.forEach(item => {
    doc.text(
      `${item.cantidad} x ${item.nombre} - $${item.precio} c/u = $${item.cantidad * item.precio}`,
      25,
      y
    );
    y += 10;
  });

  doc.text(`Total pagado: $${total}`, 20, y + 10);
  doc.text("Por favor, presenta este recibo al recoger tu pedido en la sucursal.", 20, y + 20);

  doc.save("Recibo_TuCine.pdf");

  alert("¡Compra finalizada! Descarga el recibo y preséntalo en la sucursal.");

  // Reiniciar formulario y cantidades
  this.reset();
  document.querySelectorAll(".cantidad-container input").forEach(input => (input.value = 0));
  document.getElementById("total-container").textContent = "Total a pagar: $0";
  this.style.display = "none";
});

window.onload = () => {
  cargarProductos();
  document.getElementById("form-pago").style.display = "none";
};
