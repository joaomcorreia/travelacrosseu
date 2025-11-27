@echo off
REM PHASE 6 - STEP 5: Media Manager Database Migration Script
REM This script creates and applies the database migration for MediaFile model

echo ========================================
echo PHASE 6 - STEP 5: Media Manager Migration
echo ========================================
echo.

REM Navigate to project directory
cd /d C:\projects\travelacrosseu

REM Check if virtual environment exists
if not exist ".venv\Scripts\python.exe" (
    echo ERROR: Virtual environment not found!
    echo Please ensure .venv is set up correctly.
    pause
    exit /b 1
)

echo Step 1: Creating migration for MediaFile model...
.venv\Scripts\python.exe manage.py makemigrations cms
if errorlevel 1 (
    echo ERROR: Failed to create migrations!
    pause
    exit /b 1
)
echo.

echo Step 2: Applying database migration...
.venv\Scripts\python.exe manage.py migrate
if errorlevel 1 (
    echo ERROR: Failed to apply migration!
    pause
    exit /b 1
)
echo.

echo Step 3: Checking Django configuration...
.venv\Scripts\python.exe manage.py check
if errorlevel 1 (
    echo ERROR: Django check failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo Migration completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Start Django server: python manage.py runserver
echo 2. Visit: http://127.0.0.1:8000/admin/dashboard/
echo 3. Click "Media Library" to test the new media manager
echo 4. Upload test images and verify functionality
echo.
echo Media Manager URLs:
echo - Dashboard: http://127.0.0.1:8000/admin/dashboard/
echo - Media Library: http://127.0.0.1:8000/admin/media-library/
echo - Upload Media: http://127.0.0.1:8000/admin/cms/mediafile/add/
echo - API Endpoint: http://127.0.0.1:8000/api/cms/media/
echo.

pause