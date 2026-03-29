"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  clearAdminSession,
  ensureAdminCredentialRecordAsync,
  isAdminSession,
  setAdminSession,
  verifyAdminLogin
} from "@/lib/adminAuth";

type AdminAuthContextType = {
  ready: boolean;
  authed: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await ensureAdminCredentialRecordAsync();
      if (!cancelled) {
        setAuthed(isAdminSession());
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
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

  const logout = useCallback(() => {
    clearAdminSession();
    setAuthed(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ready, authed, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
