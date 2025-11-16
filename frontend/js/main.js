// ...existing code...
// Add API base for backend calls (placed after firebase config initialization)
const API_BASE = 'http://localhost:5000/api';
// ...existing code...
/* -------------------------
   PLACE ORDER BUTTONS (use backend)
   ------------------------- */
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("place-order")) {
    const btn = e.target;

    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      img: btn.dataset.img,
      time: new Date().toISOString()
    };

    // POST to backend instead of using Firestore client in frontend
    fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: (auth && auth.currentUser) ? auth.currentUser.uid : null,
        items: [product],
        total: product.price,
        address: '', // populate from UI if available
        phone: '',
        paymentMethod: 'COD'
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.id) {
        btn.textContent = "Order Placed ✓";
        btn.style.background = "#0f9d58";
        setTimeout(() => {
          btn.textContent = "Place Order";
          btn.style.background = "";
        }, 1500);
      } else {
        throw new Error(data.error || 'Order failed');
      }
    })
    .catch(err => {
      alert("Error placing order");
      console.error(err);
    });
  }
});
// ...existing code...