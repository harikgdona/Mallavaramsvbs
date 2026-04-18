import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCx1URqykD4zlQT3k2m8wNYmrGJ3kL3ex4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mallavaramsvbs.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mallavaramsvbs",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mallavaramsvbs.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "265064758379",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:265064758379:web:975fa492bcb00078f4852e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-VWJBVWYKXB",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// App Check disabled — enforcement is off in Firebase Console
// If you need to re-enable App Check, complete reCAPTCHA domain verification first

export const db = getFirestore(app);
export const auth = getAuth(app);
