# 📱 COMMAND TERMUX - BOT VANX-313

**Copy Paste Command untuk Termux**
**Untuk bos Alwiy**

---

## 🚀 INSTALL LENGKAP (URUT SATU PER SATU)

### STEP 1: Update Termux
```bash
pkg update -y
```
Tunggu sampai selesai, lalu jalankan:
```bash
pkg upgrade -y
```

### STEP 2: Install Git
```bash
pkg install git -y
```

### STEP 3: Install Node.js
```bash
pkg install nodejs -y
```

### STEP 4: Install FFmpeg
```bash
pkg install ffmpeg -y
```

### STEP 5: Install ImageMagick
```bash
pkg install imagemagick -y
```

### STEP 6: Cek Versi (Pastikan Terinstall)
```bash
node --version
```
```bash
npm --version
```
```bash
git --version
```

### STEP 7: Masuk ke Folder Home
```bash
cd ~
```

### STEP 8: Buat Folder Bot
```bash
mkdir bot-vanx313
```

### STEP 9: Masuk ke Folder Bot
```bash
cd bot-vanx313
```

### STEP 10: Berikan Akses Storage
```bash
termux-setup-storage
```
**Setelah command ini, akan muncul popup "Allow" - klik Allow**

---

## 📤 UPLOAD FILE BOT

### Cara 1: Copy dari Storage HP (Recommended)

**STEP 11: Copy File dari Folder Download**
```bash
cp -r ~/storage/downloads/bot\ whatsaap/* ~/bot-vanx313/
```

**Atau jika file ada di Internal Storage:**
```bash
cp -r ~/storage/shared/bot\ whatsaap/* ~/bot-vanx313/
```

**Atau jika file ada di folder lain (ganti NAMA_FOLDER):**
```bash
cp -r ~/storage/shared/NAMA_FOLDER/* ~/bot-vanx313/
```

### Cara 2: Via GitHub (Alternatif)

**STEP 11: Clone dari GitHub**
```bash
git clone https://github.com/username/bot-vanx313.git ~/bot-vanx313
```

**STEP 12: Masuk ke Folder Bot**
```bash
cd ~/bot-vanx313
```

---

## 🔨 INSTALL NODE MODULES

**STEP 13: Pastikan Sudah di Folder Bot**
```bash
cd ~/bot-vanx313
```

**STEP 14: Install Dependencies**
```bash
npm install
```

**Jika ada error, gunakan command ini:**
```bash
npm install --legacy-peer-deps
```

**Jika masih error, gunakan command ini:**
```bash
npm install --force
```

**Proses ini akan memakan waktu 5-10 menit. Tunggu sampai selesai.**

---

## 🚀 JALANKAN BOT

**STEP 15: Jalankan Bot**
```bash
node index-fixed.js
```

**Setelah command di atas, akan muncul:**
```
Masukan Nomer Yang Aktif Awali Dengan 62 (contoh: 628123456789) :
```

**STEP 16: Ketik Nomor Bot**
```
9647877314905
```
Lalu tekan Enter.

**Bot akan generate Pairing Code:**
```
𝙿𝚊𝚒𝚛𝚒𝚗𝚐 𝙲𝚘𝚍𝚎 : 12345678
```

**STEP 17: Masukkan Code ke WhatsApp**
1. Buka WhatsApp di HP
2. Klik titik 3 (⋮) pojok kanan atas
3. Pilih **"Linked Devices"** atau **"Perangkat Tertaut"**
4. Klik **"Link a Device"** atau **"Tautkan Perangkat"**
5. Klik **"Link with phone number instead"**
6. Masukkan pairing code: **12345678**
7. Klik **"Link"** atau **"Tautkan"**

**Bot akan Connect:**
```
✅ Connected to WhatsApp
✅ Bot VanX-313 is ready!
```

---

## 🔄 JALANKAN BOT 24/7 (BACKGROUND)

**STEP 18: Install Screen**
```bash
pkg install screen -y
```

**STEP 19: Buat Session Baru**
```bash
screen -S bot
```

**STEP 20: Jalankan Bot di Screen**
```bash
node index-fixed.js
```

**STEP 21: Detach Screen (Bot Jalan di Background)**
Tekan **Ctrl+A** lalu tekan **D**

Bot sekarang jalan di background. Anda bisa tutup Termux.

### Command Screen Lainnya:

**Kembali ke Session Bot:**
```bash
screen -r bot
```

**Lihat Semua Session:**
```bash
screen -ls
```

**Stop Bot:**
```bash
screen -r bot
```
Lalu tekan **Ctrl+C**

