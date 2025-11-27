@echo off
setlocal
cd /d C:\projects\travelacrosseu
call .\.venv\Scripts\activate

echo Running python manage.py makemigrations...
python manage.py makemigrations

if errorlevel 1 (
    echo makemigrations failed. Exiting.
    exit /b 1
)

echo Running python manage.py migrate...
python manage.py migrate
