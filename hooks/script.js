// DevArt - Funcionalidad del Carrito de Compras
document.addEventListener('DOMContentLoaded', function() {
    // Array para almacenar productos del carrito
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Función para agregar productos al carrito
    function agregarAlCarrito(id, nombre, precio) {
        const productoExistente = carrito.find(item => item.id === id);
        
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push({
                id: id,
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }
        
        // Guardar en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Mostrar mensaje de confirmación
        mostrarMensajeConfirmacion(nombre);
        
        // Actualizar contador del carrito (si existe)
        actualizarContadorCarrito();
    }
    
    // Función para mostrar mensaje de confirmación
    function mostrarMensajeConfirmacion(nombreProducto) {
        // Crear elemento de mensaje
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-confirmacion';
        mensaje.innerHTML = `
            <div class="mensaje-contenido">
                <span class="icono">✅</span>
                <span class="texto">${nombreProducto} agregado al carrito</span>
            </div>
        `;
        
        // Agregar estilos
        mensaje.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            z-index: 10000;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', sans-serif;
            font-weight: 500;
        `;
        
        // Agregar al DOM
        document.body.appendChild(mensaje);
        
        // Animar entrada
        setTimeout(() => {
            mensaje.style.transform = 'translateX(0)';
        }, 100);
        
        // Animar salida y remover
        setTimeout(() => {
            mensaje.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(mensaje);
            }, 300);
        }, 3000);
    }
    
    // Función para actualizar contador del carrito
    function actualizarContadorCarrito() {
        const contador = document.querySelector('.cart-count');
        if (contador) {
            const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }
    
    // Event listeners para botones "Agregar al carrito"
    const botonesAgregar = document.querySelectorAll('.add-to-cart');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const producto = this.closest('.producto');
            const id = producto.dataset.id;
            const nombre = producto.dataset.nombre;
            const precio = parseInt(producto.dataset.precio);
            
            // Agregar efecto visual al botón
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            agregarAlCarrito(id, nombre, precio);
        });
    });
    
    // Función para obtener productos del carrito
    function obtenerCarrito() {
        return carrito;
    }
    
    // Función para limpiar carrito
    function limpiarCarrito() {
        carrito = [];
        localStorage.removeItem('carrito');
        actualizarContadorCarrito();
    }
    
    // Función para remover producto del carrito
    function removerDelCarrito(id) {
        carrito = carrito.filter(item => item.id !== id);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
    }
    
    // Función para calcular total del carrito
    function calcularTotal() {
        return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }
    
    // Exponer funciones globalmente para uso en otras páginas
    window.DevArtCarrito = {
        agregar: agregarAlCarrito,
        obtener: obtenerCarrito,
        limpiar: limpiarCarrito,
        remover: removerDelCarrito,
        total: calcularTotal,
        actualizar: actualizarContadorCarrito
    };
    
    // Inicializar contador al cargar la página
    actualizarContadorCarrito();
    
    // Efectos adicionales para mejorar la experiencia
    // Animación suave para los productos al hacer hover
    const productos = document.querySelectorAll('.carousel-itemShop');
    productos.forEach(producto => {
        producto.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        producto.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animación de entrada para los productos
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
    
    productos.forEach(producto => {
        producto.style.opacity = '0';
        producto.style.transform = 'translateY(30px)';
        producto.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(producto);
    });
});

// Función para formatear precios en pesos colombianos
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(precio);
}
