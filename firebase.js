// MyCampusCrib - Firebase Live for Hostels Only
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCY08Uz79RjO1rOV2vuFuWVvPHpp_CkK64",
  authDomain: "mcc-crib.firebaseapp.com",
  projectId: "mcc-crib",
  storageBucket: "mcc-crib.firebasestorage.app",
  messagingSenderId: "204303349302",
  appId: "1:204303349302:web:67995141845b49be7aca97",
  measurementId: "G-MK4EG8E901"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Collection names used across index.html, manager-dashboard.html and admin pages.
// Firestore creates a collection the first time a document is written to it.
export const COL = {
  hostels: "hostels",
  roommates: "roommates",
  hostelRequests: "hostelRequests",
  reviews: "reviews",
  favourites: "favourites",
  inquiries: "inquiries",
  reports: "reports"
};