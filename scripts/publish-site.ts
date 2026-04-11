/**
 * After Configure → save sections → export bundle (npm run export-site-bundle or deploy-from-browser):
 * finds site-bundle-from-browser.json (project root or ~/Downloads), updates
 * lib/siteManualSchema.ts and lib/publicSiteContent.json, commits, pushes.
 *
 *   npm run publish-site
 *   npm run publish-site:local   — same as publish-site but --no-git (updates lib/ only)
 *
 * Legacy: site-manual-from-browser.json (flat) still updates layout only.
 * Optional: --file=C:\path\export.json (bundle or flat manual)
 * Optional: --no-git (or MALLAVARAM_PUBLISH_NO_GIT=1) — write lib files, do not commit/push
 */

import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeCommitteeMembers } from "../lib/committeeConfig";
import { normalizeGallerySlots } from "../lib/galleryConfig";
import {
  SITE_MANUAL_IMPORT_FILENAME,
  applySiteManualDataToSchema,
  applySiteManualJsonToSchema,
  findImportedJsonPath,
  getExplicitFileArg
} from "./site-manual-to-schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const BUNDLE_FILENAME = "site-bundle-from-browser.json";
const PUBLIC_CONTENT_REL = path.join("lib", "publicSiteContent.json");
const SCHEMA_REL = path.join("lib", "siteManualSchema.ts");

type Bundle = {
  siteManual?: unknown;
  textOverrides?: unknown;
  gallerySlots?: unknown;
  committeeMembers?: unknown;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** True if JSON is the multi-part export (not a flat site-manual-only file). */
function isBundleExport(v: unknown): boolean {
  if (!isRecord(v)) return false;
  return (
    "siteManual" in v ||
    "textOverrides" in v ||
    "gallerySlots" in v ||
    "committeeMembers" in v
  );
}

function writePublicSiteContentFromBundle(bundle: Bundle): boolean {
  const outPath = path.join(root, PUBLIC_CONTENT_REL);
  let existing: { textOverrides: Record<string, unknown>; gallerySlots: unknown; committeeMembers: unknown } = {
    textOverrides: {},
    gallerySlots: [],
    committeeMembers: []
  };
  if (fs.existsSync(outPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(outPath, "utf8")) as Record<string, unknown>;
      existing = {
        textOverrides: isRecord(parsed.textOverrides) ? parsed.textOverrides : {},
        gallerySlots: parsed.gallerySlots ?? [],
        committeeMembers: parsed.committeeMembers ?? []
      };
    } catch {
      // keep empty existing
    }
  }

  const textOverrides =
    bundle.textOverrides !== undefined && isRecord(bundle.textOverrides as object)
      ? (bundle.textOverrides as Record<string, unknown>)
      : existing.textOverrides;

  const gallerySlots =
    bundle.gallerySlots !== undefined
      ? normalizeGallerySlots(bundle.gallerySlots)
      : normalizeGallerySlots(existing.gallerySlots);

  const committeeMembers =
    bundle.committeeMembers !== undefined
      ? normalizeCommitteeMembers(bundle.committeeMembers)
      : normalizeCommitteeMembers(existing.committeeMembers);

  const next = { textOverrides, gallerySlots, committeeMembers };
  const text = `${JSON.stringify(next, null, 2)}\n`;
  const before = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : "";
  if (text === before) return false;
  fs.writeFileSync(outPath, text, "utf8");
  return true;
}

function processBundleObject(bundle: Bundle): { schemaChanged: boolean; contentChanged: boolean } {
  let schemaChanged = false;
  let contentChanged = false;
  if (bundle.siteManual !== undefined && bundle.siteManual !== null) {
    schemaChanged = applySiteManualDataToSchema(root, bundle.siteManual);
  }
  if (
    bundle.textOverrides !== undefined ||
    bundle.gallerySlots !== undefined ||
    bundle.committeeMembers !== undefined
  ) {
    contentChanged = writePublicSiteContentFromBundle(bundle);
  }
  return { schemaChanged, contentChanged };
}

function describeBundleForLog(bundle: Bundle): string {
  const nCm = normalizeCommitteeMembers(bundle.committeeMembers);
  const nGa = normalizeGallerySlots(bundle.gallerySlots);
  const to =
    bundle.textOverrides !== undefined && isRecord(bundle.textOverrides as object)
      ? Object.keys(bundle.textOverrides as Record<string, unknown>).length
      : 0;
  return `Exported bundle → committee: ${nCm.length} member(s), gallery: ${nGa.length} slot(s), text keys: ${to}, has siteManual: ${bundle.siteManual != null}`;
}

function describePublicContentOnDisk(): string {
  const outPath = path.join(root, PUBLIC_CONTENT_REL);
  if (!fs.existsSync(outPath)) return `Repo ${PUBLIC_CONTENT_REL}: (missing)`;
  try {
    const parsed = JSON.parse(fs.readFileSync(outPath, "utf8")) as Record<string, unknown>;
    const nCm = normalizeCommitteeMembers(parsed.committeeMembers);
    const nGa = normalizeGallerySlots(parsed.gallerySlots);
    const to = isRecord(parsed.textOverrides) ? Object.keys(parsed.textOverrides).length : 0;
    return `Repo ${PUBLIC_CONTENT_REL} → committee: ${nCm.length} member(s), gallery: ${nGa.length} slot(s), text keys: ${to}`;
  } catch {
    return `Repo ${PUBLIC_CONTENT_REL}: (invalid JSON)`;
  }
}