**Kill Session Bot:**
```bash
screen -S bot -X quit
```

---

## ⚠️ TROUBLESHOOTING COMMANDS

### 1. Error: Cannot find module

**STEP 1: Masuk ke Folder Bot**
```bash
cd ~/bot-vanx313
```

**STEP 2: Hapus Node Modules**
```bash
rm -rf node_modules
```

**STEP 3: Hapus Package Lock**
```bash
rm -rf package-lock.json
```

**STEP 4: Install Ulang**
```bash
npm install --legacy-peer-deps
```

---

### 2. Error: Permission denied

**STEP 1: Berikan Akses Storage**
```bash
termux-setup-storage
```

**STEP 2: Restart Termux**
```bash
exit
```
Lalu buka Termux lagi.

---

### 3. Bot Disconnect Terus

**STEP 1: Masuk ke Folder Bot**
```bash
cd ~/bot-vanx313
```

**STEP 2: Hapus Session Lama**
```bash
rm -rf session
```

**STEP 3: Jalankan Bot Lagi**
```bash
node index-fixed.js
```

---

### 4. Error: ENOSPC (No Space)

**STEP 1: Bersihkan Cache NPM**
```bash
npm cache clean --force
```

**STEP 2: Hapus Folder NPM**
```bash
rm -rf ~/.npm
```

**STEP 3: Bersihkan Package Termux**
```bash
pkg clean
```

---

### 5. Hapus Semua dan Install Ulang

**STEP 1: Masuk ke Home**
```bash
cd ~
```

**STEP 2: Hapus Folder Bot**
```bash
rm -rf bot-vanx313
```

**STEP 3: Buat Folder Baru**
```bash
mkdir bot-vanx313
```

**STEP 4: Masuk ke Folder Bot**
```bash
cd bot-vanx313
```

**STEP 5: Upload File Bot Lagi**
```bash
cp -r ~/storage/downloads/bot\ whatsaap/* ~/bot-vanx313/
```

**STEP 6: Install Dependencies Lagi**
```bash
npm install --legacy-peer-deps
```

**STEP 7: Jalankan Bot**
```bash
node index-fixed.js
```

---

## 📊 MONITORING COMMANDS

### Cek Status Bot

**STEP 1: Lihat Proses Node.js**
```bash
ps aux | grep node
```

**STEP 2: Lihat Penggunaan Memory**
```bash
free -h
```

**STEP 3: Lihat Penggunaan Storage**
```bash
df -h
```

---

### Cek Log Bot

**STEP 1: Lihat Log Real-time**
```bash
tail -f ~/bot-vanx313/bot.log
```

**STEP 2: Lihat 50 Baris Terakhir**
```bash
tail -n 50 ~/bot-vanx313/bot.log
```

**STEP 3: Lihat 100 Baris Terakhir**
```bash
tail -n 100 ~/bot-vanx313/bot.log
```

---

### Restart Bot

**Jika Pakai Screen:**

**STEP 1: Masuk ke Session**
```bash
screen -r bot
```

**STEP 2: Stop Bot**
Tekan **Ctrl+C**

**STEP 3: Jalankan Bot Lagi**
```bash
node index-fixed.js
```

**Jika Tidak Pakai Screen:**

**STEP 1: Stop Bot**
Tekan **Ctrl+C** di Termux

**STEP 2: Jalankan Bot Lagi**
```bash
node index-fixed.js
```

---

## 🔧 MAINTENANCE COMMANDS

### Backup Session

**STEP 1: Masuk ke Folder Bot**
```bash
cd ~/bot-vanx313
```

**STEP 2: Backup Session dengan Tanggal**
```bash
cp -r session session-backup-$(date +%Y%m%d)
```

**STEP 3: Lihat Backup yang Ada**
```bash
ls -la | grep session
```

---

### Restore Session

**STEP 1: Masuk ke Folder Bot**
```bash
cd ~/bot-vanx313
```

**STEP 2: Hapus Session Lama**
```bash
rm -rf session
```

**STEP 3: Restore dari Backup (ganti YYYYMMDD dengan tanggal backup)**
```bash
cp -r session-backup-YYYYMMDD session
```

**STEP 4: Jalankan Bot**
```bash
node index-fixed.js
```

---

### Update Bot (jika ada update)

**STEP 1: Masuk ke Folder Bot**
```bash
cd ~/bot-vanx313
```

**STEP 2: Pull Update dari GitHub**
```bash
git pull origin main
```

**STEP 3: Install Dependencies Baru**
```bash
npm install
```

**STEP 4: Jalankan Bot**
```bash
node index-fixed.js
```

---

