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
            // Logic to try on the shirt
        });

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.addEventListener('click', () => {
            // Logic to add the shirt to the cart
        });

        shirtItem.appendChild(shirtImg);
        shirtItem.appendChild(tryOnButton);
        shirtItem.appendChild(addToCartButton);

        shirtContainer.appendChild(shirtItem);
    });
}

fetchShirts();
