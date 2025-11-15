// main.js
import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { addToCart } from "./cart.js";
import { API_BASE } from "./config.js";

async function loadProducts() {
  const shop = document.querySelector(".shop");
  if(!shop) return;
  
  shop.innerHTML = "<p>Loading products...</p>";
  
  try {
    // Try loading from Firebase first
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    
    if(snap.empty) {
      // Fallback to backend API
      await loadProductsFromBackend();
      return;
    }
    
    shop.innerHTML = "";
    snap.forEach(docSnap => {
      const p = docSnap.data();
      shop.innerHTML += `
        <div class="box">
          <div class="img" style="background-image:url('${p.image || 'box1.png'}')"></div>
          <h3>${p.title || 'Product'}</h3>
          <p>₹${p.price || 0}</p>
          <button class="add-to-cart" data-id="${docSnap.id}">Add to cart</button>
        </div>`;
    });
  } catch (error) {
    console.error("Error loading from Firebase:", error);
    // Fallback to backend API
    await loadProductsFromBackend();
  }
}

async function loadProductsFromBackend() {
  const shop = document.querySelector(".shop");
  if(!shop) return;
  
  try {
    const response = await fetch(`${API_BASE}/products`);
    const data = await response.json();
    const products = data.products || [];
    
    if(products.length === 0) {
      shop.innerHTML = "<p>No products available.</p>";
      return;
    }
    
    shop.innerHTML = "";
    products.forEach(p => {
      shop.innerHTML += `
        <div class="box">
          <div class="img" style="background-image:url('${p.image || 'box1.png'}')"></div>
          <h3>${p.title || 'Product'}</h3>
          <p>₹${p.price || 0}</p>
          <button class="add-to-cart" data-id="${p.id}">Add to cart</button>
        </div>`;
    });
  } catch (error) {
    console.error("Error loading from backend:", error);
    shop.innerHTML = "<p>Error loading products. Please try again later.</p>";
  }
}

// Handle add to cart
document.addEventListener('click', async (e) => {
  if(e.target.matches('.add-to-cart')){
    const id = e.target.dataset.id;
    
    try {
      // Try to get product from Firebase
      const productDoc = await getDoc(doc(db, "products", id));
      let productData;
      
      if(productDoc.exists()) {
        productData = { id: productDoc.id, ...productDoc.data() };
      } else {
        // Fallback to backend API
        const response = await fetch(`${API_BASE}/products/${id}`);
        const data = await response.json();
        productData = data;
      }
      
      if(productData) {
        addToCart({
          id: productData.id,
          title: productData.title,
          price: productData.price,
          image: productData.image
        });
        alert("Product added to cart!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  }
});

// Initialize
loadProducts();
