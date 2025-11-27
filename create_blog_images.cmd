@echo off
REM Create placeholder images for blog posts

cd /d "C:\projects\travelacrosseu"

echo Creating placeholder images for blog posts...
.\.venv\Scripts\python.exe create_blog_placeholder_images.py

echo.
echo Done! Blog placeholder images created in media\images\blog\travel-stories\
echo.
echo To verify images are accessible:
echo - Django server: http://127.0.0.1:8000/media/images/blog/travel-stories/
echo - Next.js frontend: http://localhost:3000/en/blog/category/travel-stories
pause