/**
 * Writes browser localStorage layout config into lib/siteManualSchema.ts as SITE_MANUAL_DEFAULTS.
 *
 * 1. DevTools → Application → Local Storage → mallavaram-site-manual-config → copy value
 * 2. Save as site-manual-from-browser.json in project root (raw JSON object)
 * 3. npm run apply-site-manual
 * 4. Review git diff, commit lib/siteManualSchema.ts (not the json file — it is gitignored)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { mergeSiteManual, type SiteManualConfig } from "../lib/siteManualSchema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const importPath = path.join(root, "site-manual-from-browser.json");
const schemaPath = path.join(root, "lib", "siteManualSchema.ts");

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
      throw new Error(`Unexpected type for ${key}`);
    }
  }

  lines.push("};");
  return lines.join("\n");
}

function main() {
  if (!fs.existsSync(importPath)) {
    console.error(`Missing ${path.relative(root, importPath)}`);
    console.error(
      "Copy the value of localStorage key \"mallavaram-site-manual-config\" from your browser (DevTools → Application) into that file as JSON, then run again."
    );
    process.exit(1);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(importPath, "utf8"));
  } catch (e) {
    console.error("Invalid JSON in site-manual-from-browser.json:", e);
    process.exit(1);
  }

  const merged = mergeSiteManual(raw);
  const block = formatDefaultsBlock(merged);

  let ts = fs.readFileSync(schemaPath, "utf8");
  const re = /\/\/ <site-manual-defaults>\n[\s\S]*?\/\/ <\/site-manual-defaults>\n/;
  if (!re.test(ts)) {
    console.error("Could not find // <site-manual-defaults> … // </site-manual-defaults> in siteManualSchema.ts");
    process.exit(1);
  }

  ts = ts.replace(re, `// <site-manual-defaults>\n${block}\n// </site-manual-defaults>\n`);
  fs.writeFileSync(schemaPath, ts, "utf8");
  console.log("Updated lib/siteManualSchema.ts → SITE_MANUAL_DEFAULTS");
  console.log("Next: git diff lib/siteManualSchema.ts  then commit (do not commit site-manual-from-browser.json).");
}

main();
