# PHASE 3 – STEP 3 — AI Admin Action

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose

Add a Django Admin action named "Generate content with AI" so editors can auto-populate TravelPage title, summary, and body fields using the existing OpenAI helper without leaving the admin UI.

## Files Updated

- `core/admin.py` — imports the AI helper, defines the `generate_with_ai` action, and attaches it to `TravelPageAdmin`.

## Commands

```cmd
cd C:\projects\travelacrosseu
C:\projects\travelacrosseu\.venv\Scripts\python.exe manage.py check
```

Start the admin site if needed:

```cmd
cd C:\projects\travelacrosseu
C:\projects\travelacrosseu\.venv\Scripts\python.exe manage.py runserver 8000
```

Stop the dev server after testing:

```cmd
taskkill /IM python.exe /F
```

## How to Use the Action

1. Visit the Django Admin (`/admin/`) while the dev server is running.
2. Open Travel Pages, select one or more entries.
3. Choose "Generate content with AI" from the Actions dropdown and click **Go**.
4. After the action completes, refreshed rows will show updated title/summary/body text. Success and warning messages appear at the top of the admin page.

## Verification Checklist

- [x] The "Generate content with AI" action appears in the TravelPage admin actions list.
- [x] Running the action overwrites title, summary, and body using AI-generated text.
- [x] Any AI errors surface as Django admin messages so staff can retry or inspect logs.
