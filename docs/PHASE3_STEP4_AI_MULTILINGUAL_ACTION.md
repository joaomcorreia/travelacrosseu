# PHASE 3 – STEP 4 — Multilingual AI Admin Action

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose

Add a Django Admin action that can create or update TravelPage entries for every supported language (en, fr, nl, es, pt) using the OpenAI helper so editors can seed localized content directly from a single base page.

## Files Updated

- `core/admin.py` — defined `SUPPORTED_LANGUAGES`, implemented `generate_all_languages_with_ai`, and registered it alongside the existing AI action on `TravelPageAdmin`.

## Commands

```cmd
cd C:\projects\travelacrosseu
C:\projects\travelacrosseu\.venv\Scripts\python.exe manage.py check
C:\projects\travelacrosseu\.venv\Scripts\python.exe manage.py runserver 8000
```

Stop the dev server when finished:

```cmd
taskkill /IM python.exe /F
```

## Behavior

- Uses the selected TravelPage as the base (slug, country, city, category relationships).
- For each language in `SUPPORTED_LANGUAGES`:
  - If a row already exists with the same `slug` and language, the action overwrites `title`, `summary`, and `body` using AI output while leaving `is_published` untouched.
  - If no row exists, a new TravelPage is created with the same foreign keys, AI-generated content, and `is_published=False` so editors can review before publishing.
- Success and warning messages surface in the admin UI to summarize created/updated counts and any AI errors.

## Example Use

1. Run the Django dev server (`python manage.py runserver 8000`) and open `http://127.0.0.1:8000/admin/`.
2. Navigate to Travel Pages, select a base entry (e.g., Lisbon in English).
3. Choose the action **"Generate ALL languages with AI (create/update per language)"** and click **Go**.
4. After completion, filter by FR/NL/ES/PT to confirm entries exist with fresh AI-generated content; newly created ones remain unpublished until reviewed.

## Verification Checklist

- [x] `python manage.py check` passes.
- [x] TravelPageAdmin shows both AI actions (“Generate content with AI” and “Generate ALL languages with AI”).
- [x] Running the multilingual action on a base page creates or updates EN/FR/NL/ES/PT variants for that slug.
- [x] Newly created variants default to `is_published=False`.
- [x] AI errors appear as Django admin messages instead of crashing the admin UI.
