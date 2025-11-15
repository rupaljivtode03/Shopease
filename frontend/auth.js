// auth.js
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function register(email,password,name){
  const cred = await createUserWithEmailAndPassword(auth,email,password);
  await setDoc(doc(db,'users',cred.user.uid), {name, email, isAdmin:false, createdAt: serverTimestamp()});
}
export async function login(email,password){ return signInWithEmailAndPassword(auth,email,password); }
export function observeAuth(cb){ onAuthStateChanged(auth,user=>cb(user)); }
