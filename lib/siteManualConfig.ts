/**
 * Build-time defaults for site manual config (same values as SITE_MANUAL_DEFAULTS in siteManualSchema).
 * Runtime UI uses ConfigProvider + localStorage; components that call useSiteManual() use merged values.
 */
import {
  SITE_MANUAL_DEFAULTS,
  siteLeftMenuBackgroundFromConfig,
  topHeaderAddressFontSizeCss as addressFontSizeFrom,
  topHeaderTitleFontSizeCss as titleFontSizeFrom,
  type SiteManualConfig
} from "./siteManualSchema";

const D = SITE_MANUAL_DEFAULTS;

export type { SiteManualConfig };
export { SITE_MANUAL_DEFAULTS, SITE_MANUAL_STORAGE_KEY, mergeSiteManual, siteLeftMenuBackgroundFromConfig } from "./siteManualSchema";

/** Uses build defaults when `cfg` is omitted (SSR or non-provider code). */
export function topHeaderTitleFontSizeCss(cfg?: SiteManualConfig): string {
  return titleFontSizeFrom(cfg ?? D);
}

export function topHeaderAddressFontSizeCss(cfg?: SiteManualConfig): string {
  return addressFontSizeFrom(cfg ?? D);
}

// §1 colors
export const SITE_TOP_HEADER_BACKGROUND = D.siteTopHeaderBackground;
export const SITE_MAIN_COLUMN_BACKGROUND = D.siteMainColumnBackground;
export const SITE_LEFT_MENU_GRADIENT_FROM = D.siteLeftMenuGradientFrom;
export const SITE_LEFT_MENU_GRADIENT_VIA = D.siteLeftMenuGradientVia;
export const SITE_LEFT_MENU_GRADIENT_TO = D.siteLeftMenuGradientTo;
export const SITE_MOBILE_NAV_BAR_BACKGROUND = D.siteMobileNavBarBackground;
export const SITE_MOBILE_NAV_MENU_BACKGROUND = D.siteMobileNavMenuBackground;

export function siteLeftMenuBackgroundCss(): string {
  return siteLeftMenuBackgroundFromConfig(D);
}

// §2
export const SIDEBAR_WIDTH_PX = D.sidebarWidthPx;

// §3
export const TOP_HEADER_HEIGHT_CLASSES = D.topHeaderHeightClasses;

// §4
export const TOP_HEADER_MOOLA_COLUMN_WIDTH_PX = D.topHeaderMoolaColumnWidthPx;
export const TOP_HEADER_LEFT_LAMP_WIDTH_PX = D.topHeaderLeftLampWidthPx;
export const TOP_HEADER_LEFT_LAMP_SHIFT_X_PX = D.topHeaderLeftLampShiftXPx;
export const TOP_HEADER_RIGHT_LAMP_WIDTH_PX = D.topHeaderRightLampWidthPx;
export const TOP_HEADER_LOGO_SRC = D.topHeaderLogoSrc;
export const TOP_HEADER_LEFT_LAMP_SRC = D.topHeaderLeftLampSrc;
export const TOP_HEADER_RIGHT_LAMP_SRC = D.topHeaderRightLampSrc;
export const TOP_HEADER_MOOLA_VIRAT_SRC = D.topHeaderMoolaViratSrc;

// §5
export const TOP_HEADER_TITLE_FONT_FIXED_REM = D.topHeaderTitleFontFixedRem;
export const TOP_HEADER_TITLE_FONT_MIN_REM = D.topHeaderTitleFontMinRem;
export const TOP_HEADER_TITLE_FONT_PREF_VW = D.topHeaderTitleFontPrefVw;
export const TOP_HEADER_TITLE_FONT_MAX_REM = D.topHeaderTitleFontMaxRem;
export const TOP_HEADER_ADDRESS_FONT_FIXED_REM = D.topHeaderAddressFontFixedRem;
export const TOP_HEADER_ADDRESS_FONT_MIN_REM = D.topHeaderAddressFontMinRem;
export const TOP_HEADER_ADDRESS_FONT_PREF_VW = D.topHeaderAddressFontPrefVw;
export const TOP_HEADER_ADDRESS_FONT_MAX_REM = D.topHeaderAddressFontMaxRem;
export const TOP_HEADER_MIDDLE_TEXT_ALIGN_LEFT = D.topHeaderMiddleTextAlignLeft;
export const TOP_HEADER_MIDDLE_TEXT_SHIFT_PX = D.topHeaderMiddleTextShiftPx;
export const TOP_HEADER_MIDDLE_TEXT_PUSH_DOWN_PX = D.topHeaderMiddleTextPushDownPx;
export const TOP_HEADER_TITLE_TO_ADDRESS_GAP_PX = D.topHeaderTitleToAddressGapPx;

// §6
export const TORANAM_IMAGE_PATHS = [
  ...D.toranamImagePaths
] as const satisfies readonly string[];

export const HEADER_TORANAM_STRIP_HEIGHT_PX = D.headerToranamStripHeightPx;
export const HEADER_TORANAM_TILE_HEIGHT_PX = D.headerToranamTileHeightPx;
export const HEADER_TORANAM_TILE_WIDTH_PX = D.headerToranamTileWidthPx;
export const HEADER_TORANAM_GAP_PX = D.headerToranamGapPx;
export const HEADER_TORANAM_OBJECT_FIT = D.headerToranamObjectFit;
export const HEADER_TORANAM_TILE_COUNT = D.headerToranamTileCount;
export const HEADER_TORANAM_LEFT_PULL_PX = D.headerToranamLeftPullPx;
export const HEADER_TORANAM_SHIFT_UP_PX = D.headerToranamShiftUpPx;
export const HOME_HERO_BACKGROUND_SRC = D.homeHeroBackgroundSrc;
