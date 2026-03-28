/**
 * Pre-commit guard: blocks staging node_modules/.next/out and files > 50 MB.
 * Run via .githooks/pre-commit (set hooksPath once — see CONTRIBUTING-GIT.md).
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const MAX_BYTES = 50 * 1024 * 1024;
const FORBIDDEN =
  /^(node_modules\/|\.next\/|out\/|coverage\/|\.turbo\/|dist\/|\.cache\/|\.vercel\/)/;

let root;
try {
  root = execSync("git rev-parse --show-toplevel", { encoding: "utf-8" }).trim();
} catch {
  process.exit(0);
}

let raw;
try {
  raw = execSync("git diff --cached --name-only -z", {
    encoding: "utf-8",
    cwd: root
  });
} catch {
  process.exit(0);
}

const names = raw.split("\0").filter(Boolean);

for (const file of names) {
  const norm = file.replace(/\\/g, "/");
  if (FORBIDDEN.test(norm)) {
    console.error(
      "\n✖ Commit blocked: Node/build folders must not be committed.\n" +
        "  Path: " +
        file +
        "\n" +
        "  Use .gitignore and remove from index: git rm -r --cached <path>\n"
    );
    process.exit(1);
  }

  const abs = path.join(root, ...norm.split("/"));
  try {
    const st = fs.statSync(abs);
    if (st.isFile() && st.size > MAX_BYTES) {
      console.error(
        `\n✖ Commit blocked: "${file}" is ${Math.ceil(st.size / 1024 / 1024)} MB (max 50 MB).\n` +
          "  Use Git LFS, host the file elsewhere, or compress it.\n"
      );
      process.exit(1);
    }
  } catch {
    // deleted or not on disk — OK
  }
}

process.exit(0);
