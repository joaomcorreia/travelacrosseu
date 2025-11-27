@echo off
setlocal
cd /d C:\projects\travelacrosseu
call .\.venv\Scripts\activate

echo Creating migrations for hero slide models...
python manage.py makemigrations cms

echo Running migrations...
python manage.py migrate

echo Hero slide models migration complete.
pause