### Bersihkan Cache

**STEP 1: Bersihkan Cache NPM**
```bash
npm cache clean --force
```

**STEP 2: Hapus Folder NPM**
```bash
rm -rf ~/.npm
```

**STEP 3: Bersihkan Package Termux**
```bash
pkg clean
```

---

## 📁 NAVIGASI FOLDER

### Masuk ke Folder Bot

**Command:**
```bash
cd ~/bot-vanx313
```

---

### Lihat Isi Folder

**Command:**
```bash
ls -la
```

---

### Lihat Isi File

**Lihat settings.js:**
```bash
cat settings.js
```

**Lihat owner.json:**
```bash
cat database/owner.json
```

**Lihat premium.json:**
```bash
cat database/premium.json
```

**Lihat config.json:**
```bash
cat config.json
```

---

### Edit File (jika perlu)

**STEP 1: Install Nano Editor**
```bash
pkg install nano -y
```

**STEP 2: Edit File (contoh: settings.js)**
```bash
nano settings.js
```

**STEP 3: Simpan File**
Tekan **Ctrl+O** lalu **Enter**

**STEP 4: Keluar dari Nano**
Tekan **Ctrl+X**

---

## 🎯 QUICK COMMANDS

### Install Semua Sekaligus (One-Liner)
```bash
pkg update -y && pkg upgrade -y && pkg install git nodejs ffmpeg imagemagick screen -y && cd ~ && mkdir -p bot-vanx313 && termux-setup-storage
```

### Jalankan Bot dengan Screen (One-Liner)
```bash
cd ~/bot-vanx313 && screen -dmS bot node index-fixed.js && screen -r bot
```

### Restart Bot Cepat
```bash
screen -S bot -X quit && cd ~/bot-vanx313 && screen -dmS bot node index-fixed.js && screen -r bot
```

### Backup Lengkap
```bash
cd ~ && tar -czf bot-backup-$(date +%Y%m%d).tar.gz bot-vanx313/
```

### Restore Backup
```bash
cd ~ && tar -xzf bot-backup-YYYYMMDD.tar.gz
```

---

## 🔍 CEK KONFIGURASI

### Cek Owner

**Command:**
```bash
cd ~/bot-vanx313
```
```bash
cat database/owner.json
```

**Output yang diharapkan:**
```json
["6287818011099","9647877314905"]
```

---

### Cek Premium

**Command:**
```bash
cd ~/bot-vanx313
```
```bash
cat database/premium.json
```

**Output yang diharapkan:**
```json
["6287818011099@s.whatsapp.net","9647877314905@s.whatsapp.net"]
```

---

### Cek Settings

**Cek Owner di Settings:**
```bash
cd ~/bot-vanx313
```
```bash
cat settings.js | grep "global.owner"
```

**Cek Nama Bot:**
```bash
cat settings.js | grep "global.namaBot"
```

**Cek Nomor Bot:**
```bash
cat settings.js | grep "global.botnumber"
```

---

### Cek Package

**Cek Nama Package:**
```bash
cd ~/bot-vanx313
```
```bash
cat package.json | grep "name"
```

**Cek Versi Package:**
```bash
cat package.json | grep "version"
```

---

## 📱 TEST BOT COMMANDS

Setelah bot connect, test dengan command ini di WhatsApp:

```
.menu
.owner
.totalfitur
.runtime
.ping
.self
.public
```

---

## 🆘 EMERGENCY COMMANDS

### Kill Semua Proses Node.js

**Command:**
```bash
pkill -9 node
```

---

### Kill Screen Session

**Command:**
```bash
screen -S bot -X quit
```

---

### Restart Termux

**Command:**
```bash
exit
```
Lalu buka Termux lagi.

---

### Hapus Semua dan Mulai dari Awal

**STEP 1: Masuk ke Home**
```bash
cd ~
```

**STEP 2: Hapus Folder Bot**
```bash
rm -rf bot-vanx313
```

**STEP 3: Hapus Cache NPM**
```bash
rm -rf .npm
```

**STEP 4: Bersihkan Cache**
```bash
npm cache clean --force
```

**STEP 5: Bersihkan Package**
```bash
pkg clean
```

**STEP 6: Mulai dari STEP 1 Lagi**
Kembali ke bagian **INSTALL LENGKAP** di atas.

---

## 💡 TIPS TERMUX

### 1. Copy Paste di Termux

**Cara 1:**
- **Long press** (tahan lama) di layar Termux
- Pilih **"Paste"**

**Cara 2:**
- Tekan **Volume Up + V**

---

### 2. Keyboard Shortcut

