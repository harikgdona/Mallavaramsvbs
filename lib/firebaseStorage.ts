/**
 * Firebase Storage upload utility.
 * Uploads a file and returns its public download URL.
 */

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

/**
 * Uploads a file to Firebase Storage under /site-images/{folder}/{filename}
 * Returns the public download URL.
 */
export async function uploadImageToStorage(
  file: File,
  folder: string
): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    // Create a unique filename using timestamp + original name
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `site-images/${folder}/${filename}`;

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { ok: true, url };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Storage upload failed:", msg);
    return { ok: false, error: msg };
  }
}
