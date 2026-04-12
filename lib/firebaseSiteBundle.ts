import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseDb, getFirebaseStorage, isFirebaseConfigured, isFirebaseStorageConfigured } from "@/lib/firebaseClient";
import type { CommitteeMemberConfig } from "@/lib/committeeConfig";
import { normalizeCommitteeMembers } from "@/lib/committeeConfig";
import type { GallerySlotConfig } from "@/lib/galleryConfig";
import { normalizeGallerySlots } from "@/lib/galleryConfig";
import { mergeSiteManual, type SiteManualConfig } from "@/lib/siteManualSchema";

export const REMOTE_SITE_DOC = { collection: "config", id: "public" } as const;

export type RemoteSiteTextOverrides = Record<string, { en: string; te: string }>;

export type RemoteSiteBundle = {
  textOverrides: RemoteSiteTextOverrides;
  gallerySlots: GallerySlotConfig[];
  committeeMembers: CommitteeMemberConfig[];
  siteManual: SiteManualConfig;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Build a clean bundle from Firestore raw data (ignores unknown keys like updatedAt). */
export function remoteSiteBundleFromFirestoreData(data: Record<string, unknown> | undefined): Partial<RemoteSiteBundle> {
  if (!data) return {};
  const out: Partial<RemoteSiteBundle> = {};
  if ("textOverrides" in data && isRecord(data.textOverrides)) {
    out.textOverrides = data.textOverrides as RemoteSiteTextOverrides;
  }
  if ("gallerySlots" in data) {
    out.gallerySlots = normalizeGallerySlots(data.gallerySlots);
  }
  if ("committeeMembers" in data) {
    out.committeeMembers = normalizeCommitteeMembers(data.committeeMembers);
  }
  if ("siteManual" in data) {
    out.siteManual = mergeSiteManual(data.siteManual);
  }
  return out;
}

function stripUndefinedDeep<T>(v: T): T {
  if (v === null || typeof v !== "object") return v;
  if (Array.isArray(v)) {
    return v.map((x) => stripUndefinedDeep(x)) as T;
  }
  const o = v as Record<string, unknown>;
  const next: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(o)) {
    if (val === undefined) continue;
    next[k] = stripUndefinedDeep(val);
  }
  return next as T;
}

export function serializeRemoteSiteBundleForWrite(bundle: RemoteSiteBundle): Record<string, unknown> {
  return {
    ...stripUndefinedDeep(bundle),
    updatedAt: serverTimestamp()
  };
}

export async function readRemoteSiteBundleOnce(): Promise<Partial<RemoteSiteBundle> | null> {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(getFirebaseDb(), REMOTE_SITE_DOC.collection, REMOTE_SITE_DOC.id));
  if (!snap.exists()) return null;
  return remoteSiteBundleFromFirestoreData(snap.data() as Record<string, unknown>);
}

export function subscribeRemoteSiteBundle(
  onData: (partial: Partial<RemoteSiteBundle>) => void,
  onError?: (e: Error) => void
): Unsubscribe {
  const db = getFirebaseDb();
  const d = doc(db, REMOTE_SITE_DOC.collection, REMOTE_SITE_DOC.id);
  return onSnapshot(
    d,
    (snap) => {
      if (!snap.exists()) {
        onData({});
        return;
      }
      onData(remoteSiteBundleFromFirestoreData(snap.data() as Record<string, unknown>));
    },
    (err) => {
      onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  );
}

export async function writeRemoteSiteBundle(bundle: RemoteSiteBundle): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getFirebaseDb();
  await setDoc(
    doc(db, REMOTE_SITE_DOC.collection, REMOTE_SITE_DOC.id),
    serializeRemoteSiteBundleForWrite(bundle),
    { merge: true }
  );
}

export function sanitizeUploadFileName(name: string): string {
  return name.replace(/[^\w.-]+/g, "_").slice(0, 120) || "image";
}

export async function uploadConfigureImage(uid: string, file: File): Promise<string> {
  if (!isFirebaseStorageConfigured()) {
    throw new Error("Firebase Storage is not configured (missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET).");
  }
  const storage = getFirebaseStorage();
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const path = `site-images/${uid}/${id}-${sanitizeUploadFileName(file.name)}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, {
    contentType: file.type || "application/octet-stream"
  });
  return getDownloadURL(storageRef);
}
