"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useAdminAuth } from "@/components/AdminAuthProvider";
import { useConfig, useSiteManual } from "@/components/ConfigProvider";
import { tMap, CONFIG_SECTIONS } from "@/i18n/config";
import {
  defaultGallerySlots,
  MAX_GALLERY_PHOTOS,
  normalizeGallerySlots,
  resolveGalleryImageSrc,
  type GallerySlotConfig
} from "@/lib/galleryConfig";
import {
  defaultCommitteeMembers,
  MAX_COMMITTEE_MEMBERS,
  normalizeCommitteeMembers,
  type CommitteeMemberConfig
} from "@/lib/committeeConfig";
import publicSiteContent from "@/lib/publicSiteContent.json";
import { withBasePath } from "@/lib/basePath";
import {
  SITE_MANUAL_DEFAULTS,
  mergeSiteManual,
  resolveSiteManualForUi,
  type SiteManualConfig
} from "@/lib/siteManualSchema";
import { ConfigureColorField } from "@/components/ConfigureColorField";
import { ConfigureFontPresetPicker } from "@/components/ConfigureFontPresetPicker";
import { POPULAR_BODY_FONTS, POPULAR_HEADING_FONTS } from "@/lib/typographyFontPresets";

type Overrides = Record<string, { en: string; te: string }>;

const MAX_IMAGE_FILE_MB = 1.5;

/** Session-only: admins can reveal full layout / toranam / typography controls */
const ADVANCED_LAYOUT_SESSION_KEY = "mallavaram-configure-advanced-layout";

