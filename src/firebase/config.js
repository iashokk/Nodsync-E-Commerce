// ===== src/firebase/config.js =====
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCc1tpb030o8TozvSeEMRYah4Sq9w-0a4U",
    authDomain: "e-commerce-f6a15.firebaseapp.com",
    projectId: "e-commerce-f6a15",
    storageBucket: "e-commerce-f6a15.firebasestorage.app",
    messagingSenderId: "981190781834",
    appId: "1:981190781834:web:f26b3d522d28209f63f673",
    measurementId: "G-G8BZXK9ZBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
