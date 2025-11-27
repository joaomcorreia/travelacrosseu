# PHASE 4 – STEP 2 — Homepage Glow-Up + Shared Layout

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose
- Deliver the hybrid aesthetic (light hero, dark mid-sections, lighter footer) for every locale-specific homepage.
- Centralize navigation and footer content so future modules (flights, hotels, experiences, language switcher) have a consistent frame.
- Keep all locale routes sharing the same header/footer while preserving existing API-driven destination data.

## Files Updated / Created
- `frontend/app/layout.tsx`
- `frontend/app/[locale]/layout.tsx`
- `frontend/app/page.tsx`
- `frontend/app/HomePage.tsx`
- `frontend/app/globals.css`
- `frontend/components/Header.tsx`
- `frontend/components/Footer.tsx`
- `docs/PHASE4_STEP2_HOMEPAGE_GLOWUP.md`

## Design Decisions
- **Color palette:** Light gradient hero (`from-slate-50 via-white to-slate-100`), deep slate backgrounds (`bg-slate-950` / `bg-slate-900`) for featured sections, and a soft slate footer for readability.
- **Layout system:** Shared `Header` + `Footer` wired through `app/[locale]/layout.tsx`, consistent `max-w-6xl` containers, rounded cards (`rounded-2xl`/`rounded-3xl`), and spacing tokens (`py-16`, `py-20`, `px-4`, `md:px-8`, `lg:px-12`).
- **CTA choices:** Primary hero CTA “Browse destinations” and secondary “Inspire me” keep flow simple until randomizer logic ships. Header includes a placeholder language pill (`EN v`) for the upcoming switcher.

## Commands Run
1. `cd /d C:\projects\travelacrosseu\frontend && npm run dev`
2. `cmd /c "C:\Windows\System32\taskkill.exe /IM node.exe /F"`

## Verification Checklist
- [x] `/en` shows the new light hero, dark featured destinations, themes grid, and how-it-works steps.
- [x] `/fr`, `/nl`, `/es`, `/pt` render with the shared header/footer layout.
- [x] Header and footer components appear on every locale page automatically.
- [x] The header displays a visible placeholder control reserved for the future language switcher.
- [x] No Next.js runtime or TypeScript errors occurred while browsing the homepage during `npm run dev`.
