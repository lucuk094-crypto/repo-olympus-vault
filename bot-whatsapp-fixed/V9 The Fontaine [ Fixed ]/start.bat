@echo off
title Bot WhatsApp V9 - Furina MD
color 0A

echo ╔════════════════════════════════════════╗
echo ║   BOT WHATSAPP V9 - FURINA MD         ║
echo ║   Fixed Version for Windows           ║
echo ╚════════════════════════════════════════╝
echo.

REM Cek apakah Node.js terinstall
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js belum terinstall!
    echo 📦 Download dari: https://nodejs.org/
    pause
    exit /b 1
)

REM Cek apakah node_modules ada
if not exist "node_modules\" (
    echo ⚠️  Dependencies belum terinstall!
    echo 📦 Menjalankan npm install...
    call npm install
    echo.
)

REM Cek apakah file index-fixed.js ada
if exist "index-fixed.js" (
    echo ✅ Memulai bot dengan index-fixed.js...
    echo.
    node index-fixed.js
) else (
    echo ⚠️  File index-fixed.js tidak ditemukan!
    echo ⚠️  Menggunakan index.js original...
    echo.

    if exist "index.js" (
        node index.js
    ) else (
        echo ❌ File index.js juga tidak ditemukan!
        pause
        exit /b 1
    )
)

pause
