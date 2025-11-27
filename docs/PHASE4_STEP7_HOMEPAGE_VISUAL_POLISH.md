# PHASE 4 – STEP 7 — Homepage Visual Polish + Dev Command Fix (Windows)

## Goal
- Make the TravelAcross EU homepage feel like the Glow-Up Phase is active (hero glow, booking widget placeholder, seasonal + blog highlights).
- Fix and document the Windows command issues so `NextDev` / `""` errors never return.
- Standardize how we start the frontend and backend on Windows CMD for every future step.

---

## A. Windows Dev Command Rules (VERY IMPORTANT)
These rules apply to **all** future steps in this project.

### 1. Things we must NEVER use
- ❌ No script or command called **`NextDev`**.
- ❌ No `npm run NextDev`.
- ❌ No commands shaped like `cmd /c "start "" cmd /k "cd /d ... ; npm run dev""`.
- ❌ No escaped quotes (`\"\"`) inside commands for CMD.
- ❌ No `;` as a command separator (that is Bash-only).
- ❌ No inline env vars such as `NODE_ENV=development next dev`.

### 2. Canonical dev commands (the only ones we use)
**Backend (Django)**
```cmd
cd /d C:\projects\travelacrosseu\backend
venv\Scripts\activate
python manage.py runserver
```

**Frontend (Next.js)**
```cmd
cd /d C:\projects\travelacrosseu\frontend
npm run dev
```
No `cmd /c`, no `start`, no wrappers. These exact commands must be shown in every future step that spins up the dev servers.

### 3. `package.json` scripts (frontend)
`C:\projects\travelacrosseu\frontend\package.json` must always contain:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```
Remove any `NextDev`/`nextdev` entries or inline env scripts the moment they appear.

---

## B. Known Error & Fix
### Error 1
**Message**
```
Windows cannot find 'NextDev'. Make sure you typed the name correctly, and then try again.
```
**Cause** – A shortcut or script tried to run a non-existent `NextDev` command (usually from incorrect AI suggestions).

**Fix**
1. Delete/ignore any `NextDev` references in docs, scripts, or shortcuts.
2. Confirm `package.json` only contains `"dev": "next dev"`.
3. Always start the frontend with:
   ```cmd
   cd /d C:\projects\travelacrosseu\frontend
   npm run dev
   ```

### Error 2
**Message**
```
Windows cannot find '"'. Make sure you typed the name correctly, and then try again.
```
**Cause** – Windows interprets escaped quotes and `;` literally (command copied from JSON-escaped text like `cmd /c "start "" cmd /k "cd /d ... ; npm run dev""`).

**Fix**
1. Do **not** use escaped quotes or `;` in CMD.
2. Replace any old shortcut with the simple version:
   ```cmd
   cd /d C:\projects\travelacrosseu\frontend
   npm run dev
   ```
3. If a Windows shortcut is ever unavoidable, it must use normal quotes and `&`:
   ```cmd
   cmd /c start "" cmd /k "cd /d C:\projects\travelacrosseu\frontend & npm run dev"
   ```
   (We still prefer the simple two-line version above.)

---

## C. Homepage Visual Polish (Glow-Up Phase)
Visual-only updates inside `frontend/app/HomePage.tsx`. No backend edits were required.

### 1. Hero section with glow + booking widget placeholder
- The hero now renders inside a dark gradient (`from-slate-900 via-slate-950 to-slate-900`) with a cyan glow blob for depth.
- Copy highlights *TravelAcrossEU • Hybrid Light/Dark* and the gradient text `smarter itineraries` headline.
- Primary/secondary CTAs are lightweight `<button>` elements so designers can restyle quickly.
- The right-side card is a **booking widget placeholder** that mirrors the upcoming affiliate iframe footprint. It includes mocked origin/destination, dates, traveler count, and a **Connect booking partner** CTA.
- Everything is server-rendered and uses Tailwind utility classes only.

Key excerpt:
```tsx
<section className="relative overflow-hidden bg-gradient-to-b ... text-slate-100">
  <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 ..." />
  <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 ...">
    {/* Hero copy */}
    {/* Booking widget placeholder */}
  </div>
</section>
```

### 2. Seasonal strip + blog shell (summary)
- The **Seasonal spotlight** strip directly under the hero keeps four cards (Winter, Sunny escapes, Romantic weekends, Slow travel & nature) linking to `/${locale}/destinations`.
- The **Featured destinations** grid still hydrates from the Django API (or fallback content) and highlights the multilingual pipeline.
- The **Blog shell** (`Inspiration from the blog`) shows three placeholder cards sourced from `frontend/lib/blogPosts.ts`, primed for CMS slugs later.

---

## D. Test Checklist for Step 7
1. **Start backend**
   ```cmd
   cd /d C:\projects\travelacrosseu\backend
   venv\Scripts\activate
   python manage.py runserver
   ```
2. **Start frontend**
   ```cmd
   cd /d C:\projects\travelacrosseu\frontend
   npm run dev
   ```
3. **Manual QA** (browser or curl)
   - Confirm no `NextDev` or `""` popups.
   - Hero shows glow, CTAs, and booking widget placeholder.
   - Seasonal strip appears below hero.
   - Blog shell renders three placeholder posts.
   - Language switcher works and layout stays stable across locales.

If all items pass: **PHASE 4 – STEP 7 = COMPLETE.**
