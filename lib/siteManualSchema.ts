/**
 * Site manual config schema — defaults + merge for admin UI (localStorage).
 * Code defaults stay in sync with historical siteManualConfig exports.
 */

export const SITE_MANUAL_STORAGE_KEY = "mallavaram-site-manual-config";

export type SiteManualConfig = {
  siteTopHeaderBackground: string;
  siteMainColumnBackground: string;
  siteLeftMenuGradientFrom: string;
  siteLeftMenuGradientVia: string;
  siteLeftMenuGradientTo: string;
  siteMobileNavBarBackground: string;
  siteMobileNavMenuBackground: string;
  /** When true, mobile nav bar uses `siteTopHeaderBackground` and menu panel uses `siteMainColumnBackground`. */
  mirrorMobileColorsFromDesktop: boolean;
  sidebarWidthPx: number;
  topHeaderHeightClasses: string;
  topHeaderMoolaColumnWidthPx: number;
  topHeaderLeftLampWidthPx: number;
  /** Nudge left lamp art horizontally (px). Positive = toward toranams, negative = toward logo. */
  topHeaderLeftLampShiftXPx: number;
  topHeaderRightLampWidthPx: number;
  /** Site path, URL, or data URL — logo (desktop header + mobile bar). */
  topHeaderLogoSrc: string;
  topHeaderLeftLampSrc: string;
  topHeaderRightLampSrc: string;
  topHeaderMoolaViratSrc: string;
  topHeaderTitleFontFixedRem: number;
  topHeaderTitleFontMinRem: number;
  topHeaderTitleFontPrefVw: number;
  topHeaderTitleFontMaxRem: number;
  topHeaderAddressFontFixedRem: number;
  topHeaderAddressFontMinRem: number;
  topHeaderAddressFontPrefVw: number;
  topHeaderAddressFontMaxRem: number;
  topHeaderMiddleTextAlignLeft: boolean;
  topHeaderMiddleTextShiftPx: number;
  topHeaderMiddleTextPushDownPx: number;
  topHeaderTitleToAddressGapPx: number;
  toranamImagePaths: string[];
  headerToranamStripHeightPx: number;
  headerToranamTileHeightPx: number;
  headerToranamTileWidthPx: number;
  headerToranamGapPx: number;
  headerToranamObjectFit: "contain" | "cover";
  headerToranamTileCount: number;
  headerToranamLeftPullPx: number;
  /** Move entire toranam row upward (px). Does not affect title band position. */
  headerToranamShiftUpPx: number;
  /** Full-bleed background on the home hero (#home) — path, URL, or data URL. */
  homeHeroBackgroundSrc: string;

  /** Root rem basis (browser default ~16px). Scales most Tailwind rem-based text. */
  typographyHtmlFontPx: number;
  /** CSS font-family stacks (e.g. var(--font-site-body), system-ui or 'Georgia', serif). */
  typographyBodyFontFamily: string;
  typographyHeadingFontFamily: string;
  typographyNavFontFamily: string;
  typographyBodyFontWeight: number;
  typographyHeadingFontWeight: number;
  typographyNavFontWeight: number;
  typographyBodyFontStyle: "normal" | "italic";
  typographyHeadingFontStyle: "normal" | "italic";
  typographyNavFontStyle: "normal" | "italic";
  /** Section panel titles (.section-heading) — clamp(min, vw, max). */
  typographySectionTitleMinRem: number;
  typographySectionTitlePrefVw: number;
  typographySectionTitleMaxRem: number;
  typographySectionSubtitleRem: number;
};

