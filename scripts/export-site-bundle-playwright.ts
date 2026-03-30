/**
 * Writes site-bundle-from-browser.json from the live Configure page's localStorage.
 *
 * Loads env from `.env` then `.env.local` in the project root (same as Next.js; `.env.local` is gitignored).
 *
 *   MALLAVARAM_SITE_URL          optional, default https://mallavaramsvbs.org/#configure
 *   MALLAVARAM_ADMIN_USER         optional; with password, signs in automatically
 *   MALLAVARAM_ADMIN_PASSWORD    optional (use double quotes in .env if password contains # or spaces)
 *   MALLAVARAM_ADMIN_PASSWORD_FILE  optional; path to a one-line password file (recommended for # in password)
 *   MALLAVARAM_EXPORT_HEADED      optional; set to 1 to show the browser even when creds are set (debug)
 *   MALLAVARAM_EXPORT_VERBOSE     optional; set to 1 for extra diagnostics (storage sizes, page URL)
 *
 * When both user and password are set: runs headless by default (fully automated).
 * If either is missing: opens a visible browser — complete sign-in manually (waits up to 10 min).
 *
 * First-time setup: npx playwright install chromium
 */

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const OUT = path.join(root, "site-bundle-from-browser.json");

dotenv.config({ path: path.join(root, ".env") });
dotenv.config({ path: path.join(root, ".env.local"), override: true });

/** Must match lib/adminAuth.ts ADMIN_SESSION_KEY + setAdminSession(). */
const ADMIN_SESSION_STORAGE_KEY = "mallavaram-admin-session";

const SITE_MANUAL_KEY = "mallavaram-site-manual-config";
const TEXT_KEY = "mallavaram-text-config";
const GALLERY_KEY = "mallavaram-gallery-photos";
const COMMITTEE_KEY = "mallavaram-committee-config";

type Bundle = {
  siteManual: unknown;
  textOverrides: Record<string, unknown>;
  gallerySlots: unknown;
  committeeMembers: unknown;
};

function parseBundleFromRaw(raw: Record<string, string | null>): Bundle {
  let siteManual: unknown = null;
  const mr = raw[SITE_MANUAL_KEY];
  if (mr) {
    try {
      siteManual = JSON.parse(mr);
    } catch {
      siteManual = null;
    }
  }

  let textOverrides: Record<string, unknown> = {};
  const tr = raw[TEXT_KEY];
  if (tr) {
    try {
      const p = JSON.parse(tr) as unknown;
      if (p && typeof p === "object" && !Array.isArray(p)) textOverrides = p as Record<string, unknown>;
    } catch {
      /* ignore */
    }
  }

  let gallerySlots: unknown = [];
  const gr = raw[GALLERY_KEY];
  if (gr) {
    try {
      gallerySlots = JSON.parse(gr);
    } catch {
      gallerySlots = [];
    }
  }

  let committeeMembers: unknown = [];
  const cr = raw[COMMITTEE_KEY];
  if (cr) {
    try {
      committeeMembers = JSON.parse(cr);
    } catch {
      committeeMembers = [];
    }
  }

  return { siteManual, textOverrides, gallerySlots, committeeMembers };
}

type StoragePullResult =
  | { ok: true; raw: Record<string, string | null>; href: string }
  | { ok: false; error: string; href: string };

/** Minimal in-page work: only string values cross the bridge (no big nested objects). */
function pullLocalStorageKeys(keys: string[]): StoragePullResult {
  const href = (() => {
    try {
      return globalThis.location?.href ?? "";
    } catch {
      return "";
    }
  })();

  const raw: Record<string, string | null> = {};
  try {
    const ls = globalThis.localStorage;
    if (!ls) {
      return { ok: false, error: "localStorage is missing on globalThis", href };
    }
    for (const k of keys) {
      try {
        raw[k] = ls.getItem(k);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return { ok: false, error: `localStorage.getItem(${JSON.stringify(k)}) failed: ${msg}`, href };
      }
    }
    return { ok: true, raw, href };
  } catch (e) {
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    return { ok: false, error: msg, href };
  }
}

function truthyEnv(v: string | undefined): boolean {
  if (!v) return false;
  return v === "1" || /^true$/i.test(v);
}

