// ============================================================
// FIREBASE CONFIGURATION — SHAPES BY SATIINDER KAUR
// ============================================================
// INSTRUCTIONS: Replace the placeholder values below with
// your real Firebase project config.
//
// To get your config:
// 1. Go to https://console.firebase.google.com
// 2. Open your project → ⚙️ Project Settings
// 3. Scroll to "Your apps" → Click your web app
// 4. Copy the firebaseConfig object and paste it below
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
         onAuthStateChanged, signOut, updateProfile,
         GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query,
         where, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ▼▼▼ FIREBASE CONFIG — shapes-boutique-e269d ▼▼▼
const firebaseConfig = {
  apiKey: "AIzaSyCwql3AFjd6T1RdJCEqCKk9ZgdYNoHm8jo",
  authDomain: "shapes-boutique-e269d.firebaseapp.com",
  projectId: "shapes-boutique-e269d",
  storageBucket: "shapes-boutique-e269d.firebasestorage.app",
  messagingSenderId: "627271312603",
  appId: "1:627271312603:web:0afbda55887eaad78b98fe"
};
// ▲▲▲ END OF CONFIG ▲▲▲

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    doc,
    getDoc
};
