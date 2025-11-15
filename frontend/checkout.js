// checkout.js
import { db } from "./firebase-config.js";
import { auth } from "./firebase-config.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { API_BASE } from "./config.js";

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

    if(!address || !phone){
        alert("Please fill in all fields!");
        return;
    }

    const cartItems = getCart();
    if(cartItems.length === 0){
        alert("Your cart is empty!");
        return;
    }

    const total = cartItems.reduce((sum, item)=> sum + (item.subtotal || item.price * (item.qty || 1)), 0);

    try {
        // Option 1: Save to Firebase directly
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

        // Option 2: Also save to backend API
        try {
            await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.uid,
                    items: cartItems,
                    total: total,
                    address: address,
                    phone: phone,
                    paymentMethod: "COD",
                    status: "Pending"
                })
            });
        } catch (backendError) {
            console.warn("Backend API call failed, but Firebase save succeeded:", backendError);
        }

        // Clear cart
        localStorage.removeItem("cart");
        alert("Order Placed Successfully!");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
    }
}

// Button listener
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector("#placeOrderBtn");
    if(btn){
        btn.addEventListener("click", placeOrder);
    }
});
