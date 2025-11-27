@echo off
if "%1"=="" (
  echo Usage: curl_frontend_page.cmd /path
  exit /b 1
)
cd /d C:\projects\travelacrosseu
curl http://127.0.0.1:3000%1
