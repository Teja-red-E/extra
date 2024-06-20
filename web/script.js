document.addEventListener('DOMContentLoaded', () => {
    const aboutUsLink = document.getElementById('about-us');
    const cartLink = document.getElementById('cart');
    const cartCountElement = document.getElementById('cart-count');

    aboutUsLink.addEventListener('click', () => {
        alert('Charan');
    });

    cartLink.addEventListener('click', () => {
        alert('Cart is clicked');
        // Here you would display the cart items in a modal or a new section
    });

    // Function to update cart count
    function updateCartCount(count) {
        cartCountElement.textContent = count;
    }

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
                // Add logic for trying on the shirt
            });

            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Add to Cart';
            addToCartButton.addEventListener('click', () => {
                // Add logic for adding the shirt to the cart
                let currentCount = parseInt(cartCountElement.textContent, 10);
                updateCartCount(currentCount + 1);
            });

            shirtItem.appendChild(shirtImg);
            shirtItem.appendChild(tryOnButton);
            shirtItem.appendChild(addToCartButton);
            shirtContainer.appendChild(shirtItem);
        });
    }

    fetchShirts();
});