**Ctrl+C**: Stop proses yang sedang jalan
**Ctrl+Z**: Suspend proses
**Ctrl+D**: Exit/Logout dari Termux
**Ctrl+A lalu D**: Detach screen (untuk background)
**Volume Up + Q**: Show/Hide keyboard tambahan

---

### 3. Akses Storage

**Masuk ke Folder Download:**
```bash
cd ~/storage/downloads
```

**Masuk ke Internal Storage:**
```bash
cd ~/storage/shared
```

**Masuk ke Folder DCIM (Camera):**
```bash
cd ~/storage/dcim
```

**Kembali ke Home:**
```bash
cd ~
```

**Lihat Semua Storage:**
```bash
ls ~/storage/
```

---

### 4. Hemat Baterai

**STEP 1: Gunakan Screen untuk Background**
```bash
screen -dmS bot node index-fixed.js
```

**STEP 2: Set Environment Production**
```bash
export NODE_ENV=production
```

**STEP 3: Matikan Log Verbose**
Edit file settings.js dan set:
```javascript
global.debug = false
```

---

## 📋 CHECKLIST INSTALL (URUT)

Copy paste command ini **satu per satu** sesuai urutan:

### STEP 1: Update Termux
```bash
pkg update -y
```

### STEP 2: Upgrade Termux
```bash
pkg upgrade -y
```

### STEP 3: Install Git
```bash
pkg install git -y
```

### STEP 4: Install Node.js
```bash
pkg install nodejs -y
```

### STEP 5: Install FFmpeg
```bash
pkg install ffmpeg -y
```

### STEP 6: Install ImageMagick
```bash
pkg install imagemagick -y
```

### STEP 7: Install Screen
```bash
pkg install screen -y
```

### STEP 8: Cek Versi Node
```bash
node --version
```

### STEP 9: Cek Versi NPM
```bash
npm --version
```

### STEP 10: Masuk ke Home
```bash
cd ~
```

### STEP 11: Buat Folder Bot
```bash
mkdir bot-vanx313
```

### STEP 12: Masuk ke Folder Bot
```bash
cd bot-vanx313
```

### STEP 13: Akses Storage
```bash
termux-setup-storage
```
**Klik "Allow" pada popup yang muncul**

### STEP 14: Copy File Bot
```bash
cp -r ~/storage/downloads/bot\ whatsaap/* ~/bot-vanx313/
```

### STEP 15: Install Dependencies
```bash
npm install --legacy-peer-deps
```
**Tunggu 5-10 menit sampai selesai**

### STEP 16: Jalankan Bot
```bash
node index-fixed.js
```

### STEP 17: Input Nomor Bot
```
9647877314905
```
**Tekan Enter**

### STEP 18: Masukkan Pairing Code ke WhatsApp
- Buka WhatsApp
- Klik titik 3 (⋮)
- Pilih "Linked Devices"
- Klik "Link a Device"
- Klik "Link with phone number instead"
- Masukkan pairing code yang muncul di Termux
- Klik "Link"

### STEP 19: Bot Connected! ✅
Bot sekarang sudah jalan dan siap digunakan!

### STEP 20: Test Bot (Opsional)
Kirim pesan ke bot:
```
.menu
```

---

## 🎉 SELESAI!

Semua command sudah diurutkan satu per satu bos Alwiy! 🚀

**Cara Pakai:**
1. Buka Termux
2. Copy paste command **satu per satu** sesuai urutan
3. Tunggu setiap command selesai sebelum jalankan command berikutnya
4. Ikuti instruksi yang muncul
5. Bot akan jalan otomatis

**File Ini Berisi:**
- ✅ Command install lengkap (urut 1-20)
- ✅ Command upload file bot
- ✅ Command install node modules
- ✅ Command jalankan bot
- ✅ Command jalankan 24/7 (background dengan screen)
- ✅ Command troubleshooting (5 masalah umum)
- ✅ Command monitoring (status, log, restart)
- ✅ Command maintenance (backup, restore, update)
- ✅ Command navigasi folder
- ✅ Command cek konfigurasi
- ✅ Command emergency (kill, restart, hapus semua)
- ✅ Tips & tricks Termux

**Keunggulan:**
- ✅ Semua command diurutkan step by step
- ✅ Tidak ada command yang digabung (&&)
- ✅ Mudah dipahami dan diikuti
- ✅ Setiap step ada penjelasan
- ✅ Tinggal copy paste satu per satu

---

**Dibuat**: 16 Mei 2026, 15:25 WIB
**Status**: ✅ READY TO USE

Tinggal copy paste satu per satu bos Alwiy! 🚀
