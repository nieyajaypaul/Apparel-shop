/* ==========================================
   1. LOGIN & SESSION LOGIC
   ========================================== */

// This function runs on EVERY page to check if the user is logged in
function checkLoginStatus() {
    const loginLink = document.querySelector('nav a[href="login.html"]');
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true" && loginLink) {
        loginLink.innerText = "Logout";
        loginLink.href = "#";
        loginLink.onclick = function() {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userEmail");
            alert("Logged out successfully!");
            window.location.href = "index.html";
        };
    }
}

// Logic specifically for the Login Page form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;

        // Simple hardcoded credentials for testing
        if (email === "admin@shop.com" && password === "12345") {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", email);
            alert("Welcome back!");
            window.location.href = "index.html";
        } else {
            alert("Invalid credentials! Try admin@shop.com / 12345");
        }
    });
}

/* ==========================================
   2. CART CORE LOGIC
   ========================================== */

// Load existing cart or start empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price, qtyId) {
    let qtyInput = document.getElementById(qtyId);
    let quantityToAdd = parseInt(qtyInput.value);

    if (isNaN(quantityToAdd) || quantityToAdd < 1) {
        alert("Please enter a valid quantity");
        return;
    }

    // CHECK IF PRODUCT ALREADY EXISTS (Prevents separate rows for same item)
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += quantityToAdd;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            quantity: quantityToAdd
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} (Qty: ${quantityToAdd}) added to cart!`);
}

/* ==========================================
   3. CART DISPLAY & TABLE LOGIC
   ========================================== */

function displayCart() {
    let table = document.getElementById("cartTable");
    let totalText = document.getElementById("grandTotal");

    if (!table) return; // Exit if we aren't on the cart page

    // Clear the table (keeping only the header row)
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    let totalAmount = 0;

    cart.forEach((item, index) => {
        let row = table.insertRow();
        
        let p = Number(item.price);
        let q = Number(item.quantity);
        let subtotal = p * q;

        row.insertCell(0).innerText = item.name;
        row.insertCell(1).innerText = "₹" + p;
        row.insertCell(2).innerText = q;
        row.insertCell(3).innerText = "₹" + subtotal;
        
        // Add a Delete button for each specific row
        let actionCell = row.insertCell(4);
        actionCell.innerHTML = `<button onclick="removeItem(${index})" style="background:red; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Remove</button>`;

        totalAmount += subtotal;
    });

    if (totalText) {
        totalText.innerText = "Total Amount to Pay: ₹" + totalAmount;
    }
}

function removeItem(index) {
    cart.splice(index, 1); // Remove item from array
    localStorage.setItem("cart", JSON.stringify(cart)); // Update storage
    displayCart(); // Refresh table
}

function clearCart() {
    if (confirm("Are you sure you want to empty the cart?")) {
        cart = [];
        localStorage.removeItem("cart");
        displayCart();
    }
}

/* ==========================================
   4. INITIALIZE
   ========================================== */

// Run these whenever any page loads
checkLoginStatus();
if (document.getElementById("cartTable")) {
    displayCart();
}