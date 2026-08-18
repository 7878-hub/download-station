@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0update.ps1"
echo.
echo Press any key to close...
pause >nul
