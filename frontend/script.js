// ...existing code...
/*
  Basic frontend script for index.html:
  - Loads products from API (uses config.API_URL if available)
  - Renders product grid into an element with id="products"
  - Simple search and category filter (elements: #search, #categoryFilter)
  - Add-to-cart stored in localStorage under "shopCart"
  - Gracefully degrades if expected DOM elements or config are missing
*/

(() => {
  const API_BASE = (typeof config !== 'undefined' && config.API_URL) ? config.API_URL : '';

  // Utility: fetch JSON with basic error handling
  async function fetchJson(path) {
    try {
      const res = await fetch(`${API_BASE}${path}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('fetchJson error', err);
      return null;
    }
  }

  // Cart helpers (localStorage)
  const CART_KEY = 'shopCart';
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // optional event for other scripts
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: cart.length } }));
  }
  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
  }

  // Render product cards
  function createProductCard(p) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image || 'extra.avif'}" alt="${p.name || 'Product'}" loading="lazy">
      <h3 class="product-title">${escapeHtml(p.name || '')}</h3>
      <p class="product-price">₹${(p.price || 0).toFixed(2)}</p>
      <button class="add-cart">Add to cart</button>
    `;
    const btn = card.querySelector('.add-cart');
    btn.addEventListener('click', () => addToCart(p));
    return card;
  }

  // Simple HTML escape for product strings
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Main render flow
  async function loadAndRenderProducts() {
    const container = document.getElementById('products');
    if (!container) return;
    container.innerHTML = '<p>Loading products...</p>';

    const data = await fetchJson('/api/products') || await fetchJson('/products') || [];
    // Accept different shapes: array or { products: [] }
    const products = Array.isArray(data) ? data : (data && data.products) ? data.products : [];

    if (!products.length) {
      container.innerHTML = '<p>No products available.</p>';
      return;
    }

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    products.forEach(p => fragment.appendChild(createProductCard(p)));
    container.appendChild(fragment);

    // populate category filter if present
    const categorySelect = document.getElementById('categoryFilter');
    if (categorySelect) {
      const categories = Array.from(new Set(products.map(x => x.category).filter(Boolean)));
      categorySelect.innerHTML = `<option value="">All</option>` + categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
      categorySelect.addEventListener('change', () => applyFilters(products));
    }

    // search input hookup
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.addEventListener('input', () => applyFilters(products));
    }
  }

  // Apply client-side filters (search + category)
  function applyFilters(products) {
    const container = document.getElementById('products');
    if (!container) return;
    const q = (document.getElementById('search')?.value || '').toLowerCase().trim();
    const cat = document.getElementById('categoryFilter')?.value || '';
    const filtered = products.filter(p => {
      const matchesQ = !q || (p.name && p.name.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q));
      const matchesCat = !cat || p.category === cat;
      return matchesQ && matchesCat;
    });
    container.innerHTML = '';
    if (!filtered.length) {
      container.innerHTML = '<p>No products match your search.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    filtered.forEach(p => frag.appendChild(createProductCard(p)));
    container.appendChild(frag);
  }

  // Update any cart count UI element
  function updateCartCountBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    const count = getCart().reduce((s, i) => s + (i.qty || 0), 0);
    badge.textContent = count > 0 ? String(count) : '';
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderProducts();
    updateCartCountBadge();
    window.addEventListener('cart:updated', updateCartCountBadge);
  });

})();

// Backend API integration (using fetch directly to avoid module issues)
const API_BASE = "http://localhost:5000/api";

// Fetch products from backend
async function loadProductsFromBackend() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    const data = await response.json();
    console.log("Backend products:", data);
    return data.products || [];
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return [];
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  const products = await loadProductsFromBackend();
  if (products.length > 0) {
    console.log(`Loaded ${products.length} products from backend`);
  }
});
