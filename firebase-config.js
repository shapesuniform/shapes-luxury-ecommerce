// ============================================================
// FIREBASE CONFIGURATION — SHAPES BY SATIINDER KAUR
// ============================================================
// NOTE: Firebase API keys for web apps are INTENTIONALLY public.
// Security is enforced via Firebase Security Rules (firestore.rules),
// not by hiding this key. It is safe to commit this file to GitHub.
// See: https://firebase.google.com/docs/projects/api-keys
// ============================================================


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
         onAuthStateChanged, signOut, updateProfile,
         GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query,
         where, orderBy, doc, getDoc, updateDoc, setDoc, deleteDoc, onSnapshot, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
    getDoc,
    updateDoc,
    setDoc,
    deleteDoc,
    onSnapshot,
    increment
};

