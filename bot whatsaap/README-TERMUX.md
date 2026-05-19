# Bot WhatsApp V9 - Furina MD (Fixed for Termux)

## 🔧 Perbaikan yang Dilakukan

1. **File index.js yang ter-encode** sudah di-decode menjadi `index-fixed.js`
2. **QR Code Support** - Bot sekarang bisa menampilkan QR code di Termux
3. **Pairing Code Support** - Alternatif login menggunakan kode pairing
4. **Dependencies** sudah dioptimasi untuk Termux

## 📋 Persyaratan

- Termux (Android)
- Node.js v18 atau lebih tinggi
- Koneksi internet stabil
- Minimal 2GB RAM

## 🚀 Cara Instalasi di Termux

### 1. Install Termux dari F-Droid (Recommended)
Download dari: https://f-droid.org/en/packages/com.termux/

### 2. Buka Termux dan jalankan perintah berikut:

```bash
# Berikan izin storage
termux-setup-storage

# Masuk ke folder
cd storage/downloads

# Clone atau copy folder bot ke Termux
# Jika sudah ada folder bot, masuk ke folder tersebut
cd "V9 The Fontaine [ Fixed ]"

# Berikan izin eksekusi pada script install
chmod +x install-termux.sh

# Jalankan instalasi
./install-termux.sh
```

## 🎯 Cara Menjalankan Bot

### Metode 1: Menggunakan Pairing Code (Recommended)

```bash
node index-fixed.js
```

Kemudian:
1. Masukkan nomor WhatsApp dengan kode negara (contoh: 628123456789)
2. Buka WhatsApp di HP
3. Pergi ke **Settings > Linked Devices > Link a Device**
4. Pilih **Link with phone number instead**
5. Masukkan kode pairing yang muncul di Termux

### Metode 2: Menggunakan QR Code

Edit file `index-fixed.js`, cari baris:
```javascript
'printQRInTerminal': !pairingCode,
```

Ubah menjadi:
```javascript
'printQRInTerminal': true,
```

Kemudian jalankan:
```bash
node index-fixed.js
```

Scan QR code yang muncul dengan WhatsApp.

## 📁 Struktur File Penting

```
V9 The Fontaine [ Fixed ]/
├── index-fixed.js          # File utama bot (sudah di-decode)
├── package-fixed.json      # Dependencies yang sudah diperbaiki
├── settings.js             # Konfigurasi bot
├── Furina.js              # Handler perintah bot
├── module.js              # Module dependencies
├── install-termux.sh      # Script instalasi untuk Termux
├── session/               # Folder session WhatsApp
├── database/              # Database bot
└── lib/                   # Library pendukung
```

## ⚙️ Konfigurasi

Edit file `settings.js` untuk mengubah:
- Nomor owner
- Nama bot
- Prefix command
- API keys
- Dan lainnya

## 🐛 Troubleshooting

### QR Code tidak muncul
- Pastikan `printQRInTerminal` di-set `true`
- Pastikan package `qrcode-terminal` sudah terinstall
- Coba restart Termux

### Error saat install dependencies
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm cache clean --force
npm install
```

### Bot disconnect terus
- Pastikan koneksi internet stabil
- Jangan logout dari WhatsApp Web
- Jangan hapus folder session

### Error "lily-baileys" tidak ditemukan
```bash
npm install github:skyzopedia/Baileys
```

## 📝 Catatan Penting

1. **Jangan hapus folder session** setelah bot berhasil connect
2. **Backup folder session** secara berkala
3. **Gunakan nomor WhatsApp yang berbeda** dari nomor utama (recommended)
4. **Jangan spam** command ke bot
5. **Update Termux** secara berkala: `pkg update && pkg upgrade`

## 🔄 Update Bot

```bash
# Backup session dulu
cp -r session session-backup

# Pull update (jika dari git)
git pull

# Install dependencies baru
npm install

# Jalankan bot
node index-fixed.js
```

## 👨‍💻 Credits

- **Base**: DINZBOTZ
- **Creator**: FALLZX INFINITY
- **Fixed by**: bos Alwiy
- **Library**: lily-baileys (Baileys fork)

## 📞 Support

Jika ada masalah, hubungi owner bot atau buat issue di repository.

## ⚠️ Disclaimer

Bot ini hanya untuk tujuan edukasi. Gunakan dengan bijak dan patuhi Terms of Service WhatsApp.

---

**Happy Coding! 🚀**
