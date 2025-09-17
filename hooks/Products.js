// Products.js - Funcionalidad específica para la página de productos
// Este archivo es usado por Products.html y trabaja junto con script.js

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar contador del carrito al cargar la página
    updateCartCountFromStorage();
    
    // Agregar efectos visuales a los productos
    addProductAnimations();
});

// Actualizar contador desde localStorage
function updateCartCountFromStorage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const contador = document.querySelector('.cart-count');
    if (contador) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

// Agregar animaciones y efectos a los productos
function addProductAnimations() {
    const productos = document.querySelectorAll('.carousel-itemShop');
    
    // Efecto hover
    productos.forEach(producto => {
        producto.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        producto.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animación de entrada con IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Configurar animación inicial
    productos.forEach(producto => {
        producto.style.opacity = '0';
        producto.style.transform = 'translateY(30px)';
        producto.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(producto);
    });
}
