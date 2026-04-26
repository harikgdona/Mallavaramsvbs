/**
 * Clears oversized base64 image fields from Firestore using the REST API.
 * Run with: node scripts/clear-large-fields.mjs
 */

const API_KEY = "AIzaSyCx1URqykD4zlQT3k2m8wNYmrGJ3kL3ex4";
const PROJECT_ID = "mallavaramsvbs";
const DOC_PATH = "config/siteContent";

const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${DOC_PATH}`;

async function run() {
  console.log("Fetching current Firestore document...");

  // 1. GET current document
  const getRes = await fetch(`${BASE_URL}?key=${API_KEY}`);
  if (!getRes.ok) {
    const err = await getRes.text();
    console.error("Failed to fetch document:", err);
    process.exit(1);
  }

  const doc = await getRes.json();
  const fields = doc.fields || {};

  console.log("Current fields:", Object.keys(fields));

  // 2. Remove large image fields
  const fieldsToRemove = ["aboutImages", "activitiesPhotos", "annadanamPhotos", "templeHistoryImages"];
  let removed = [];

  for (const f of fieldsToRemove) {
    if (fields[f]) {
      delete fields[f];
      removed.push(f);
    }
  }

  if (removed.length === 0) {
    console.log("No large image fields found to remove.");
    process.exit(0);
  }

  console.log("Removing fields:", removed);

  // 3. PATCH document with remaining fields
  // Build updateMask to only touch the fields we're removing
  const updateMask = removed.map(f => `updateMask.fieldPaths=${encodeURIComponent(f)}`).join("&");
  const patchUrl = `${BASE_URL}?${updateMask}&key=${API_KEY}`;

  const patchRes = await fetch(patchUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: {} })  // empty = delete those fields
  });

  if (!patchRes.ok) {
    const err = await patchRes.text();
    console.error("Failed to patch document:", err);
    process.exit(1);
  }

  console.log("\n✓ Successfully cleared large image fields:", removed.join(", "));
  console.log("\nYou can now:");
  console.log("  1. Go to Configure section on the website");
  console.log("  2. Re-upload images for Activities and Annadanam photos");
  console.log("  3. Save Committee members");
}

run().catch(err => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
