# 🏛️✨ Olympus Vault - Anime Style Edition

Penyimpanan file aman 1TB dengan tampilan Anime Style yang kawaii! 💖

## 🎨 Anime Style Features

### Warna Palette
- 💖 **Pink Anime**: #FF6B9D
- 💜 **Purple**: #C44569  
- 💙 **Blue**: #4FACFE
- 🩵 **Cyan**: #00F2FE
- 💛 **Yellow**: #FFC837
- 🧡 **Orange**: #FF8C42
- 💜 **Lavender**: #B8A4E8
- 🩵 **Mint**: #7FDBDA

### UI/UX Anime
- ✨ Floating particles animation
- 💫 Sparkle effects
- 🌟 Kawaii icons & emojis
- 🎭 Smooth bounce & float animations
- 🌈 Gradient backgrounds
- ✨ Shimmer effects
- 💖 Glow shadows

## ✨ Fitur Lengkap

### 🔐 Keamanan
- **Enkripsi AES-256** - Setiap file dienkripsi dengan kunci unik
- **Password Hashing** - PBKDF2-SHA256 dengan salt unik
- **Rate Limiting** - Proteksi dari brute force
- **Session Management** - Keamanan session yang ketat

### 💾 Penyimpanan
- **1TB Storage** - Simpan hingga 1 Terabyte file
- **Multi-format Support** - 50+ format file
- **Upload via URL** - Download APK langsung dari link
- **Project Website** - Simpan URL project dengan preview

### 📸 Galeri Modern
- **Galeri Foto & Video** - Tampilan seperti galeri HP
- **View Langsung** - Lihat foto dan putar video tanpa download
- **Thumbnail Otomatis** - Preview cepat
- **Fullscreen Mode** - Modal view yang keren

### 🔔 Notifikasi & Berbagi
- **Notifikasi Real-time** - Setiap aktivitas file
- **Berbagi File** - Link aman dengan expiry
- **Share Token** - Token unik per file

### 🎨 Anime UI/UX
- **Responsive Design** - Desktop, tablet, mobile
- **PWA Support** - Install sebagai aplikasi
- **Smooth Animations** - Bounce, float, sparkle
- **Custom Scrollbar** - Gradient anime style
- **Kawaii Elements** - Emoji & cute icons

## 🚀 Deploy ke Vercel

### Quick Deploy
```bash
# Windows
deploy-vercel-anime.bat

# Manual
npm install -g vercel
vercel login
vercel --prod
```

### Environment Variables
Set di Vercel Dashboard:
```env
SECRET_KEY=<random-32-char-string>
UPLOAD_FOLDER=/tmp/uploads
DATABASE_PATH=/tmp/vault.db
```

Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## 🚀 Deploy ke Netlify

### Quick Deploy
```bash
# Windows
deploy-netlify.bat

# Manual
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## ⚠️ Important Notes

### Vercel & Netlify
- ❌ **Ephemeral storage** - Files reset on restart
- ✅ Good for: Demo, testing, preview
- ❌ Bad for: Production with file uploads

### Railway (Recommended for Production)
- ✅ **Persistent storage** - Files preserved
- ✅ Free tier available
- ✅ Automatic HTTPS

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## 📁 Struktur Folder

```
Olympus-Vault/
├── backend/
│   ├── app.py              # Flask app (1TB storage)
│   └── vault.db            # SQLite database
├── static/
│   ├── css/
│   │   └── style.css       # Anime style CSS ✨
│   ├── js/
│   │   └── dashboard.js    # Dashboard logic
│   ├── thumbnails/         # Auto thumbnails
│   ├── uploads/            # Encrypted files
│   ├── sw.js               # Service Worker
│   └── manifest.json       # PWA Manifest (Anime theme)
├── templates/
│   ├── index.html          # Landing (Anime style) ✨
│   ├── login.html          # Login page
│   ├── register.html       # Register page
│   ├── dashboard.html      # Main dashboard
│   ├── gallery.html        # Photo/Video gallery
│   ├── notifications.html  # Notifications
│   ├── shared.html         # Shared files
│   └── error.html          # Error page
├── vercel.json             # Vercel config (optimized)
├── netlify.toml            # Netlify config
├── requirements.txt        # Python deps
└── README.md               # This file
```

## 🎯 Kategori File

- 📄 **Documents**: PDF, Word, Excel, PowerPoint, TXT, CSV, ODT, RTF
- 🖼️ **Images**: JPG, PNG, GIF, BMP, SVG, WebP, ICO, TIFF, HEIC
- 🎥 **Videos**: MP4, AVI, MOV, WMV, FLV, MKV, WebM, M4V, 3GP, MPEG
- 📱 **APK**: APK, XAPK, APKS
- 🌐 **Projects**: HTML, CSS, JS, JSON, XML, PHP, Python, Java, C++, Go, Rust
- 📦 **Others**: ZIP, RAR, 7Z, TAR, GZ, ISO, DMG, EXE, MSI

## 🔗 Platform Comparison

| Platform | Storage | Gratis | Cocok Untuk |
|----------|---------|--------|-------------|
| Railway | Persistent | ✅ Ya | **Production (RECOMMENDED)** |
| Vercel | Ephemeral | ✅ Ya | Demo/Testing saja |
| Netlify | Ephemeral | ✅ Ya | Demo/Testing saja |

## 🎨 Anime Style Customization

Edit `static/css/style.css` untuk mengubah:
- Warna anime palette (CSS variables)
- Animation speeds
- Particle effects
- Glow intensities

## 📱 Mobile & PWA

- ✅ Responsive design
- ✅ Touch-friendly
- ✅ Install as app
- ✅ Offline support
- ✅ Push notifications ready

## 🔧 Troubleshooting

**File upload tidak tersimpan?**
- Vercel/Netlify: Normal (ephemeral storage)
- Gunakan Railway untuk persistent storage

**Anime style tidak muncul?**
- Clear browser cache
- Hard refresh (Ctrl+F5)
- Check CSS file loaded

**PWA tidak bisa diinstall?**
- Pastikan HTTPS
- Check manifest.json
- Browser support PWA

## 🌟 Anime Features

### Animations
- 💫 Floating particles
- ✨ Sparkle effects
- 🎭 Bounce animations
- 🌊 Wave effects
- 💖 Pulse animations
- 🌈 Shimmer effects

### Visual Effects
- 🌟 Glow shadows
- 💎 Gradient backgrounds
- ✨ Shine effects
- 🎨 Color transitions
- 💫 Blur effects

## 📖 Documentation

- [DEPLOY.md](DEPLOY.md) - Deployment guide
- [QUICKSTART.md](QUICKSTART.md) - Quick start
- [CHECKLIST.md](CHECKLIST.md) - Deployment checklist

## 🎉 Quick Start

### Cara Tercepat:
```bash
# Windows
deploy-vercel-anime.bat

# Atau
deploy.bat
```

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 📞 Support

Butuh bantuan? Check dokumentasi atau logs di dashboard platform.

---

**Built with 💖 by Olympus Vault Team**  
**Anime Style Edition** ✨  
**Last Updated**: 2026-05-19  
**Version**: 2.0.0 - Anime Style! 🎨

🏛️✨ **Olympus Vault** - Penyimpanan Aman dengan Anime Style yang Kawaii! 💖
