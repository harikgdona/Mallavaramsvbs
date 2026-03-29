/**
 * Client-only admin gate for the Configure section.
 *
 * This app uses static export (no server). A real database + server-side auth is not available here.
 * We persist a PBKDF2-SHA256 hash + salt in localStorage (password never stored in plain text).
 * Anyone with browser access can still bypass this in devtools — treat as a deterrent, not bank-grade security.
 *
 * PBKDF2 uses @noble/hashes (not crypto.subtle) so login works on plain HTTP / LAN where SubtleCrypto is unavailable.
 */

import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";

export const ADMIN_SESSION_KEY = "mallavaram-admin-session";

const CREDENTIALS_KEY = "mallavaram-admin-credentials";
const PBKDF2_ITERATIONS = 150_000;
const DEFAULT_ADMIN_USER = "admin";

/** First-time bootstrap password (change via future “change password” or by clearing storage + redeploy init). */
const BOOTSTRAP_PASSWORD = "Hari678#";

type StoredCred = {
  v: 1;
  saltB64: string;
  hashB64: string;
  iterations: number;
};

function bufToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function b64ToBuf(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveHash(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const enc = new TextEncoder().encode(password);
  const out = pbkdf2(sha256, enc, salt, { c: PBKDF2_ITERATIONS, dkLen: 32 });
  return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength);
}

function timingSafeEqualUa(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a[i] ^ b[i];
  return x === 0;
}

function readStored(): StoredCred | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CREDENTIALS_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as StoredCred;
    if (o?.v !== 1 || typeof o.saltB64 !== "string" || typeof o.hashB64 !== "string") return null;
    return o;
  } catch {
    return null;
  }
}

function writeStored(rec: StoredCred) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(rec));
}

/** Create default admin hash record if missing (runs in browser). */
export async function ensureAdminCredentialRecordAsync(): Promise<void> {
  if (typeof window === "undefined") return;
  if (readStored()) return;
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const hashBuf = await deriveHash(BOOTSTRAP_PASSWORD, salt);
  writeStored({
    v: 1,
    saltB64: bufToB64(salt.buffer),
    hashB64: bufToB64(hashBuf),
    iterations: PBKDF2_ITERATIONS
  });
}

export async function verifyAdminLogin(username: string, password: string): Promise<boolean> {
  if (username.trim().toLowerCase() !== DEFAULT_ADMIN_USER.toLowerCase()) return false;
  let stored = readStored();
  if (!stored) {
    await ensureAdminCredentialRecordAsync();
    stored = readStored();
  }
  if (!stored) return false;
  const salt = b64ToBuf(stored.saltB64);
  const expected = b64ToBuf(stored.hashB64);
  const derivedBuf = await deriveHash(password, salt);
  const derived = new Uint8Array(derivedBuf);
  return timingSafeEqualUa(derived, expected);
}

export function setAdminSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}
