@echo off
setlocal
cd /d C:\projects\travelacrosseu
call .\.venv\Scripts\activate

echo Ensuring Django core app exists...
if exist core\apps.py (
    echo core app already present; skipping python manage.py startapp core.
) else (
    python manage.py startapp core
)
