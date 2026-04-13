// Product Data
const products = {
    women: [
        { id: 'w1', name: 'فستان سهرة أنيق', price: 1200, img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=500&q=80' },
        { id: 'w2', name: 'بلوزة كلاسيكية حرير', price: 450, img: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=500&q=80' },
        { id: 'w3', name: 'جاكيت شتوي فاخر', price: 850, img: 'https://images.unsplash.com/photo-1550634621-e7811c750e33?auto=format&fit=crop&w=500&q=80' },
        { id: 'w4', name: 'حقيبة يد عصرية', price: 300, img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=500&q=80' }
    ],
    men: [
        { id: 'm1', name: 'بدلة رجالي رسمية', price: 2500, img: 'https://images.unsplash.com/photo-1594938298596-03372c05af23?auto=format&fit=crop&w=500&q=80' },
        { id: 'm2', name: 'قميص قطن 100%', price: 400, img: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e23?auto=format&fit=crop&w=500&q=80' },
        { id: 'm3', name: 'بنطلون جينز كاجوال', price: 550, img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80' },
        { id: 'm4', name: 'حذاء كلاسيكي جلد', price: 750, img: 'https://images.unsplash.com/photo-1614252339460-e1b18a3680fb?auto=format&fit=crop&w=500&q=80' }
    ],
    kids: [
        { id: 'k1', name: 'طقم بناتي صيفي', price: 350, img: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=500&q=80' },
        { id: 'k2', name: 'تيشيرت ولادي مطبوع', price: 200, img: 'https://images.unsplash.com/photo-1519238396253-abebafb21a8a?auto=format&fit=crop&w=500&q=80' },
        { id: 'k3', name: 'جاكيت شتوي أطفال', price: 450, img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80' },
        { id: 'k4', name: 'حذاء رياضي للأطفال', price: 300, img: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=500&q=80' }
    ]
};

// Cart State
let cart = [];

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const toast = document.getElementById('toast');

// Initialize Products
function renderProducts() {
    ['women', 'men', 'kids'].forEach(category => {
        const grid = document.getElementById(`${category}-grid`);
        grid.innerHTML = products[category].map(product => `
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">${product.price} ج.م</div>
                    <button class="add-to-cart" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.img}')">
                        <i class="fas fa-cart-plus"></i> أضف إلى السلة
                    </button>
                </div>
            </div>
        `).join('');
    });
}

// Cart Functions
function addToCart(id, name, price, img) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, img, quantity: 1 });
    }
    updateCartUI();
    showToast();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Update items wrapper
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">سلة المشتريات فارغة</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price * item.quantity} ج.م</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                    </div>
                </div>
                <div class="remove-btn" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerText = total;
}

// Checkout to WhatsApp
function checkout() {
    if (cart.length === 0) {
        alert('السلة فارغة برجاء اضافة منتجات اولا');
        return;
    }

    const phoneNumber = "201090958733"; // The requested number
    
    let message = "مرحباً، أريد طلب المنتجات التالية:%0a%0a";
    
    cart.forEach((item, index) => {
        message += `${index + 1}- ${item.name} (الكمية: ${item.quantity}) - السعر: ${item.price * item.quantity} ج.م%0a`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `%0aالإجمالي: ${total} ج.م`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// UI Event Listeners
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    overlay.classList.add('open');
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('open');
});

overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('open');
});

checkoutBtn.addEventListener('click', checkout);

// Toast Notification
function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});
