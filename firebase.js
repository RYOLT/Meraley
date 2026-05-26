// ============================================================
// firebase.js — Módulo compartido MERALEY
// Importar en script.js, signin.html, signup.html, jams.html
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics }  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ─── CONFIG ──────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyC-_drZTirWMatRuo5wqx2o7aBJ6gnplPg",
  authDomain: "merme-db.firebaseapp.com",
  projectId: "merme-db",
  storageBucket: "merme-db.firebasestorage.app",
  messagingSenderId: "667177586343",
  appId: "1:667177586343:web:031089153e2233598dd582",
  measurementId: "G-0P6FFGBM6J"
};

const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth      = getAuth(app);
const db        = getFirestore(app);

export {
  app, auth, db,
  // Auth helpers
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  // Firestore helpers
  collection, doc, getDoc, getDocs, setDoc, updateDoc,
  addDoc, arrayUnion, arrayRemove, increment,
  serverTimestamp, query, where, orderBy
};