function runGit(args: string[]): boolean {
  try {
    execFileSync("git", args, { cwd: root, stdio: "inherit" });
    return true;
  } catch {
    return false;
  }
}

function publishVerbose(): boolean {
  return process.env.MALLAVARAM_PUBLISH_VERBOSE === "1" || /^true$/i.test(process.env.MALLAVARAM_PUBLISH_VERBOSE ?? "");
}

/** Apply bundle to lib/* only; skip git (for local `next dev` / `next build` using baked defaults). */
function publishNoGit(): boolean {
  return (
    process.argv.includes("--no-git") ||
    process.env.MALLAVARAM_PUBLISH_NO_GIT === "1" ||
    /^true$/i.test(process.env.MALLAVARAM_PUBLISH_NO_GIT ?? "")
  );
}

function logPublish(msg: string) {
  console.log(`[publish ${new Date().toISOString()}] ${msg}`);
}

function main() {
  let schemaChanged = false;
  let contentChanged = false;
  let bundleForDiagnostics: Bundle | null = null;
  let bundlePathUsed: string | null = null;
  const pv = publishVerbose();

  const explicit = getExplicitFileArg();
  if (explicit && fs.existsSync(explicit)) {
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(path.resolve(explicit), "utf8"));
    } catch (e) {
      console.error("Invalid JSON:", e);
      process.exit(1);
    }
    if (isBundleExport(raw)) {
      bundleForDiagnostics = raw as Bundle;
      bundlePathUsed = path.resolve(explicit);
      ({ schemaChanged, contentChanged } = processBundleObject(raw as Bundle));
    } else {
      schemaChanged = applySiteManualDataToSchema(root, raw);
    }
  } else {
    const bundlePath = findImportedJsonPath(root, BUNDLE_FILENAME);
    const manualOnlyPath = bundlePath ? null : findImportedJsonPath(root, SITE_MANUAL_IMPORT_FILENAME);

    if (bundlePath) {
      let bundle: Bundle;
      try {
        bundle = JSON.parse(fs.readFileSync(bundlePath, "utf8")) as Bundle;
      } catch (e) {
        console.error("Invalid bundle JSON:", e);
        process.exit(1);
      }
      bundleForDiagnostics = bundle;
      bundlePathUsed = bundlePath;
      if (pv) {
        try {
          const st = fs.statSync(bundlePath);
          logPublish(`bundle file: ${bundlePath} (${st.size} bytes)`);
        } catch {
          logPublish(`bundle file: ${bundlePath}`);
        }
        logPublish(describeBundleForLog(bundle));
      }
      ({ schemaChanged, contentChanged } = processBundleObject(bundle));
      if (pv) {
        logPublish(`apply result: schemaChanged=${schemaChanged} contentChanged=${contentChanged}`);
      }
    } else if (manualOnlyPath) {
      schemaChanged = applySiteManualJsonToSchema(root, manualOnlyPath);
    } else {
      console.error(`Could not find ${BUNDLE_FILENAME} or ${SITE_MANUAL_IMPORT_FILENAME}`);
      console.error("Configure (admin): save your sections, then click \"Download for public site\".");
      console.error("Then run: npm run publish-site");
      process.exit(1);
    }
  }

  if (!schemaChanged && !contentChanged) {
    console.log("No file changes — already up to date with this export.");
    if (bundleForDiagnostics) {
      console.log("");
      console.log(bundlePathUsed ? `Bundle file: ${bundlePathUsed}` : "(bundle from --file)");
      console.log(describeBundleForLog(bundleForDiagnostics));
      console.log(describePublicContentOnDisk());
      console.log("");
      console.log(
        "If you edited Committee/Gallery/text on the site but still see this: (1) Click the section Save button — e.g. \"Save Committee (text & members)\" — so localStorage updates, then re-run export. (2) Use the same hostname in the browser and in MALLAVARAM_SITE_URL (www vs non-www are different storage)."
      );
    }
    process.exit(0);
  }

  if (publishNoGit()) {
    console.log("\nApplied bundle to repo files (no git commit/push).");
    console.log("Next: restart `npm run dev` if running, or run `npm run build` — baked content is in lib/.");
    process.exit(0);
  }

  const stage: string[] = [];
  if (schemaChanged) stage.push(SCHEMA_REL);
  if (contentChanged) stage.push(PUBLIC_CONTENT_REL);
  runGit(["add", ...stage]);

  const committed = runGit(["commit", "-m", "chore: deploy Configure content to public site"]);
  if (!committed) {
    console.error("git commit failed. Try: git status");
    process.exit(1);
  }

  if (!runGit(["push"])) {
    console.error("\nPush failed. Try: git pull --rebase origin main  then  git push");
    process.exit(1);
  }

  console.log("\nDone. GitHub Actions will deploy public defaults for layout, text, gallery, and committee.");
}

main();
