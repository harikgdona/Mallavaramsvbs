/**
 * Firestore read/write for site configuration.
 *
 * Document structure:
 *   config/siteContent → { textOverrides, gallerySlots, committeeMembers, siteManual }
 *
 * Public reads, admin-only writes (enforced by Firestore rules).
 */

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CONFIG_DOC = "config/siteContent";

export type FirestoreSiteConfig = {
  textOverrides?: Record<string, { en: string; te: string }>;
  gallerySlots?: unknown[];
  committeeMembers?: unknown[];
  siteManual?: Record<string, unknown>;
  aboutImages?: string[];
  templeHistoryImages?: unknown[];
  activitiesPhotos?: Array<{ src: string; descriptionEn: string; descriptionTe: string }>;
  annadanamPhotos?: Array<{ src: string; descriptionEn: string; descriptionTe: string }>;
  updatedAt?: string;
  updatedBy?: string;
};

/** Read the site config from Firestore. Returns null if doc doesn't exist. */
export async function readSiteConfig(): Promise<FirestoreSiteConfig | null> {
  try {
    const snap = await getDoc(doc(db, CONFIG_DOC));
    if (!snap.exists()) return null;
    return snap.data() as FirestoreSiteConfig;
  } catch (e) {
    console.error("Firestore read failed:", e);
    return null;
  }
}

/** Write the site config to Firestore. Requires authenticated admin. */
export async function writeSiteConfig(
  data: FirestoreSiteConfig,
  userEmail: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    await setDoc(doc(db, CONFIG_DOC), {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: userEmail,
    }, { merge: true });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Firestore write failed:", msg);
    return { ok: false, error: msg };
  }
}
