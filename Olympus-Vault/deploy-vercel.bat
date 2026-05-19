@echo off
echo ========================================
echo   OLYMPUS VAULT - VERCEL DEPLOYMENT
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Vercel CLI...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Vercel CLI not found!
    echo Please install: npm install -g vercel
    pause
    exit /b 1
)

echo [2/4] Vercel CLI found!
echo.

echo [3/4] Starting deployment...
echo.
vercel --prod

echo.
echo [4/4] Deployment complete!
echo.
echo IMPORTANT NOTES:
echo - Set environment variables in Vercel Dashboard
echo - SECRET_KEY: Use random string (32+ characters)
echo - UPLOAD_FOLDER: /tmp/uploads
echo - DATABASE_PATH: /tmp/vault.db
echo.
echo WARNING: Vercel uses ephemeral storage!
echo Files and database will be reset on each deployment.
echo Consider using external storage for production.
echo.
pause
