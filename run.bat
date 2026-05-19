@echo off
title Olympus Vault - Secure File Storage
color 0E
echo.
echo  ================================================
echo         OLYMPUS VAULT - SECURE FILE STORAGE
echo  ================================================
echo.
echo  [!] Memeriksa sistem...
echo.

REM Check Python
where python >nul 2>&1
if errorlevel 1 (
    echo  [X] Python tidak ditemukan!
    echo.
    echo  [INFO] Silakan install Python terlebih dahulu:
    echo  1. Download dari https://www.python.org/downloads/
    echo  2. Saat install, centang "Add Python to PATH"
    echo  3. Restart command prompt
    echo  4. Jalankan run.bat lagi
    echo.
    pause
    exit /b 1
)

echo  [OK] Python ditemukan
python --version

REM Check pip
where pip >nul 2>&1
if errorlevel 1 (
    echo  [X] pip tidak ditemukan!
    pause
    exit /b 1
)

echo  [OK] pip ditemukan

REM Create virtual environment
if not exist "venv" (
    echo.
    echo  [*] Membuat virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo  [X] Gagal membuat virtual environment!
        pause
        exit /b 1
    )
    echo  [OK] Virtual environment dibuat
)

REM Activate virtual environment
echo.
echo  [*] Mengaktifkan virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo.
echo  [*] Menginstall dependencies...
pip install -r requirements.txt -q
if errorlevel 1 (
    echo  [X] Gagal install dependencies!
    pause
    exit /b 1
)
echo  [OK] Dependencies terinstall

echo.
echo  ================================================
echo   Server berjalan di: http://localhost:5000
echo   Tekan Ctrl+C untuk menghentikan server
echo  ================================================
echo.

REM Run server
python backend\app.py

pause
