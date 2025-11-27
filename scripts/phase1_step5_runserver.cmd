@echo off
cd /d C:\projects\travelacrosseu
start "TravelAcrossEU runserver" cmd /c ".\.venv\Scripts\python.exe manage.py runserver --noreload"
