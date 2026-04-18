import { withBasePath } from "@/lib/basePath";
import { TORANAM_IMAGE_PATHS } from "@/lib/toranamStrip";

/** Maximum photos in the gallery (Configure + Gallery section). */
export const MAX_GALLERY_PHOTOS = 40;

/** @deprecated Use MAX_GALLERY_PHOTOS */
export const GALLERY_SLOT_COUNT = MAX_GALLERY_PHOTOS;

export const GALLERY_STORAGE_KEY = "mallavaram-gallery-photos";

export type GallerySlotConfig = {
  /** Image URL, data URL, or site path like /images/photo.jpg. Empty = built-in placeholder. */
  src: string;
  altEn: string;
  altTe: string;
  /** Optional caption shown below the photo in the gallery. */
  descriptionEn: string;
  descriptionTe: string;
};

export type TempleHistoryImageConfig = {
  /** Image URL, data URL, or site path like /images/photo.jpg. */
  src: string;
  /** Optional caption shown on hover. */
  descriptionEn: string;
  descriptionTe: string;
};

/** Slots that use header toranam asset paths are dropped (toranams stay in the header only). */
function isHeaderToranamSrc(src: string): boolean {
  const t = src.trim();
  if (!t) return false;
  const lower = t.toLowerCase();
  return TORANAM_IMAGE_PATHS.some(
    (p) => lower === p.toLowerCase() || lower.endsWith(p.toLowerCase())
  );
}

export function defaultGallerySlots(): GallerySlotConfig[] {
  return [];
}

export function normalizeGallerySlots(raw: unknown): GallerySlotConfig[] {
  if (!Array.isArray(raw)) return [];
  const out: GallerySlotConfig[] = [];
  for (let i = 0; i < Math.min(raw.length, MAX_GALLERY_PHOTOS); i++) {
    const row = raw[i];
    if (row && typeof row === "object") {
      const o = row as Record<string, unknown>;
      const slot: GallerySlotConfig = {
        src: typeof o.src === "string" ? o.src : "",
        altEn: typeof o.altEn === "string" ? o.altEn : "",
        altTe: typeof o.altTe === "string" ? o.altTe : "",
        descriptionEn: typeof o.descriptionEn === "string" ? o.descriptionEn : "",
        descriptionTe: typeof o.descriptionTe === "string" ? o.descriptionTe : "",
      };
      if (!isHeaderToranamSrc(slot.src)) {
        out.push(slot);
      }
    }
  }
  return out;
}

/** Resolve stored gallery `src` for next/image (paths get basePath on GitHub Pages). */
export function resolveGalleryImageSrc(
  rawSrc: string,
  placeholderWithBase: string
): { src: string; unoptimized: boolean } {
  const t = rawSrc.trim();
  if (!t) return { src: placeholderWithBase, unoptimized: false };
  if (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("data:")) {
    return { src: t, unoptimized: true };
  }
  if (t.startsWith("/")) {
    return { src: withBasePath(t), unoptimized: false };
  }
  return { src: placeholderWithBase, unoptimized: false };
}
