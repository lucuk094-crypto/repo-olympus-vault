# PANDUAN LENGKAP BOT WHATSAPP V9 - TERMUX

## 📱 Masalah yang Sudah Diperbaiki

### 1. **QR Code Tidak Muncul**
**Penyebab**: File `index.js` ter-encode dengan base64 dan obfuscation

**Solusi**: 
- File sudah di-decode menjadi `index-fixed.js`
- Setting `printQRInTerminal` sudah dikonfigurasi dengan benar
- Pairing code sebagai alternatif login

### 2. **Dependencies Error**
**Penyebab**: Beberapa package tidak kompatibel dengan Termux

**Solusi**:
- Package.json sudah dioptimasi (`package-fixed.json`)
- Dependencies yang tidak perlu sudah dihapus
- Versi package sudah disesuaikan untuk Termux

### 3. **Lily-Baileys Installation**
**Penyebab**: Package dari GitHub memerlukan konfigurasi khusus

**Solusi**:
```bash
npm install github:skyzopedia/Baileys
```

## 🚀 CARA INSTALL DI TERMUX (Step by Step)

### Step 1: Persiapan Termux
```bash
# Update Termux
pkg update && pkg upgrade -y

# Install tools yang diperlukan
pkg install -y nodejs git ffmpeg imagemagick wget
```

### Step 2: Copy Bot ke Termux
```bash
# Berikan akses storage
termux-setup-storage

# Masuk ke folder downloads
cd /storage/emulated/0/Download

# Atau jika bot sudah di folder lain
cd /sdcard/Download
```

### Step 3: Masuk ke Folder Bot
```bash
cd "V9 The Fontaine [ Fixed ]"

# Atau jika nama folder berbeda
cd "bot-whatsapp-fixed/V9 The Fontaine [ Fixed ]"
```

### Step 4: Install Dependencies
```bash
# Gunakan package-fixed.json
cp package-fixed.json package.json

# Install dependencies
npm install

# Jika error, coba:
npm install --legacy-peer-deps
```

### Step 5: Jalankan Bot
```bash
# Berikan izin eksekusi
chmod +x start.sh

# Jalankan bot
./start.sh

# Atau langsung:
node index-fixed.js
```

## 🔐 CARA LOGIN

### Metode 1: Pairing Code (Recommended)
1. Jalankan bot: `node index-fixed.js`
2. Masukkan nomor WA dengan kode negara: `628123456789`
3. Buka WhatsApp di HP
4. Pergi ke: **Settings → Linked Devices → Link a Device**
5. Pilih: **Link with phone number instead**
6. Masukkan kode 8 digit yang muncul di Termux

### Metode 2: QR Code
1. Edit file `index-fixed.js`
2. Cari baris: `'printQRInTerminal': !pairingCode,`
3. Ubah jadi: `'printQRInTerminal': true,`
4. Jalankan: `node index-fixed.js`
5. Scan QR code dengan WhatsApp

## ⚙️ KONFIGURASI BOT

Edit file `settings.js`:

```javascript
// Nomor Owner
global.owner = ['628123456789']
global.ownernumber = '628123456789'

// Nama Bot
global.botname = "Nama Bot Kamu"
global.namaBot = "Nama Bot Kamu"

// Prefix Command
global.prefix = ['.', '!', '#']

// Auto Welcome/Leave
global.welcome = true

// Anti Spam
global.antispam = true
```

## 🐛 TROUBLESHOOTING

### Error: Cannot find module 'lily-baileys'
```bash
npm install github:skyzopedia/Baileys
```

### Error: sharp installation failed
```bash
pkg install -y libvips
npm install sharp --ignore-scripts
```

### Error: ffmpeg not found
```bash
pkg install -y ffmpeg
```

### QR Code tidak muncul
```bash
# Install ulang qrcode-terminal
npm install qrcode-terminal

# Pastikan setting di index-fixed.js:
'printQRInTerminal': true
```

### Bot disconnect terus
1. Cek koneksi internet
2. Jangan logout dari WhatsApp Web
3. Jangan hapus folder `session`
4. Pastikan Termux tidak di-kill oleh sistem

### Error: ENOSPC (No space left)
```bash
# Bersihkan cache npm
npm cache clean --force

# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

## 📁 STRUKTUR FILE

```
V9 The Fontaine [ Fixed ]/
├── index-fixed.js          ← File utama (sudah di-decode)
├── package-fixed.json      ← Dependencies yang sudah diperbaiki
├── settings.js             ← Konfigurasi bot
├── Furina.js              ← Handler command
├── module.js              ← Module loader
├── start.sh               ← Script startup
├── install-termux.sh      ← Script instalasi
├── README-TERMUX.md       ← Dokumentasi
├── session/               ← Session WhatsApp (jangan dihapus!)
├── database/              ← Database bot
│   └── database.json
└── lib/                   ← Library pendukung
    ├── color.js
    ├── myfunc.js
    ├── exif.js
    └── ...
```

## 🔄 KEEP BOT RUNNING

### Menggunakan PM2
```bash
# Install PM2
npm install -g pm2

# Jalankan bot dengan PM2
pm2 start index-fixed.js --name furina-bot

# Lihat status
pm2 status

# Lihat logs
pm2 logs furina-bot

# Stop bot
pm2 stop furina-bot

# Restart bot
pm2 restart furina-bot
```

### Menggunakan Screen
```bash
# Install screen
pkg install -y screen

# Buat session baru
screen -S botwa

# Jalankan bot
node index-fixed.js

# Detach: tekan Ctrl+A lalu D
# Attach kembali: screen -r botwa
```

## 💡 TIPS & TRICKS

1. **Backup Session Secara Berkala**
```bash
cp -r session session-backup-$(date +%Y%m%d)
```

2. **Auto Restart Jika Bot Crash**
```bash
while true; do node index-fixed.js; sleep 5; done
```

3. **Cek Memory Usage**
```bash
free -h
```

4. **Cek CPU Usage**
```bash
top
```

5. **Update Bot**
```bash
# Backup session dulu
cp -r session ../session-backup

# Pull update
git pull

# Install dependencies baru
npm install

# Restore session
cp -r ../session-backup session
```

## ⚠️ PENTING!

1. ✅ **JANGAN** hapus folder `session` setelah bot connect
2. ✅ **BACKUP** folder session secara berkala
3. ✅ **GUNAKAN** nomor WhatsApp berbeda dari nomor utama
4. ✅ **JANGAN** spam command ke bot
5. ✅ **UPDATE** Termux dan Node.js secara berkala
6. ✅ **JANGAN** share session ke orang lain
7. ✅ **MATIKAN** battery optimization untuk Termux

## 📞 SUPPORT

Jika masih ada masalah:
1. Baca dokumentasi dengan teliti
2. Cek error message di terminal
3. Hubungi owner bot
4. Join grup support

## 👨‍💻 CREDITS

- **Base**: DINZBOTZ
- **Creator**: FALLZX INFINITY  
- **Developer**: RXQZ OFFC, DINZIDCHX
- **Fixed by**: bos Alwiy
- **Library**: lily-baileys (Baileys fork)

---

**Selamat Menggunakan Bot! 🎉**

Jika ada pertanyaan, jangan ragu untuk bertanya.
