@echo off
setlocal
cd /d C:\projects\travelacrosseu
call .\.venv\Scripts\activate

echo Installing django-cors-headers...
pip install "django-cors-headers>=4.4,<4.5"

echo Refreshing requirements.txt...
pip freeze > requirements.txt
