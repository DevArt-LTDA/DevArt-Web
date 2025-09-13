<script src="../Assets/Shop.js"></script>


// Array donde guardaremos los productos seleccionados
let carrito = [];

// Seleccionar elementos
const listaCarrito = document.getElementById('lista-carrito');
const totalElement = document.getElementById('total');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

// Escuchar clicks en los botones "Agregar al carrito"
document.querySelectorAll('.add-to-cart').forEach(boton => {
    boton.addEventListener('click', (e) => {
        const productoElemento = e.target.closest('.producto');

        const producto = {
            id: productoElemento.dataset.id,
            nombre: productoElemento.dataset.nombre,
            precio: parseFloat(productoElemento.dataset.precio),
            cantidad: 1
        };

        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(p => p.id === producto.id);

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push(producto);
        }

        actualizarCarrito();
    });
});

// Actualiza la interfaz del carrito
function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = `${producto.nombre} x${producto.cantidad} - $${producto.precio * producto.cantidad}`;
        listaCarrito.appendChild(li);

        total += producto.precio * producto.cantidad;
    });

    totalElement.textContent = total.toFixed(2);
}

// Vaciar carrito
vaciarCarritoBtn.addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
});
