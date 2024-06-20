document.addEventListener('DOMContentLoaded', () => {
    const aboutUsLink = document.getElementById('about-us');
    const cartLink = document.getElementById('cart');
    const loginSignupLink = document.getElementById('login-signup');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const signupButton = document.getElementById('signup-button');
    const loginForm = document.getElementById('login-form');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    const buyButton = document.getElementById('buy-button');

    // Initialize cart
    let cart = [];

    aboutUsLink.addEventListener('click', () => {
        alert('Charan');
    });

    cartLink.addEventListener('click', () => {
        alert('Cart is clicked');
        // Here you would display the cart items in a modal or a new section
    });

    loginSignupLink.addEventListener('click', () => {
        loginModal.style.display = "block";
    });

    closeModal.addEventListener('click', () => {
        loginModal.style.display = "none";
    });

    signupButton.addEventListener('click', () => {
        alert('Sign Up button clicked');
        // Add logic for sign-up process
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        // Add logic for login process (e.g., send credentials to backend)
        console.log(`Username: ${username}, Password: ${password}`);
        loginModal.style.display = "none";
    });

    // Function to update cart count
    function updateCartCount() {
        cartCountElement.textContent = cart.length;
    }

    // Function to calculate total price in the cart
    function calculateCartTotal() {
        let total = 0;
        cart.forEach(item => {
            total += item.price;
        });
        return total;
    }

    // Update cart total initially
    updateCartCount();
    cartTotalElement.textContent = calculateCartTotal();

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
                cart.push({ name: shirt.name, price: shirt.price }); // Assuming shirt.price is available
                updateCartCount();
                cartTotalElement.textContent = calculateCartTotal();
            });

            shirtItem.appendChild(shirtImg);
            shirtItem.appendChild(tryOnButton);
            shirtItem.appendChild(addToCartButton);
            shirtContainer.appendChild(shirtItem);
        });
    }

    fetchShirts();

    // Buy button click event
    buyButton.addEventListener('click', () => {
        alert('Buy button clicked');
        // Add logic to proceed with the purchase
        // E.g., send cart details to backend for processing
    });
});
