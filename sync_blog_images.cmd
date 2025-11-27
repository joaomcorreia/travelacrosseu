@echo off
REM Copy blog images from frontend public folder to Django media folder

cd /d "C:\projects\travelacrosseu"

echo Copying uploaded blog images from frontend to Django media directory...
echo.

REM Ensure the media directory exists
if not exist "media\images\blog\travel-stories" mkdir "media\images\blog\travel-stories"

REM Copy all images from frontend public folder to Django media folder
xcopy "frontend\public\images\travel-stories\*" "media\images\blog\travel-stories\" /Y

echo.
echo Done! Copied uploaded images to Django media directory.
echo.
echo Your images are now available at:
echo - Django media server: http://127.0.0.1:8000/media/images/blog/travel-stories/
echo - Frontend blog pages: http://localhost:3000/en/blog/category/travel-stories
echo.
echo Note: Run this script whenever you add new images to frontend\public\images\travel-stories\
pause