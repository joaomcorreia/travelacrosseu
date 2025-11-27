# PHASE 3 – STEP 1 — AI Base Layer

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose
Introduce a reusable AI helper that can draft structured travel content via OpenAI so future admin tools or APIs can request generated travel pages on demand.

## Files Created
- `core/ai.py` — shared helper that wraps the OpenAI client and returns structured drafts.
- `core/management/commands/test_ai_travelpage.py` — optional command to manually exercise the helper.

## New Dependency
- `openai==2.8.1` (added to `requirements.txt`).

## Environment Requirement
- `OPENAI_API_KEY` must be present in `.env` (or system environment) for the helper/command to function. Without it, a descriptive runtime error is raised.

## Commands Run
1. `cd /d C:\projects\travelacrosseu && .\.venv\Scripts\pip.exe install openai`
2. `cd /d C:\projects\travelacrosseu && .\.venv\Scripts\pip.exe freeze > C:\projects\travelacrosseu\requirements.txt`
3. `cd /d C:\projects\travelacrosseu && .\.venv\Scripts\python.exe manage.py check`
4. `cd /d C:\projects\travelacrosseu && .\.venv\Scripts\python.exe manage.py test_ai_travelpage`

## Verification Checklist
- [x] `core/ai.py` exists and defines `generate_travel_page_draft`.
- [x] `OPENAI_API_KEY` is read from the environment (no hardcoded secrets).
- [x] `python manage.py check` passes with the new helper and command included.
- [x] `python manage.py test_ai_travelpage` prints a draft when the API key is configured.
