import { withBasePath } from "@/lib/basePath";
import { TORANAM_IMAGE_PATHS } from "@/lib/toranamStrip";

/** Number of gallery photo slots (Configure + Gallery section). */
export const GALLERY_SLOT_COUNT = 10;

export const GALLERY_STORAGE_KEY = "mallavaram-gallery-photos";

export type GallerySlotConfig = {
  /** Image URL, data URL, or site path like /images/photo.jpg. Empty = built-in placeholder. */
  src: string;
  altEn: string;
  altTe: string;
};

export function defaultGallerySlots(): GallerySlotConfig[] {
  const toranams: GallerySlotConfig[] = TORANAM_IMAGE_PATHS.map((src, i) => {
    const n = i + 1;
    return {
      src,
      altEn: `Toranam decoration ${n}`,
      altTe: `తోరణం అలంకారం ${n}`
    };
  });

  const slots = Array.from({ length: GALLERY_SLOT_COUNT }, () => ({
    src: "",
    altEn: "",
    altTe: ""
  }));

  for (let i = 0; i < Math.min(GALLERY_SLOT_COUNT, toranams.length); i++) {
    slots[i] = toranams[i];
  }
  return slots;
}

export function emptyGallerySlots(): GallerySlotConfig[] {
  return Array.from({ length: GALLERY_SLOT_COUNT }, () => ({
    src: "",
    altEn: "",
    altTe: ""
  }));
}

export function normalizeGallerySlots(raw: unknown): GallerySlotConfig[] {
  const base = defaultGallerySlots();
  if (!Array.isArray(raw)) return base;
  for (let i = 0; i < GALLERY_SLOT_COUNT; i++) {
    const row = raw[i];
    if (row && typeof row === "object") {
      const o = row as Record<string, unknown>;
      base[i] = {
        src: typeof o.src === "string" ? o.src : "",
        altEn: typeof o.altEn === "string" ? o.altEn : "",
        altTe: typeof o.altTe === "string" ? o.altTe : ""
      };
    }
  }
  return base;
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
