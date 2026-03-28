"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useConfig } from "@/components/ConfigProvider";
import { tMap, CONFIG_SECTIONS } from "@/i18n/config";
import {
  defaultGallerySlots,
  GALLERY_SLOT_COUNT,
  resolveGalleryImageSrc,
  type GallerySlotConfig
} from "@/lib/galleryConfig";
import { withBasePath } from "@/lib/basePath";

type Overrides = Record<string, { en: string; te: string }>;

const MAX_IMAGE_FILE_MB = 1.5;

function getEffective(sectionOverrides: Overrides, key: string): { en: string; te: string } {
  return (
    sectionOverrides[key] ?? {
      en: (tMap as Record<string, { en: string; te: string }>)[key]?.en ?? "",
      te: (tMap as Record<string, { en: string; te: string }>)[key]?.te ?? ""
    }
  );
}

function GalleryThumb({ src }: { src: string }) {
  const ph = withBasePath("/images/placeholder.svg");
  const { src: resolved, unoptimized } = resolveGalleryImageSrc(src, ph);
  return (
    <Image
      src={resolved}
      alt=""
      fill
      sizes="96px"
      className="object-cover"
      unoptimized={unoptimized}
    />
  );
}

export function ConfigureSection() {
  const { overrides, saveOverrides, resetOverrides, gallerySlots, setGallerySlots } = useConfig();
  const [draft, setDraft] = useState<Overrides>(() => ({ ...overrides }));
  const [galleryDraft, setGalleryDraft] = useState<GallerySlotConfig[]>(() => defaultGallerySlots());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft({ ...overrides });
  }, [overrides]);

  useEffect(() => {
    setGalleryDraft(gallerySlots);
  }, [gallerySlots]);

  const updateDraft = useCallback((key: string, lang: "en" | "te", value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...getEffective(prev, key),
        [lang]: value
      }
    }));
    setSaved(false);
  }, []);

  const updateGallerySlot = useCallback((index: number, patch: Partial<GallerySlotConfig>) => {
    setGalleryDraft((prev) =>
      prev.map((row, j) => (j === index ? { ...row, ...patch } : row))
    );
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    saveOverrides(draft);
    setGallerySlots(galleryDraft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [draft, galleryDraft, saveOverrides, setGallerySlots]);

  const handleReset = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Reset all text and gallery photos to defaults?")
    ) {
      resetOverrides();
      setDraft({});
      setGalleryDraft(defaultGallerySlots());
      setSaved(false);
    }
  }, [resetOverrides]);

  return (
    <SectionContainer id="configure">
      <div className="bg-white rounded-3xl border border-maroon/20 shadow-md p-6 md:p-8">
        <h2 className="section-heading">Configure</h2>
        <p className="section-subtitle mb-6">
          Edit text by section (header name). Gallery photos are stored in this browser only (localStorage).
        </p>

        <div className="space-y-8">
          {Object.entries(CONFIG_SECTIONS).map(([headerName, keys]) => (
            <fieldset key={headerName} className="border border-maroon/20 rounded-2xl p-4 md:p-5">
              <legend className="font-heading text-lg text-maroon px-2 font-bold">
                {headerName}
              </legend>
              <div className="space-y-4 mt-2">
                {keys.map((key) => {
                  const keyStr = String(key);
                  const val = getEffective(draft, keyStr);
                  return (
                    <div key={keyStr} className="grid gap-2">
                      <label className="text-xs font-medium text-text-dark/70 uppercase tracking-wide">
                        {keyStr}
                      </label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-maroon/80 block mb-1">English</span>
                          <input
                            type="text"
                            value={val.en}
                            onChange={(e) => updateDraft(keyStr, "en", e.target.value)}
                            className="w-full rounded-xl border border-maroon/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon bg-sandal/40"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-maroon/80 block mb-1">Telugu</span>
                          <input
                            type="text"
                            value={val.te}
                            onChange={(e) => updateDraft(keyStr, "te", e.target.value)}
                            className="w-full rounded-xl border border-maroon/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon bg-sandal/40"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {headerName === "Gallery" && (
                  <div className="pt-4 mt-4 border-t border-maroon/15 space-y-5">
                    <p className="text-sm text-text-dark/80 font-medium">
                      Gallery photos (up to {GALLERY_SLOT_COUNT} slots)
                    </p>
                    <p className="text-xs text-text-dark/65">
                      Paste an image URL, a site path like{" "}
                      <code className="bg-sandal/80 px-1 rounded">/images/your-photo.jpg</code>, or
                      upload a file (stored in this browser only; keep files under ~{MAX_IMAGE_FILE_MB}{" "}
                      MB for best results). Empty URL uses the default placeholder.
                    </p>
                    {galleryDraft.map((slot, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-maroon/15 bg-sandal/30 p-3 md:p-4 space-y-3"
                      >
                        <p className="text-xs font-semibold text-maroon">Photo {i + 1}</p>
                        <div className="grid md:grid-cols-[100px_1fr] gap-4 items-start">
                          <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-maroon/20 bg-white shrink-0 mx-auto md:mx-0">
                            <GalleryThumb src={slot.src} />
                          </div>
                          <div className="space-y-2 min-w-0">
                            <label className="text-xs text-text-dark/70 block">Image URL or path</label>
                            <input
                              type="text"
                              value={slot.src}
                              onChange={(e) => updateGallerySlot(i, { src: e.target.value })}
                              placeholder="https://... or /images/photo.jpg"
                              className="w-full rounded-lg border border-maroon/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon bg-white"
                            />
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="text-xs text-maroon/90 cursor-pointer btn-outline py-1.5 px-3">
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    e.target.value = "";
                                    if (!file) return;
                                    if (file.size > MAX_IMAGE_FILE_MB * 1024 * 1024) {
                                      window.alert(
                                        `File is too large. Please use an image under ${MAX_IMAGE_FILE_MB} MB or host it online and paste the URL.`
                                      );
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      const r = reader.result;
                                      if (typeof r === "string") updateGallerySlot(i, { src: r });
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                                Upload file
                              </label>
                              <button
                                type="button"
                                className="text-xs text-maroon/80 underline"
                                onClick={() => updateGallerySlot(i, { src: "", altEn: "", altTe: "" })}
                              >
                                Clear slot
                              </button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2 pt-1">
                              <div>
                                <span className="text-xs text-maroon/80 block mb-1">Alt text (English)</span>
                                <input
                                  type="text"
                                  value={slot.altEn}
                                  onChange={(e) => updateGallerySlot(i, { altEn: e.target.value })}
                                  placeholder="Short description"
                                  className="w-full rounded-lg border border-maroon/20 px-3 py-2 text-sm bg-white"
                                />
                              </div>
                              <div>
                                <span className="text-xs text-maroon/80 block mb-1">Alt text (Telugu)</span>
                                <input
                                  type="text"
                                  value={slot.altTe}
                                  onChange={(e) => updateGallerySlot(i, { altTe: e.target.value })}
                                  placeholder="వివరణ"
                                  className="w-full rounded-lg border border-maroon/20 px-3 py-2 text-sm bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-maroon/10">
          <button type="button" onClick={handleSave} className="btn-primary">
            {saved ? "Saved" : "Save all"}
          </button>
          <button type="button" onClick={handleReset} className="btn-outline">
            Reset to defaults
          </button>
        </div>
      </div>
    </SectionContainer>
  );
}
