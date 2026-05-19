# 🚀 DEPLOY ANIME STREAMING KE CLOUDFLARE PAGES (MANUAL UPLOAD)

**Panduan Mudah untuk bos Alwiy**
**Tanggal**: 17 Mei 2026

---

## 📋 CARA DEPLOY (TANPA API TOKEN)

### Yang Sudah Siap:
- ✅ Project sudah di-build
- ✅ Folder `out/` berisi semua file website
- ✅ Total 150+ files siap di-upload

---

## 🚀 STEP BY STEP DEPLOY

### STEP 1: Login ke Cloudflare

**Buka browser dan pergi ke:**
```
https://dash.cloudflare.com/
```

**Login dengan akun Cloudflare.**

**Jika belum punya akun, daftar gratis:**
```
https://dash.cloudflare.com/sign-up
```
- Masukkan email
- Buat password
- Verifikasi email
- Login

---

### STEP 2: Masuk ke Cloudflare Pages

**Di Cloudflare Dashboard:**
1. Klik **"Workers & Pages"** di sidebar kiri
2. Klik tab **"Pages"** di bagian atas
3. Klik tombol **"Create application"**

---

### STEP 3: Pilih Upload Assets

**Di halaman Create:**
1. Pilih **"Upload assets"** (tab kedua)
2. Klik tombol **"Create project"**

---

### STEP 4: Konfigurasi Project

**Project name:**
```
anime-streaming
```
Atau nama lain yang Anda inginkan (huruf kecil, tanpa spasi).

**Production branch:**
```
main
```
(Biarkan default)

---

### STEP 5: Upload Folder

**Ada 2 cara upload:**

#### Cara 1: Drag & Drop (Paling Mudah)
1. Buka File Explorer
2. Pergi ke: `C:\Users\vanx3\Desktop\project Vanx\Galery Anime\out`
3. **Pilih SEMUA file dan folder di dalam `out/`** (Ctrl+A)
4. **Drag & drop** ke area upload di browser

#### Cara 2: Select from Computer
1. Klik **"Select from computer"**
2. Pergi ke: `C:\Users\vanx3\Desktop\project Vanx\Galery Anime\out`
3. **Pilih SEMUA file dan folder** (Ctrl+A)
4. Klik **"Open"**

