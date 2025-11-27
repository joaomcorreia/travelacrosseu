# PHASE 1 – STEP 8 — Django Env Settings

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose
Introduce environment-driven configuration so local development and production (travelacross.eu) share the same codebase without leaking secrets or hostnames in version control.

## New Dependency
- `python-dotenv` — loads key/value pairs from the project root `.env` file before Django settings read them.

## `.env` Variables
| Variable | Description | Example |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | Private key used by Django for crypto signing. Never commit production values. | `dev-secret-change-me` |
| `DJANGO_DEBUG` | Toggles Django debug mode. Use `false` in production. | `true` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hostnames/IPs the site can serve. Include `travelacross.eu` live. | `127.0.0.1,localhost` |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | Full origins allowed to POST to Django with CSRF cookies. Add `https://travelacross.eu`. | `http://127.0.0.1:8000,http://localhost:8000` |
| `DJANGO_CORS_ALLOWED_ORIGINS` | Frontend origins allowed to request the API. Add production frontend URL(s). | `http://localhost:3000,http://127.0.0.1:3000` |

## Commands Run
1. `C:\projects\travelacrosseu\.venv\Scripts\pip.exe install python-dotenv`
2. `C:\projects\travelacrosseu\.venv\Scripts\pip.exe freeze > C:\projects\travelacrosseu\requirements.txt`
3. `C:\projects\travelacrosseu\.venv\Scripts\python.exe C:\projects\travelacrosseu\manage.py check`
4. `C:\projects\travelacrosseu\.venv\Scripts\python.exe C:\projects\travelacrosseu\manage.py runserver 8000`
5. `taskkill /IM python.exe /F`

## Production Reminders
- Set `DJANGO_DEBUG=false` before deploying.
- Add `https://travelacross.eu` (and any subdomains) to `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS`, and `DJANGO_CORS_ALLOWED_ORIGINS`.
- Generate a fresh `DJANGO_SECRET_KEY` and store it securely in the server environment.

## Verification Checklist
- [x] `.env` exists at the project root with development defaults.
- [x] `backend/settings.py` reads sensitive values and origin lists from environment variables.
- [x] `python manage.py check` passes with the new configuration.
- [x] `python manage.py runserver` starts successfully using env values.
- [x] No hardcoded secrets remain in `backend/settings.py`.
