"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { useLanguage } from "./LanguageProvider";
import { useAdminAuth } from "./AdminAuthProvider";
import { tMap } from "@/i18n/config";
import {
  defaultGallerySlots,
  GALLERY_STORAGE_KEY,
  normalizeGallerySlots,
  type GallerySlotConfig
} from "@/lib/galleryConfig";
import {
  mergeSiteManual,
  SITE_MANUAL_DEFAULTS,
  SITE_MANUAL_STORAGE_KEY,
  type SiteManualConfig
} from "@/lib/siteManualSchema";
import {
  COMMITTEE_STORAGE_KEY,
  defaultCommitteeMembers,
  normalizeCommitteeMembers,
  type CommitteeMemberConfig
} from "@/lib/committeeConfig";
import publicSiteContent from "@/lib/publicSiteContent.json";
import { isFirebaseConfigured } from "@/lib/firebaseClient";
import {
  subscribeRemoteSiteBundle,
  writeRemoteSiteBundle,
  type RemoteSiteBundle
} from "@/lib/firebaseSiteBundle";

const STORAGE_KEY = "mallavaram-text-config";

type Overrides = Record<string, { en: string; te: string }>;

type PublishLiveResult = { ok: boolean; error?: string; skipped?: boolean };

type ConfigContextType = {
  overrides: Overrides;
  saveOverrides: (updates: Overrides) => void;
  resetOverrides: () => void;
  gallerySlots: GallerySlotConfig[];
  setGallerySlots: (slots: GallerySlotConfig[]) => void;
  committeeMembers: CommitteeMemberConfig[];
  setCommitteeMembers: (rows: CommitteeMemberConfig[]) => void;
  siteManual: SiteManualConfig;
  setSiteManual: (next: SiteManualConfig) => void;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const bakedText = (publicSiteContent.textOverrides ?? {}) as Overrides;
const bakedGallery = normalizeGallerySlots(publicSiteContent.gallerySlots);
const bakedCommittee = normalizeCommitteeMembers(publicSiteContent.committeeMembers);

function loadFromStorage(): Overrides {
  if (typeof window === "undefined") return { ...bakedText };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...bakedText };
    const parsed = JSON.parse(raw) as Overrides;
    return typeof parsed === "object" && parsed !== null ? { ...bakedText, ...parsed } : { ...bakedText };
  } catch {
    return { ...bakedText };
  }
}

function loadGalleryFromStorage(): GallerySlotConfig[] {
  if (typeof window === "undefined") return defaultGallerySlots();
  try {
    const raw = window.localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return bakedGallery.length ? bakedGallery : defaultGallerySlots();
    const parsed = JSON.parse(raw) as unknown;
    return normalizeGallerySlots(parsed);
  } catch {
    return bakedGallery.length ? bakedGallery : defaultGallerySlots();
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

function saveGalleryToStorage(slots: GallerySlotConfig[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(slots));
  } catch {
    // ignore (e.g. quota exceeded for large data URLs)
  }
}

function loadCommitteeFromStorage(): CommitteeMemberConfig[] {
  if (typeof window === "undefined") return defaultCommitteeMembers();
  try {
    const raw = window.localStorage.getItem(COMMITTEE_STORAGE_KEY);
    if (!raw) return bakedCommittee.length ? bakedCommittee : defaultCommitteeMembers();
    return normalizeCommitteeMembers(JSON.parse(raw) as unknown);
  } catch {
    return bakedCommittee.length ? bakedCommittee : defaultCommitteeMembers();
  }
}

function saveCommitteeToStorage(rows: CommitteeMemberConfig[]): boolean {
  if (typeof window === "undefined") return true;
  try {
    window.localStorage.setItem(COMMITTEE_STORAGE_KEY, JSON.stringify(rows));
    return true;
  } catch (e) {
    console.error("committee localStorage save failed:", e);
    return false;
  }
}

function loadSiteManualFromStorage(): SiteManualConfig {
  if (typeof window === "undefined") return SITE_MANUAL_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(SITE_MANUAL_STORAGE_KEY);
    if (!raw) return SITE_MANUAL_DEFAULTS;
    return mergeSiteManual(JSON.parse(raw) as unknown);
  } catch {
    return SITE_MANUAL_DEFAULTS;
  }
}

