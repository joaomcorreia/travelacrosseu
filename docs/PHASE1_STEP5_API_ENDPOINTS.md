# PHASE 1 – STEP 5 — Read-Only API Endpoints & Routers

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

**Project:** TravelAcross EU  
**Status:** ✅ Completed

---

## Purpose

- Expose read-only JSON endpoints for every core data model (countries, cities, categories, travel pages).
- Keep the DRF integration minimal by using `ReadOnlyModelViewSet` classes with a router-managed URL map.
- Verify the `/api/` heartbeat plus each collection endpoint through a live `runserver` smoke test.
- Document the exact commands and verification steps so we can reproduce the setup later.

---

## Environment

- OS: Windows 10 (CMD shell only)
- Python: 3.11.9 (`.venv` at `C:\projects\travelacrosseu`)
- Django: 5.1.14
- Django REST Framework: 3.15.2
- django-cors-headers: 4.4.0

Helper script created for this step:
- `scripts\phase1_step5_runserver.cmd` — spawns `python manage.py runserver --noreload` in a separate CMD window for manual/API smoke testing.

---

## Viewsets (`core/views.py`)

- `CountryViewSet` — lists all countries.
- `CityViewSet` — lists cities with `select_related("country")` for efficient serialization.
- `CategoryViewSet` — lists categories.
- `TravelPageViewSet` — lists travel pages with `select_related("country", "city", "category")` for JSON nesting.
- `api_root` from Step 3 remains as the human-friendly heartbeat endpoint.

---

## Router & URLs (`backend/urls.py`)

```text
/api/ → api_root (JSON heartbeat)
/api/countries/ → CountryViewSet list + detail
/api/cities/ → CityViewSet list + detail
/api/categories/ → CategoryViewSet list + detail
/api/pages/ → TravelPageViewSet list + detail
```

The router is a `DefaultRouter` registered with `countries`, `cities`, `categories`, and `pages`, and then included under the `/api/` prefix alongside the `api_root` view.

---

## Commands Executed

All commands were issued from Windows CMD (one command per line, absolute paths used where needed):

```cmd
C:\projects\travelacrosseu\.venv\Scripts\python.exe C:\projects\travelacrosseu\manage.py check

C:\projects\travelacrosseu\scripts\phase1_step5_runserver.cmd

curl http://127.0.0.1:8000/api/

curl http://127.0.0.1:8000/api/countries/

curl http://127.0.0.1:8000/api/pages/

taskkill /IM python.exe /F
```

> `phase1_step5_runserver.cmd` launches the dev server in a separate CMD window so that testing commands (curl) can run concurrently in the VS Code-integrated terminal.

---

## Verification Checklist

- [x] `python manage.py check` reports no issues.
- [x] `/api/` responds with the JSON heartbeat (`{"status":"ok",...}`).
- [x] `/api/countries/` returns an empty list (no seed data yet) with HTTP 200.
- [x] `/api/pages/` returns an empty list with HTTP 200.
- [x] Development server stopped cleanly via `taskkill /IM python.exe /F` after testing.

---

## Notes

- All endpoints are read-only (`ReadOnlyModelViewSet`) for now; write operations will be added after authentication/authorization is in place.
- Serializers defined in Step 4 are reused directly, so everything continues to render JSON using the global renderer/parser defaults set in Step 3.
- The router keeps URL structure consistent; future endpoints (e.g., filters, detail routes) can be added via DRF configuration without touching the base URLs.
