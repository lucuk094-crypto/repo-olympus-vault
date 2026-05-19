@echo off
echo ========================================
echo   OLYMPUS VAULT - NETLIFY DEPLOYMENT
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Netlify CLI...
where netlify >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Netlify CLI not found!
    echo Please install: npm install -g netlify-cli
    pause
    exit /b 1
)

echo [2/4] Netlify CLI found!
echo.

echo [3/4] Starting deployment...
echo.
netlify deploy --prod

echo.
echo [4/4] Deployment complete!
echo.
echo IMPORTANT NOTES:
echo - Set environment variables in Netlify Dashboard
echo - SECRET_KEY: Use random string (32+ characters)
echo - UPLOAD_FOLDER: /tmp/uploads
echo - DATABASE_PATH: /tmp/vault.db
echo.
echo WARNING: Netlify uses ephemeral storage!
echo Files and database will be reset on each deployment.
echo Consider using Railway or VPS for production.
echo.
pause