function saveSiteManualToStorage(cfg: SiteManualConfig): boolean {
  if (typeof window === "undefined") return true;
  try {
    window.localStorage.setItem(SITE_MANUAL_STORAGE_KEY, JSON.stringify(cfg));
    return true;
  } catch (e) {
    console.error("site manual localStorage save failed:", e);
    return false;
  }
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>(() => ({ ...bakedText }));
  const [gallerySlots, setGallerySlotsState] = useState<GallerySlotConfig[]>(() =>
    bakedGallery.length ? bakedGallery : defaultGallerySlots()
  );
  const [committeeMembers, setCommitteeMembersState] = useState<CommitteeMemberConfig[]>(() =>
    bakedCommittee.length ? bakedCommittee : defaultCommitteeMembers()
  );
  const [siteManual, setSiteManualState] = useState<SiteManualConfig>(() => ({
    ...SITE_MANUAL_DEFAULTS,
    toranamImagePaths: [...SITE_MANUAL_DEFAULTS.toranamImagePaths]
  }));
  const [firebaseRemoteReady, setFirebaseRemoteReady] = useState(!isFirebaseConfigured());
  const [firebaseRemoteError, setFirebaseRemoteError] = useState<string | null>(null);

  const overridesRef = useRef(overrides);
  const galleryRef = useRef(gallerySlots);
  const committeeRef = useRef(committeeMembers);
  const siteManualRef = useRef(siteManual);

  useEffect(() => {
    overridesRef.current = overrides;
  }, [overrides]);
  useEffect(() => {
    galleryRef.current = gallerySlots;
  }, [gallerySlots]);
  useEffect(() => {
    committeeRef.current = committeeMembers;
  }, [committeeMembers]);
  useEffect(() => {
    siteManualRef.current = siteManual;
  }, [siteManual]);

  useEffect(() => {
    setOverrides(loadFromStorage());
    setGallerySlotsState(loadGalleryFromStorage());
    setCommitteeMembersState(loadCommitteeFromStorage());
    setSiteManualState(loadSiteManualFromStorage());
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsub = subscribeRemoteSiteBundle(
      (partial) => {
        setFirebaseRemoteReady(true);
        setFirebaseRemoteError(null);
        if (partial.textOverrides !== undefined) {
          const merged = { ...bakedText, ...partial.textOverrides };
          setOverrides(merged);
          saveToStorage(merged);
        }
        if (partial.gallerySlots !== undefined) {
          setGallerySlotsState(partial.gallerySlots);
          saveGalleryToStorage(partial.gallerySlots);
        }
        if (partial.committeeMembers !== undefined) {
          setCommitteeMembersState(partial.committeeMembers);
          saveCommitteeToStorage(partial.committeeMembers);
        }
        if (partial.siteManual !== undefined) {
          setSiteManualState(partial.siteManual);
          saveSiteManualToStorage(partial.siteManual);
        }
      },
      (err) => {
        setFirebaseRemoteReady(true);
        setFirebaseRemoteError(err.message);
      }
    );
    return () => unsub();
  }, []);

  const saveOverrides = useCallback((updates: Overrides) => {
    setOverrides((prev) => {
      const next = { ...prev, ...updates };
      saveToStorage(next);
      return next;
    });
  }, []);

  const setGallerySlots = useCallback((slots: GallerySlotConfig[]) => {
    const normalized = normalizeGallerySlots(slots);
    setGallerySlotsState(normalized);
    saveGalleryToStorage(normalized);
  }, []);

  const setCommitteeMembers = useCallback((rows: CommitteeMemberConfig[]) => {
    const normalized = normalizeCommitteeMembers(rows);
    setCommitteeMembersState(normalized);
    if (!saveCommitteeToStorage(normalized) && typeof window !== "undefined") {
      window.alert(
        "Could not save committee data in this browser (storage quota exceeded is common when photos are embedded as very large base64). " +
          "Use a file under /public/images, a hosted URL, or Firebase upload when signed in. " +
          "Until this saves, deploy export will not include your new members."
      );
    }
  }, []);

  const setSiteManual = useCallback((next: SiteManualConfig) => {
    const normalized = mergeSiteManual(next);
    setSiteManualState(normalized);
    if (!saveSiteManualToStorage(normalized) && typeof window !== "undefined") {
      window.alert(
        "Could not save layout settings to this browser (storage full, private mode, or blocked). " +
          "The header may update until you refresh."
      );
    }
  }, []);

  const resetOverrides = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(GALLERY_STORAGE_KEY);
        window.localStorage.removeItem(COMMITTEE_STORAGE_KEY);
        window.localStorage.removeItem(SITE_MANUAL_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    setOverrides({ ...bakedText });
    setGallerySlotsState(bakedGallery.length ? bakedGallery : defaultGallerySlots());
    setCommitteeMembersState(bakedCommittee.length ? bakedCommittee : defaultCommitteeMembers());
    setSiteManualState(mergeSiteManual({}));
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        overrides,
        saveOverrides,
        resetOverrides,
        gallerySlots,
        setGallerySlots,
        committeeMembers,
        setCommitteeMembers,
        siteManual,
        setSiteManual
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}

export function useSiteManual() {
  const { siteManual, setSiteManual } = useConfig();
  return { siteManual, setSiteManual };
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
