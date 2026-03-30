/**
 * Shared: locate site-manual-from-browser.json and merge into SITE_MANUAL_DEFAULTS in siteManualSchema.ts
 */

import fs from "fs";
import os from "os";
import path from "path";

/** Search project root, ~/Downloads, ~ — does not use --file= (for publish-site bundle vs manual). */
export function findImportedJsonPath(projectRoot: string, filename: string): string | null {
  const inRoot = path.join(projectRoot, filename);
  if (fs.existsSync(inRoot)) return inRoot;

  const inDownloads = path.join(os.homedir(), "Downloads", filename);
  if (fs.existsSync(inDownloads)) return inDownloads;

  const inHome = path.join(os.homedir(), filename);
  if (fs.existsSync(inHome)) return inHome;

  return null;
}
import { mergeSiteManual, type SiteManualConfig } from "../lib/siteManualSchema";

export const SITE_MANUAL_IMPORT_FILENAME = "site-manual-from-browser.json";

const KEY_ORDER: (keyof SiteManualConfig)[] = [
  "siteTopHeaderBackground",
  "siteMainColumnBackground",
  "siteLeftMenuGradientFrom",
  "siteLeftMenuGradientVia",
  "siteLeftMenuGradientTo",
  "siteMobileNavBarBackground",
  "siteMobileNavMenuBackground",
  "mirrorMobileColorsFromDesktop",
  "sidebarWidthPx",
  "topHeaderHeightClasses",
  "topHeaderMoolaColumnWidthPx",
  "topHeaderLeftLampWidthPx",
  "topHeaderLeftLampShiftXPx",
  "topHeaderRightLampWidthPx",
  "topHeaderLogoSrc",
  "topHeaderLeftLampSrc",
  "topHeaderRightLampSrc",
  "topHeaderMoolaViratSrc",
  "topHeaderTitleFontFixedRem",
  "topHeaderTitleFontMinRem",
  "topHeaderTitleFontPrefVw",
  "topHeaderTitleFontMaxRem",
  "topHeaderAddressFontFixedRem",
  "topHeaderAddressFontMinRem",
  "topHeaderAddressFontPrefVw",
  "topHeaderAddressFontMaxRem",
  "topHeaderMiddleTextAlignLeft",
  "topHeaderMiddleTextShiftPx",
  "topHeaderMiddleTextPushDownPx",
  "topHeaderTitleToAddressGapPx",
  "toranamImagePaths",
  "headerToranamStripHeightPx",
  "headerToranamTileHeightPx",
  "headerToranamTileWidthPx",
  "headerToranamGapPx",
  "headerToranamObjectFit",
  "headerToranamTileCount",
  "headerToranamLeftPullPx",
  "headerToranamShiftUpPx",
  "homeHeroBackgroundSrc",
  "typographyHtmlFontPx",
  "typographyBodyFontFamily",
  "typographyHeadingFontFamily",
  "typographyNavFontFamily",
  "typographyBodyFontWeight",
  "typographyHeadingFontWeight",
  "typographyNavFontWeight",
  "typographyBodyFontStyle",
  "typographyHeadingFontStyle",
  "typographyNavFontStyle",
  "typographySectionTitleMinRem",
  "typographySectionTitlePrefVw",
  "typographySectionTitleMaxRem",
  "typographySectionSubtitleRem"
];

function formatDefaultsBlock(cfg: SiteManualConfig): string {
  const lines: string[] = ["export const SITE_MANUAL_DEFAULTS: SiteManualConfig = {"];

  for (const key of KEY_ORDER) {
    const v = cfg[key];
    if (key === "toranamImagePaths") {
      const arr = v as string[];
      lines.push("  toranamImagePaths: [");
      for (const item of arr) {
        lines.push(`    ${JSON.stringify(item)},`);
      }
      lines.push("  ],");
      continue;
    }
    if (typeof v === "string") {
      lines.push(`  ${key}: ${JSON.stringify(v)},`);
    } else if (typeof v === "boolean") {
      lines.push(`  ${key}: ${v},`);
    } else if (typeof v === "number") {
      lines.push(`  ${key}: ${v},`);
    } else {
      throw new Error(`Unexpected type for ${String(key)}`);
    }
  }

  lines.push("};");
  return lines.join("\n");
}

/** Parse argv for `--file=C:\path\to.json` */
export function getExplicitFileArg(): string | null {
  const prefix = "--file=";
  const arg = process.argv.find((a) => a.startsWith(prefix));
  if (!arg) return null;
  return arg.slice(prefix.length).replace(/^['"]|['"]$/g, "");
}

/**
 * Resolved path to import JSON, or null.
 * Order: --file=…, project root file, ~/Downloads/file, ~/file
 */
export function findSiteManualJsonPath(projectRoot: string): string | null {
  const explicit = getExplicitFileArg();
  if (explicit && fs.existsSync(explicit)) return path.resolve(explicit);

  return findImportedJsonPath(projectRoot, SITE_MANUAL_IMPORT_FILENAME);
}

/** Writes merged site manual into siteManualSchema.ts. */
export function applySiteManualDataToSchema(projectRoot: string, raw: unknown): boolean {
  const schemaPath = path.join(projectRoot, "lib", "siteManualSchema.ts");
  const merged = mergeSiteManual(raw);
  const block = formatDefaultsBlock(merged);

  let ts = fs.readFileSync(schemaPath, "utf8");
  const re = /\/\/ <site-manual-defaults>\n[\s\S]*?\/\/ <\/site-manual-defaults>\n/;
  if (!re.test(ts)) {
    console.error("Markers // <site-manual-defaults> not found in siteManualSchema.ts");
    process.exit(1);
  }

  const nextTs = ts.replace(re, `// <site-manual-defaults>\n${block}\n// </site-manual-defaults>\n`);
  const changed = nextTs !== ts;
  if (changed) fs.writeFileSync(schemaPath, nextTs, "utf8");
  return changed;
}

export function applySiteManualJsonToSchema(projectRoot: string, jsonPath: string): boolean {
  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch (e) {
    console.error("Invalid JSON:", jsonPath, e);
    process.exit(1);
  }
  return applySiteManualDataToSchema(projectRoot, raw);
}
