/**
 * Merges site-manual-from-browser.json into lib/siteManualSchema.ts (SITE_MANUAL_DEFAULTS).
 *
 * Finds JSON in order: --file=path, ./site-manual-from-browser.json, ~/Downloads/…, ~/
 *
 *   npm run apply-site-manual
 */

import path from "path";
import { fileURLToPath } from "url";
import {
  SITE_MANUAL_IMPORT_FILENAME,
  findSiteManualJsonPath,
  applySiteManualJsonToSchema
} from "./site-manual-to-schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const jsonPath = findSiteManualJsonPath(root);
if (!jsonPath) {
  console.error(`Could not find ${SITE_MANUAL_IMPORT_FILENAME}`);
  console.error("Use Configure → Download for deployment, then run this again (file can stay in Downloads).");
  process.exit(1);
}

applySiteManualJsonToSchema(root, jsonPath);
console.log(`Updated lib/siteManualSchema.ts from:\n  ${jsonPath}`);
