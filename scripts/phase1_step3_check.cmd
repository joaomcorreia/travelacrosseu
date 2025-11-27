@echo off
setlocal
cd /d C:\projects\travelacrosseu
call .\.venv\Scripts\activate

echo Running python manage.py check...
python manage.py check
