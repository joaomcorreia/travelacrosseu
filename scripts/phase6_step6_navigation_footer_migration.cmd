@echo off
REM PHASE 6 - STEP 6: Navigation & Footer Database Migration Script
REM This script creates and applies database migrations for NavigationMenuItem, FooterBlock, and FooterLink models

echo ========================================
echo PHASE 6 - STEP 6: Navigation & Footer Migration
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

echo Step 1: Creating migration for Navigation and Footer models...
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
echo 3. Click "Navigation Menu" to create menu items
echo 4. Click "Footer Blocks" to configure footer content
echo 5. Test APIs and frontend integration
echo.
echo Navigation & Footer URLs:
echo - Dashboard: http://127.0.0.1:8000/admin/dashboard/
echo - Navigation Admin: http://127.0.0.1:8000/admin/cms/navigationmenuitem/
echo - Footer Admin: http://127.0.0.1:8000/admin/cms/footerblock/
echo - Navigation API: http://127.0.0.1:8000/api/cms/navigation/?locale=en
echo - Footer API: http://127.0.0.1:8000/api/cms/footer/?locale=en
echo - Frontend: http://localhost:3000/en
echo.

pause