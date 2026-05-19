# 🚀 PANDUAN DEPLOY OLYMPUS VAULT KE RAILWAY

## File Project Sudah Siap

Semua file sudah dibuat di folder:
`
C:\Users\vanx3\Desktop\project Vanx\
`

---

## LANGKAH 1: Upload ke GitHub

### Opsi A: Via GitHub Desktop (Mudah)
1. Download GitHub Desktop dari https://desktop.github.com
2. Login dengan akun GitHub
3. Klik File → Add Local Repository
4. Pilih folder: C:\Users\vanx3\Desktop\project Vanx
5. Klik "Create a new repository for this project"
6. Nama: olympus-vault
7. Klik "Create repository"
8. Klik "Publish repository"

### Opsi B: Via Git Command Line
1. Buka Command Prompt (Run as Administrator)
2. Jalankan command:
`cmd
cd "C:\Users\vanx3\Desktop\project Vanx"
git init
git add backend/ templates/ static/ requirements.txt Procfile railway.json nixpacks.toml runtime.txt .gitignore README.md .env.example config.py
git commit -m "Initial commit - Olympus Vault"
git remote add origin https://github.com/USERNAME/olympus-vault.git
git push -u origin main
`
(Ganti USERNAME dengan username GitHub kamu)

### Opsi C: Via GitHub Web
1. Buka https://github.com/new
2. Buat repository: olympus-vault
3. Klik "uploading an existing file"
4. Drag & drop semua file project
5. Commit

---

## LANGKAH 2: Deploy ke Railway

1. Buka https://railway.app
2. Klik **"Login with GitHub"**
3. Authorize Railway
4. Klik **"New Project"**
5. Pilih **"Deploy from GitHub repo"**
6. Pilih repository **olympus-vault**
7. Klik **"Deploy Now"**
8. Tunggu 2-3 menit sampai selesai

---

## LANGKAH 3: Akses Website

Railway akan memberikan URL seperti:
`
https://olympus-vault-production-abc123.up.railway.app
`

Klik URL tersebut untuk membuka Olympus Vault!

---

## OPTIONAL: Set Environment Variable

Di Railway Dashboard:
1. Klik project
2. Klik tab **"Variables"**
3. Klik **"Add Variable"**
4. Tambahkan:
   - Name: SECRET_KEY
   - Value: (random string 32 karakter, contoh: bc123xyz789secretkey456)
5. Railway akan auto-redeploy

---

## FILE YANG SUDAH DIBUAT

`
olympus-vault/
├── backend/
│   └── app.py           ✅ Flask server
├── templates/
│   ├── index.html       ✅ Landing page
│   ├── login.html       ✅ Login page
│   ├── register.html    ✅ Register page
│   └── dashboard.html   ✅ Dashboard
├── static/
│   ├── css/
│   │   └── style.css    ✅ Greek styling
│   └── js/
│       └── dashboard.js ✅ JavaScript
├── requirements.txt     ✅ Dependencies
├── Procfile             ✅ Railway config
├── railway.json         ✅ Railway settings
├── nixpacks.toml        ✅ Build config
├── runtime.txt          ✅ Python version
├── .gitignore           ✅ Git ignore
├── README.md            ✅ Documentation
└── .env.example         ✅ Env template
`

---

## BUTUH BANTUAN?

Jika ada error saat deploy:
1. Cek log di Railway Dashboard
2. Pastikan semua file ter-upload ke GitHub
3. Coba redeploy di Railway

---
Good luck! 🏛️⚡
