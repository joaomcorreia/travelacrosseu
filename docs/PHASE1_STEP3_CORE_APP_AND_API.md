# PHASE 1 – STEP 3 — Core App & Base API Setup

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

**Project:** TravelAcross EU  
**Status:** ✅ Completed

---

## Purpose

- Add the foundational `core` Django app that will host shared backend functionality.
- Wire up Django REST Framework and CORS so the upcoming frontend can communicate with the API.
- Expose a simple `/api/` JSON route that confirms the backend is online.
- Record every command and change so the setup is reproducible.

---

## Environment

- OS: Windows 10 (CMD terminal)
- Python: 3.11.9 (virtual environment `.venv` in `C:\projects\travelacrosseu`)
- Django: 5.1.14
- Django REST Framework: 3.15.2
- django-cors-headers: 4.4.0

---

## Commands Executed

All commands were executed from `C:\projects\travelacrosseu` with the virtual environment activated (handled inside helper scripts stored in `scripts\`).

```cmd
cd C:\projects\travelacrosseu
.\.venv\Scripts\activate

python manage.py startapp core

pip install "django-cors-headers>=4.4,<4.5"

pip freeze > requirements.txt

python manage.py check
```

Scripts used for repeatability:

- `scripts\phase1_step3_startapp.cmd` — activates the venv and runs `python manage.py startapp core` if needed.
- `scripts\phase1_step3_install_cors.cmd` — installs `django-cors-headers` and refreshes `requirements.txt`.
- `scripts\phase1_step3_check.cmd` — activates the venv and runs `python manage.py check`.

---

## Modified / Added Files

- `core/` — new Django app scaffold (`apps.py`, `views.py`, etc.).
- `core/views.py` — now serves a JSON `api_root` view that returns `{ "status": "ok", "project": "TravelAcrossEU" }`.
- `backend/settings.py` — registered `core`, `rest_framework`, and `corsheaders`; inserted `corsheaders.middleware.CorsMiddleware`; added base `REST_FRAMEWORK` render/parser defaults plus `CORS_ALLOW_ALL_ORIGINS = True`.
- `backend/urls.py` — imports `core.views.api_root` and exposes it at `path("api/", api_root, name="api-root")`.
- `requirements.txt` — refreshed to include `django-cors-headers==4.4.0` alongside Django and DRF.
- `scripts/phase1_step3_startapp.cmd`, `scripts/phase1_step3_install_cors.cmd`, `scripts/phase1_step3_check.cmd` — helper CMD scripts to ensure consistent execution.
- `docs/PHASE1_STEP3_CORE_APP_AND_API.md` — this documentation file.

---

## Resulting Structure (Key Items)

- manage.py
- backend/
  - settings.py (INSTALLED_APPS + middleware + REST/CORS config)
  - urls.py (includes `/api/` route)
- core/
  - __init__.py
  - apps.py
  - views.py (API root view)
  - migrations/
- requirements.txt
- scripts/
  - phase1_step3_startapp.cmd
  - phase1_step3_install_cors.cmd
  - phase1_step3_check.cmd
- docs/
  - PHASE1_STEP3_CORE_APP_AND_API.md

---

## Verification Checklist

- [x] `core` app exists with default Django files.
- [x] `core` is registered in `INSTALLED_APPS` along with `rest_framework` and `corsheaders`.
- [x] `corsheaders.middleware.CorsMiddleware` is placed before `SecurityMiddleware`.
- [x] `REST_FRAMEWORK` defaults restrict responses/parsing to JSON.
- [x] `CORS_ALLOW_ALL_ORIGINS = True` ensures the frontend can call the API during early development.
- [x] `/api/` route returns a JSON heartbeat response.
- [x] `python manage.py check` passes with zero issues.

---

## Notes

- CORS is intentionally open for now to keep early development frictionless; we can tighten allowed origins before production.
- The helper CMD scripts keep us compliant with the Windows CMD-only constraint and avoid manual mistakes.
- Re-run `scripts\phase1_step3_check.cmd` anytime to verify the backend after future changes.
