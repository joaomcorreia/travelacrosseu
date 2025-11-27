# PHASE 1 – STEP 6 — Multilingual Backend Foundation (i18n)

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

**Project:** TravelAcross EU  
**Status:** ✅ Completed

---

## Purpose

- Tell Django that TravelAcross EU serves multiple languages (EN, FR, NL, ES, PT).
- Prepare the backend to load translation files by configuring locales, middleware, and directory structure.
- Validate the configuration via `python manage.py check` so later translation work (makemessages/compilemessages) is seamless.

---

## Settings Updates (`backend/settings.py`)

- `LANGUAGE_CODE = "en"` (default English locale shared with the frontend).
- Added `LANGUAGES` tuple with the five supported languages.
- Enabled `USE_L10N = True` (in addition to existing `USE_I18N`/`USE_TZ`).
- Declared `LOCALE_PATHS = [BASE_DIR / "locale"]` so Django knows where to read/write `.po` files.
- Inserted `"django.middleware.locale.LocaleMiddleware"` right after `"django.contrib.sessions.middleware.SessionMiddleware"` and before `"django.middleware.common.CommonMiddleware"` while keeping `corsheaders` at the top per earlier CORS requirements.

---

## Folder Structure

- Created `C:\projects\travelacrosseu\locale` (empty for now) to host translation catalogs for each language.

---

## Commands Executed (CMD, one per line)

```cmd
C:\projects\travelacrosseu\scripts\phase1_step6_env.cmd

mkdir C:\projects\travelacrosseu\locale

C:\projects\travelacrosseu\.venv\Scripts\python.exe C:\projects\travelacrosseu\manage.py check
```

---

## Verification Checklist

- [x] `LANGUAGES` lists EN/FR/NL/ES/PT.
- [x] `LOCALE_PATHS` points to `BASE_DIR / "locale"`.
- [x] `LocaleMiddleware` is positioned between SessionMiddleware and CommonMiddleware.
- [x] `mkdir locale` succeeded (directory exists in the project root).
- [x] `python manage.py check` reports “System check identified no issues (0 silenced).”

---

## Notes

- We are not running `makemessages` on Windows yet; this step just guarantees the configuration and directory scaffolding are ready.
- When we add translated strings later, we can run Django’s i18n tooling (likely from WSL or CI) without revisiting these foundational settings.
- Frontend language switching will live in the Next.js app, but this backend prep ensures API responses/errors/admin labels can eventually be localized as well.
