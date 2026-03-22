"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { tMap } from "@/i18n/config";

const STORAGE_KEY = "mallavaram-text-config";

type Overrides = Record<string, { en: string; te: string }>;

type ConfigContextType = {
  overrides: Overrides;
  saveOverrides: (updates: Overrides) => void;
  resetOverrides: () => void;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

function loadFromStorage(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Overrides;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveToStorage(overrides: Overrides) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // ignore
  }
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>({});

  useEffect(() => {
    setOverrides(loadFromStorage());
  }, []);

  const saveOverrides = useCallback((updates: Overrides) => {
    setOverrides((prev) => {
      const next = { ...prev, ...updates };
      saveToStorage(next);
      return next;
    });
  }, []);

  const resetOverrides = useCallback(() => {
    setOverrides({});
    saveToStorage({});
  }, []);

  return (
    <ConfigContext.Provider value={{ overrides, saveOverrides, resetOverrides }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}

/** Resolves text for current language: override first, then tMap default. */
export function useTranslate() {
  const { language } = useLanguage();
  const { overrides } = useConfig();

  return useCallback(
    (key: keyof typeof tMap): string => {
      const o = overrides[key];
      if (o?.[language]) return o[language];
      return tMap[key]?.[language] ?? tMap[key]?.en ?? key;
    },
    [language, overrides]
  );
}