// <site-manual-defaults>
export const SITE_MANUAL_DEFAULTS: SiteManualConfig = {
  siteTopHeaderBackground: "#D4AF37",
  siteMainColumnBackground: "#F5F5DC",
  siteLeftMenuGradientFrom: "#87CEEB",
  siteLeftMenuGradientVia: "#F8F1E5",
  siteLeftMenuGradientTo: "#F8F1E5",
  siteMobileNavBarBackground: "#FDE047",
  siteMobileNavMenuBackground: "rgba(248, 241, 229, 0.95)",
  mirrorMobileColorsFromDesktop: true,
  sidebarWidthPx: 175,
  topHeaderHeightClasses: "h-[8.7rem] md:h-[9.9rem]",
  topHeaderMoolaColumnWidthPx: 112,
  topHeaderLeftLampWidthPx: 165,
  topHeaderLeftLampShiftXPx: -58,
  topHeaderRightLampWidthPx: 110,
  topHeaderLogoSrc: "/images/logo.png",
  topHeaderLeftLampSrc: "/images/lamp-left.png",
  topHeaderRightLampSrc: "/images/lamp-right.png",
  topHeaderMoolaViratSrc: "/images/moola-virat.png",
  topHeaderTitleFontFixedRem: 1.55,
  topHeaderTitleFontMinRem: 1.125,
  topHeaderTitleFontPrefVw: 3.6,
  topHeaderTitleFontMaxRem: 1.9,
  topHeaderAddressFontFixedRem: 0.8,
  topHeaderAddressFontMinRem: 0.72,
  topHeaderAddressFontPrefVw: 2,
  topHeaderAddressFontMaxRem: 1.05,
  topHeaderMiddleTextAlignLeft: true,
  topHeaderMiddleTextShiftPx: -45,
  topHeaderMiddleTextPushDownPx: 35,
  topHeaderTitleToAddressGapPx: 30,
  toranamImagePaths: [
    "/images/toranam-1.jpeg",
    "/images/Toranam-2.jpeg",
    "/images/Toranam-3.jpeg",
    "/images/toranam-4.png",
    "/images/toranam-5.png",
  ],
  headerToranamStripHeightPx: 76,
  headerToranamTileHeightPx: 70,
  headerToranamTileWidthPx: 255,
  headerToranamGapPx: 0,
  headerToranamObjectFit: "cover",
  headerToranamTileCount: 3,
  headerToranamLeftPullPx: 60,
  headerToranamShiftUpPx: 10,
  homeHeroBackgroundSrc: "",
  typographyHtmlFontPx: 16,
  typographyBodyFontFamily: "var(--font-site-body), system-ui, sans-serif",
  typographyHeadingFontFamily: "'Merriweather', Georgia, serif",
  typographyNavFontFamily: "var(--font-site-body), system-ui, sans-serif",
  typographyBodyFontWeight: 400,
  typographyHeadingFontWeight: 700,
  typographyNavFontWeight: 600,
  typographyBodyFontStyle: "normal",
  typographyHeadingFontStyle: "normal",
  typographyNavFontStyle: "normal",
  typographySectionTitleMinRem: 1.75,
  typographySectionTitlePrefVw: 4.5,
  typographySectionTitleMaxRem: 2.35,
  typographySectionSubtitleRem: 1.125,
};
// </site-manual-defaults>

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Merge saved partial JSON over defaults (safe for localStorage). */
export function mergeSiteManual(overrides: unknown): SiteManualConfig {
  const base = { ...SITE_MANUAL_DEFAULTS, toranamImagePaths: [...SITE_MANUAL_DEFAULTS.toranamImagePaths] };
  if (!isRecord(overrides)) return base;

  const o = overrides as Record<string, unknown>;
  const next: SiteManualConfig = { ...base };

  const str = (k: keyof SiteManualConfig): string => {
    const v = o[k as string];
    return typeof v === "string" ? v : (next[k] as string);
  };
  const num = (k: keyof SiteManualConfig): number => {
    const v = o[k as string];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
    return next[k] as number;
  };
  const bool = (k: keyof SiteManualConfig): boolean => {
    const v = o[k as string];
    return typeof v === "boolean" ? v : (next[k] as boolean);
  };

  next.siteTopHeaderBackground = str("siteTopHeaderBackground");
  next.siteMainColumnBackground = str("siteMainColumnBackground");
  next.siteLeftMenuGradientFrom = str("siteLeftMenuGradientFrom");
  next.siteLeftMenuGradientVia = str("siteLeftMenuGradientVia");
  next.siteLeftMenuGradientTo = str("siteLeftMenuGradientTo");
  next.siteMobileNavBarBackground = str("siteMobileNavBarBackground");
  next.siteMobileNavMenuBackground = str("siteMobileNavMenuBackground");
  next.mirrorMobileColorsFromDesktop = bool("mirrorMobileColorsFromDesktop");
  next.sidebarWidthPx = Math.max(40, Math.round(num("sidebarWidthPx")));
  next.topHeaderHeightClasses = str("topHeaderHeightClasses");
  next.topHeaderMoolaColumnWidthPx = Math.max(20, Math.round(num("topHeaderMoolaColumnWidthPx")));
  next.topHeaderLeftLampWidthPx = Math.max(0, Math.round(num("topHeaderLeftLampWidthPx")));
  next.topHeaderLeftLampShiftXPx = Math.max(
    -200,
    Math.min(200, Math.round(num("topHeaderLeftLampShiftXPx")))
  );
  next.topHeaderRightLampWidthPx = Math.max(0, Math.round(num("topHeaderRightLampWidthPx")));
  next.topHeaderLogoSrc = str("topHeaderLogoSrc");
  next.topHeaderLeftLampSrc = str("topHeaderLeftLampSrc");
  next.topHeaderRightLampSrc = str("topHeaderRightLampSrc");
  next.topHeaderMoolaViratSrc = str("topHeaderMoolaViratSrc");
  next.topHeaderTitleFontFixedRem = num("topHeaderTitleFontFixedRem");
  next.topHeaderTitleFontMinRem = num("topHeaderTitleFontMinRem");
  next.topHeaderTitleFontPrefVw = num("topHeaderTitleFontPrefVw");
  next.topHeaderTitleFontMaxRem = num("topHeaderTitleFontMaxRem");
  next.topHeaderAddressFontFixedRem = num("topHeaderAddressFontFixedRem");
  next.topHeaderAddressFontMinRem = num("topHeaderAddressFontMinRem");
  next.topHeaderAddressFontPrefVw = num("topHeaderAddressFontPrefVw");
  next.topHeaderAddressFontMaxRem = num("topHeaderAddressFontMaxRem");
  next.topHeaderMiddleTextAlignLeft = bool("topHeaderMiddleTextAlignLeft");
  next.topHeaderMiddleTextShiftPx = Math.round(num("topHeaderMiddleTextShiftPx"));
  next.topHeaderMiddleTextPushDownPx = Math.max(0, Math.round(num("topHeaderMiddleTextPushDownPx")));
  next.topHeaderTitleToAddressGapPx = Math.max(0, Math.round(num("topHeaderTitleToAddressGapPx")));

  if (Array.isArray(o.toranamImagePaths) && o.toranamImagePaths.every((x) => typeof x === "string")) {
    next.toranamImagePaths = o.toranamImagePaths as string[];
  }

  next.headerToranamStripHeightPx = Math.max(1, Math.round(num("headerToranamStripHeightPx")));
  next.headerToranamTileHeightPx = Math.max(0, Math.round(num("headerToranamTileHeightPx")));
  next.headerToranamTileWidthPx = Math.max(0, Math.round(num("headerToranamTileWidthPx")));
  next.headerToranamGapPx = Math.max(0, Math.round(num("headerToranamGapPx")));
  const fit = o.headerToranamObjectFit;
  next.headerToranamObjectFit = fit === "contain" || fit === "cover" ? fit : next.headerToranamObjectFit;
  next.headerToranamTileCount = Math.max(0, Math.min(20, Math.round(num("headerToranamTileCount"))));
  next.headerToranamLeftPullPx = Math.max(0, Math.round(num("headerToranamLeftPullPx")));
  next.headerToranamShiftUpPx = Math.max(0, Math.min(120, Math.round(num("headerToranamShiftUpPx"))));
  next.homeHeroBackgroundSrc = str("homeHeroBackgroundSrc");

  next.typographyHtmlFontPx = Math.max(12, Math.min(24, Math.round(num("typographyHtmlFontPx"))));
  next.typographyBodyFontFamily = str("typographyBodyFontFamily");
  next.typographyHeadingFontFamily = str("typographyHeadingFontFamily");
  next.typographyNavFontFamily = str("typographyNavFontFamily");
  const wClamp = (k: keyof SiteManualConfig) =>
    Math.max(100, Math.min(900, Math.round(num(k) / 100) * 100));
  next.typographyBodyFontWeight = wClamp("typographyBodyFontWeight");
  next.typographyHeadingFontWeight = wClamp("typographyHeadingFontWeight");
  next.typographyNavFontWeight = wClamp("typographyNavFontWeight");
  const fs = (k: keyof SiteManualConfig): "normal" | "italic" => {
    const v = o[k as string];
    if (v === "italic" || v === "normal") return v;
    return next[k] as "normal" | "italic";
  };
  next.typographyBodyFontStyle = fs("typographyBodyFontStyle");
  next.typographyHeadingFontStyle = fs("typographyHeadingFontStyle");
  next.typographyNavFontStyle = fs("typographyNavFontStyle");
  next.typographySectionTitleMinRem = Math.max(0.5, num("typographySectionTitleMinRem"));
  next.typographySectionTitlePrefVw = Math.max(0, num("typographySectionTitlePrefVw"));
  next.typographySectionTitleMaxRem = Math.max(0.5, num("typographySectionTitleMaxRem"));
  next.typographySectionSubtitleRem = Math.max(0.75, num("typographySectionSubtitleRem"));

  return next;
}

