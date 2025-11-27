# PHASE 1 – STEP 4 — Core Models, Serializers, and Migrations

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

**Project:** TravelAcross EU  
**Status:** ✅ Completed

---

## Purpose

- Define the initial data model for countries, cities, content categories, and localized travel pages.
- Provide matching Django REST Framework serializers for read-side API development later in PHASE 2.
- Register the models in Django Admin for quick inspection and content seeding.
- Generate and apply the first `core` app migration so the schema matches the models.

---

## Environment

- OS: Windows 10 (CMD shell only)
- Python: 3.11.9 (`.venv` in `C:\projects\travelacrosseu`)
- Django: 5.1.14
- Django REST Framework: 3.15.2
- django-cors-headers: 4.4.0

Helper CMD scripts created for repeatability (all live in `scripts\`):
- `phase1_step4_env.cmd` — activates the virtual environment for this step.
- `phase1_step4_migrations.cmd` — runs `python manage.py makemigrations` and `python manage.py migrate`.
- `phase1_step4_check.cmd` — runs `python manage.py check` after changes.

---

## Models Implemented (`core/models.py`)

- **Country** — stores ISO alpha-2 `code`, human `name`, and URL `slug`; ordered alphabetically.
- **City** — belongs to a `Country`, includes `name` and `slug` with a (`country`, `slug`) unique constraint to prevent duplicates inside the same nation.
- **Category** — reusable content taxonomy identified by a unique `slug` and display `name`.
- **TravelPage** — main content unit with optional relations to `Country`, `City`, and `Category`, language choices, slug/title/body fields, publication flag, and timestamp metadata. Enforces (`language`, `slug`) uniqueness to avoid duplicate localized URLs.

---

## Serializers Added (`core/serializers.py`)

- `CountrySerializer` → `id`, `code`, `name`, `slug`.
- `CitySerializer` → nests `CountrySerializer` for read-only country context.
- `CategorySerializer` → exposes `id`, `name`, `slug`.
- `TravelPageSerializer` → nests the other serializers and surfaces key content fields plus timestamps.

These serializers will back future API endpoints; for now they provide a consistent shape for tests or admin previews.

---

## Admin Configuration (`core/admin.py`)

- Registered all four models with tailored `list_display`, `search_fields`, and `list_filter` options.
- `TravelPageAdmin` prepopulates the slug from the title to streamline manual entry.

---

## Commands Executed

All commands were executed from `C:\projects\travelacrosseu` with the virtual environment active (via the helper scripts):

```cmd
cd C:\projects\travelacrosseu
.\.venv\Scripts\activate

python manage.py makemigrations

python manage.py migrate

python manage.py check
```

(Each command was run once the relevant files were updated; see terminal history for timestamps.)

---

## Resulting Artifacts

- `core/models.py` — Country, City, Category, TravelPage definitions.
- `core/serializers.py` — DRF serializers matching the models.
- `core/admin.py` — admin registrations for all models.
- `core/migrations/0001_initial.py` — first migration for the `core` app.
- `scripts/phase1_step4_env.cmd`, `scripts/phase1_step4_migrations.cmd`, `scripts/phase1_step4_check.cmd` — automation helpers.
- `docs/PHASE1_STEP4_CORE_MODELS_AND_SERIALIZERS.md` — this record.

---

## Verification Checklist

- [x] `python manage.py makemigrations` produced `core\migrations\0001_initial.py` with all four models.
- [x] `python manage.py migrate` applied the new migration successfully.
- [x] `python manage.py check` reports “System check identified no issues (0 silenced).”
- [x] Admin shows Country, City, Category, and TravelPage with the configured list/search options.
- [x] Serializers compile (imports resolved) and match the model fields for upcoming API work.

---

## Notes & Decisions

- Travel pages can target either a country, a city, or just a category; therefore the related foreign keys allow `null=True` and `blank=True` with `on_delete=models.SET_NULL`.
- Language choices cover five EU languages (+ English) for now; stored as two-letter codes to keep URLs compact.
- JSON-only serializer defaults (added in Step 3) align with these models; no extra renderers were required.
- Future steps can extend the serializers (e.g., writable nested fields) without altering this base migration.
