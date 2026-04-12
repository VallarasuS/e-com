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

let allProducts = [];

async function fetchProducts() {
    try {
        let response = await fetch('./assets/products.json');
        if (!response.ok) throw new Error("Network response was not ok");
        allProducts = await response.json();
        
        const path = window.location.pathname;
        if (path.includes('index') || path === '/' || path.endsWith('/')) {
            renderFeatured();
        } else if (path.includes('product.html')) {
            loadProductPage();
        } else if (path.includes('search.html')) {
            renderProductGrid(allProducts, 'search-grid-container');
        } else if (path.includes('deals.html')) {
            renderProductGrid(allProducts.filter(p => p.isDeal), 'product-grid-container');
        } else if (path.includes('new-arrivals.html')) {
            renderProductGrid(allProducts.filter(p => p.isNewArrival), 'product-grid-container');
        } else if (path.includes('best-sellers.html')) {
            renderProductGrid(allProducts.filter(p => p.isBestSeller), 'product-grid-container');
        } else if (path.includes('shop.html') || path.includes('category.html')) {
            renderProductGrid(allProducts, 'product-grid-container');
        }
        
    } catch (e) {
        console.error("Failed to load products.json", e);
    }
}

function renderProductGrid(products, containerId) {
    let container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    if (products.length === 0) {
        container.innerHTML = '<p>No products found matching your criteria.</p>';
        return;
    }
    
    products.forEach(p => {
        let card = document.createElement('div');
        card.className = 'card product-card';
        card.innerHTML = `
            <a id="link-${p.id}" href="./product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
            <h4>${p.name}</h4>
            <p>$${parseFloat(p.price).toFixed(2)}</p>
            <button type="button" id="add-to-cart-${p.id}" name="add-to-cart-${p.id}" data-testid="add-to-cart-${p.id}" class="fill-width" onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

function renderFeatured() {
    let featuredPhonesContainer1 = document.getElementById('featured-phones-1');
    let featuredPhonesContainer2 = document.getElementById('featured-phones-2');
    let featuredProducts = allProducts.filter(p => p.isFeatured);
    
    let buildFeaturedHtml = () => {
        return featuredProducts.map(p => `
            <div style="flex: 1; padding: 5px; text-align: center;">
                <a href="./product.html?id=${p.id}"><img src="${p.image}" width="100%" height="auto" style="max-height: 200px; object-fit: contain;"></a>
                <div style="font-size: small; margin-top:10px;">${p.name}</div>
            </div>
        `).join('');
    };
    
    if (featuredPhonesContainer1) featuredPhonesContainer1.innerHTML = buildFeaturedHtml();
    if (featuredPhonesContainer2) featuredPhonesContainer2.innerHTML = buildFeaturedHtml();
}

function applyFilters() {
    let containerId = document.getElementById('search-grid-container') ? 'search-grid-container' : 'product-grid-container';
    if (!document.getElementById(containerId)) return;
    
    let filtered = [...allProducts];
    
    let searchInput = document.getElementById('search-query');
    if (searchInput && searchInput.value.trim() !== '') {
        let query = searchInput.value.trim().toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query))
        );
    }
    
    const path = window.location.pathname;
    if (path.includes('deals.html')) filtered = filtered.filter(p => p.isDeal);
    if (path.includes('new-arrivals.html')) filtered = filtered.filter(p => p.isNewArrival);
    if (path.includes('best-sellers.html')) filtered = filtered.filter(p => p.isBestSeller);
    
    let cats = [];
    if (document.getElementById('filter-cat-electronics')?.checked) cats.push('electronics');
    if (document.getElementById('filter-cat-fashion')?.checked) cats.push('fashion');
    if (document.getElementById('filter-cat-toys')?.checked) cats.push('toys');
    if (cats.length > 0) filtered = filtered.filter(p => cats.includes(p.category));
    
    let brandSelect = document.getElementById('filter-brand');
    if (brandSelect && brandSelect.selectedOptions) {
        let brands = Array.from(brandSelect.selectedOptions).map(opt => opt.value);
        if (brands.length > 0 && !brands.includes('')) filtered = filtered.filter(p => brands.includes(p.brand));
    }
    
    let priceSlider = document.getElementById('filter-price-slider');
    if (priceSlider) {
        let maxPrice = parseFloat(priceSlider.value);
        filtered = filtered.filter(p => p.price <= maxPrice);
    }
    
    let availInStock = document.getElementById('filter-avail-instock');
    let availOutStock = document.getElementById('filter-avail-outstock');
    if (availInStock?.checked) {
        filtered = filtered.filter(p => p.availability === 'instock');
    } else if (availOutStock?.checked) {
        filtered = filtered.filter(p => p.availability === 'outstock');
    }
    
    renderProductGrid(filtered, containerId);
}

function loadProductPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    
    let product = allProducts.find(p => p.id === productId);
    if (!product) product = allProducts.find(p => p.id === 'phone-1') || allProducts[0];
    
    if (product) {
        let pdImage = document.getElementById('pd-image');
        if (pdImage) pdImage.src = product.image;
        
        let pdName = document.getElementById('pd-name');
        if (pdName) pdName.innerText = product.name;
        
        let pdBrand = document.getElementById('pd-brand');
        if (pdBrand) pdBrand.innerText = product.brand.toUpperCase();
        
        let pdPrice = document.getElementById('pd-price');
        if (pdPrice) pdPrice.innerText = '₹ ' + product.price.toFixed(2);
        
        let pdDesc = document.getElementById('pd-desc');
        if (pdDesc) pdDesc.innerText = product.description;
        
        let pdRating = document.getElementById('pd-rating');
        if (pdRating) pdRating.innerText = product.rating + ' ⭐';
        
        let pdReviews = document.getElementById('pd-reviews');
        if (pdReviews) pdReviews.innerText = '(' + product.reviews + ')';
        
        let addBtn = document.getElementById('btn-add-to-cart');
        if (addBtn) {
            addBtn.onclick = () => {
                addToCart(product.id, product.name, product.price, product.image);
                window.location.href='./cart.html';
            };
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    
    let filterBtn = document.getElementById('apply-filters-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', applyFilters);
    }
    
    fetchProducts();
});