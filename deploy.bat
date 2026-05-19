@echo off
title Deploy Olympus Vault to Railway via GitHub
color 0E
echo.
echo  ================================================================
echo           OLYMPUS VAULT - DEPLOY TO RAILWAY
echo  ================================================================
echo.
echo  PRASYARAT:
echo  - Git sudah terinstall (https://git-scm.com)
echo  - Punya akun GitHub
echo  - Punya akun Railway (https://railway.app)
echo.
echo  ================================================================
echo.
pause

REM Cek Git
git --version >nul 2>&1
if errorlevel 1 (
    echo  [X] Git tidak ditemukan!
    echo  Download dari: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo  [OK] Git tersedia
echo.

REM Setup Git config jika belum
git config user.name >nul 2>&1
if errorlevel 1 (
    echo  [*] Setup Git config...
    set /p GIT_NAME="Masukkan nama GitHub Anda: "
    set /p GIT_EMAIL="Masukkan email GitHub Anda: "
    git config --global user.name "%GIT_NAME%"
    git config --global user.email "%GIT_EMAIL%"
)

echo.
echo  LANGKAH 1: Buat Repository di GitHub
echo  ----------------------------------------
echo  1. Buka https://github.com/new
echo  2. Nama repository: olympus-vault
echo  3. JANGAN centang README, .gitignore, license
echo  4. Klik Create repository
echo  5. Copy repository URL
echo.
set /p REPO_URL="Masukkan GitHub repository URL (https://github.com/username/olympus-vault.git): "

echo.
echo  LANGKAH 2: Push ke GitHub
echo  ----------------------------------------

REM Hapus lock file jika ada
if exist .git\index.lock del /f .git\index.lock

REM Inisialisasi
if not exist .git (
    git init
)

REM Tambahkan file
echo  [*] Adding files...
git add backend/ templates/ static/ requirements.txt Procfile railway.json nixpacks.toml runtime.txt .gitignore README.md .env.example config.py

REM Commit
echo  [*] Committing...
git commit -m "Initial commit - Olympus Vault Secure File Storage with Greek Theme"

REM Remote
git remote remove origin 2>nul
git remote add origin %REPO_URL%

REM Push
echo  [*] Pushing to GitHub...
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo  [X] Push gagal! Pastikan:
    echo  - Repository URL benar
    echo  - Sudah login ke GitHub (git config credential)
    echo  - Repository kosong (tidak ada README)
    pause
    exit /b 1
)

echo.
echo  ================================================================
echo           BERHASIL PUSH KE GITHUB!
echo  ================================================================
echo.
echo  LANGKAH 3: Deploy ke Railway
echo  ----------------------------------------
echo  1. Buka https://railway.app
echo  2. Klik "Login with GitHub"
echo  3. Klik "New Project"
echo  4. Pilih "Deploy from GitHub repo"
echo  5. Pilih repository "olympus-vault"
echo  6. Tunggu beberapa menit sampai deploy selesai
echo  7. Klik domain yang diberikan untuk akses website
echo.
echo  OPTIONAL - Set Environment Variable:
echo  - Di Railway Dashboard, klik project
echo  - Klik tab "Variables"
echo  - Add Variable: SECRET_KEY = (random string 32 karakter)
echo.
echo  ================================================================
echo.
pause
