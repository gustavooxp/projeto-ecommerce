// Variáveis globais
let currentProduct = null; // Variável para armazenar o produto atual
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Carrega o carrinho do localStorage ou cria um carrinho vazio
updateCartCount(); // Atualiza o contador de itens no carrinho

// Funções do Modal
function openModal(productId, productName, productPrice, productDescription, productImage) {
    // Preenche os detalhes do modal com as informações do produto
    document.getElementById('modal-product-name').textContent = productName;
    document.getElementById('modal-product-description').textContent = productDescription;
    document.getElementById('modal-product-price').textContent = productPrice.toFixed(2).replace('.', ',');
    document.getElementById('modal-product-image').src = productImage;

    // Exibe o modal de quantidade
    document.getElementById('quantity-modal').style.display = 'block';

    // Resetar a quantidade para 1
    document.getElementById('quantity').value = 1;
}

function closeModal() {
    // Fecha o modal de quantidade
    document.getElementById('quantity-modal').style.display = 'none';
}

function proceedToPayment() {
    // Calcula o valor total do carrinho
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Salva o valor total no localStorage
    localStorage.setItem('cartTotal', total.toFixed(2));
    showToast('Redirecionando para a página de pagamento...'); // Exibe uma mensagem de toast
    // Redireciona para a página de pagamento
    window.location.href = 'pagina-de-pagamento.html';
}

function proceedToGoBack() {
    // Redireciona de volta para a página inicial
    window.location.href = 'index.html';
}

function incrementQuantity() {
    const input = document.getElementById('quantity');
    if (input.value < 5) {
        input.value = parseInt(input.value) + 1; // Aumenta a quantidade no modal
    }
}

function decrementQuantity() {
    const input = document.getElementById('quantity');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1; // Diminui a quantidade no modal
    }
}

// Funções do Carrinho
function addToCart() {
    // Captura os dados do modal
    const productName = document.getElementById('modal-product-name').textContent;
    const productPrice = parseFloat(document.getElementById('modal-product-price').textContent.replace(',', '.'));
    const productQuantity = parseInt(document.getElementById('quantity').value, 10);
    const productImage = document.getElementById('modal-product-image').src;

    // Verifica se o produto já está no carrinho
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        // Se o produto já estiver no carrinho, atualiza a quantidade
        const newQuantity = existingProduct.quantity + productQuantity;
        if (newQuantity > 5) {
            showToast('Você só pode adicionar até 5 unidades deste item no total.');
            return; // Impede adicionar mais do que 5 unidades
        } else {
            existingProduct.quantity = newQuantity; // Atualiza a quantidade
        }
    } else {
        // Se o produto não estiver no carrinho, adiciona-o
        if (productQuantity > 5) {
            showToast('Você só pode adicionar até 5 unidades deste item no total.');
            return; // Impede adicionar mais do que 5 unidades
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: productQuantity,
                image: productImage
            });
        }
    }

    // Atualiza o contador de itens no carrinho
    updateCartCount();

    // Atualiza a interface do carrinho
    updateCartUI();

    // Fecha o modal
    closeModal();

    // Abre o carrinho
    openCart();
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems; // Exibe a quantidade total de itens no carrinho
}

