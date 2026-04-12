import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * When all required env vars are set, the app loads published site data from
 * Firestore (`config/public`), uploads images to Firebase Storage, and uses
 * Firebase Auth for Configure admin sign-in. When unset, behavior matches the
 * original localStorage + PBKDF2 admin flow.
 *
 * Required for remote mode:
 * - NEXT_PUBLIC_FIREBASE_API_KEY
 * - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 * - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 * - NEXT_PUBLIC_FIREBASE_APP_ID
 *
 * Required for image uploads (optional if you only use URLs/paths):
 * - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *
 * Optional:
 * - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 */

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  );
}

export function isFirebaseStorageConfigured(): boolean {
  return isFirebaseConfigured() && Boolean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
}

function webConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
  };
}

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase env vars are not set.");
  }
  const existing = getApps()[0];
  if (existing) return existing;
  return initializeApp(webConfig());
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!isFirebaseStorageConfigured()) {
    throw new Error("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set.");
  }
  return getStorage(getFirebaseApp());
}
