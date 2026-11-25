@echo off
rem FIMS: .env file generator (double-click). The key is NOT stored in this file.
cd /d "%~dp0"
echo.
echo Supabase Dashboard - Project Settings - API - Publishable key
set /p KEY=Paste the key and press Enter: 
if "%KEY%"=="" (echo No key entered. & pause & exit /b 1)
set "KEY=%KEY:_Publishable_Key=%"
set "KEY=%KEY: =%"
(
echo VITE_SUPABASE_URL=https://ebnsvgrkyirqiglknmjn.supabase.co
echo VITE_SUPABASE_ANON_KEY=%KEY%
)> .env
echo.
echo [OK] .env created in %CD%
echo Restart the dev server: stop it with Ctrl+C, then run npm run dev
pause
