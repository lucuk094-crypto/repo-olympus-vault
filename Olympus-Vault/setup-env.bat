@echo off
echo ========================================
echo   OLYMPUS VAULT - SETUP ENVIRONMENT
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Generating SECRET_KEY...
python -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))" > .env
echo UPLOAD_FOLDER=static/uploads >> .env
echo DATABASE_PATH=backend/vault.db >> .env
echo PORT=5000 >> .env

echo [2/3] Creating upload folders...
mkdir static\uploads\documents 2>nul
mkdir static\uploads\images 2>nul
mkdir static\uploads\videos 2>nul
mkdir static\uploads\apk 2>nul
mkdir static\uploads\others 2>nul

echo [3/3] Environment setup complete!
echo.
echo .env file created with random SECRET_KEY
echo Upload folders created
echo.
echo Next steps:
echo 1. Run: run.bat (for local development)
echo 2. Or deploy: deploy-vercel.bat / deploy-netlify.bat
echo.
pause
