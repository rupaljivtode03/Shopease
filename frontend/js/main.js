// Firebase is initialized in firebase-config.js
// Get auth and firestore instances
let auth, db;
if (typeof firebase !== 'undefined') {
  try {
    auth = firebase.auth();
    db = firebase.firestore();
  } catch (error) {
    console.error('Firebase setup error:', error);
  }
}

// API base for backend calls
const API_BASE = 'http://localhost:5000/api';

/* -------------------------
   SIGN IN FORM HANDLER
   ------------------------- */
// Wait for DOM to be ready before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
  const signinForm = document.getElementById('signinForm');
  if (signinForm) {
    const i_msg = document.getElementById('i_msg');

    function showMessage(text, color) {
      if (i_msg) {
        i_msg.style.color = color || '#333';
        i_msg.textContent = text;
      }
    }

    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('i_email').value.trim();
      const password = document.getElementById('i_password').value;

      if (!email || !password) {
        showMessage('Please enter both email and password.', 'crimson');
        return;
      }

      showMessage('Signing in...', '#666');

      try {
        // Wait for Firebase to be ready
        if (typeof firebase === 'undefined' || !firebase.auth) {
          showMessage('Firebase not loaded. Please refresh the page.', 'crimson');
          return;
        }

        // Sign in with Firebase
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        showMessage('Login successful! Redirecting...', 'green');
        
        // Wait a moment for auth state to update, then redirect
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Redirect to home page
        // Use window.location.replace to avoid back button issues
        window.location.replace('index.html');

      } catch (error) {
        console.error('Sign in error:', error);
        let errorMessage = 'Login failed. ';
        if (error.code === 'auth/user-not-found') {
          errorMessage += 'No account found with this email.';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage += 'Incorrect password.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage += 'Invalid email address.';
        } else if (error.code === 'auth/user-disabled') {
          errorMessage += 'This account has been disabled.';
        } else {
          errorMessage += error.message;
        }
        showMessage(errorMessage, 'crimson');
      }
    });
  }
});

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
      console.error("Order error:", err);
      // Check if backend is running
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        alert("Cannot connect to backend server.\n\nPlease make sure:\n1. Backend is running: python app.py\n2. Backend is on port 5000");
      } else {
        alert("Error placing order: " + err.message);
      }
    });
  }
});
