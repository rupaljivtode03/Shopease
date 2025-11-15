// checkout.js
import { db } from "./firebase-config.js";
import { auth } from "./firebase-config.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Read cart from localStorage
function getCart(){
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

async function placeOrder() {
    const user = auth.currentUser;
    if(!user){
        alert("Please login first!");
        return;
    }

    // Get form values
    const address = document.querySelector("#address").value;
    const phone = document.querySelector("#phone").value;

    const cartItems = getCart();
    const total = cartItems.reduce((sum, item)=> sum + item.subtotal, 0);

    await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cartItems,
        total: total,
        address: address,
        phone: phone,
        paymentMethod: "COD",
        status: "Pending",
        createdAt: serverTimestamp()
    });

    // Clear cart
    localStorage.removeItem("cart");
    alert("Order Placed Successfully!");
    window.location.href = "index.html";
}

// Button listener
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector("#placeOrderBtn");
    if(btn){
        btn.addEventListener("click", placeOrder);
    }
});