/** Effective config for rendering: applies mobile color mirror when enabled. */
export function resolveSiteManualForUi(cfg: SiteManualConfig): SiteManualConfig {
  if (!cfg.mirrorMobileColorsFromDesktop) return cfg;
  return {
    ...cfg,
    siteMobileNavBarBackground: cfg.siteTopHeaderBackground,
    siteMobileNavMenuBackground: cfg.siteMainColumnBackground
  };
}

export function siteLeftMenuBackgroundFromConfig(cfg: SiteManualConfig): string {
  return `linear-gradient(to bottom, ${cfg.siteLeftMenuGradientFrom}, ${cfg.siteLeftMenuGradientVia}, ${cfg.siteLeftMenuGradientTo})`;
}

export function topHeaderTitleFontSizeCss(cfg: SiteManualConfig): string {
  if (cfg.topHeaderTitleFontFixedRem > 0) {
    return `${cfg.topHeaderTitleFontFixedRem}rem`;
  }
  const lo = Math.min(cfg.topHeaderTitleFontMinRem, cfg.topHeaderTitleFontMaxRem);
  const hi = Math.max(cfg.topHeaderTitleFontMinRem, cfg.topHeaderTitleFontMaxRem);
  return `clamp(${lo}rem, ${cfg.topHeaderTitleFontPrefVw}vw, ${hi}rem)`;
}

export function topHeaderAddressFontSizeCss(cfg: SiteManualConfig): string {
  if (cfg.topHeaderAddressFontFixedRem > 0) {
    return `${cfg.topHeaderAddressFontFixedRem}rem`;
  }
  const lo = Math.min(cfg.topHeaderAddressFontMinRem, cfg.topHeaderAddressFontMaxRem);
  const hi = Math.max(cfg.topHeaderAddressFontMinRem, cfg.topHeaderAddressFontMaxRem);
  return `clamp(${lo}rem, ${cfg.topHeaderAddressFontPrefVw}vw, ${hi}rem)`;
}

/** Main section panel titles (.section-heading). */
export function sectionHeadingFontSizeCss(cfg: SiteManualConfig): string {
  const lo = Math.min(cfg.typographySectionTitleMinRem, cfg.typographySectionTitleMaxRem);
  const hi = Math.max(cfg.typographySectionTitleMinRem, cfg.typographySectionTitleMaxRem);
  return `clamp(${lo}rem, ${cfg.typographySectionTitlePrefVw}vw, ${hi}rem)`;
}
