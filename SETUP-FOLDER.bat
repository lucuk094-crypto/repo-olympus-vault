@@echo off
title Setup Olympus Vault Folder
color 0E
echo.
echo  ================================================================
echo       MEMBUAT FOLDER OLYMPUS VAULT
echo  ================================================================
echo.

REM Buat folder baru di Desktop
echo  [1/2] Membuat folder Olympus-Vault di Desktop...
cd C:\Users\vanx3\Desktop
mkdir Olympus-Vault 2>nul
cd Olympus-Vault
mkdir backend 2>nul
mkdir templates 2>nul
mkdir static\css 2>nul
mkdir static\js 2>nul
mkdir static\uploads\documents 2>nul
mkdir static\uploads\images 2>nul
mkdir static\uploads\videos 2>nul
mkdir static\uploads\apk 2>nul
mkdir static\uploads\others 2>nul

echo  [2/2] Menyalin file...
copy "C:\Users\vanx3\Desktop\project Vanx\backend\app.py" "C:\Users\vanx3\Desktop\Olympus-Vault\backend\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\templates\*.html" "C:\Users\vanx3\Desktop\Olympus-Vault\templates\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\static\css\style.css" "C:\Users\vanx3\Desktop\Olympus-Vault\static\css\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\static\js\dashboard.js" "C:\Users\vanx3\Desktop\Olympus-Vault\static\js\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\requirements.txt" "C:\Users\vanx3\Desktop\Olympus-Vault\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\Procfile" "C:\Users\vanx3\Desktop\Olympus-Vault\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\railway.json" "C:\Users\vanx3\Desktop\Olympus-Vault\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\nixpacks.toml" "C:\Users\vanx3\Desktop\Olympus-Vault\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\runtime.txt" "C:\Users\vanx3\Desktop\Olympus-Vault\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\.gitignore" "C:\Users\vanx3\Desktop\Olympus-Vault\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\README.md" "C:\Users\vanx3\Desktop\Olympus-Vault\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\.env.example" "C:\Users\vanx3\Desktop\Olympus-Vault\" >nul
copy "C:\Users\vanx3\Desktop\project Vanx\config.py" "C:\Users\vanx3\Desktop\Olympus-Vault\" >nul

echo.
echo  ================================================================
echo           SELESAI!
echo  ================================================================
echo.
echo  Folder Olympus-Vault sudah dibuat di Desktop:
echo  C:\Users\vanx3\Desktop\Olympus-Vault
echo.
echo  Buka folder tersebut untuk melihat semua file project.
echo.
echo  ================================================================
echo.
pause
explorer C:\Users\vanx3\Desktop\Olympus-Vault

