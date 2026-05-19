# 🚀 CARA DEPLOY ANIME STREAMING KE CLOUDFLARE PAGES

**Panduan untuk bos Alwiy**
**Tanggal**: 17 Mei 2026

---

## 📋 PERSIAPAN

### Yang Sudah Selesai:
- ✅ Project sudah di-build (folder `out/` sudah ada)
- ✅ Wrangler CLI sudah terinstall
- ✅ Static export Next.js sudah siap

### Yang Dibutuhkan:
- ⚠️ Akun Cloudflare (gratis)
- ⚠️ Cloudflare API Token

---

## 🔑 STEP 1: BUAT CLOUDFLARE API TOKEN

### 1. Login ke Cloudflare

Buka browser dan pergi ke:
```
https://dash.cloudflare.com/
```

Login dengan akun Cloudflare Anda. Jika belum punya, daftar gratis di:
```
https://dash.cloudflare.com/sign-up
```

---

### 2. Buat API Token

**STEP 1: Masuk ke API Tokens**
- Klik profil Anda (pojok kanan atas)
- Pilih **"My Profile"**
- Klik tab **"API Tokens"** di sidebar kiri

**STEP 2: Create Token**
- Klik tombol **"Create Token"**

**STEP 3: Pilih Template**
- Cari template **"Edit Cloudflare Workers"**
- Klik **"Use template"**

**STEP 4: Konfigurasi Token**
- **Token name**: `Wrangler Deploy` (atau nama lain)
- **Permissions**:
  - Account → Cloudflare Pages → Edit
  - Account → Account Settings → Read
- **Account Resources**: Pilih akun Anda
- **Zone Resources**: All zones (atau pilih zone tertentu)

**STEP 5: Create Token**
- Klik **"Continue to summary"**
- Klik **"Create Token"**

**STEP 6: Copy Token**
- **PENTING**: Copy token yang muncul
- Token hanya ditampilkan sekali!
- Simpan di tempat aman

Contoh token:
```
abcdef1234567890abcdef1234567890abcdef12
```

---

## 🔧 STEP 2: SET API TOKEN DI WINDOWS

### Cara 1: Set Environment Variable Sementara (PowerShell)

Buka PowerShell dan jalankan:
```powershell
$env:CLOUDFLARE_API_TOKEN = "TOKEN_ANDA_DISINI"
```

Ganti `TOKEN_ANDA_DISINI` dengan token yang sudah di-copy.

**Contoh:**
```powershell
$env:CLOUDFLARE_API_TOKEN = "abcdef1234567890abcdef1234567890abcdef12"
```

---

### Cara 2: Set Environment Variable Permanen (Recommended)

**STEP 1: Buka System Properties**
- Tekan **Windows + R**
- Ketik: `sysdm.cpl`
- Tekan **Enter**

**STEP 2: Environment Variables**
- Klik tab **"Advanced"**
- Klik tombol **"Environment Variables..."**

**STEP 3: Tambah Variable Baru**
- Di bagian **"User variables"**, klik **"New..."**
- **Variable name**: `CLOUDFLARE_API_TOKEN`
- **Variable value**: Paste token Anda
- Klik **"OK"**

**STEP 4: Apply**
- Klik **"OK"** di semua dialog
- **Restart PowerShell/Command Prompt**

---

## 🚀 STEP 3: DEPLOY KE CLOUDFLARE PAGES

### Cara 1: Deploy via Wrangler CLI (Recommended)

**STEP 1: Buka PowerShell**
```powershell
cd "c:\Users\vanx3\Desktop\project Vanx\Galery Anime"
```

**STEP 2: Deploy**
```powershell
wrangler pages deploy out --project-name=anime-streaming
```

**STEP 3: Tunggu Deploy Selesai**
Output akan menampilkan:
```
✨ Success! Uploaded 150 files (5.2 sec)

✨ Deployment complete! Take a peek over at https://anime-streaming.pages.dev
```

**STEP 4: Buka Website**
Copy URL yang muncul dan buka di browser.

---

### Cara 2: Deploy via Cloudflare Dashboard (Alternatif)

**STEP 1: Login ke Cloudflare Dashboard**
```
https://dash.cloudflare.com/
```

**STEP 2: Masuk ke Pages**
- Klik **"Workers & Pages"** di sidebar
- Klik tab **"Pages"**
- Klik **"Create application"**

**STEP 3: Upload Files**
- Pilih **"Upload assets"**
- Klik **"Create project"**
- **Project name**: `anime-streaming`
- **Production branch**: `main`

**STEP 4: Upload Folder**
- Drag & drop folder `out/` ke upload area
- Atau klik **"Select from computer"** dan pilih folder `out/`

**STEP 5: Deploy**
- Klik **"Deploy site"**
- Tunggu proses upload dan deploy selesai

**STEP 6: Buka Website**
Setelah selesai, akan muncul URL:
```
https://anime-streaming.pages.dev
```

