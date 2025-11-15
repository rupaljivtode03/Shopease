// cart.js
export function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
export function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
export function addToCart(item){
  const cart = getCart();
  const idx = cart.findIndex(x=>x.id===item.id);
  if(idx>-1){ cart[idx].qty++; cart[idx].subtotal = cart[idx].qty*cart[idx].price; }
  else cart.push({...item, qty:1, subtotal:item.price});
  saveCart(cart); updateBadge();
}
export function updateBadge(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const el = document.querySelector('#cart-count');
  if(el) el.textContent = count;
}
