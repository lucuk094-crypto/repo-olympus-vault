# 📱 CARA INSTALL BOT VANX-313 DI TERMUX

**Step by Step untuk bos Alwiy**
**Tanggal**: 16 Mei 2026

---

## 📋 PERSIAPAN

### Yang Dibutuhkan:
- ✅ HP Android
- ✅ Aplikasi Termux (download dari F-Droid atau GitHub)
- ✅ Koneksi internet stabil
- ✅ WhatsApp sudah terinstall
- ✅ Nomor WhatsApp untuk bot: **+9647877314905**

---

## 🚀 STEP 1: INSTALL TERMUX

1. **Download Termux**:
   - Jangan download dari Play Store (versi lama)
   - Download dari: https://f-droid.org/en/packages/com.termux/
   - Atau dari: https://github.com/termux/termux-app/releases

2. **Install Termux**:
   - Buka file APK yang sudah didownload
   - Install aplikasi
   - Buka Termux

---

## 🔧 STEP 2: UPDATE TERMUX

Jalankan command ini satu per satu:

```bash
# Update package list
pkg update -y

# Upgrade semua package
pkg upgrade -y
```

**Catatan**: Kalau ada pertanyaan, ketik `y` lalu Enter

---

## 📦 STEP 3: INSTALL DEPENDENCIES

Jalankan command ini satu per satu:

```bash
# Install Git
pkg install git -y

# Install Node.js
pkg install nodejs -y

# Install FFmpeg (untuk fitur media)
pkg install ffmpeg -y

# Install ImageMagick (untuk fitur image)
pkg install imagemagick -y

# Cek versi (pastikan sudah terinstall)
node --version
npm --version
git --version
```

**Output yang diharapkan**:
- Node.js: v18.x atau lebih tinggi
- NPM: v9.x atau lebih tinggi
- Git: v2.x atau lebih tinggi

---

## 📥 STEP 4: DOWNLOAD BOT

```bash
# Masuk ke folder home
cd ~

# Clone bot dari GitHub (jika ada) atau upload manual
# Untuk sekarang, kita akan upload manual via Termux

# Buat folder untuk bot
mkdir bot-vanx313
cd bot-vanx313
```

---

## 📤 STEP 5: UPLOAD FILE BOT KE TERMUX

**Cara 1: Via Termux (Recommended)**

1. Copy semua file bot dari PC ke HP:
   - Copy folder `bot whatsaap` ke HP
   - Simpan di folder Download atau Internal Storage

2. Di Termux, jalankan:
```bash
# Berikan akses storage ke Termux
termux-setup-storage

# Tunggu popup muncul, klik "Allow"

# Copy file dari storage ke Termux
cp -r ~/storage/downloads/bot\ whatsaap/* ~/bot-vanx313/

# Atau jika di internal storage:
cp -r ~/storage/shared/bot\ whatsaap/* ~/bot-vanx313/
```

**Cara 2: Via GitHub (Alternatif)**

```bash
# Clone dari repository (jika sudah diupload ke GitHub)
git clone https://github.com/username/bot-vanx313.git
cd bot-vanx313
```

---

## 🔨 STEP 6: INSTALL NODE MODULES

```bash
# Pastikan sudah di folder bot
cd ~/bot-vanx313

# Install dependencies
npm install

# Atau jika ada error, gunakan:
npm install --legacy-peer-deps
```

**Proses ini akan memakan waktu 5-10 menit**

Tunggu sampai muncul:
```
added XXX packages in XXs
```

---

## ⚙️ STEP 7: KONFIGURASI BOT (OPSIONAL)

File sudah dikonfigurasi, tapi bisa dicek:

```bash
# Cek konfigurasi owner
cat database/owner.json
```

Output:
```json
["6287818011099","9647877314905"]
```

```bash
# Cek konfigurasi settings
cat settings.js | grep "global.owner"
```

Output:
```javascript
global.owner = ['6287818011099','9647877314905']
```

---

## 🚀 STEP 8: JALANKAN BOT

```bash
# Jalankan bot dengan file yang sudah di-fix
node index-fixed.js
```

**Output yang akan muncul**:
```
Masukan Nomer Yang Aktif Awali Dengan 62 (contoh: 628123456789) :
```

---

## 📱 STEP 9: PAIRING CODE (CONNECT KE WHATSAPP)

1. **Input Nomor Bot**:
   ```
   Masukan Nomer Yang Aktif Awali Dengan 62 (contoh: 628123456789) :
   9647877314905
   ```
   
   **Catatan**: Nomor bot sudah dengan kode negara (964 untuk Iraq)

2. **Bot akan generate Pairing Code**:
   ```
   𝙿𝚊𝚒𝚛𝚒𝚗𝚐 𝙲𝚘𝚍𝚎 : 12345678
   ```

