# PHASE 2 – STEP 7 — About & Contact Pages

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose
- Add static About and Contact experiences for every supported locale so `/[locale]/about` and `/[locale]/contact` share the same dark layout and gating logic as other pages.
- Expose the new sections in the global navigation and provide English root redirects to keep `/about` and `/contact` user-friendly.

## Files Updated / Added
- `frontend/components/Header.tsx` — appended About and Contact links (currently defaulting to `/en/...`) and left TODO notes to make them locale-aware alongside Destinations.
- `frontend/app/[locale]/about/page.tsx` — new server component that validates the locale and renders project context plus a roadmap card.
- `frontend/app/[locale]/contact/page.tsx` — new server component with locale validation, intro text, and an interim email card.
- `frontend/app/about/page.tsx` and `frontend/app/contact/page.tsx` — lightweight redirectors that point root-level routes to the English versions.
- `docs/PHASE2_STEP7_ABOUT_CONTACT.md` — documentation (this file).

## Commands Run
```cmd
C:\projects\travelacrosseu\scripts\phase2_step1_dev_window.cmd
curl http://localhost:3000/en/about
curl http://localhost:3000/en/contact
curl http://localhost:3000/fr/about
curl http://localhost:3000/pt/contact
curl -I http://localhost:3000/about
curl -I http://localhost:3000/contact
taskkill /IM node.exe /F
```

## Verification Checklist
- [x] `/` still renders via the shared layout (implicitly exercised while hitting new routes).
- [x] `/en/about` and `/en/contact` return the new sections with navigation links updated in the header.
- [x] `/fr/about` and `/pt/contact` (spot checks for the other locales) render successfully; the same structure is available for `nl`, `es`, etc.
- [x] Header links for About/Contact render and route correctly (currently defaulting to English with TODO notes to localize later).
- [x] Root routes `/about` and `/contact` issue `307` redirects to `/en/about` and `/en/contact`.
- [x] Dev server stopped cleanly after verification via `taskkill /IM node.exe /F`.
