"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { useLanguage } from "./LanguageProvider";
import { useAdminAuth } from "./AdminAuthProvider";
import { tMap } from "@/i18n/config";
import {
  defaultGallerySlots,
  GALLERY_STORAGE_KEY,
  normalizeGallerySlots,
  type GallerySlotConfig,
  type TempleHistoryImageConfig
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
import { readSiteConfig, writeSiteConfig } from "@/lib/firestoreConfig";

const STORAGE_KEY = "mallavaram-text-config";

type Overrides = Record<string, { en: string; te: string }>;

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
  aboutImages: string[];
  setAboutImages: (images: string[]) => Promise<void>;
  templeHistoryImages: TempleHistoryImageConfig[];
  setTempleHistoryImages: (images: TempleHistoryImageConfig[]) => void;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const bakedText = (publicSiteContent.textOverrides ?? {}) as Overrides;
const bakedGallery = normalizeGallerySlots(publicSiteContent.gallerySlots);
const bakedCommittee = normalizeCommitteeMembers(publicSiteContent.committeeMembers);
const bakedTempleHistoryImages: TempleHistoryImageConfig[] = [
  { src: "/images/temple-history/Temple-history-1.jpg", descriptionEn: "", descriptionTe: "" },
  { src: "/images/temple-history/Temple-history-2.jpg", descriptionEn: "", descriptionTe: "" },
  { src: "/images/temple-history/Temple-history-3.jpg", descriptionEn: "", descriptionTe: "" },
  { src: "/images/temple-history/Temple-history-4.jpg", descriptionEn: "", descriptionTe: "" },
  { src: "/images/temple-history/Temple-history-5.jpg", descriptionEn: "", descriptionTe: "" },
  { src: "/images/temple-history/Temple-history-6.jpg", descriptionEn: "", descriptionTe: "" },
];

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
  const [aboutImages, setAboutImagesState] = useState<string[]>([]);
  const [templeHistoryImages, setTempleHistoryImagesState] = useState<TempleHistoryImageConfig[]>(() => bakedTempleHistoryImages);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  // Load from Firestore on mount, fall back to localStorage/baked defaults
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await readSiteConfig();
      if (cancelled) return;
      if (remote) {
        if (remote.textOverrides && Object.keys(remote.textOverrides).length > 0) {
          const merged = { ...bakedText, ...remote.textOverrides };
          setOverrides(merged);
        }
        if (remote.gallerySlots && Array.isArray(remote.gallerySlots) && remote.gallerySlots.length > 0) {
          const g = normalizeGallerySlots(remote.gallerySlots);
          setGallerySlotsState(g);
        }
        if (remote.committeeMembers && Array.isArray(remote.committeeMembers) && remote.committeeMembers.length > 0) {
          const c = normalizeCommitteeMembers(remote.committeeMembers);
          setCommitteeMembersState(c);
        }
        if (remote.siteManual && Object.keys(remote.siteManual).length > 0) {
          const s = mergeSiteManual(remote.siteManual);
          setSiteManualState(s);
        }
        if (remote.aboutImages && Array.isArray(remote.aboutImages) && remote.aboutImages.length > 0) {
          setAboutImagesState(remote.aboutImages);
        }
        if (remote.templeHistoryImages && Array.isArray(remote.templeHistoryImages) && remote.templeHistoryImages.length > 0) {
          setTempleHistoryImagesState(remote.templeHistoryImages as TempleHistoryImageConfig[]);
        }
        setFirebaseLoaded(true);
      } else {
        // No Firestore data — use localStorage
        setOverrides(loadFromStorage());
        setGallerySlotsState(loadGalleryFromStorage());
        setCommitteeMembersState(loadCommitteeFromStorage());
        setSiteManualState(loadSiteManualFromStorage());
        setFirebaseLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Helper: sync current state to Firestore (called after any save when admin is logged in)
  const { authed, user } = useAdminAuth();
  const syncToFirestore = useCallback(async (
    ov: Overrides,
    gs: GallerySlotConfig[],
    cm: CommitteeMemberConfig[],
    sm: SiteManualConfig
  ) => {
    if (!authed || !user?.email) return;
    await writeSiteConfig(
      {
        textOverrides: ov,
        gallerySlots: gs,
        committeeMembers: cm,
        siteManual: sm as unknown as Record<string, unknown>,
      },
      user.email
    );
  }, [authed, user]);

  const saveOverrides = useCallback((updates: Overrides) => {
    setOverrides((prev) => {
      const next = { ...prev, ...updates };
      saveToStorage(next);
      // Sync to Firestore with latest state
      syncToFirestore(next, gallerySlots, committeeMembers, siteManual);
      return next;
    });
  }, [syncToFirestore, gallerySlots, committeeMembers, siteManual]);

  const setGallerySlots = useCallback((slots: GallerySlotConfig[]) => {
    const normalized = normalizeGallerySlots(slots);
    setGallerySlotsState(normalized);
    saveGalleryToStorage(normalized);
    syncToFirestore(overrides, normalized, committeeMembers, siteManual);
  }, [syncToFirestore, overrides, committeeMembers, siteManual]);

  const setCommitteeMembers = useCallback((rows: CommitteeMemberConfig[]) => {
    const normalized = normalizeCommitteeMembers(rows);
    setCommitteeMembersState(normalized);
    saveCommitteeToStorage(normalized);
    syncToFirestore(overrides, gallerySlots, normalized, siteManual);
  }, [syncToFirestore, overrides, gallerySlots, siteManual]);

  const setSiteManual = useCallback((next: SiteManualConfig) => {
    const normalized = mergeSiteManual(next);
    setSiteManualState(normalized);
    saveSiteManualToStorage(normalized);
    syncToFirestore(overrides, gallerySlots, committeeMembers, normalized);
  }, [syncToFirestore, overrides, gallerySlots, committeeMembers]);

  const setAboutImages = useCallback(async (images: string[]) => {
    const limited = images.slice(0, 5);
    setAboutImagesState(limited);
    if (authed && user?.email) {
      await writeSiteConfig({ aboutImages: limited }, user.email);
    }
  }, [authed, user]);

  const setTempleHistoryImages = useCallback((images: TempleHistoryImageConfig[]) => {
    setTempleHistoryImagesState(images);
    if (authed && user?.email) {
      writeSiteConfig({ templeHistoryImages: images }, user.email);
    }
  }, [authed, user]);

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
        setSiteManual,
        aboutImages,
        setAboutImages,
        templeHistoryImages,
        setTempleHistoryImages
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
