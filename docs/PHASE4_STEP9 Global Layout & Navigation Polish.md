# PHASE 4 – STEP 9 — Global Layout & Navigation Polish

## Goal
- Drive the shared header, navigation, and footer from locale dictionaries so every locale sees the same shell.
- Keep the shell consistent with the dark gradient aesthetic while integrating the existing LanguageSwitcher.
- Remove hard-coded English strings from the layout so future nav/footer tweaks only touch `common.json`.

## Prerequisites
- Phase 4 Step 7 (homepage visuals) and Step 8 (homepage i18n) completed.
- Locale routing already wired at `/app/[locale]/` and dictionaries living under `frontend/locales/<lang>/common.json`.
- Existing Header/Footer components reside under `frontend/components/`.

## Files to Edit / Create
- `frontend/locales/{en,fr,nl,es,pt}/common.json` — add `layout`, `nav`, and `footer` sections for shell text.
- `frontend/components/Header.tsx` — consume dictionary strings for site title/tagline, nav pills, language menu label, and CTA.
- `frontend/components/Footer.tsx` — pull footer links/copyright copy plus tagline from the dictionary.
- `frontend/app/[locale]/layout.tsx` — load the dictionary via `getDictionary(locale)` and pass it to Header/Footer while keeping the gradient shell.

## Step Instructions
1. Extend each locale JSON (`frontend/locales/<lang>/common.json`) with:
   - `layout.siteTitle`, `layout.siteTagline`, `layout.siteInitials`.
   - `nav.home`, `nav.destinations`, `nav.blog`, `nav.about`, `nav.contact`, `nav.languageMenu`, `nav.cta`.
   - `footer.copyright`, `footer.privacy`, `footer.cookies`, `footer.contact`.
2. Update `Header.tsx`:
   - Accept a `dictionary: CommonDictionary` prop.
   - Map nav items to dictionary labels; keep routing via `buildHref` to `/[locale]/...`.
   - Style the header with the darker gradient palette and feed `nav.languageMenu` into `LanguageSwitcher`.
3. Update `Footer.tsx`:
   - Accept the dictionary prop, render the tagline, and wire Privacy/Cookies anchor links plus Contact route via `buildHref`.
   - Use the dictionary copyright string.
4. Update `app/[locale]/layout.tsx`:
   - Validate the locale with `isSupportedLocale`, fetch `getDictionary(locale)`, and pass it to the header/footer.
   - Keep the gradient background + main content wrapper consistent with other dark pages.

## Commands
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

## What to Test
- Open `/en`, `/fr`, `/nl`, `/es`, `/pt` and confirm the header/footer text updates per locale dictionaries.
- Resize the viewport (mobile → desktop) to ensure nav pills wrap and footer links stay readable.
- Switch locales via the LanguageSwitcher and verify nav links keep the correct locale prefix.
- Check `#privacy`/`#cookies` anchors resolve on the same page and `/[locale]/contact` still loads.
- Watch the server/dev console for missing dictionary key warnings.

## Notes / Pitfalls
- All visible layout/nav/footer strings must come from JSON; avoid reintroducing literals when adding future links.
- `params` arrive as a `Promise` in Next.js 16—always `await` them before reading `locale`.
- Keep the CTA path pointing to `/[locale]/destinations` until the dedicated blog/flights routes arrive.
- When new locales join, copy these sections into their JSON files before shipping the shell.
