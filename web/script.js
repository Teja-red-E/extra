// script.js

// Example function to fetch and display shirt images dynamically
async function fetchShirts() {
    const response = await fetch('/api/shirts'); // Assuming Streamlit app serves shirts via this endpoint
    const shirts = await response.json();

    const shirtContainer = document.querySelector('.shirt-container');
    shirtContainer.innerHTML = '';

    shirts.forEach(shirt => {
        const shirtItem = document.createElement('div');
        shirtItem.classList.add('shirt-item');

        const shirtImg = document.createElement('img');
        shirtImg.src = shirt.imageUrl;
        shirtImg.alt = shirt.name;

        const tryOnButton = document.createElement('button');
        tryOnButton.textContent = 'Try On';
        tryOnButton.addEventListener('click', () => tryOnShirt(shirt.id));

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.addEventListener('click', () => addToCart(shirt.id));

        shirtItem.appendChild(shirtImg);
        shirtItem.appendChild(tryOnButton);
        shirtItem.appendChild(addToCartButton);
        shirtContainer.appendChild(shirtItem);
    });
}

// Function to handle "About Us"
function aboutUs() {
    alert("My name is Charan.");
}

// Function to add shirt to cart
function addToCart(shirtId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(shirtId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = cart.length;
}

// Fetch shirts on page load
fetchShirts();
updateCartCount();
