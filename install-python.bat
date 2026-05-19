@echo off
title Install Python for Olympus Vault
color 0E
echo.
echo  ================================================
echo      PYTHON INSTALLER FOR OLYMPUS VAULT
echo  ================================================
echo.
echo  Script ini akan mendownload dan menginstall Python
echo  secara otomatis untuk menjalankan Olympus Vault.
echo.
echo  Tekan tombol apapun untuk melanjutkan...
pause >nul

echo.
echo  [*] Mendownload Python installer...

REM Download Python 3.11
powershell -Command "& {Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe' -OutFile 'python-installer.exe'}"

if not exist "python-installer.exe" (
    echo  [X] Gagal mendownload Python!
    echo.
    echo  Silakan download manual dari:
    echo  https://www.python.org/downloads/
    pause
    exit /b 1
)

echo  [OK] Download selesai
echo.
echo  [*] Menginstall Python...
echo  [!] PENTING: Centang "Add Python to PATH" saat install!
echo.

REM Run installer
python-installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0

echo.
echo  [*] Membersihkan file installer...
del python-installer.exe

echo.
echo  ================================================
echo   Python berhasil diinstall!
echo  
echo   Langkah selanjutnya:
echo   1. Tutup command prompt ini
echo   2. Buka command prompt baru
echo   3. Jalankan run.bat
echo  ================================================
echo.
pause