3. **Masukkan Code ke WhatsApp**:
   - Buka WhatsApp di HP
   - Klik titik 3 di pojok kanan atas
   - Pilih **"Linked Devices"** atau **"Perangkat Tertaut"**
   - Klik **"Link a Device"** atau **"Tautkan Perangkat"**
   - Klik **"Link with phone number instead"** atau **"Tautkan dengan nomor telepon"**
   - Masukkan pairing code: **12345678**
   - Klik **"Link"** atau **"Tautkan"**

4. **Bot akan Connect**:
   ```
   ✅ Connected to WhatsApp
   ✅ Bot VanX-313 is ready!
   ```

---

## ✅ STEP 10: TEST BOT

Setelah bot connect, test dengan mengirim pesan ke bot:

```
.menu
```

Bot akan membalas dengan menu lengkap.

**Test Akses Owner**:
```
.owner
```

Bot akan menampilkan kontak owner (Anda).

**Test Fitur**:
```
.totalfitur
```

Bot akan menampilkan total 1,631 fitur.

---

## 🔄 STEP 11: JALANKAN BOT 24/7 (OPSIONAL)

Agar bot tetap jalan meskipun Termux ditutup:

```bash
# Install screen
pkg install screen -y

# Buat session baru
screen -S bot

# Jalankan bot
node index-fixed.js

# Tekan Ctrl+A lalu D untuk detach
# Bot akan tetap jalan di background
```

**Untuk kembali ke session**:
```bash
screen -r bot
```

**Untuk stop bot**:
```bash
# Masuk ke session
screen -r bot

# Tekan Ctrl+C untuk stop bot
```

---

## ⚠️ TROUBLESHOOTING

### 1. **Error: Cannot find module**
```bash
# Install ulang dependencies
rm -rf node_modules
npm install --legacy-peer-deps
```

### 2. **Error: Permission denied**
```bash
# Berikan akses storage
termux-setup-storage

# Restart Termux
exit
# Buka Termux lagi
```

### 3. **Bot Disconnect Terus**
```bash
# Hapus session lama
rm -rf session

# Jalankan bot lagi
node index-fixed.js
```

### 4. **Pairing Code Tidak Muncul**
```bash
# Pastikan nomor sudah benar (dengan kode negara)
# Contoh: 9647877314905 (untuk Iraq)
# Contoh: 6287818011099 (untuk Indonesia)
```

### 5. **Error: ENOSPC (No Space)**
```bash
# Bersihkan cache
npm cache clean --force

# Hapus file tidak perlu
rm -rf ~/.npm
```

---

## 📊 MONITORING BOT

### Cek Status Bot:
```bash
# Lihat proses yang jalan
ps aux | grep node
```

### Cek Log Bot:
```bash
# Lihat log real-time
tail -f bot.log
```

### Restart Bot:
```bash
# Stop bot (Ctrl+C)
# Jalankan lagi
node index-fixed.js
```

---

## 🎯 TIPS & TRIK

### 1. **Hemat Baterai**:
- Gunakan screen untuk background process
- Matikan notifikasi Termux
- Gunakan mode hemat daya

### 2. **Hemat Data**:
- Gunakan WiFi untuk install dependencies
- Matikan auto-update di Termux

### 3. **Backup Session**:
```bash
# Backup session
cp -r session session-backup

# Restore session
cp -r session-backup session
```

### 4. **Update Bot**:
```bash
# Pull update dari GitHub
git pull origin main

# Install dependencies baru
npm install
```

---

## 📞 COMMAND PENTING

### Owner Commands:
```
.self          → Mode self (owner only)
.public        → Mode public (semua bisa pakai)
.restart       → Restart bot
.clearall      → Clear semua chat
.broadcast     → Broadcast ke semua
```

### Info Commands:
```
.menu          → Lihat semua menu
.totalfitur    → Lihat total fitur
.owner         → Lihat kontak owner
.runtime       → Lihat uptime bot
.ping          → Cek kecepatan bot
```

---

## 🎉 SELESAI!

Bot VanX-313 sudah jalan di Termux! 🚀

### Checklist:
- [x] ✅ Termux terinstall
- [x] ✅ Dependencies terinstall (Node.js, Git, FFmpeg)
- [x] ✅ Bot files sudah diupload
- [x] ✅ Node modules terinstall
- [x] ✅ Bot connect ke WhatsApp via Pairing Code
- [x] ✅ Bot berfungsi normal
- [x] ✅ Owner access aktif

---

## 📝 CATATAN PENTING

1. **Jangan tutup Termux** jika ingin bot tetap jalan
2. **Gunakan screen** untuk background process
3. **Backup session** secara berkala
4. **Update bot** secara berkala
5. **Monitor memory** jika bot jalan 24/7

---

## 🆘 BUTUH BANTUAN?

Jika ada masalah:
1. Cek log error di Termux
2. Restart bot dengan `.restart`
3. Hapus session dan login ulang
4. Reinstall dependencies

---

**Panduan Dibuat**: 16 Mei 2026, 15:17 WIB
**Status**: ✅ READY TO USE

Selamat menggunakan bot VanX-313 di Termux bos Alwiy! 🚀