function formatPrice(price) {
    // Formata o preço para o formato de moeda brasileiro
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = ''; // Limpa os itens do carrinho
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        // Cria um item do carrinho na interface
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <h4>${item.name}</h4>
            <p>Quantidade: ${item.quantity}</p>
            <p>Preço unitário: ${formatPrice(item.price)}</p>
            <p>Subtotal: ${formatPrice(itemTotal)}</p>
            <button onclick="removeFromCart(${item.id})">Remover</button>
        `;
        cartItems.appendChild(itemElement);
    });

    // Exibe o total do carrinho
    cartTotal.textContent = formatPrice(total);
}

function removeFromCart(productId) {
    // Remove o item do carrinho
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart)); // Atualiza o carrinho no localStorage
    updateCartCount(); // Atualiza o contador de itens
    updateCartDisplay(); // Atualiza a interface do carrinho
}

function toggleCart() {
    const cartPanel = document.getElementById('shopping-cart');
    // Alterna a visibilidade do carrinho
    if (cartPanel.style.display === 'block') {
        cartPanel.style.display = 'none';
    } else {
        cartPanel.style.display = 'block';
    }
}

// Fechar o carrinho quando clicar fora dele
document.addEventListener('click', (e) => {
    const cartPanel = document.getElementById('shopping-cart');
    const cartIcon = document.querySelector('.cart-icon');

    if (cartPanel.classList.contains('active') &&
        !cartPanel.contains(e.target) &&
        !cartIcon.contains(e.target)) {
        cartPanel.classList.remove('active');
    }
});

// Fechar o modal quando clicar fora dele
window.onclick = function (event) {
    const modal = document.getElementById('quantity-modal');
    if (event.target == modal) {
        closeModal(); // Fecha o modal se clicar fora dele
    }
}

// Inicializa o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay(); // Atualiza a interface do carrinho
});

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Limpa o conteúdo atual do carrinho
    cartItemsContainer.innerHTML = '';

    // Atualiza os itens do carrinho na interface
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Quantidade: ${item.quantity}</p>
                <p>Preço: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
            </div>
        `;

        // Adicionar botão de remover
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.className = 'remove-item';
        removeButton.onclick = () => {
            cart.splice(index, 1); // Remove o item do array
            updateCartUI(); // Atualiza o carrinho
            updateCartCount(); // Atualiza o contador
        };

        cartItem.appendChild(removeButton);
        cartItemsContainer.appendChild(cartItem);
    });

    // Atualizar o total do carrinho
    cartTotalElement.textContent = total.toFixed(2).replace('.', ',');
}

function openCart() {
    const cartPanel = document.getElementById('shopping-cart');
    cartPanel.style.display = 'block'; // Abre o painel do carrinho
}

function closeCart() {
    const cartPanel = document.getElementById('shopping-cart');
    cartPanel.style.display = 'none'; // Fecha o painel do carrinho
}

function openPaymentModal() {
    // Verifica se o carrinho está vazio antes de prosseguir
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio. Adicione algum produto antes de prosseguir para o pagamento.');
        return;
    }
    const paymentModal = document.getElementById('payment-modal');
    const paymentItemsContainer = document.getElementById('payment-items');
    const paymentTotalElement = document.getElementById('payment-total');

    // Limpar o conteúdo atual do modal de pagamento
    paymentItemsContainer.innerHTML = '';

    // Adicionar os itens do carrinho ao modal de pagamento
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const paymentItem = document.createElement('div');
        paymentItem.classList.add('payment-item');
        paymentItem.innerHTML = `
            <div class="payment-item-details">
                <img src="${item.image}" alt="${item.name}" class="payment-item-image">
                <div>
                    <h4>${item.name}</h4>
                    <p>Quantidade: ${item.quantity}</p>
                    <p>Preço unitário: R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    <p>Subtotal: R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>
        `;
        paymentItemsContainer.appendChild(paymentItem);
    });

    // Atualizar o total no modal de pagamento
    paymentTotalElement.textContent = total.toFixed(2).replace('.', ',');

    // Exibir o modal de pagamento
    paymentModal.style.display = 'block';
}

function closePaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    paymentModal.style.display = 'none'; // Fecha o modal de pagamento
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';

    // Remove o toast após 3 segundos
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Exemplo de items no carrinho para renderização inicial
const cartItems = [
    { id: 1, name: 'Item 1', price: 10 },
    { id: 2, name: 'Item 2', price: 20 },
    { id: 3, name: 'Item 3', price: 30 },
];

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Limpa os itens existentes

    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - R$${item.price}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.className = 'remove-item';
        removeButton.onclick = () => removeItem(item.id);

        listItem.appendChild(removeButton);
        cartItemsContainer.appendChild(listItem);
    });
}

function removeItem(itemId) {
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1); // Remove o item do array
        renderCart(); // Re-renderiza o carrinho
    }
}

// Inicializa o carrinho
renderCart();
