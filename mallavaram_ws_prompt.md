# Mallavaram Website — Project Context

## What this is
A bilingual (English/Telugu) charitable trust website for **Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu** — a trust supporting poor Brahmin families in Mallavaram village, Prakasam District, Andhra Pradesh, India.

**Live URL:** https://mallavaramsvbs.org
**Repo:** https://github.com/harikgdona/Mallavaramsvbs

## Tech Stack
- **Framework:** Next.js 16 with React 18, static export (`output: "export"`)
- **Styling:** Tailwind CSS 3.4 with custom colors (maroon, gold, sandal, saffron, beige)
- **Fonts:** Google Fonts (Inter, Playfair Display, Great Vibes, Noto Sans Telugu)
- **Hosting:** GitHub Pages with custom domain `mallavaramsvbs.org`
- **Database:** Firebase Firestore (Spark/free plan) — stores gallery, committee, text overrides, site config
- **Auth:** Firebase Auth with Google sign-in — only whitelisted admin emails can access Configure panel
- **Security:** Firebase App Check (reCAPTCHA v3), CSP headers, Firestore rate limiting, GitHub branch protection

## Architecture
- **Static site on GitHub Pages** — code changes deploy via GitHub Actions on push to `main`
- **Firestore as live data backend** — content changes (gallery, committee, text) are read from Firestore at runtime by the client
- **Admin panel** — the Configure section (last nav item) lets admins edit content via Google sign-in → changes write to Firestore → live instantly, no deploy needed
- **Tab-based navigation** — sections show as overlays (not scrolling), managed by `components/SectionTabs.tsx`

## Key Files
| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with providers (Language, Config, Auth, SectionTabs) |
| `app/page.tsx` | Tab-based page — renders one section at a time |
| `components/SectionTabs.tsx` | Context for active section state |
| `components/ConfigProvider.tsx` | Reads/writes config from Firestore + localStorage fallback |
| `components/AdminAuthProvider.tsx` | Firebase Google Auth, admin email whitelist |
| `lib/firebase.ts` | Firebase init (Firestore, Auth, App Check) |
| `lib/firestoreConfig.ts` | Firestore read/write helpers for `config/siteContent` |
| `i18n/config.ts` | Translation keys (EN/TE) for UI strings |
| `sections/*.tsx` | Each page section (Hero, About, Annadanam, etc.) |
| `components/Header.tsx` | Desktop sidebar nav + mobile hamburger menu |
| `components/TopHeader.tsx` | Ornate gold banner with logo, lamps, toranams |
| `firestore.rules` | Firestore security rules |
| `lib/publicSiteContent.json` | Baked fallback data (gallery, committee) when Firestore is unavailable |

## Sections (nav order)
Home, About, Temple History, Directions, Annadanam, Activities, Donate, Gallery, Committee, Contact, Configure (admin only)

## Firebase Project
- **Project ID:** `mallavaramsvbs`
- **Firestore document:** `config/siteContent` — contains `textOverrides`, `gallerySlots`, `committeeMembers`, `siteManual`, `aboutImages`
- **Auth:** Google sign-in, admin emails: `harikgdona@gmail.com`, `koteswaragali@gmail.com`
- **App Check:** reCAPTCHA v3, site key: `6LeRyr0sAAAAAPN6BMzjROQdlaXVvyKo38FRVzhS`

## Content Management Flow
1. Admin opens site → Configure → Sign in with Google
2. Edit gallery/committee/text/images → Click Save
3. Data writes to Firestore → live for all visitors instantly
4. No git push needed for content changes

## Code Change Flow
1. Edit code locally → `npm run dev` to test on `localhost:3000`
2. `git add -A && git commit -m "message" && git push`
3. GitHub Actions builds and deploys to GitHub Pages (~2 min)

## Important Notes
- **Never commit `.env.local`** — contains Firebase debug tokens
- **Images live in `public/images/uploads/`** — referenced as `/images/uploads/filename.jpg`
- **Telugu translations** — most sections have inline `language === "te" ? teluguText : englishText` patterns
- **Committee members** are hardcoded in `sections/CommitteeSection.tsx` (Honorary + Working groups) with photo support via `src` field
- **UPI QR code** is at `public/images/upi-scanner.jpg`, UPI ID: `9440887264@sbi`
- **WhatsApp number:** `919885117126`
- The site uses `suppressHydrationWarning` on elements with localStorage-driven styles to avoid React hydration mismatches

## Local Development
```powershell
npm install
npm run dev
# Open http://localhost:3000
# For Firebase to work locally, add App Check debug token to .env.local:
# NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN=your-token-here
```
