@echo off
REM Script to copy country images to Django media directory

cd /d "C:\projects\travelacrosseu"

echo.
echo ========================================
echo   Country Images Setup for Django
echo ========================================
echo.

REM Create the countries directory if it doesn't exist
if not exist "media\countries" mkdir "media\countries"

echo Instructions:
echo.
echo 1. Download and extract the ZIP from Claude
echo 2. Place all 20 country-*.jpg files in: media\countries\
echo 3. Run: python create_countries_blog_posts.py
echo 4. Import the generated JSON via Django admin
echo.

echo Expected files in media\countries\:
echo - country-france.jpg
echo - country-italy.jpg  
echo - country-spain.jpg
echo - country-portugal.jpg
echo - country-germany.jpg
echo - country-netherlands.jpg
echo - country-belgium.jpg
echo - country-austria.jpg
echo - country-switzerland.jpg
echo - country-poland.jpg
echo - country-czech-republic.jpg
echo - country-hungary.jpg
echo - country-greece.jpg
echo - country-croatia.jpg
echo - country-iceland.jpg
echo - country-ireland.jpg
echo - country-united-kingdom.jpg
echo - country-norway.jpg
echo - country-sweden.jpg
echo - country-finland.jpg
echo.

echo Current files in media\countries\:
if exist "media\countries\*.*" (
    dir /b "media\countries\"
) else (
    echo [No files yet - copy your images here]
)

echo.
echo ========================================
echo Ready for country blog post generation!
echo ========================================
pause