**PENTING:** Upload **ISI folder out/**, bukan folder out/ itu sendiri!

---

### STEP 6: Deploy Site

1. Tunggu upload selesai (150+ files, sekitar 2-5 menit)
2. Progress bar akan menunjukkan upload progress
3. Setelah upload selesai, klik tombol **"Deploy site"**
4. Tunggu deployment selesai (sekitar 30 detik - 1 menit)

---

### STEP 7: Website Live! 🎉

**Setelah deployment selesai, akan muncul:**
```
✅ Success! Your site is live at:
https://anime-streaming.pages.dev
```

**Klik URL tersebut untuk membuka website Anda!**

---

## 🔄 UPDATE WEBSITE (JIKA ADA PERUBAHAN)

### Jika Ada Update di Website:

**STEP 1: Build Ulang**
```powershell
cd "c:\Users\vanx3\Desktop\project Vanx\Galery Anime"
npm run build
```

**STEP 2: Masuk ke Project di Cloudflare**
1. Buka https://dash.cloudflare.com/
2. Klik **"Workers & Pages"**
3. Klik project **"anime-streaming"**

**STEP 3: Create New Deployment**
1. Klik tombol **"Create deployment"**
2. Upload file baru dari folder `out/`
3. Klik **"Deploy"**

Website akan otomatis update dengan versi terbaru!

---

## 🌐 CUSTOM DOMAIN (OPSIONAL)

### Jika Ingin Pakai Domain Sendiri:

**STEP 1: Masuk ke Project**
1. Buka Cloudflare Dashboard
2. Klik **"Workers & Pages"**
3. Klik project **"anime-streaming"**

**STEP 2: Custom Domain**
1. Klik tab **"Custom domains"**
2. Klik **"Set up a custom domain"**

**STEP 3: Tambah Domain**
1. Masukkan domain Anda (contoh: `anime.example.com`)
2. Klik **"Continue"**
3. Ikuti instruksi untuk setup DNS

**STEP 4: Tunggu DNS Propagation**
- Biasanya 5-10 menit
- Website akan bisa diakses via domain custom

---

## 📊 MONITORING & ANALYTICS

### Cek Analytics:

**STEP 1: Masuk ke Project**
1. Buka Cloudflare Dashboard
2. Klik **"Workers & Pages"**
3. Klik project **"anime-streaming"**

**STEP 2: Lihat Analytics**
1. Klik tab **"Analytics"**
2. Lihat:
   - Total requests
   - Bandwidth usage
   - Top pages
   - Geographic distribution
   - Response time

---

## ⚙️ SETTINGS PROJECT

### Mengatur Project Settings:

**STEP 1: Masuk ke Project**
1. Buka Cloudflare Dashboard
2. Klik **"Workers & Pages"**
3. Klik project **"anime-streaming"**

**STEP 2: Settings**
1. Klik tab **"Settings"**
2. Anda bisa mengatur:
   - **Build settings** (jika deploy via Git)
   - **Environment variables**
   - **Functions** (serverless functions)
   - **Redirects** (URL redirects)
   - **Access policies** (password protect)

---

## 🔒 PASSWORD PROTECT (OPSIONAL)

### Jika Ingin Website Private:

**STEP 1: Masuk ke Project Settings**
1. Buka project **"anime-streaming"**
2. Klik tab **"Settings"**
3. Scroll ke **"Access policies"**

**STEP 2: Enable Access**
1. Klik **"Enable Access"**
2. Pilih **"One-time PIN"** atau **"Email"**
3. Tambahkan email yang boleh akses
4. Klik **"Save"**

Sekarang website hanya bisa diakses oleh email yang terdaftar!

---

## 🔧 TROUBLESHOOTING

### 1. Upload Gagal

**Solusi:**
- Cek koneksi internet
- Coba upload ulang
- Pastikan file tidak corrupt
- Coba upload file lebih sedikit (batch upload)

---

### 2. Website Tidak Muncul

**Solusi:**
- Tunggu 1-2 menit setelah deploy
- Clear cache browser (Ctrl+F5)
- Coba buka di incognito mode
- Cek URL sudah benar

---

### 3. Error 404 Not Found

**Solusi:**
- Pastikan file `index.html` ada di root folder upload
- Cek struktur folder sudah benar
- Upload ulang semua file

---

### 4. Video Tidak Muncul

**Solusi:**
- Pastikan file video sudah ter-upload
- Cek ukuran file video tidak terlalu besar
- Cek path video di code sudah benar

---

### 5. Gambar Tidak Muncul

**Solusi:**
- Pastikan semua file gambar ter-upload
- Cek path gambar di code
- Cek format gambar didukung (jpg, png, svg, webp)

---

## 📁 STRUKTUR FILE YANG DI-UPLOAD

Pastikan struktur folder seperti ini:

```
out/
├── index.html          ← Harus ada di root
├── 404.html
├── _next/              ← Folder Next.js assets
│   ├── static/
│   └── ...
├── about/
├── catalog/
├── library/
├── schedule/
├── series/
├── data/               ← Data anime
├── video-1.mp4         ← Video background
├── video-2.mp4
├── video-3.mp4
├── video-4.mp4
├── video-5.mp4
└── ...
```

**Upload SEMUA file dan folder di dalam `out/`!**

---

## 🎯 CHECKLIST DEPLOY

- [ ] Login ke Cloudflare Dashboard
- [ ] Klik "Workers & Pages" → "Pages"
- [ ] Klik "Create application"
- [ ] Pilih "Upload assets"
- [ ] Klik "Create project"
- [ ] Masukkan project name: `anime-streaming`
- [ ] Upload semua file dari folder `out/`
- [ ] Klik "Deploy site"
- [ ] Tunggu deployment selesai
- [ ] Buka URL yang muncul
- [ ] Website live! ✅

---

## 🎉 KEUNTUNGAN CLOUDFLARE PAGES

### Gratis Selamanya:
- ✅ Unlimited bandwidth
- ✅ Unlimited requests
- ✅ 500 deployments per month
- ✅ CDN global (300+ locations)
- ✅ SSL otomatis (HTTPS)
- ✅ DDoS protection
- ✅ Analytics gratis
- ✅ Custom domain gratis

### Performa:
- ⚡ Load time < 1 detik
- 🌍 CDN global (cepat di seluruh dunia)
- 🔒 HTTPS otomatis
- 📊 99.99% uptime

---

## 📝 RINGKASAN SINGKAT

1. **Login** ke https://dash.cloudflare.com/
2. **Klik** "Workers & Pages" → "Pages"
3. **Klik** "Create application" → "Upload assets"
4. **Masukkan** project name: `anime-streaming`
5. **Upload** semua file dari folder `out/`
6. **Klik** "Deploy site"
7. **Buka** URL yang muncul
8. **Selesai!** Website live! 🚀

---

## 🔗 LINK PENTING

- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Cloudflare Support**: https://support.cloudflare.com/

---

## 🎊 SELESAI!

Website anime streaming siap di-deploy ke Cloudflare Pages bos Alwiy!

**Cara paling mudah:**
1. Login ke Cloudflare
2. Upload folder `out/`
3. Deploy
4. Website live!

**Tidak perlu:**
- ❌ API Token
- ❌ Command line
- ❌ Git/GitHub
- ❌ Konfigurasi rumit

**Tinggal drag & drop aja!** 🚀

---

**Dibuat**: 17 Mei 2026, 15:48 WIB
**Status**: ✅ READY TO DEPLOY

Selamat deploy bos Alwiy! 🎉
