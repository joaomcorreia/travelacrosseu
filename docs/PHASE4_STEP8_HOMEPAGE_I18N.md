# PHASE 4 – STEP 8 — Homepage i18n Hardening (Prod-ready)

## Goal
- Make every piece of homepage UI copy dictionary-driven so we can ship production locales safely.
- Load strings with `getDictionary(locale)` and pass them down to the `HomePage` server component.
- Leave zero hard-coded English (or French) strings inside the React tree so translators can edit JSON only.

---

## A. Dictionary + Loader Updates
1. Added `frontend/locales/{en,fr,nl,es,pt}/common.json` with a shared `home` section that covers:
   - hero badge, titles, CTAs, footnote, and booking widget labels/values
   - seasonal strip metadata + cards, featured destinations copy, theme tiles
   - blog shell headings/cards, and how-it-works steps
2. Created `frontend/lib/i18n/getDictionary.ts`:
   - Uses `import "server-only"` and lazy-loads each locale JSON.
   - Exports `CommonDictionary` plus `getDictionary(locale)` with automatic fallback to English.

## B. Homepage Wiring
1. `app/[locale]/page.tsx`
   - Guards locale via `isSupportedLocale`, fetches `getDictionary(locale)`, and passes `dictionary.home` to the shared `HomePage` component.
2. `app/HomePage.tsx`
   - Accepts the new `messages` prop (`CommonDictionary["home"]`).
   - Replaced hero, booking widget, seasonal strip, featured grid, theme cards, blog shell, and how-it-works copy with dictionary lookups.
   - Removed local string arrays so future locales only require JSON edits.

## C. Windows CMD Commands
### Backend (Django)
```cmd
cd /d C:\projects\travelacrosseu\backend
venv\Scripts\activate
python manage.py runserver
```

### Frontend (Next.js)
```cmd
cd /d C:\projects\travelacrosseu\frontend
npm run dev
```

### OPTIONAL — Lint
```cmd
cd /d C:\projects\travelacrosseu\frontend
npm run lint
```

## D. What to Test
- Visit `/en`, `/fr`, `/nl`, `/es`, `/pt` and confirm the homepage renders without runtime errors.
- Toggle locales via the smart switcher; ensure every text block (hero, booking card, seasonal strip, featured grid, themes, blog shell, how-it-works) updates from JSON.
- Temporarily change a value such as `home.badge` inside `frontend/locales/fr/common.json`, reload `/fr`, and verify the new copy appears.
- Check browser console/server logs for missing dictionary keys.
- (Optional) Run `npm run lint` after the dev server starts to confirm type-safety and JSON imports remain healthy.
