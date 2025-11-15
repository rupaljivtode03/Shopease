// cart.js
export function getCart(){ 
  try {
    return JSON.parse(localStorage.getItem('cart')||'[]'); 
  } catch {
    return [];
  }
}

export function saveCart(c){ 
  localStorage.setItem('cart', JSON.stringify(c)); 
}

export function addToCart(item){
  const cart = getCart();
  const idx = cart.findIndex(x=>x.id===item.id);
  if(idx>-1){ 
    cart[idx].qty = (cart[idx].qty || 1) + 1; 
    cart[idx].subtotal = cart[idx].qty * cart[idx].price; 
  } else {
    cart.push({
      ...item, 
      qty: 1, 
      subtotal: item.price || 0
    });
  }
  saveCart(cart); 
  updateBadge();
}

export function removeFromCart(itemId){
  const cart = getCart();
  const filtered = cart.filter(x => x.id !== itemId);
  saveCart(filtered);
  updateBadge();
}

export function updateCartItem(itemId, qty){
  const cart = getCart();
  const idx = cart.findIndex(x=>x.id===itemId);
  if(idx > -1){
    cart[idx].qty = qty;
    cart[idx].subtotal = qty * cart[idx].price;
    saveCart(cart);
    updateBadge();
  }
}

export function updateBadge(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+(i.qty||0),0);
  const el = document.querySelector('#cart-count') || document.querySelector('.cart-count');
  if(el) el.textContent = count > 0 ? count : '';
  
  // Also dispatch event for other listeners
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count } }));
}

export function getCartTotal(){
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.subtotal || item.price * (item.qty || 1)), 0);
}
