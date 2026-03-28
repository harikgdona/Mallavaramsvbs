# Git & commit rules

## Do not commit

- **`node_modules/`** — install with `npm ci` / `npm install` locally
- **`.next/`**, **`out/`**, **`.turbo/`**, **`dist/`** — build outputs
- **`.env*.local`** — secrets (already in `.gitignore`)

These paths are listed in **`.gitignore`**.

## Max 50 MB per file

GitHub rejects very large files. This repo’s pre-commit hook blocks any **single staged file over 50 MB**.

## Enable the pre-commit hook (one-time per clone)

From the repo root:

```powershell
git config core.hooksPath .githooks
```

(On macOS/Linux you may run `chmod +x .githooks/pre-commit` once.)

After this, every `git commit` runs `scripts/verify-staged.mjs` to block bad paths and huge files.

## If something was committed by mistake

```powershell
git rm -r --cached node_modules
git rm -r --cached .next
git commit -m "Stop tracking build output"
```

Then add or fix `.gitignore` so it does not happen again.
