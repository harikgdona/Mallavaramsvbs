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
  sidebarWidthPx: number;
  topHeaderHeightClasses: string;
  topHeaderMoolaColumnWidthPx: number;
  topHeaderLeftLampWidthPx: number;
  topHeaderRightLampWidthPx: number;
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
};

export const SITE_MANUAL_DEFAULTS: SiteManualConfig = {
  siteTopHeaderBackground: "#D4AF37",
  siteMainColumnBackground: "#F5F5DC",
  siteLeftMenuGradientFrom: "#FFFBEB",
  siteLeftMenuGradientVia: "#F8F1E5",
  siteLeftMenuGradientTo: "#F8F1E5",
  siteMobileNavBarBackground: "#FDE047",
  siteMobileNavMenuBackground: "rgba(248, 241, 229, 0.95)",
  sidebarWidthPx: 175,
  topHeaderHeightClasses: "h-[8.7rem] md:h-[9.9rem]",
  topHeaderMoolaColumnWidthPx: 112,
  topHeaderLeftLampWidthPx: 165,
  topHeaderRightLampWidthPx: 110,
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
  topHeaderMiddleTextPushDownPx: 10,
  topHeaderTitleToAddressGapPx: 30,
  toranamImagePaths: [
    "/images/toranam-1.jpeg",
    "/images/Toranam-2.jpeg",
    "/images/Toranam-3.jpeg",
    "/images/toranam-4.png",
    "/images/toranam-5.png"
  ],
  headerToranamStripHeightPx: 76,
  headerToranamTileHeightPx: 70,
  headerToranamTileWidthPx: 250,
  headerToranamGapPx: 0,
  headerToranamObjectFit: "cover",
  headerToranamTileCount: 4,
  headerToranamLeftPullPx: 60,
  headerToranamShiftUpPx: 10
};

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
  next.sidebarWidthPx = Math.max(40, Math.round(num("sidebarWidthPx")));
  next.topHeaderHeightClasses = str("topHeaderHeightClasses");
  next.topHeaderMoolaColumnWidthPx = Math.max(20, Math.round(num("topHeaderMoolaColumnWidthPx")));
  next.topHeaderLeftLampWidthPx = Math.max(0, Math.round(num("topHeaderLeftLampWidthPx")));
  next.topHeaderRightLampWidthPx = Math.max(0, Math.round(num("topHeaderRightLampWidthPx")));
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

  return next;
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
