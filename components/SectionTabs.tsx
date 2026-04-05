"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

const SECTION_IDS = [
  "home",
  "about",
  "annadanam",
  "activities",
  "donate",
  "gallery",
  "committee",
  "contact",
  "configure"
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

type SectionTabsContextType = {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
};

const SectionTabsContext = createContext<SectionTabsContextType | undefined>(undefined);

export function SectionTabsProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSectionState] = useState<SectionId>("home");

  const setActiveSection = useCallback((id: SectionId) => {
    setActiveSectionState(id);
    // Update URL hash without scrolling
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  }, []);

  // Read hash on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "") as SectionId;
    if (SECTION_IDS.includes(hash)) {
      setActiveSectionState(hash);
    }
  }, []);

  return (
    <SectionTabsContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </SectionTabsContext.Provider>
  );
}

export function useSectionTabs() {
  const ctx = useContext(SectionTabsContext);
  if (!ctx) throw new Error("useSectionTabs must be used within SectionTabsProvider");
  return ctx;
}
