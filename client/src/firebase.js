// firebase.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBq3fO8MD_yj7SSLxM903JqUm90mDV3rws",
  authDomain: "real-estate-fb3fc.firebaseapp.com",
  projectId: "real-estate-fb3fc",
  storageBucket: "real-estate-fb3fc.appspot.com", // ✅ Fixed here
  messagingSenderId: "552305335397",
  appId: "1:552305335397:web:a946f1e692b784a077ba8c",
  measurementId: "G-0ZB0WYC2V9"
};

export const app = initializeApp(firebaseConfig);