function loadPasswordFromFile(): string {
  const file = process.env.MALLAVARAM_ADMIN_PASSWORD_FILE?.trim();
  if (!file) return "";
  const abs = path.isAbsolute(file) ? file : path.join(root, file);
  if (!fs.existsSync(abs)) {
    throw new Error(`MALLAVARAM_ADMIN_PASSWORD_FILE not found: ${abs}`);
  }
  return fs.readFileSync(abs, "utf8").replace(/\r?\n$/, "");
}

function resolvePassword(): string {
  const fromFile = loadPasswordFromFile();
  if (fromFile !== "") return fromFile;
  return process.env.MALLAVARAM_ADMIN_PASSWORD ?? "";
}

function resolveSiteUrl(): { url: string; didNormalize: boolean } {
  const fallback = "https://mallavaramsvbs.org/#configure";
  let raw = process.env.MALLAVARAM_SITE_URL?.trim();
  if (!raw) return { url: fallback, didNormalize: false };
  if (!raw.includes("#")) {
    return { url: `${raw.replace(/\/$/, "")}#configure`, didNormalize: true };
  }
  return { url: raw, didNormalize: false };
}

function logStep(msg: string) {
  console.log(`[export ${new Date().toISOString()}] ${msg}`);
}

async function main() {
  const verbose = truthyEnv(process.env.MALLAVARAM_EXPORT_VERBOSE);
  const { url: siteUrl, didNormalize } = resolveSiteUrl();
  if (didNormalize) {
    console.log(
      `[export] MALLAVARAM_SITE_URL had no #hash — appended #configure (Configure is a page section). Final: ${siteUrl}`
    );
  }
  const user = process.env.MALLAVARAM_ADMIN_USER?.trim() ?? "";
  const pass = resolvePassword();
  const hasCreds = Boolean(user && pass);
  const headless = hasCreds && !truthyEnv(process.env.MALLAVARAM_EXPORT_HEADED);

  logStep(`URL=${siteUrl}`);
  logStep(`admin user=${user || "(none)"} headless=${headless} verbose=${verbose}`);

  if (hasCreds && headless) {
    console.log("Export: headless (credentials from environment / .env.local).");
  }

  let browser;
  try {
    browser = await chromium.launch({
      headless,
      args: headless ? ["--disable-dev-shm-usage"] : undefined
    });
  } catch (e) {
    console.error(e);
    console.error("\nIf browsers are missing, run: npx playwright install chromium\n");
    process.exit(1);
  }

  const page = await browser.newPage();
  page.on("pageerror", (err) => console.error("[page]", err.message));

  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto(siteUrl, { waitUntil: "load", timeout: 120_000 });
  logStep(`after goto page.url=${page.url()}`);

  const configureRoot = page.locator("#configure").first();
  await configureRoot.waitFor({ state: "attached", timeout: 90_000 });
  await configureRoot.scrollIntoViewIfNeeded().catch(() => undefined);
  await page.waitForTimeout(500);

  await page.waitForFunction(
    (key: string) =>
      sessionStorage.getItem(key) === "1" ||
      [...document.querySelectorAll("h2")].some((h) =>
        (h.textContent || "").toLowerCase().includes("configure")
      ),
    ADMIN_SESSION_STORAGE_KEY,
    { timeout: 90_000 }
  );

  const signInHeading = page.getByRole("heading", { name: /Configure — sign in/i });
  const needsLogin = await signInHeading.isVisible().catch(() => false);

  if (needsLogin) {
    if (user && pass) {
      const userBox = page.getByLabel("Username");
      const passBox = page.getByLabel("Password");
      const submitBtn = page.getByRole("button", { name: "Sign in" });
      await configureRoot.scrollIntoViewIfNeeded().catch(() => undefined);
      await submitBtn.waitFor({ state: "visible", timeout: 30_000 });
      await userBox.click();
      await userBox.fill("");
      await userBox.fill(user);
      await passBox.click();
      await passBox.fill("");
      await passBox.fill(pass);
      await submitBtn.click();

      const loginTimeoutMs = 120_000;
      try {
        await page.waitForFunction(
          (key: string) => sessionStorage.getItem(key) === "1",
          ADMIN_SESSION_STORAGE_KEY,
          { timeout: loginTimeoutMs }
        );
        await page.getByRole("heading", { name: "Configure", exact: true }).waitFor({
          state: "visible",
          timeout: 30_000
        });
      } catch {
        const debugPath = path.join(root, "export-login-debug.png");
        await page.screenshot({ path: debugPath, fullPage: true }).catch(() => undefined);
        const stillSignIn = await signInHeading.isVisible().catch(() => false);
        const invalid = await page
          .getByText("Invalid username or password", { exact: true })
          .isVisible()
          .catch(() => false);
        const genericErr = await page
          .locator("form .text-red-700")
          .first()
          .textContent()
          .catch(() => null);
        const hints: string[] = [];
        if (fs.existsSync(debugPath)) {
          hints.push(`Screenshot: ${debugPath}`);
        }
        if (genericErr?.trim()) {
          hints.push(`Form message: ${genericErr.trim()}`);
        }
        hints.push(
          "If the password contains # or =, wrap it in double quotes in .env.local, or use MALLAVARAM_ADMIN_PASSWORD_FILE."
        );
        const hintBlock = hints.length ? `\n${hints.join("\n")}` : "";
        throw new Error(
          invalid
            ? `Login failed: invalid username or password.${hintBlock}`
            : stillSignIn
              ? `Still on sign-in — wrong password (see .env / password file), wrong site URL, or page error.${hintBlock}`
              : `Login timed out after ${loginTimeoutMs / 1000}s (PBKDF2 verify can be slow in CI).${hintBlock}`
        );
      }
    } else {
      console.log(
        "Sign in in the opened browser window. Waiting until Configure is shown (up to 10 minutes)…"
      );
      await page.getByRole("heading", { name: "Configure", exact: true }).waitFor({
        state: "visible",
        timeout: 600_000
      });
    }
  }

  await configureRoot.scrollIntoViewIfNeeded().catch(() => undefined);

  const storageKeys = [SITE_MANUAL_KEY, TEXT_KEY, GALLERY_KEY, COMMITTEE_KEY];
  const pulled = await page.evaluate(pullLocalStorageKeys, storageKeys);
  if (!pulled.ok) {
    const debugPath = path.join(root, "export-login-debug.png");
    await page.screenshot({ path: debugPath, fullPage: true }).catch(() => undefined);
    throw new Error(
      `Export failed while reading browser storage.\nURL: ${pulled.href}\n${pulled.error}\nScreenshot: ${debugPath}`
    );
  }

  const bundle = parseBundleFromRaw(pulled.raw);
  const raw = pulled.raw;
  const cm = Array.isArray(bundle.committeeMembers) ? bundle.committeeMembers : [];
  const cmBytes = raw[COMMITTEE_KEY] ? raw[COMMITTEE_KEY]!.length : 0;
  logStep(
    `localStorage raw chars: siteManual=${raw[SITE_MANUAL_KEY]?.length ?? 0} text=${raw[TEXT_KEY]?.length ?? 0} gallery=${raw[GALLERY_KEY]?.length ?? 0} committee=${cmBytes}`
  );
  logStep(`parsed committee members=${cm.length}`);
  if (cm.length > 0) {
    const sample = cm[0] as Record<string, unknown>;
    const srcLen = typeof sample?.src === "string" ? String(sample.src).length : 0;
    const extra =
      srcLen > 50_000 ? " — WARNING: huge embedded image; browser Save may hit localStorage quota (use file path/URL)." : "";
    if (verbose || srcLen > 50_000) {
      logStep(`committee[0] nameEn=${String(sample?.nameEn ?? "")} src length=${srcLen} chars${extra}`);
    }
  }

  let outJson: string;
  try {
    outJson = `${JSON.stringify(bundle, null, 2)}\n`;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Could not serialize bundle to JSON: ${msg}`);
  }
  fs.writeFileSync(OUT, outJson, "utf8");
  const outBytes = Buffer.byteLength(outJson, "utf8");
  logStep(`Wrote ${OUT} (${outBytes} bytes)`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
