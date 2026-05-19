# Olympus Vault - Deployment Guide

## Deploy ke Vercel

### Persiapan
1. Install Vercel CLI (jika belum):
```bash
npm install -g vercel
```

2. Login ke Vercel:
```bash
vercel login
```

### Deploy
1. Masuk ke folder Olympus-Vault:
```bash
cd "Olympus-Vault"
```

2. Deploy ke Vercel:
```bash
vercel
```

3. Ikuti prompt:
   - Set up and deploy? **Y**
   - Which scope? Pilih akun Anda
   - Link to existing project? **N**
   - Project name? **olympus-vault** (atau nama lain)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

4. Untuk production deployment:
```bash
vercel --prod
```

### Set Environment Variables
Setelah deploy, set environment variables di Vercel Dashboard atau via CLI:

```bash
vercel env add SECRET_KEY
# Masukkan: random string panjang (gunakan: python -c "import secrets; print(secrets.token_hex(32))")

vercel env add UPLOAD_FOLDER
# Masukkan: /tmp/uploads

vercel env add DATABASE_PATH
# Masukkan: /tmp/vault.db
```

### ⚠️ PENTING - Keterbatasan Vercel
- **Ephemeral Storage**: File yang diupload dan database akan hilang setiap kali function restart
- **Solusi**: Gunakan external storage (AWS S3, Cloudinary) dan database (PostgreSQL, MongoDB Atlas)

---

## Deploy ke Netlify (Alternative)

### Persiapan
1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

### Deploy
1. Buat file `netlify.toml`:
```toml
[build]
  command = "pip install -r requirements.txt"
  publish = "."

[functions]
  directory = "functions"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/app/:splat"
  status = 200
```

2. Deploy:
```bash
netlify deploy --prod
```

### ⚠️ Catatan
Netlify juga memiliki keterbatasan yang sama dengan Vercel untuk ephemeral storage.

---

## Rekomendasi untuk Production
Untuk aplikasi file storage seperti Olympus Vault, lebih baik gunakan:
- **Railway** (sudah ada konfigurasi)
- **Heroku**
- **DigitalOcean App Platform**
- **VPS** (Linode, DigitalOcean Droplet)

Platform ini menyediakan persistent storage yang cocok untuk aplikasi file upload.
