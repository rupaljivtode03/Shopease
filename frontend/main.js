// main.js
import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadProducts() {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const shop = document.querySelector(".shop");
  if(!shop) return;
  shop.innerHTML = "";
  snap.forEach(doc => {
    const p = doc.data();
    shop.innerHTML += `
      <div class="box">
        <div class="img" style="background-image:url('${p.image}')"></div>
        <h3>${p.title}</h3>
        <p>₹${p.price}</p>
        <button class="add-to-cart" data-id="${doc.id}">Add to cart</button>
      </div>`;
  });
}
loadProducts();
document.addEventListener('click', e=>{
  if(e.target.matches('.add-to-cart')){
    const id = e.target.dataset.id;
    // find product data from page or fetch doc by id (simple approach: fetch doc)
    // minimal implementation: fetch doc then addToCart({...})
  }
});
