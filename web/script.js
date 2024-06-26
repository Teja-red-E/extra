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
        tryOnButton.addEventListener('click', () => {
            // Functionality to trigger try-on
            selectShirt(shirt);
        });

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.addEventListener('click', () => {
            addToCart(shirt);
        });

        shirtItem.appendChild(shirtImg);
        shirtItem.appendChild(tryOnButton);
        shirtItem.appendChild(addToCartButton);
        shirtContainer.appendChild(shirtItem);
    });
}

function selectShirt(shirt) {
    // Functionality to select shirt for try-on
    console.log(`Selected shirt: ${shirt.name}`);
    // Additional code to handle try-on
}

function addToCart(shirt) {
    const cartItems = document.getElementById('cart-items');
    const cartItem = document.createElement('li');
    cartItem.textContent = `${shirt.name} - ${shirt.price}`;
    cartItems.appendChild(cartItem);
}

// Fetch shirts on page load
fetchShirts();
