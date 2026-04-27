/**
 * Uploads Brahmotsavam images to Firebase Storage and saves URLs to Firestore.
 * Requires firebase-key.json (service account) in the project root.
 * Run with: node scripts/upload-brahmotsavam.mjs
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, extname } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Load service account
const keyPath = "firebase-key.json";
if (!existsSync(keyPath)) {
  console.error("❌ firebase-key.json not found in project root.");
  console.error("   Download it from Firebase Console → Project Settings → Service Accounts → Generate new private key");
  process.exit(1);
}

const serviceAccount = require("../" + keyPath);

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "mallavaramsvbs.firebasestorage.app",
});

const storage = getStorage();
const db = getFirestore();
const bucket = storage.bucket();

const IMAGE_DIR = "public/images/Brahmotsavam";
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

async function run() {
  // Get image files only (skip videos)
  const files = readdirSync(IMAGE_DIR)
    .filter(f => IMAGE_EXTS.includes(extname(f).toLowerCase()))
    .sort();

  console.log(`Found ${files.length} images in ${IMAGE_DIR}\n`);

  const photos = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filepath = join(IMAGE_DIR, filename);
    const cleanName = `brahmotsavam-26-${String(i + 1).padStart(2, "0")}.jpeg`;
    const storagePath = `site-images/brahmotsavam-26/${cleanName}`;

    process.stdout.write(`[${i + 1}/${files.length}] ${filename} → ${cleanName}... `);

    try {
      const ext = extname(filename).toLowerCase();
      const contentType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

      await bucket.upload(filepath, {
        destination: storagePath,
        metadata: { contentType },
        public: true,
      });

      const url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
      photos.push({ src: url, descriptionEn: "", descriptionTe: "" });
      console.log("✓");
    } catch (e) {
      console.log(`✗ ${e.message}`);
    }
  }

  console.log(`\nUploaded ${photos.length}/${files.length} photos.`);
  console.log("Saving to Firestore...");

  await db.doc("config/siteContent").set({
    brahmostavam26Photos: photos,
    updatedAt: new Date().toISOString(),
    updatedBy: "upload-script",
  }, { merge: true });

  console.log(`✓ Saved ${photos.length} photo URLs to Firestore!`);
  console.log("\nDone! Refresh the website to see the Brahmostavam-26 photos.");
  process.exit(0);
}

run().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