---

## 🔄 STEP 4: UPDATE DEPLOYMENT (JIKA ADA PERUBAHAN)

### Jika Ada Update di Website:

**STEP 1: Build Ulang**
```powershell
cd "c:\Users\vanx3\Desktop\project Vanx\Galery Anime"
npm run build
```

**STEP 2: Deploy Ulang**
```powershell
wrangler pages deploy out --project-name=anime-streaming
```

Cloudflare akan otomatis update website dengan versi terbaru.

---

## 🌐 STEP 5: CUSTOM DOMAIN (OPSIONAL)

### Jika Ingin Pakai Domain Sendiri:

**STEP 1: Masuk ke Project**
- Buka Cloudflare Dashboard
- Klik **"Workers & Pages"**
- Klik project **"anime-streaming"**

**STEP 2: Custom Domain**
- Klik tab **"Custom domains"**
- Klik **"Set up a custom domain"**

**STEP 3: Tambah Domain**
- Masukkan domain Anda (contoh: `anime.example.com`)
- Klik **"Continue"**
- Ikuti instruksi untuk setup DNS

**STEP 4: Tunggu DNS Propagation**
- Biasanya 5-10 menit
- Website akan bisa diakses via domain custom

---

## ⚙️ KONFIGURASI TAMBAHAN

### Build Settings (Jika Deploy via Git)

Jika nanti ingin deploy otomatis dari GitHub:

**Build command:**
```bash
npm run build
```

**Build output directory:**
```
out
```

**Root directory:**
```
/
```

**Environment variables:**
Tidak ada yang perlu diset (project ini static)

---

## 📊 MONITORING & ANALYTICS

### Cek Analytics:

**STEP 1: Masuk ke Project**
- Buka Cloudflare Dashboard
- Klik **"Workers & Pages"**
- Klik project **"anime-streaming"**

**STEP 2: Lihat Analytics**
- Klik tab **"Analytics"**
- Lihat:
  - Total requests
  - Bandwidth usage
  - Top pages
  - Geographic distribution

---

## 🔧 TROUBLESHOOTING

### 1. Error: API Token Invalid

**Solusi:**
- Cek token sudah benar
- Pastikan token punya permission **Cloudflare Pages → Edit**
- Buat token baru jika perlu

---

### 2. Error: Project Already Exists

**Solusi:**
```powershell
# Ganti nama project
wrangler pages deploy out --project-name=anime-streaming-v2
```

---

### 3. Error: Upload Failed

**Solusi:**
```powershell
# Cek koneksi internet
# Coba deploy ulang
wrangler pages deploy out --project-name=anime-streaming
```

---

### 4. Website Tidak Muncul

**Solusi:**
- Tunggu 1-2 menit setelah deploy
- Clear cache browser (Ctrl+F5)
- Coba buka di incognito mode

---

### 5. Error: Build Failed

**Solusi:**
```powershell
# Build ulang
cd "c:\Users\vanx3\Desktop\project Vanx\Galery Anime"
npm run build

# Cek folder out/ ada
ls out/
```

---

## 📝 COMMAND LENGKAP

### Deploy Pertama Kali:
```powershell
# 1. Set API Token (jika belum)
$env:CLOUDFLARE_API_TOKEN = "TOKEN_ANDA"

# 2. Masuk ke folder project
cd "c:\Users\vanx3\Desktop\project Vanx\Galery Anime"

# 3. Build project (jika belum)
npm run build

# 4. Deploy
wrangler pages deploy out --project-name=anime-streaming
```

### Deploy Update:
```powershell
# 1. Masuk ke folder project
cd "c:\Users\vanx3\Desktop\project Vanx\Galery Anime"

# 2. Build ulang
npm run build

# 3. Deploy ulang
wrangler pages deploy out --project-name=anime-streaming
```

### Cek Deployment:
```powershell
# List semua project
wrangler pages project list

# Lihat detail project
wrangler pages deployment list --project-name=anime-streaming
```

---

## 🎉 SELESAI!

Website anime streaming sudah siap di-deploy ke Cloudflare Pages!

**Langkah Selanjutnya:**
1. ✅ Buat Cloudflare API Token
2. ✅ Set environment variable `CLOUDFLARE_API_TOKEN`
3. ✅ Jalankan: `wrangler pages deploy out --project-name=anime-streaming`
4. ✅ Buka URL yang muncul
5. ✅ Website live! 🚀

**Keuntungan Cloudflare Pages:**
- ✅ Gratis (unlimited bandwidth)
- ✅ CDN global (cepat di seluruh dunia)
- ✅ SSL otomatis (HTTPS)
- ✅ Deploy unlimited
- ✅ Custom domain gratis
- ✅ Analytics gratis

---

**Dibuat**: 17 Mei 2026, 15:43 WIB
**Status**: ✅ READY TO DEPLOY

Tinggal buat API Token dan deploy bos Alwiy! 🚀
