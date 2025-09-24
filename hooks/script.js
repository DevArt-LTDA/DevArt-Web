document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    function actualizarContadorCarrito() {
        const contador = document.querySelector('.cart-count');
        if (contador) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }
    actualizarContadorCarrito();
    window.DevArtCarrito = window.DevArtCarrito || {};
    window.DevArtCarrito.actualizar = actualizarContadorCarrito;
});
