// Cart.js - Gestión del carrito de compras (Simple y entendible)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartTotal = 0;
let appliedDiscount = 0;

// Inicializar cuando la página se carga
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    updateCartCount();
    setupEventListeners();
});

// Configurar todos los event listeners
function setupEventListeners() {
    // Botón aplicar descuento
    const applyDiscountBtn = document.getElementById('applyDiscount');
    if (applyDiscountBtn) {
        applyDiscountBtn.addEventListener('click', applyDiscount);
    }

    // Botón limpiar carrito
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            showModal('¿Vaciar carrito?', '¿Estás seguro de eliminar todos los productos?', clearCart);
        });
    }

    // Botón checkout
    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

// Mostrar u ocultar secciones según si hay productos en el carrito
function updateCartDisplay() {
    const emptyCartDiv = document.getElementById('emptyCart');
    const cartItemsDiv = document.getElementById('cartItems');
    const cartSummaryDiv = document.getElementById('cartSummary');

    if (cart.length === 0) {
        // Mostrar carrito vacío
        emptyCartDiv.style.display = 'block';
        cartItemsDiv.style.display = 'none';
        cartSummaryDiv.style.display = 'none';
    } else {
        // Mostrar productos y resumen
        emptyCartDiv.style.display = 'none';
        cartItemsDiv.style.display = 'block';
        cartSummaryDiv.style.display = 'block';
        renderCartItems();
        updateSummary();
    }
}

// Crear la lista de productos en el carrito
function renderCartItems() {
    const container = document.getElementById('cartItemsList');
    container.innerHTML = '';

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image || '../img/ChatGPTdevweb.png'}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Categoría: ${item.category || 'Servicios'}</p>
                </div>
            </div>
            <div class="cart-item-price">$${formatPrice(item.price)}</div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-subtotal">$${formatPrice(item.price * item.quantity)}</div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')" title="Eliminar">×</button>
        `;
        container.appendChild(itemElement);
    });
}

// Cambiar la cantidad de un producto
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        saveCart();
        updateCartDisplay();
        updateCartCount();
        showNotification('Cantidad actualizada');
    }
}

// Eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    updateCartCount();
    showNotification('Producto eliminado del carrito');
}

// Vaciar todo el carrito
function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
    updateCartCount();
    showNotification('Carrito vaciado');
    closeModal();
}

// Calcular y mostrar el resumen del carrito
function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = (subtotal * appliedDiscount) / 100;
    const total = subtotal - discount;

    document.getElementById('subtotal').textContent = `$${formatPrice(subtotal)}`;
    
    const discountElement = document.getElementById('discount');
    if (discount > 0) {
        discountElement.textContent = `-$${formatPrice(discount)}`;
        discountElement.parentElement.style.display = 'flex';
    } else {
        discountElement.parentElement.style.display = 'none';
    }
    
    document.getElementById('total').textContent = `$${formatPrice(total)}`;
    cartTotal = total;
}

// Aplicar código de descuento
function applyDiscount() {
    const discountCode = document.getElementById('discountCode').value.trim().toLowerCase();
    const validCodes = {
        'devart10': 10,
        'welcome20': 20,
        'save15': 15
    };

    if (validCodes[discountCode]) {
        appliedDiscount = validCodes[discountCode];
        document.getElementById('discountCode').value = '';
        updateSummary();
        showNotification(`¡Descuento del ${appliedDiscount}% aplicado!`);
    } else if (discountCode === '') {
        showNotification('Por favor ingresa un código de descuento');
    } else {
        showNotification('Código de descuento inválido');
    }
}

// Proceder al checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }

    showModal(
        'Confirmar Pedido', 
        `¿Confirmas tu pedido por un total de $${formatPrice(cartTotal)}?`,
        function() {
            showNotification('¡Pedido procesado exitosamente!');
            cart = [];
            saveCart();
            updateCartDisplay();
            updateCartCount();
            closeModal();
        }
    );
}

// Actualizar contador del carrito en la navegación
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        if (totalItems > 0) {
            element.textContent = totalItems;
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// Guardar carrito en el navegador
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Mostrar modal de confirmación (Simple)
function showModal(title, message, onConfirm) {
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirm');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'flex';
    
    // Limpiar eventos anteriores y agregar nuevo
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener('click', function() {
        if (onConfirm) onConfirm();
        closeModal();
    });
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.style.display = 'none';
}

// Mostrar notificaciones simples
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        z-index: 10001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Formatear precios (Simple)
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Event listeners para cerrar modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('modalCancel');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Cerrar modal al hacer clic fuera
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Enter en el input de descuento
    const discountInput = document.getElementById('discountCode');
    if (discountInput) {
        discountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyDiscount();
            }
        });
    }
});

// Hacer funciones disponibles globalmente
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
