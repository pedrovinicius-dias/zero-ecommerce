document.addEventListener('DOMContentLoaded', () => {

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: productCard.dataset.id || `product-${Date.now()}`,
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('R$ ', '').replace(',', '.')),
                image: productCard.querySelector('img').src
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            const existingProduct = cart.find(item => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                product.quantity = 1;
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`"${product.name}" foi adicionado ao seu carrinho!`);
            
            updateCartDisplay();
        });
    });

    const updateCartDisplay = () => {
        const cartContainer = document.getElementById('cart-container');
        const emptyMessage = document.getElementById('empty-cart-message');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            if (cartContainer) cartContainer.innerHTML = '<p id="empty-cart-message" style="text-align: center;">Seu carrinho está vazio.</p>';
            updateCartSummary(0);
            return;
        }

        if (emptyMessage) emptyMessage.style.display = 'none';

        if (cartContainer) {
            cartContainer.innerHTML = '';
            let subtotal = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Quantidade: ${item.quantity}</p>
                    </div>
                    <span class="item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
                    <button class="remove-item-btn" data-id="${item.id}">Remover</button>
                `;
                cartContainer.appendChild(cartItemElement);
            });

            updateCartSummary(subtotal);
        }
    };

    const updateCartSummary = (subtotal) => {
        const shipping = 50; 
        const total = subtotal + shipping;
        
        const subtotalElement = document.getElementById('cart-subtotal');
        const shippingElement = document.getElementById('cart-shipping');
        const totalElement = document.getElementById('cart-total');

        if (subtotalElement) subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        if (shippingElement) shippingElement.textContent = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
        if (totalElement) totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    };

    if (document.getElementById('cart-container')) {
        document.getElementById('cart-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                const productIdToRemove = e.target.dataset.id;
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                cart = cart.filter(item => item.id !== productIdToRemove);
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            }
        });
    }

    updateCartDisplay();

});