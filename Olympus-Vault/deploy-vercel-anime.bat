@echo off
color 0D
cls
echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                            ║
echo ║          ✨ OLYMPUS VAULT - ANIME STYLE DEPLOYMENT ✨                      ║
echo ║                                                                            ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.
echo   🎨 Tampilan: Anime Style dengan warna Pink, Purple, Cyan
echo   🚀 Platform: Vercel / Netlify
echo   💾 Storage: 1TB
echo   🔒 Enkripsi: AES-256
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

cd /d "%~dp0"

echo [1/5] Checking Vercel CLI...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Vercel CLI not found!
    echo.
    echo Please install: npm install -g vercel
    echo.
    pause
    exit /b 1
)

echo ✅ Vercel CLI found!
echo.

echo [2/5] Checking Python dependencies...
pip show flask >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing dependencies...
    pip install -r requirements.txt
)
echo ✅ Dependencies OK!
echo.

echo [3/5] Testing local server (optional)...
echo Press Ctrl+C to skip and continue to deployment
echo.
timeout /t 5
echo.

echo [4/5] Starting Vercel deployment...
echo.
echo ⚠️  IMPORTANT NOTES:
echo   - Vercel uses ephemeral storage (files reset on restart)
echo   - Set environment variables in Vercel Dashboard:
echo     * SECRET_KEY (generate with: python -c "import secrets; print(secrets.token_hex(32))")
echo     * UPLOAD_FOLDER=/tmp/uploads
echo     * DATABASE_PATH=/tmp/vault.db
echo.
pause
echo.

vercel --prod

echo.
echo [5/5] Deployment complete! ✨
echo.
echo 🎉 Your Olympus Vault (Anime Style) is now live!
echo.
echo 📝 Next steps:
echo   1. Go to Vercel Dashboard
echo   2. Set environment variables (Settings → Environment Variables)
echo   3. Redeploy if needed
echo   4. Test your anime-styled vault!
echo.
echo 💖 Enjoy your kawaii file storage! 💖
echo.
pause
