"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useConfig, useSiteManual } from "@/components/ConfigProvider";
import { tMap, CONFIG_SECTIONS } from "@/i18n/config";
import {
  defaultGallerySlots,
  GALLERY_SLOT_COUNT,
  resolveGalleryImageSrc,
  type GallerySlotConfig
} from "@/lib/galleryConfig";
import { withBasePath } from "@/lib/basePath";
import { SITE_MANUAL_DEFAULTS, type SiteManualConfig } from "@/lib/siteManualSchema";
import { ConfigureColorField } from "@/components/ConfigureColorField";

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

function cloneSiteManual(cfg: SiteManualConfig): SiteManualConfig {
  return { ...cfg, toranamImagePaths: [...cfg.toranamImagePaths] };
}

export function ConfigureSection() {
  const { overrides, saveOverrides, resetOverrides, gallerySlots, setGallerySlots, setSiteManual } =
    useConfig();
  const { siteManual } = useSiteManual();
  const [draft, setDraft] = useState<Overrides>(() => ({ ...overrides }));
  const [galleryDraft, setGalleryDraft] = useState<GallerySlotConfig[]>(() => defaultGallerySlots());
  const [siteManualDraft, setSiteManualDraft] = useState<SiteManualConfig>(() =>
    cloneSiteManual(SITE_MANUAL_DEFAULTS)
  );
  /** When true, do not overwrite layout draft from context (avoids losing edits when localStorage hydrates). */
  const [siteLayoutDirty, setSiteLayoutDirty] = useState(false);
  const [saveFlash, setSaveFlash] = useState<string | null>(null);

  const patchLayoutDraft = useCallback((updater: (p: SiteManualConfig) => SiteManualConfig) => {
    setSiteLayoutDirty(true);
    setSiteManualDraft(updater);
  }, []);

  useEffect(() => {
    setDraft({ ...overrides });
  }, [overrides]);

  useEffect(() => {
    setGalleryDraft(gallerySlots);
  }, [gallerySlots]);

  useEffect(() => {
    if (siteLayoutDirty) return;
    setSiteManualDraft(cloneSiteManual(siteManual));
  }, [siteManual, siteLayoutDirty]);

  const updateDraft = useCallback((key: string, lang: "en" | "te", value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...getEffective(prev, key),
        [lang]: value
      }
    }));
  }, []);

  const updateGallerySlot = useCallback((index: number, patch: Partial<GallerySlotConfig>) => {
    setGalleryDraft((prev) =>
      prev.map((row, j) => (j === index ? { ...row, ...patch } : row))
    );
  }, []);

  const runFlash = useCallback((id: string) => {
    setSaveFlash(id);
    setTimeout(() => {
      setSaveFlash((cur) => (cur === id ? null : cur));
    }, 2000);
  }, []);

  const saveSiteLayout = useCallback(() => {
    setSiteManual(siteManualDraft);
    setSiteLayoutDirty(false);
    runFlash("site-layout");
  }, [siteManualDraft, setSiteManual, runFlash]);

  const saveTextSection = useCallback(
    (headerName: string, keys: readonly (keyof typeof tMap)[]) => {
      const updates: Overrides = {};
      for (const k of keys) {
        const keyStr = String(k);
        updates[keyStr] = getEffective(draft, keyStr);
      }
      saveOverrides(updates);
      if (headerName === "Gallery") {
        setGallerySlots(galleryDraft);
      }
      runFlash(`section-${headerName}`);
    },
    [draft, galleryDraft, saveOverrides, setGallerySlots, runFlash]
  );

  const handleReset = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.confirm(
        "Reset all text, gallery photos, and site layout or header settings to defaults?"
      )
    ) {
      resetOverrides();
      setDraft({});
      setGalleryDraft(defaultGallerySlots());
      setSiteLayoutDirty(false);
      setSiteManualDraft(cloneSiteManual(SITE_MANUAL_DEFAULTS));
      setSaveFlash(null);
    }
  }, [resetOverrides]);

  return (
    <SectionContainer id="configure">
      <div className="bg-white rounded-3xl border border-maroon/20 shadow-md p-6 md:p-8">
        <h2 className="section-heading">Configure</h2>
        <p className="section-subtitle mb-6">
          Each block has its own Save button (this browser only, localStorage). Use the palette or color picker for
          colors; you can still paste hex or rgba in the text field.
        </p>

        <div className="space-y-8">
          <fieldset className="border border-maroon/20 rounded-2xl p-4 md:p-5">
            <legend className="font-heading text-lg text-maroon px-2 font-bold">
              Site layout and header
            </legend>
            <p className="text-sm text-text-dark/75 mt-2 mb-4">
              Colors, sidebar width, top banner height classes, toranam strip, and title or address typography.
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <ConfigureColorField
                label="Top header background"
                value={siteManualDraft.siteTopHeaderBackground}
                onChange={(v) => patchLayoutDraft((p) => ({ ...p, siteTopHeaderBackground: v }))}
              />
              <ConfigureColorField
                label="Main column background"
                value={siteManualDraft.siteMainColumnBackground}
                onChange={(v) => patchLayoutDraft((p) => ({ ...p, siteMainColumnBackground: v }))}
              />
              <ConfigureColorField
                label="Left menu gradient — from"
                value={siteManualDraft.siteLeftMenuGradientFrom}
                onChange={(v) => patchLayoutDraft((p) => ({ ...p, siteLeftMenuGradientFrom: v }))}
              />
              <ConfigureColorField
                label="Left menu gradient — via"
                value={siteManualDraft.siteLeftMenuGradientVia}
                onChange={(v) => patchLayoutDraft((p) => ({ ...p, siteLeftMenuGradientVia: v }))}
              />
              <ConfigureColorField
                label="Left menu gradient — to"
                value={siteManualDraft.siteLeftMenuGradientTo}
                onChange={(v) => patchLayoutDraft((p) => ({ ...p, siteLeftMenuGradientTo: v }))}
              />
              <ConfigureColorField
                label="Mobile nav bar background"
                value={siteManualDraft.siteMobileNavBarBackground}
                onChange={(v) => patchLayoutDraft((p) => ({ ...p, siteMobileNavBarBackground: v }))}
              />
              <div className="md:col-span-2">
                <ConfigureColorField
                  label="Mobile menu panel background"
                  value={siteManualDraft.siteMobileNavMenuBackground}
                  onChange={(v) => patchLayoutDraft((p) => ({ ...p, siteMobileNavMenuBackground: v }))}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mt-6 pt-4 border-t border-maroon/10">
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Sidebar width (px)
                <input
                  type="number"
                  min={40}
                  value={siteManualDraft.sidebarWidthPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      sidebarWidthPx: Number(e.target.value) || p.sidebarWidthPx
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70 sm:col-span-2 md:col-span-3">
                Top header Tailwind height classes
                <input
                  type="text"
                  value={siteManualDraft.topHeaderHeightClasses}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({ ...p, topHeaderHeightClasses: e.target.value }))
                  }
                  placeholder="e.g. h-[8.7rem] md:h-[9.9rem]"
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white font-mono text-xs"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Moola column width (px)
                <input
                  type="number"
                  min={20}
                  value={siteManualDraft.topHeaderMoolaColumnWidthPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      topHeaderMoolaColumnWidthPx: Number(e.target.value) || p.topHeaderMoolaColumnWidthPx
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Left lamp width (px)
                <input
                  type="number"
                  min={0}
                  value={siteManualDraft.topHeaderLeftLampWidthPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      topHeaderLeftLampWidthPx: Number(e.target.value) || p.topHeaderLeftLampWidthPx
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Right lamp width (px)
                <input
                  type="number"
                  min={0}
                  value={siteManualDraft.topHeaderRightLampWidthPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      topHeaderRightLampWidthPx: Number(e.target.value) || p.topHeaderRightLampWidthPx
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
            </div>

            <p className="text-xs font-semibold text-maroon mt-6 mb-2">Title font (rem / vw)</p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {(
                [
                  ["topHeaderTitleFontFixedRem", "Fixed rem (>0 disables clamp)"] as const,
                  ["topHeaderTitleFontMinRem", "Clamp min rem"] as const,
                  ["topHeaderTitleFontPrefVw", "Clamp preferred vw"] as const,
                  ["topHeaderTitleFontMaxRem", "Clamp max rem"] as const
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="grid gap-1 text-xs font-medium text-text-dark/70">
                  {label}
                  <input
                    type="number"
                    step={0.01}
                    value={siteManualDraft[key]}
                    onChange={(e) =>
                      patchLayoutDraft((p) => ({
                        ...p,
                        [key]: Number(e.target.value) || 0
                      }))
                    }
                    className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                  />
                </label>
              ))}
            </div>

            <p className="text-xs font-semibold text-maroon mt-4 mb-2">Address font (rem / vw)</p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {(
                [
                  ["topHeaderAddressFontFixedRem", "Fixed rem (>0 disables clamp)"] as const,
                  ["topHeaderAddressFontMinRem", "Clamp min rem"] as const,
                  ["topHeaderAddressFontPrefVw", "Clamp preferred vw"] as const,
                  ["topHeaderAddressFontMaxRem", "Clamp max rem"] as const
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="grid gap-1 text-xs font-medium text-text-dark/70">
                  {label}
                  <input
                    type="number"
                    step={0.01}
                    value={siteManualDraft[key]}
                    onChange={(e) =>
                      patchLayoutDraft((p) => ({
                        ...p,
                        [key]: Number(e.target.value) || 0
                      }))
                    }
                    className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mt-4 pt-4 border-t border-maroon/10">
              <label className="flex items-center gap-2 text-sm text-text-dark/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={siteManualDraft.topHeaderMiddleTextAlignLeft}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      topHeaderMiddleTextAlignLeft: e.target.checked
                    }))
                  }
                  className="rounded border-maroon/40"
                />
                Align title and address left
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Text shift X (px)
                <input
                  type="number"
                  value={siteManualDraft.topHeaderMiddleTextShiftPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      topHeaderMiddleTextShiftPx: Number(e.target.value) || 0
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Text push down (px)
                <input
                  type="number"
                  min={0}
                  value={siteManualDraft.topHeaderMiddleTextPushDownPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      topHeaderMiddleTextPushDownPx: Number(e.target.value) || 0
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Title to address gap (px)
                <input
                  type="number"
                  min={0}
                  value={siteManualDraft.topHeaderTitleToAddressGapPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      topHeaderTitleToAddressGapPx: Number(e.target.value) || 0
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
            </div>

            <label className="grid gap-1 text-xs font-medium text-text-dark/70 mt-6">
              Toranam image paths (one per line, site paths like /images/toranam-1.jpeg)
              <textarea
                rows={6}
                value={siteManualDraft.toranamImagePaths.join("\n")}
                onChange={(e) => {
                  const lines = e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean);
                  patchLayoutDraft((p) => ({ ...p, toranamImagePaths: lines }));
                }}
                className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white font-mono"
              />
            </label>

            <p className="text-xs font-semibold text-maroon mt-4 mb-2">Toranam strip (header)</p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Strip height (px)
                <input
                  type="number"
                  min={1}
                  value={siteManualDraft.headerToranamStripHeightPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      headerToranamStripHeightPx: Number(e.target.value) || p.headerToranamStripHeightPx
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Tile height (px, 0 = use strip)
                <input
                  type="number"
                  min={0}
                  value={siteManualDraft.headerToranamTileHeightPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      headerToranamTileHeightPx: Number(e.target.value) || 0
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Tile width (px, 0 = fluid)
                <input
                  type="number"
                  min={0}
                  value={siteManualDraft.headerToranamTileWidthPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      headerToranamTileWidthPx: Number(e.target.value) || 0
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Gap between tiles (px)
                <input
                  type="number"
                  min={0}
                  value={siteManualDraft.headerToranamGapPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      headerToranamGapPx: Number(e.target.value) || 0
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Object fit
                <select
                  value={siteManualDraft.headerToranamObjectFit}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      headerToranamObjectFit: e.target.value as "cover" | "contain"
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                >
                  <option value="cover">cover</option>
                  <option value="contain">contain</option>
                </select>
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Max tiles shown
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={siteManualDraft.headerToranamTileCount}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      headerToranamTileCount: Number(e.target.value) || 0
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Left pull (px)
                <input
                  type="number"
                  min={0}
                  value={siteManualDraft.headerToranamLeftPullPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      headerToranamLeftPullPx: Number(e.target.value) || 0
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-maroon/10">
              <button type="button" onClick={saveSiteLayout} className="btn-primary">
                {saveFlash === "site-layout" ? "Saved" : "Save layout & header"}
              </button>
            </div>
          </fieldset>

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
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-maroon/10">
                <button
                  type="button"
                  onClick={() => saveTextSection(headerName, keys)}
                  className="btn-primary"
                >
                  {saveFlash === `section-${headerName}`
                    ? "Saved"
                    : headerName === "Gallery"
                      ? "Save Gallery (text & photos)"
                      : `Save ${headerName}`}
                </button>
              </div>
            </fieldset>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-maroon/10">
          <button type="button" onClick={handleReset} className="btn-outline">
            Reset everything to defaults
          </button>
        </div>
      </div>
    </SectionContainer>
  );
}
