@echo off
setlocal
cd /d C:\projects\travelacrosseu
call .\.venv\Scripts\activate

echo Upgrading pip...
python -m pip install --upgrade pip

echo Installing Django and DRF...
pip install "Django>=5.1,<5.2" "djangorestframework>=3.15,<3.16"

echo Freezing requirements.txt...
pip freeze > requirements.txt

if exist manage.py (
    echo manage.py already exists; skipping startproject.
) else (
    echo Creating Django project in current directory...
    django-admin startproject backend .
)

if exist backend\settings.py (
    echo Running django system check...
    python manage.py check
) else (
    echo backend\\settings.py missing; please verify project creation.
    exit /b 1
)
