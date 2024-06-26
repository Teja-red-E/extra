// script.js

// Example function to fetch and display shirt images dynamically
async function fetchShirts() {
    const response = await fetch('/api/shirts'); // Assuming Streamlit app serves shirts via this endpoint
    const shirts = await response.json();

    const shirtContainer = document.querySelector('.shirt-container');
    shirtContainer.innerHTML = '';

    shirts.forEach((shirt, index) => {
        const shirtItem = document.createElement('div');
        shirtItem.classList.add('shirt-item');

        const shirtImg = document.createElement('img');
        shirtImg.src = shirt.imageUrl;
        shirtImg.alt = shirt.name;

        const tryOnButton = document.createElement('button');
        tryOnButton.textContent = 'Try On';
        tryOnButton.addEventListener('click', () => {
            selectShirt(index);
        });

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.addEventListener('click', () => {
            addToCart(index);
        });

        shirtItem.appendChild(shirtImg);
        shirtItem.appendChild(tryOnButton);
        shirtItem.appendChild(addToCartButton);
        shirtContainer.appendChild(shirtItem);
    });
}

function selectShirt(shirtIndex) {
    // Functionality to select shirt for try-on
    console.log(`Selected shirt: ${shirt_info[shirtIndex].name}`);
    // Additional code to handle try-on
}

function addToCart(shirtIndex) {
    const cartItems = document.getElementById('cart-items');
    const cartItem = document.createElement('li');
    cartItem.textContent = `${shirt_info[shirtIndex].name} - ${shirt_info[shirtIndex].price}`;
    cartItems.appendChild(cartItem);
}

// Fetch shirts on page load
fetchShirts();
