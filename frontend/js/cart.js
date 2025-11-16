// Cart Management Functions

// Get cart from localStorage
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Add item to cart
function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id || Date.now().toString(),
      name: product.name,
      price: parseFloat(product.price),
      img: product.img,
      quantity: 1
    });
  }
  
  saveCart(cart);
  return cart;
}

// Remove item from cart
function removeFromCart(itemId) {
  const cart = getCart();
  const filteredCart = cart.filter(item => item.id !== itemId);
  saveCart(filteredCart);
  return filteredCart;
}

// Update item quantity in cart
function updateQuantity(itemId, newQuantity) {
  if (newQuantity <= 0) {
    return removeFromCart(itemId);
  }
  
  const cart = getCart();
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity = newQuantity;
  }
  saveCart(cart);
  return cart;
}

// Get cart total
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart count (total items)
function getCartCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart count badge
function updateCartCount() {
  const count = getCartCount();
  const badge = document.getElementById('cartBadge');
  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

// Display cart items on cart page
function displayCartItems() {
  const container = document.getElementById('cartItemsContainer');
  const cart = getCart();
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started!</p>
        <a href="index.html">Continue Shopping</a>
      </div>
    `;
    document.getElementById('checkoutBtn').disabled = true;
    updateCartSummary();
    return;
  }
  
  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-img" style="background-image: url('${item.img}');"></div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button onclick="decreaseQuantity('${item.id}')">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQuantity('${item.id}')">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem('${item.id}')">
            <i class="fa-solid fa-trash"></i> Remove
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  document.getElementById('checkoutBtn').disabled = false;
  updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
  const subtotal = getCartTotal();
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;
  
  document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}

// Increase quantity
function increaseQuantity(itemId) {
  const cart = getCart();
  const item = cart.find(item => item.id === itemId);
  if (item) {
    updateQuantity(itemId, item.quantity + 1);
    displayCartItems();
  }
}

// Decrease quantity
function decreaseQuantity(itemId) {
  const cart = getCart();
  const item = cart.find(item => item.id === itemId);
  if (item) {
    if (item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    } else {
      removeItem(itemId);
    }
    displayCartItems();
  }
}

// Remove item
function removeItem(itemId) {
  if (confirm('Are you sure you want to remove this item from cart?')) {
    removeFromCart(itemId);
    displayCartItems();
  }
}

// Checkout handler
document.addEventListener('DOMContentLoaded', function() {
  // Display cart items when page loads
  if (document.getElementById('cartItemsContainer')) {
    displayCartItems();
  }
  
  // Checkout button handler
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      const cart = getCart();
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      
      // Redirect to order page with cart data
      const total = getCartTotal();
      const items = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
      window.location.href = `order.html?items=${encodeURIComponent(items)}&total=${total}`;
    });
  }
  
  // Update cart count on page load
  updateCartCount();
});

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.getCart = getCart;
window.getCartTotal = getCartTotal;
window.getCartCount = getCartCount;
window.updateCartCount = updateCartCount;
window.displayCartItems = displayCartItems;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeItem = removeItem;

