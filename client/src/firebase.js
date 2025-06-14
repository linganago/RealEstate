// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-fb3fc.firebaseapp.com",
  projectId: "real-estate-fb3fc",
  storageBucket: "real-estate-fb3fc.appspot.com", 
  messagingSenderId: "552305335397",
  appId: "1:552305335397:web:a946f1e692b784a077ba8c",
  measurementId: "G-0ZB0WYC2V9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