/** Same baseline as ConfigProvider after reset (repo `lib/publicSiteContent.json`). */
const RESET_GALLERY_BASELINE = normalizeGallerySlots(publicSiteContent.gallerySlots);
const RESET_COMMITTEE_BASELINE = normalizeCommitteeMembers(publicSiteContent.committeeMembers);

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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r === "string") resolve(r);
      else reject(new Error("Could not read file"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

function HeaderImageField({
  label,
  hint,
  value,
  fallbackPath,
  onChange,
  allowClear = true,
  emptyThumbMode = "fallback",
  resolveUploadedFile
}: {
  label: string;
  hint?: string;
  value: string;
  fallbackPath: string;
  onChange: (next: string) => void;
  /** Show a control that clears the field (empty string). */
  allowClear?: boolean;
  /** When the value is empty: show bundled default in preview, or a neutral “no image” tile. */
  emptyThumbMode?: "fallback" | "none";
  /** When set (e.g. Firebase signed-in admin), uploads return a public URL instead of a large data URL. */
  resolveUploadedFile?: (file: File) => Promise<string>;
}) {
  const ph = withBasePath(fallbackPath);
  const placeholderTile = withBasePath("/images/placeholder.svg");
  const trimmed = value.trim();
  const previewPath =
    trimmed !== ""
      ? trimmed
      : emptyThumbMode === "none"
        ? placeholderTile
        : fallbackPath;
  const { src: thumbSrc, unoptimized } = resolveGalleryImageSrc(previewPath, ph);

  return (
    <div className="rounded-xl border border-maroon/15 bg-sandal/25 p-3 md:p-4 space-y-2">
      <p className="text-xs font-semibold text-maroon">{label}</p>
      {hint ? <p className="text-xs text-text-dark/65">{hint}</p> : null}
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-maroon/20 bg-white">
          <Image src={thumbSrc} alt="" fill sizes="80px" className="object-contain" unoptimized={unoptimized} />
        </div>
        <div className="flex-1 min-w-[12rem] space-y-2">
          <label className="text-xs text-text-dark/70 block">Path, URL, or upload</label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={fallbackPath}
            className="w-full rounded-lg border border-maroon/20 px-3 py-2 text-sm bg-white font-mono"
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
                      `File is too large. Use an image under ${MAX_IMAGE_FILE_MB} MB or host it and paste the URL.`
                    );
                    return;
                  }
                  if (resolveUploadedFile) {
                    void resolveUploadedFile(file)
                      .then(onChange)
                      .catch((err: unknown) => {
                        window.alert(err instanceof Error ? err.message : String(err));
                      });
                    return;
                  }
                  void readFileAsDataUrl(file).then(onChange).catch((err: unknown) => {
                    window.alert(err instanceof Error ? err.message : String(err));
                  });
                }}
              />
              Upload
            </label>
            <button type="button" className="text-xs text-maroon/80 underline" onClick={() => onChange(fallbackPath)}>
              Use default file
            </button>
            {allowClear ? (
              <button
                type="button"
                className="text-xs text-red-800 underline font-medium"
                onClick={() => onChange("")}
              >
                Delete picture
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConfigureSection() {
  const { ready, authed, login, logout } = useAdminAuth();
  const {
    overrides,
    saveOverrides,
    resetOverrides,
    gallerySlots,
    setGallerySlots,
    committeeMembers,
    setCommitteeMembers,
    setSiteManual
  } = useConfig();
  const { siteManual } = useSiteManual();
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [loginBusy, setLoginBusy] = useState(false);
  const [draft, setDraft] = useState<Overrides>(() => ({ ...overrides }));
  const [galleryDraft, setGalleryDraft] = useState<GallerySlotConfig[]>(() => defaultGallerySlots());
  const [committeeDraft, setCommitteeDraft] = useState<CommitteeMemberConfig[]>(() =>
    defaultCommitteeMembers()
  );
  const [siteManualDraft, setSiteManualDraft] = useState<SiteManualConfig>(() =>
    cloneSiteManual(SITE_MANUAL_DEFAULTS)
  );
  /** When true, do not overwrite layout draft from context (avoids losing edits when localStorage hydrates). */
  const [siteLayoutDirty, setSiteLayoutDirty] = useState(false);
  const [saveFlash, setSaveFlash] = useState<string | null>(null);
  const [showAdvancedSiteLayout, setShowAdvancedSiteLayout] = useState(false);

  const resolveUploadedFile = useCallback(
    async (file: File) => {
      return readFileAsDataUrl(file);
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShowAdvancedSiteLayout(sessionStorage.getItem(ADVANCED_LAYOUT_SESSION_KEY) === "1");
  }, []);

  const toggleAdvancedSiteLayout = useCallback(() => {
    setShowAdvancedSiteLayout((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        if (next) sessionStorage.setItem(ADVANCED_LAYOUT_SESSION_KEY, "1");
        else sessionStorage.removeItem(ADVANCED_LAYOUT_SESSION_KEY);
      }
      return next;
    });
  }, []);

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
    setCommitteeDraft(committeeMembers);
  }, [committeeMembers]);

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

  const addGalleryPhoto = useCallback(() => {
    setGalleryDraft((prev) =>
      prev.length >= MAX_GALLERY_PHOTOS
        ? prev
        : [...prev, { src: "", altEn: "", altTe: "" }]
    );
  }, []);

  const removeGalleryPhoto = useCallback((index: number) => {
    setGalleryDraft((prev) => prev.filter((_, j) => j !== index));
  }, []);

  const updateCommitteeMember = useCallback((index: number, patch: Partial<CommitteeMemberConfig>) => {
    setCommitteeDraft((prev) =>
      prev.map((row, j) => (j === index ? { ...row, ...patch } : row))
    );
  }, []);

  const addCommitteeMember = useCallback(() => {
    setCommitteeDraft((prev) =>
      prev.length >= MAX_COMMITTEE_MEMBERS
        ? prev
        : [
            ...prev,
            {
              src: "",
              nameEn: "",
              nameTe: "",
              designationEn: "",
              designationTe: "",
              group: "working"
            }
          ]
    );
  }, []);

  const removeCommitteeMember = useCallback((index: number) => {
    setCommitteeDraft((prev) => prev.filter((_, j) => j !== index));
  }, []);

  const runFlash = useCallback((id: string) => {
    setSaveFlash(id);
    setTimeout(() => {
      setSaveFlash((cur) => (cur === id ? null : cur));
    }, 2000);
  }, []);

  const saveSiteLayout = useCallback(async () => {
    setSiteManual(siteManualDraft);
    setSiteLayoutDirty(false);
    runFlash("site-layout");
  }, [siteManualDraft, setSiteManual, runFlash]);

  const saveTextSection = useCallback(
    async (headerName: string, keys: readonly (keyof typeof tMap)[]) => {
      const updates: Overrides = {};
      for (const k of keys) {
        const keyStr = String(k);
        updates[keyStr] = getEffective(draft, keyStr);
      }
      saveOverrides(updates);
      if (headerName === "Gallery") {
        setGallerySlots(galleryDraft);
      }
      if (headerName === "Committee") {
        setCommitteeMembers(committeeDraft);
      }
      runFlash(`section-${headerName}`);
    },
    [
      draft,
      galleryDraft,
      committeeDraft,
      saveOverrides,
      setGallerySlots,
      setCommitteeMembers,
      runFlash
    ]
  );

  const handleReset = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.confirm(
        "Reset all text, gallery, committee, and site layout or header settings to defaults?"
      )
    ) {
      resetOverrides();
      try {
        sessionStorage.removeItem(ADVANCED_LAYOUT_SESSION_KEY);
        if (typeof caches !== "undefined") {
          void caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
        }
      } catch {
        // ignore private mode / blocked storage
      }
      setShowAdvancedSiteLayout(false);
      setDraft({});
      setGalleryDraft(
        RESET_GALLERY_BASELINE.length
          ? RESET_GALLERY_BASELINE.map((s) => ({ ...s }))
          : defaultGallerySlots()
      );
      setCommitteeDraft(
        RESET_COMMITTEE_BASELINE.length
          ? RESET_COMMITTEE_BASELINE.map((m) => ({ ...m }))
          : defaultCommitteeMembers()
      );
      setSiteLayoutDirty(false);
      setSiteManualDraft(cloneSiteManual(SITE_MANUAL_DEFAULTS));
      setSaveFlash(null);
    }
  }, [resetOverrides]);

  const handleDownload = useCallback(() => {
    const bundle = {
      siteManual: JSON.parse(localStorage.getItem("mallavaram-site-manual-config") ?? "null"),
      textOverrides: JSON.parse(localStorage.getItem("mallavaram-text-config") ?? "{}"),
      gallerySlots: JSON.parse(localStorage.getItem("mallavaram-gallery-photos") ?? "[]"),
      committeeMembers: JSON.parse(localStorage.getItem("mallavaram-committee-config") ?? "[]"),
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-bundle-from-browser.json";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    setLoginErr(null);
    setLoginBusy(true);
    const r = await login();
    setLoginBusy(false);
    if (!r.ok) setLoginErr(r.error ?? "Sign-in failed.");
  }, [login]);

  if (!ready) {
    return (
      <SectionContainer id="configure">
        <div className="py-12 text-center text-text-dark/70">Loading…</div>
      </SectionContainer>
    );
  }

  if (!authed) {
    return (
      <SectionContainer id="configure">
        <div className="bg-white rounded-3xl border border-maroon/20 shadow-md p-6 md:p-8 max-w-md mx-auto text-center">
          <h2 className="section-heading text-2xl">Configure — sign in</h2>
          <p className="text-sm text-text-dark/75 mb-6">
            Admin access only. Sign in with an authorized Google account.
          </p>
          {loginErr ? <p className="text-sm text-red-700 mb-4">{loginErr}</p> : null}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loginBusy}
            className="btn-primary w-full sm:w-auto"
          >
            {loginBusy ? "Signing in…" : "Sign in with Google"}
          </button>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="configure">
      <div className="bg-white rounded-3xl border border-maroon/20 shadow-md p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          <h2 className="section-heading mb-0">Configure</h2>
          <button type="button" onClick={logout} className="btn-outline text-sm py-2 px-4">
            Sign out
          </button>
        </div>
        <p className="section-subtitle mb-6">
          Each block has its own Save button. Changes are saved to Firestore and visible to everyone on refresh.
              Each block has its own Save button (this browser only, localStorage). Header images are saved with{" "}
              <strong>Save layout & header</strong>. To push changes to everyone on the public site, use{" "}
        </p>

        <div className="space-y-8">
          <fieldset className="border border-maroon/20 rounded-2xl p-4 md:p-5">
            <legend className="font-heading text-lg text-maroon px-2 font-bold">Header images</legend>
            <p className="text-sm text-text-dark/75 mt-2 mb-4">
              Current previews below. Use a site path like <code className="text-xs bg-sandal/60 px-1 rounded">/images/logo.png</code>, a full URL, or upload (stored in this browser only).
            </p>
            <div className="space-y-4">
              <HeaderImageField
                label="Logo"
                hint="Desktop gold header and mobile top bar."
                value={siteManualDraft.topHeaderLogoSrc}
                fallbackPath="/images/logo.png"
                onChange={(v) => patchLayoutDraft((p) => ({ ...p, topHeaderLogoSrc: v }))}
                resolveUploadedFile={resolveUploadedFile}
              />
              <HeaderImageField
                label="Left lamp"
                value={siteManualDraft.topHeaderLeftLampSrc}
                fallbackPath="/images/lamp-left.png"
                onChange={(v) => patchLayoutDraft((p) => ({ ...p, topHeaderLeftLampSrc: v }))}
                resolveUploadedFile={resolveUploadedFile}
              />
              <HeaderImageField
                label="Right lamp"
                value={siteManualDraft.topHeaderRightLampSrc}
                fallbackPath="/images/lamp-right.png"
                onChange={(v) => patchLayoutDraft((p) => ({ ...p, topHeaderRightLampSrc: v }))}
                resolveUploadedFile={resolveUploadedFile}
              />
              <HeaderImageField
                label="Moola virat"
                value={siteManualDraft.topHeaderMoolaViratSrc}
                fallbackPath="/images/moola-virat.png"
                onChange={(v) => patchLayoutDraft((p) => ({ ...p, topHeaderMoolaViratSrc: v }))}
                resolveUploadedFile={resolveUploadedFile}
              />
            </div>
            <p className="text-xs text-text-dark/65 mt-4">
              Use <strong>Save layout & header</strong> at the bottom of the next block to persist these images with the
              rest of the header settings.
            </p>
          </fieldset>

          <fieldset className="border border-maroon/20 rounded-2xl p-4 md:p-5">
            <legend className="font-heading text-lg text-maroon px-2 font-bold">Home page hero</legend>
            <p className="text-sm text-text-dark/75 mt-2 mb-4">
              Optional full-screen photo behind the welcome text. Leave empty (or use <strong>Delete picture</strong>) for
              a gradient-only hero with no background image.
            </p>
            <HeaderImageField
              label="Hero background image (optional)"
              hint="Path, URL, or upload. Empty = no background photo on the home page."
              value={siteManualDraft.homeHeroBackgroundSrc}
              fallbackPath="/images/Satram-illuminated.jpeg"
              emptyThumbMode="none"
              onChange={(v) => patchLayoutDraft((p) => ({ ...p, homeHeroBackgroundSrc: v }))}
              resolveUploadedFile={resolveUploadedFile}
            />
            <p className="text-xs text-text-dark/65 mt-4">
              Saved with <strong>Save layout & header</strong> below.
            </p>
          </fieldset>

          <fieldset className="border border-maroon/20 rounded-2xl p-4 md:p-5">
            <legend className="font-heading text-lg text-maroon px-2 font-bold">
              Site layout and header
            </legend>
            <p className="text-sm text-text-dark/75 mt-2 mb-4">
              By default only <strong>colors</strong> (and matching mobile colors) are shown. Use{" "}
              <strong>Show advanced layout &amp; header options</strong> for sidebar width, banner height, toranams,
              and typography — admin session only (resets when the browser tab is closed).
            </p>

            <label className="flex items-start gap-3 rounded-xl border border-maroon/15 bg-sandal/20 p-3 md:p-4 mb-5 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-maroon/40 text-maroon focus:ring-maroon/40"
                checked={siteManualDraft.mirrorMobileColorsFromDesktop}
                onChange={(e) =>
                  patchLayoutDraft((p) => ({ ...p, mirrorMobileColorsFromDesktop: e.target.checked }))
                }
              />
              <span>
                <span className="font-semibold text-sm text-maroon block">
                  Use desktop colors on the phone layout
                </span>
                <span className="text-xs text-text-dark/70 mt-1 block leading-relaxed">
                  When checked, the mobile top bar matches <strong>Top header background</strong> and the slide-down
                  menu matches <strong>Main column background</strong>. Gallery, text, and header images already apply
                  everywhere. Uncheck to set mobile bar and menu colors separately.
                </span>
              </span>
            </label>

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
                disabled={siteManualDraft.mirrorMobileColorsFromDesktop}
                value={
                  siteManualDraft.mirrorMobileColorsFromDesktop
                    ? resolveSiteManualForUi(siteManualDraft).siteMobileNavBarBackground
                    : siteManualDraft.siteMobileNavBarBackground
                }
                onChange={(v) => patchLayoutDraft((p) => ({ ...p, siteMobileNavBarBackground: v }))}
              />
              <div className="md:col-span-2">
                <ConfigureColorField
                  label="Mobile menu panel background"
                  disabled={siteManualDraft.mirrorMobileColorsFromDesktop}
                  value={
                    siteManualDraft.mirrorMobileColorsFromDesktop
                      ? resolveSiteManualForUi(siteManualDraft).siteMobileNavMenuBackground
                      : siteManualDraft.siteMobileNavMenuBackground
                  }
                  onChange={(v) => patchLayoutDraft((p) => ({ ...p, siteMobileNavMenuBackground: v }))}
                />
              </div>
            </div>

            {!showAdvancedSiteLayout ? (
              <div className="mt-5">
                <button type="button" onClick={toggleAdvancedSiteLayout} className="btn-outline text-sm py-2 px-4">
                  Show advanced layout &amp; header options (admin)
                </button>
              </div>
            ) : null}

            {showAdvancedSiteLayout ? (
              <>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-maroon/10 pt-4">
                  <p className="text-xs font-semibold text-maroon">Advanced — layout, toranam strip, typography</p>
                  <button type="button" onClick={toggleAdvancedSiteLayout} className="text-sm text-maroon/90 underline">
                    Hide advanced options
                  </button>
                </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mt-4">
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
                Left lamp shift horizontal (px)
                <input
                  type="number"
                  min={-200}
                  max={200}
                  value={siteManualDraft.topHeaderLeftLampShiftXPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      topHeaderLeftLampShiftXPx: Number(e.target.value) || 0
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
                <span className="font-normal text-text-dark/60">
                  Positive moves toward toranams; negative toward the logo.
                </span>
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

            <p className="text-xs font-semibold text-maroon mt-6 mb-2 border-t border-maroon/10 pt-4">
              Site-wide typography (body, headings, nav, section titles)
            </p>
            <p className="text-xs text-text-dark/65 mb-3">
              Font stacks use CSS, e.g. <code className="bg-sandal/60 px-1 rounded">var(--font-site-body), system-ui</code> or{" "}
              <code className="bg-sandal/60 px-1 rounded">&apos;Georgia&apos;, serif</code>. Root px scales rem-based Tailwind text.
            </p>
            <ConfigureFontPresetPicker
              title="Popular body fonts (click a card to set main text)"
              presets={POPULAR_BODY_FONTS}
              value={siteManualDraft.typographyBodyFontFamily}
              variant="body"
              onSelect={(familyCss) => patchLayoutDraft((p) => ({ ...p, typographyBodyFontFamily: familyCss }))}
            />
            <ConfigureFontPresetPicker
              title="Popular heading fonts (click a card to set titles)"
              presets={POPULAR_HEADING_FONTS}
              value={siteManualDraft.typographyHeadingFontFamily}
              variant="heading"
              onSelect={(familyCss) => patchLayoutDraft((p) => ({ ...p, typographyHeadingFontFamily: familyCss }))}
            />
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Root HTML font size (px)
                <input
                  type="number"
                  min={12}
                  max={24}
                  value={siteManualDraft.typographyHtmlFontPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      typographyHtmlFontPx: Math.max(12, Math.min(24, Math.round(Number(e.target.value) || p.typographyHtmlFontPx)))
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-3 mt-3">
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Body font family (CSS)
                <input
                  type="text"
                  value={siteManualDraft.typographyBodyFontFamily}
                  onChange={(e) => patchLayoutDraft((p) => ({ ...p, typographyBodyFontFamily: e.target.value }))}
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white font-mono text-xs"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Heading font family (CSS)
                <input
                  type="text"
                  value={siteManualDraft.typographyHeadingFontFamily}
                  onChange={(e) => patchLayoutDraft((p) => ({ ...p, typographyHeadingFontFamily: e.target.value }))}
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white font-mono text-xs"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-text-dark/70">
                Nav / menu font family (CSS)
                <input
                  type="text"
                  value={siteManualDraft.typographyNavFontFamily}
                  onChange={(e) => patchLayoutDraft((p) => ({ ...p, typographyNavFontFamily: e.target.value }))}
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white font-mono text-xs"
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 mt-3">
              {(
                [
                  ["typographyBodyFontWeight", "Body weight (100–900)"] as const,
                  ["typographyHeadingFontWeight", "Heading weight"] as const,
                  ["typographyNavFontWeight", "Nav weight"] as const
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="grid gap-1 text-xs font-medium text-text-dark/70">
                  {label}
                  <input
                    type="number"
                    min={100}
                    max={900}
                    step={100}
                    value={siteManualDraft[key]}
                    onChange={(e) =>
                      patchLayoutDraft((p) => ({
                        ...p,
                        [key]: Math.max(100, Math.min(900, Math.round(Number(e.target.value) / 100) * 100 || (p[key] as number)))
                      }))
                    }
                    className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                  />
                </label>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 mt-3">
              {(
                [
                  ["typographyBodyFontStyle", "Body style"] as const,
                  ["typographyHeadingFontStyle", "Heading style"] as const,
                  ["typographyNavFontStyle", "Nav style"] as const
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="grid gap-1 text-xs font-medium text-text-dark/70">
                  {label}
                  <select
                    value={siteManualDraft[key]}
                    onChange={(e) =>
                      patchLayoutDraft((p) => ({
                        ...p,
                        [key]: e.target.value as "normal" | "italic"
                      }))
                    }
                    className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                  >
                    <option value="normal">Regular</option>
                    <option value="italic">Italic</option>
                  </select>
                </label>
              ))}
            </div>
            <p className="text-xs font-semibold text-maroon mt-4 mb-2">Section panel titles (.section-heading)</p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {(
                [
                  ["typographySectionTitleMinRem", "Clamp min (rem)"] as const,
                  ["typographySectionTitlePrefVw", "Preferred (vw)"] as const,
                  ["typographySectionTitleMaxRem", "Clamp max (rem)"] as const,
                  ["typographySectionSubtitleRem", "Subtitle size (rem)"] as const
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="grid gap-1 text-xs font-medium text-text-dark/70">
                  {label}
                  <input
                    type="number"
                    step={0.05}
                    value={siteManualDraft[key]}
                    onChange={(e) =>
                      patchLayoutDraft((p) => ({
                        ...p,
                        [key]: Number(e.target.value) || (p[key] as number)
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
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
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
              <label className="grid gap-1 text-xs font-medium text-text-dark/70 sm:col-span-2">
                Shift toranam strip up (px)
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={siteManualDraft.headerToranamShiftUpPx}
                  onChange={(e) =>
                    patchLayoutDraft((p) => ({
                      ...p,
                      headerToranamShiftUpPx: Number(e.target.value) || 0
                    }))
                  }
                  className="rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-white"
                />
                <span className="font-normal text-text-dark/60">
                  Moves the whole toranam row toward the top of the banner (clipped by the header). Title band
                  stays put.
                </span>
              </label>
            </div>
              </>
            ) : null}

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-maroon/10">
              <button type="button" onClick={() => void saveSiteLayout()} className="btn-primary">
                {saveFlash === "site-layout" ? "Saved" : "Save layout & header"}
              </button>
            </div>
            <div className="rounded-xl border border-maroon/15 bg-sandal/25 px-3 py-2.5 mt-3 max-w-2xl">
              <p className="text-xs font-semibold text-maroon mb-1">Update the live site for everyone</p>
              <p className="text-xs text-text-dark/75 leading-relaxed">
                Save each block you changed. Changes are saved to this browser. Use <strong>Download for deploy</strong> and the deploy script to push to the public site.
              </p>
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
                  const multiline =
                    keyStr === "live_feed_text" || keyStr === "home_brahmotsavam_ticker";
                  const fieldClass =
                    "w-full rounded-xl border border-maroon/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon bg-sandal/40";
                  return (
                    <div key={keyStr} className="grid gap-2">
                      <label className="text-xs font-medium text-text-dark/70 uppercase tracking-wide">
                        {keyStr}
                        {multiline && keyStr === "live_feed_text" ? (
                          <span className="block font-normal normal-case text-text-dark/60 mt-0.5">
                            Shown on the home ticker (multicolor by word). Leading, trailing, and multiple spaces are
                            kept. Save with <strong>Save Hero</strong>.
                          </span>
                        ) : null}
                        {multiline && keyStr === "home_brahmotsavam_ticker" ? (
                          <span className="block font-normal normal-case text-text-dark/60 mt-0.5">
                            Scrolling strip at the bottom of the home hero (one long line; use • between items). Save
                            with <strong>Save Hero</strong>.
                          </span>
                        ) : null}
                      </label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-maroon/80 block mb-1">English</span>
                          {multiline ? (
                            <textarea
                              rows={4}
                              value={val.en}
                              onChange={(e) => updateDraft(keyStr, "en", e.target.value)}
                              className={`${fieldClass} min-h-[5rem] resize-y font-mono text-xs md:text-sm`}
                            />
                          ) : (
                            <input
                              type="text"
                              value={val.en}
                              onChange={(e) => updateDraft(keyStr, "en", e.target.value)}
                              className={fieldClass}
                            />
                          )}
                        </div>
                        <div>
                          <span className="text-xs text-maroon/80 block mb-1">Telugu</span>
                          {multiline ? (
                            <textarea
                              rows={4}
                              value={val.te}
                              onChange={(e) => updateDraft(keyStr, "te", e.target.value)}
                              className={`${fieldClass} min-h-[5rem] resize-y font-mono text-xs md:text-sm`}
                            />
                          ) : (
                            <input
                              type="text"
                              value={val.te}
                              onChange={(e) => updateDraft(keyStr, "te", e.target.value)}
                              className={fieldClass}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {headerName === "Committee" && (
                  <div className="pt-4 mt-4 border-t border-maroon/15 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-text-dark/80 font-medium">
                        Members ({committeeDraft.length} / {MAX_COMMITTEE_MEMBERS})
                      </p>
                      <button
                        type="button"
                        onClick={addCommitteeMember}
                        disabled={committeeDraft.length >= MAX_COMMITTEE_MEMBERS}
                        className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Add member
                      </button>
                    </div>
                    <p className="text-xs text-text-dark/65">
                      Default headshots load from{" "}
                      <code className="bg-sandal/60 px-1 rounded">public/images/Committee_members/</code> using the
                      English designation as the file name (e.g. <code className="bg-sandal/60 px-1">president.jpg</code>
                      , <code className="bg-sandal/60 px-1">vice-president-1.jpg</code> for multiple Vice Presidents,{" "}
                      <code className="bg-sandal/60 px-1">members-1.jpg</code> … for Members). Extensions{" "}
                      <code className="bg-sandal/60 px-1">.jpg</code>, <code className="bg-sandal/60 px-1">.jpeg</code>,{" "}
                      <code className="bg-sandal/60 px-1">.png</code>, or <code className="bg-sandal/60 px-1">.webp</code>{" "}
                      are tried in order. Leave Photo URL empty to use those files; otherwise paste a path/URL or
                      upload (under ~{MAX_IMAGE_FILE_MB} MB). You must click{" "}
                      <strong>Save Committee (text &amp; members)</strong> below or deploy exports will not include new
                      members (draft rows are not written to localStorage until then).
                    </p>
                    {committeeDraft.length === 0 ? (
                      <p className="text-sm text-text-dark/60 italic">
                        No members yet. Click Add member to start.
                      </p>
                    ) : (
                      committeeDraft.map((row, i) => {
                        return (
                        <div
                          key={i}
                          className="rounded-xl border border-maroon/15 bg-sandal/30 p-3 md:p-4 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-maroon">Member {i + 1}</p>
                            <button
                              type="button"
                              className="text-xs text-red-800 underline font-medium"
                              onClick={() => removeCommitteeMember(i)}
                            >
                              Remove member
                            </button>
                          </div>
                          <div className="grid md:grid-cols-[100px_1fr] gap-4 items-start">
                            <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-maroon/20 bg-white shrink-0 mx-auto md:mx-0">
                              {row.src.trim() ? (
                                <GalleryThumb src={row.src} />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-text-dark/30 text-xs">No photo</div>
                              )}
                            </div>
                            <div className="space-y-2 min-w-0">
                              <label className="text-xs text-text-dark/70 block">Photo URL or path</label>
                              <input
                                type="text"
                                value={row.src}
                                onChange={(e) => updateCommitteeMember(i, { src: e.target.value })}
                                placeholder="https://... or /images/member.jpg"
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
                                      void resolveUploadedFile(file)
                                        .then((url) => updateCommitteeMember(i, { src: url }))
                                        .catch((err: unknown) => {
                                          window.alert(err instanceof Error ? err.message : String(err));
                                        });
                                    }}
                                  />
                                  Upload photo
                                </label>
                                <button
                                  type="button"
                                  className="text-xs text-red-800 underline font-medium"
                                  onClick={() => updateCommitteeMember(i, { src: "" })}
                                >
                                  Delete picture
                                </button>
                              </div>
                              <div>
                                <span className="text-xs text-maroon/80 block mb-1">Section</span>
                                <select
                                  value={row.group ?? "working"}
                                  onChange={(e) =>
                                    updateCommitteeMember(i, {
                                      group: e.target.value === "honorary" ? "honorary" : "working"
                                    })
                                  }
                                  className="w-full max-w-xs rounded-lg border border-maroon/20 px-3 py-2 text-sm bg-white"
                                >
                                  <option value="honorary">Honorary (one summary line)</option>
                                  <option value="working">Working committee (table)</option>
                                </select>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-2 pt-1">
                                <div>
                                  <span className="text-xs text-maroon/80 block mb-1">Name (English)</span>
                                  <input
                                    type="text"
                                    value={row.nameEn}
                                    onChange={(e) => updateCommitteeMember(i, { nameEn: e.target.value })}
                                    className="w-full rounded-lg border border-maroon/20 px-3 py-2 text-sm bg-white"
                                  />
                                </div>
                                <div>
                                  <span className="text-xs text-maroon/80 block mb-1">Name (Telugu)</span>
                                  <input
                                    type="text"
                                    value={row.nameTe}
                                    onChange={(e) => updateCommitteeMember(i, { nameTe: e.target.value })}
                                    className="w-full rounded-lg border border-maroon/20 px-3 py-2 text-sm bg-white"
                                  />
                                </div>
                                <div>
                                  <span className="text-xs text-maroon/80 block mb-1">Designation (English)</span>
                                  <input
                                    type="text"
                                    value={row.designationEn}
                                    onChange={(e) =>
                                      updateCommitteeMember(i, { designationEn: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-maroon/20 px-3 py-2 text-sm bg-white"
                                  />
                                </div>
                                <div>
                                  <span className="text-xs text-maroon/80 block mb-1">Designation (Telugu)</span>
                                  <input
                                    type="text"
                                    value={row.designationTe}
                                    onChange={(e) =>
                                      updateCommitteeMember(i, { designationTe: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-maroon/20 px-3 py-2 text-sm bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                      })
                    )}
                  </div>
                )}

                {headerName === "Gallery" && (
                  <div className="pt-4 mt-4 border-t border-maroon/15 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-text-dark/80 font-medium">
                        Gallery photos ({galleryDraft.length} / {MAX_GALLERY_PHOTOS})
                      </p>
                      <button
                        type="button"
                        onClick={addGalleryPhoto}
                        disabled={galleryDraft.length >= MAX_GALLERY_PHOTOS}
                        className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Add photo
                      </button>
                    </div>
                    <p className="text-xs text-text-dark/65">
                      Add photos one at a time. Paste a URL, a path like{" "}
                      <code className="bg-sandal/80 px-1 rounded">/images/your-photo.jpg</code>, or upload (this
                      browser only; under ~{MAX_IMAGE_FILE_MB} MB). Toranam images are not used here — they stay in the
                      header strip only. Save with <strong>Save Gallery</strong> below.
                    </p>
                    {galleryDraft.length === 0 ? (
                      <p className="text-sm text-text-dark/60 italic">No photos yet. Click Add photo to start.</p>
                    ) : (
                      galleryDraft.map((slot, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-maroon/15 bg-sandal/30 p-3 md:p-4 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-maroon">Photo {i + 1}</p>
                            <button
                              type="button"
                              className="text-xs text-red-800 underline font-medium"
                              onClick={() => removeGalleryPhoto(i)}
                            >
                              Remove photo
                            </button>
                          </div>
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
                                      void resolveUploadedFile(file)
                                        .then((url) => updateGallerySlot(i, { src: url }))
                                        .catch((err: unknown) => {
                                          window.alert(err instanceof Error ? err.message : String(err));
                                        });
                                    }}
                                  />
                                  Upload file
                                </label>
                                <button
                                  type="button"
                                  className="text-xs text-red-800 underline font-medium"
                                  onClick={() => updateGallerySlot(i, { src: "" })}
                                >
                                  Delete picture
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
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-maroon/10">
                <button
                  type="button"
                  onClick={() => void saveTextSection(headerName, keys)}
                  className="btn-primary"
                >
                  {saveFlash === `section-${headerName}`
                    ? "Saved"
                    : headerName === "Gallery"
                      ? "Save Gallery (text & photos)"
                      : headerName === "Committee"
                        ? "Save Committee (text & members)"
                        : `Save ${headerName}`}
                </button>
              </div>
            </fieldset>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-maroon/10">
          <button type="button" onClick={handleDownload} className="btn-primary">
            Download for deploy
          </button>
          <p className="text-xs text-text-dark/60 max-w-xl">
            Downloads <code className="bg-sandal/60 px-1 rounded">site-bundle-from-browser.json</code>. Repo root or
            Downloads is fine. Then:{" "}
            <code className="bg-sandal/60 px-1 rounded">
              .\Mallavaram-Workflows.ps1 -MergeDownloadedBundleAndPushToGitHub
            </code>{" "}
            for the public site, or{" "}
            <code className="bg-sandal/60 px-1 rounded">-MergeDownloadedBundleIntoLibNoGit</code> to update{" "}
            <code className="bg-sandal/60 px-1 rounded">lib/</code> only (no Git).
          </p>
          <div className="w-full border-t border-maroon/10 pt-3 mt-1">
            <button type="button" onClick={handleReset} className="btn-outline text-sm">
              Reset everything to defaults
            </button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
