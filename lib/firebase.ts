import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCx1URqykD4zlQT3k2m8wNYmrGJ3kL3ex4",
  authDomain: "mallavaramsvbs.firebaseapp.com",
  projectId: "mallavaramsvbs",
  storageBucket: "mallavaramsvbs.firebasestorage.app",
  messagingSenderId: "265064758379",
  appId: "1:265064758379:web:975fa492bcb00078f4852e",
  measurementId: "G-VWJBVWYKXB",
};

// Initialize Firebase only once (avoid duplicate app errors in dev hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
