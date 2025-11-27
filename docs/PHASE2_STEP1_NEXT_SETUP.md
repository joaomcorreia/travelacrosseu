# PHASE 2 – STEP 1 — Next.js Frontend Scaffold

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

**Project:** TravelAcross EU  
**Status:** ✅ Completed

---

## Purpose

- Stand up the foundational Next.js (App Router) frontend in `/frontend` so we can iterate on the public experience alongside the Django API.
- Enable Tailwind CSS + TypeScript out of the box for rapid UI work.
- Replace the default starter template with a TravelAcross-branded landing page placeholder.

---

## Environment

- OS: Windows 10 (CMD-only workflow)
- Node tooling: `npx create-next-app@latest` (Next.js 16.0.3, React 19.2.0)
- Package manager: npm (auto-selected)
- Frontend path: `C:\projects\travelacrosseu\frontend`

Helper scripts created:
- `scripts\phase2_step1_dev.cmd` — runs `npm run dev` inside `/frontend`.
- `scripts\phase2_step1_dev_window.cmd` — opens a new CMD window with the dev server so other commands can run simultaneously.

---

## Commands Executed

(All commands issued from CMD with explicit paths.)

```cmd
mkdir C:\projects\travelacrosseu\frontend

cd /d C:\projects\travelacrosseu
npx create-next-app@latest C:\projects\travelacrosseu\frontend --typescript --eslint --tailwind --use-npm

C:\projects\travelacrosseu\scripts\phase2_step1_dev.cmd   (initial run)
C:\projects\travelacrosseu\scripts\phase2_step1_dev_window.cmd   (background dev server)

curl http://localhost:3000

taskkill /IM node.exe /F
```

> `curl` confirmed the custom homepage HTML, and `taskkill` shut down all Node dev-server instances afterwards.

---

## Custom Homepage (`frontend/app/page.tsx`)

The default starter view was replaced with a simple hero + section layout using Tailwind classes:

- **Hero:** “TravelAcross EU” title, tagline “Explore Europe with AI-powered travel guides,” and badges noting supported languages + API status.
- **Sections:** “Destinations” and “Why TravelAcross?” cards describing upcoming data/features.
- **Coming soon:** dashed card teasing future integrations.

This serves as a branded placeholder while the rest of PHASE 2 connects to the backend.

---

## Verification Checklist

- [x] `/frontend` contains a fresh Next.js 16 + Tailwind project managed by npm.
- [x] `npm run dev` (via helper scripts) serves http://localhost:3000 without errors.
- [x] Visiting `http://localhost:3000` shows the TravelAcross EU hero/sections instead of the default Next.js boilerplate.
- [x] Dev server shuts down cleanly via `taskkill /IM node.exe /F` when testing is done.

---

## Notes

- `next.config.ts` keeps the default stable options (no experimental Turbopack flags were added manually).
- The `app/` directory structure is ready for future multilingual routing layers.
- Tailwind CSS v4 (preview) ships with Create Next App; no manual configuration changes were necessary beyond the generated files.
- Locale-specific paths such as `/en` currently fall through to Next.js' default 404 page; this is expected until the multilingual routes are implemented in a later phase.
