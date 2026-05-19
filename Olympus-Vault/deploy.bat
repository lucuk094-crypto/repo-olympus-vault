@echo off
title Olympus Vault - Deployment Manager
color 0B

:menu
cls
echo.
echo  ╔════════════════════════════════════════════════════════╗
echo  ║                                                        ║
echo  ║           🏛️  OLYMPUS VAULT DEPLOYMENT 🏛️              ║
echo  ║                                                        ║
echo  ╚════════════════════════════════════════════════════════╝
echo.
echo  [1] Setup Environment (.env)
echo  [2] Run Local Development
echo  [3] Deploy to Vercel
echo  [4] Deploy to Netlify
echo  [5] Deploy to Railway
echo  [6] Install Dependencies
echo  [7] Generate SECRET_KEY
echo  [0] Exit
echo.
echo  ════════════════════════════════════════════════════════
echo.
set /p choice="  Select option (0-7): "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto local
if "%choice%"=="3" goto vercel
if "%choice%"=="4" goto netlify
if "%choice%"=="5" goto railway
if "%choice%"=="6" goto install
if "%choice%"=="7" goto genkey
if "%choice%"=="0" goto exit
goto menu

:setup
cls
echo.
echo [SETUP] Creating environment...
call setup-env.bat
pause
goto menu

:local
cls
echo.
echo [LOCAL] Starting development server...
echo.
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
python backend/app.py
pause
goto menu

:vercel
cls
echo.
echo [VERCEL] Deploying to Vercel...
echo.
call deploy-vercel.bat
pause
goto menu

:netlify
cls
echo.
echo [NETLIFY] Deploying to Netlify...
echo.
call deploy-netlify.bat
pause
goto menu

:railway
cls
echo.
echo [RAILWAY] Deploying to Railway...
echo.
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Railway CLI not found!
    echo Install: npm install -g @railway/cli
    pause
    goto menu
)
railway login
railway init
railway up
echo.
echo Deployment complete! Opening dashboard...
railway open
pause
goto menu

:install
cls
echo.
echo [INSTALL] Installing dependencies...
echo.
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found!
    echo Please install Python 3.11+
    pause
    goto menu
)
pip install -r requirements.txt
echo.
echo Dependencies installed successfully!
pause
goto menu

:genkey
cls
echo.
echo [GENERATE] Creating SECRET_KEY...
echo.
python -c "import secrets; print('Your SECRET_KEY:')"
python -c "import secrets; print(secrets.token_hex(32))"
echo.
echo Copy this key to your .env file or platform dashboard
pause
goto menu

:exit
cls
echo.
echo Thank you for using Olympus Vault!
echo.
timeout /t 2 >nul
exit
