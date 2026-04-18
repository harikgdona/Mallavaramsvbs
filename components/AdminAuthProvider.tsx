"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// Only these emails can access the Configure panel
const ADMIN_EMAILS = [
  "harikgdona@gmail.com",
  "koteswaragali@gmail.com",
];

type AdminAuthContextType = {
  ready: boolean;
  authed: boolean;
  user: User | null;
  login: () => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function isAdminEmail(email: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && isAdminEmail(firebaseUser.email)) {
        setUser(firebaseUser);
        setAuthed(true);
      } else {
        setUser(null);
        setAuthed(false);
      }
      setReady(true);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (!isAdminEmail(result.user.email)) {
        await signOut(auth);
        return { ok: false, error: "This Google account is not authorized as admin." };
      }
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Sign-in failed.";
      return { ok: false, error: msg };
    }
  }, []);

  const logout = useCallback(() => {
    signOut(auth);
    setUser(null);
    setAuthed(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ready, authed, user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
