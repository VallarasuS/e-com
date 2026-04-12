function redirect(path) {
    window.location.assign(path)
}

function login() {

    user = document.getElementById('auth-user').value
    pass = document.getElementById('auth-pass').value

    if (user == 'admin' && pass == 'admin') {
        redirect("index.html")
    }
    else {
        show_alert("Invalid user name or password")
    }
}

function show_alert(text) {
    window.alert(text)
}

function signup() {

    current = 0
    groups = document.getElementsByClassName("field-group")
    length = groups?.length || 0

    function next(reverse = false) {

        groups[current].classList.toggle("visible")

        if (reverse)
            current--
        if (current < 0)
            current = length - 1
        else {
            current++
            if (current >= length)
                current = 0
        }

        if (current == length - 1) {
            document.getElementById("signup-button-next").classList.toggle("visible")
        }

        groups[current].classList.toggle("visible")
    }

    function submit() {

    }

    function createOption(id, start, stop, step) {

        el = document.getElementById(id)

        for (let i = start; i <= stop; i = i + step) {

            value = document.createTextNode(`${String(i).padStart(2, 0)}`)

            option = document.createElement("option")
            option.appendChild(value)
            option.setAttribute("value", i)

            el.appendChild(option)
        }
    }

    function populate() {

        createOption("auth-dob-day", 1, 31, 1)
        createOption("auth-dob-month", 1, 12, 1)
    }

    return { next, submit, populate, show_alert }
}

// Global Cart functionality
function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id, name, price, image, qty: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(name + " added to cart!");
}

function updateCartDisplay() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartItemsContainer = document.getElementById('cart-items-container');
    let summarySubtotal = document.getElementById('summary-subtotal');
    let summaryTax = document.getElementById('summary-tax');
    let summaryTotal = document.getElementById('summary-total');
    let checkoutSummaryTotal = document.getElementById('checkout-summary-total');
    let checkoutGrandTotal = document.getElementById('checkout-grand-total');
    let checkoutTotalItems = document.getElementById('checkout-total-items');
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                let itemTotal = item.price * item.qty;
                subtotal += itemTotal;
                
                let row = document.createElement('div');
                row.className = 'cart-item';
                row.id = 'cart-row-' + item.id;
                row.setAttribute('data-testid', 'cart-row-' + item.id);
                row.innerHTML = `
                    <div style=\"display: flex; gap: 15px; align-items: center;\">
                        <img src=\"${item.image}\" alt=\"${item.name}\" style=\"width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius)\">
                        <div>
                            <h4>${item.name}</h4>
                            <p style=\"margin: 0; color: var(--muted-text)\">SKU: ${item.id}</p>
                        </div>
                    </div>
                    <div>$${item.price.toFixed(2)}</div>
                    <div>
                        <input type=\"number\" id=\"qty-item-${item.id}\" name=\"qty-item-${item.id}\" data-testid=\"qty-item-${item.id}\" class=\"qty-input\" value=\"${item.qty}\" min=\"1\" onchange=\"updateItemQty('${item.id}', this.value)\" style=\"width: 60px; padding: 5px; text-align: center;\">
                    </div>
                    <div>
                        <button type=\"button\" id=\"remove-btn-${item.id}\" name=\"remove-btn-${item.id}\" data-testid=\"remove-btn-${item.id}\" class=\"remove-btn\" onclick=\"removeCartItem('${item.id}')\" style=\"background: #ff4d4d; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: var(--radius);\">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(row);
            });
        }
        
        if (summarySubtotal) {
            let tax = subtotal * 0.08;
            let total = subtotal + tax;
            summarySubtotal.innerText = '$' + subtotal.toFixed(2);
            summaryTax.innerText = '$' + tax.toFixed(2);
            summaryTotal.innerText = '$' + total.toFixed(2);
        }
    }

    if (checkoutSummaryTotal) {
        let subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        let tax = subtotal * 0.08;
        let total = subtotal + tax;
        let numItems = cart.reduce((acc, item) => acc + item.qty, 0);
        
        if (checkoutTotalItems) checkoutTotalItems.innerText = 'Total Items (' + numItems + ')';
        checkoutSummaryTotal.innerText = '$' + subtotal.toFixed(2);
        checkoutGrandTotal.innerText = '$' + total.toFixed(2);
    }
}

function updateItemQty(id, qty) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(item => item.id === id);
    if (item) {
        item.qty = parseInt(qty);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function removeCartItem(id) {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

document.addEventListener('DOMContentLoaded', updateCartDisplay);