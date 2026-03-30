"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  clearAdminSession,
  hasAdminCredentials,
  isAdminSession,
  setAdminPassword,
  setAdminSession,
  verifyAdminLogin
} from "@/lib/adminAuth";

type AdminAuthContextType = {
  ready: boolean;
  authed: boolean;
  /** True when no password has been set yet in this browser (first-time setup). */
  needsSetup: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  setupPassword: (password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    setNeedsSetup(!hasAdminCredentials());
    setAuthed(isAdminSession());
    setReady(true);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const ok = await verifyAdminLogin(username, password);
    if (ok) {
      setAdminSession();
      setAuthed(true);
      return { ok: true };
    }
    return { ok: false, error: "Invalid username or password." };
  }, []);

  const setupPassword = useCallback(async (password: string) => {
    if (password.length < 8) {
      return { ok: false, error: "Password must be at least 8 characters." };
    }
    await setAdminPassword(password);
    setNeedsSetup(false);
    setAdminSession();
    setAuthed(true);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setAuthed(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ready, authed, needsSetup, login, setupPassword, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
