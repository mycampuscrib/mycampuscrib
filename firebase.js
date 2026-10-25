import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCY0U8Z7R9jOiOrV2vuFuWVvPPHpp_CKk64",
  authDomain: "mcc-crib.firebaseapp.com",
  projectId: "mcc-crib",
  storageBucket: "mcc-crib.firebasestorage.app",
  messagingSenderId: "204303349302",
  appId: "1:204303349302:web:67995141845b49be7aca97",
  measurementId: "G-MK4EG9E901"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;