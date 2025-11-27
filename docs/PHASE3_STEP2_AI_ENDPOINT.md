# PHASE 3 – STEP 2 — AI Endpoint

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose

Expose an API endpoint that uses the OpenAI-based helper to generate a travel page draft (title, summary, body) without saving it to the database.

The endpoint is:

`POST /api/ai/generate-page/`

## Files Updated

- `core/serializers.py` — added request/response serializers for AI generation.
- `core/views.py` — added `ai_generate_travel_page` view.
- `backend/urls.py` — wired `/api/ai/generate-page/` route.

## Environment Requirements

- `.env` must contain a valid `OPENAI_API_KEY`.
- Django must be able to import `core.ai.generate_travel_page_draft`.

## Commands

```cmd
cd C:\projects\travelacrosseu
C:\projects\travelacrosseu\.venv\Scripts\python.exe manage.py check
C:\projects\travelacrosseu\.venv\Scripts\python.exe manage.py runserver 8000
```

Stop the dev server afterward with:

```cmd
taskkill /IM python.exe /F
```

## Example Request (CMD)

```cmd
cd C:\projects\travelacrosseu
curl -X POST http://127.0.0.1:8000/api/ai/generate-page/ -H "Content-Type: application/json" -d "{ \"language\": \"en\", \"country\": \"Portugal\", \"city\": \"Lisbon\", \"category\": \"city break\" }"
```

## Verification Checklist

- [x] `python manage.py check` passes with AI endpoint wired.
- [x] `POST /api/ai/generate-page/` with a valid JSON payload returns HTTP 200.
- [x] Response JSON includes `title`, `summary`, and `body` fields.
- [x] When `OPENAI_API_KEY` is missing or invalid, errors are visible in logs.
