# PHASE 1 – STEP 2 — Django + DRF Setup and Backend Project Creation

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

**Project:** TravelAcross EU  
**Status:** ✅ Completed

---

## Purpose

- Install Django and Django REST Framework into the existing virtual environment.
- Ensure the Django project `backend` exists in the repo root.
- Verify the backend boots correctly using `python manage.py check`.
- Capture the exact commands and package versions for future reproducibility.

---

## Environment

- OS: Windows 10 (CMD shell only)
- Python: 3.11.9 (virtual environment `.venv` in `C:\projects\travelacrosseu`)
- Virtual environment activation script: `.venv\Scripts\activate`

---

## Commands Executed

All commands were issued from `C:\projects\travelacrosseu` with the virtual environment activated (performed automatically inside `scripts\\phase1_step2.cmd`).

```cmd
cd C:\projects\travelacrosseu
.\.venv\Scripts\activate

python -m pip install --upgrade pip

pip install "Django>=5.1,<5.2" "djangorestframework>=3.15,<3.16"

pip freeze > requirements.txt

django-admin startproject backend .

python manage.py check
```

> Note: The helper script detected that `manage.py` and `backend/` already existed, so the `django-admin startproject backend .` step was skipped after confirming the files were already present and healthy.

---

## Resulting Files and Structure (Key Items)

- manage.py
- backend/__init__.py
- backend/settings.py
- backend/urls.py
- backend/asgi.py
- backend/wsgi.py
- requirements.txt (captures Django + DRF and dependencies)
- scripts/phase1_step2.cmd (automation helper for this step)
- docs/PHASE1_STEP2_DJANGO_SETUP.md (this document)

---

## Verification Checklist

- [x] `requirements.txt` exists and lists `Django==5.1.14` and `djangorestframework==3.15.2`.
- [x] `manage.py` is present in the project root.
- [x] `backend/` contains the standard Django project files.
- [x] `python manage.py check` passes with no blocking errors.

---

## Notes

- Django installed at **5.1.14**.
- Django REST Framework installed at **3.15.2**.
- `scripts/phase1_step2.cmd` can be re-run safely; it upgrades pip, ensures dependencies, refreshes `requirements.txt`, verifies the project tree, and runs `python manage.py check`.
- The backend is ready for future Django/DRF development tasks.
