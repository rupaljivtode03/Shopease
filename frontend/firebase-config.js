// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDYV1znQQkTjujhHJP9A2i7p1BrfflEJ8",
  authDomain: "shop-e0d52.firebaseapp.com",
  projectId: "shop-e0d52",
  storageBucket: "shop-e0d52.firebasestorage.app",
  messagingSenderId: "289578405810",
  appId: "1:289578405810:web:116adfc3d3f16443fb5eab",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

