# 🏛️ Olympus Vault - Secure File Storage

Website penyimpanan file pribadi dengan keamanan maksimal dan tampilan Yunani kuno.

## ✨ Fitur

- **Enkripsi AES-256** - Setiap file dienkripsi dengan kunci unik menggunakan Fernet
- **Rate Limiting** - Proteksi dari brute force dan spam
- **Password Hashing** - PBKDF2-SHA256 dengan salt unik
- **Multi-format Support** - PDF, Word, Excel, Gambar, Video, APK
- **Tampilan Yunani** - Desain elegan bergaya Olympus

## 🔒 Keamanan

1. File dienkripsi saat upload, didekripsi saat download
2. Password di-hash dengan PBKDF2 (100,000 iterasi)
3. Rate limiting untuk login dan register
4. Session management yang aman
5. Validasi tipe file

## 📦 Instalasi Lokal

### Otomatis (Windows)
`ash
run.bat
`

### Manual
`ash
# Buat virtual environment
python -m venv venv

# Aktifkan venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Jalankan server
python backend/app.py
`

## 🚀 Deploy ke Railway (Rekomendasi)

### Cara 1: Via Railway Dashboard

1. Buka https://railway.app dan login dengan GitHub
2. Klik **New Project** → **Deploy from GitHub repo**
3. Pilih repository ini
4. Railway otomatis detect Python dan deploy
5. Tunggu beberapa menit sampai selesai
6. Klik domain yang diberikan untuk akses website

### Cara 2: Via Railway CLI

`ash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inisialisasi project
railway init

# Deploy
railway up

# Buka website
railway open
`

### Setting Environment Variables di Railway

Di Railway Dashboard, tambahkan variable:
- SECRET_KEY - Random string untuk session security

## 📁 Struktur Folder

`
project Vanx/
├── backend/
│   ├── app.py          # Flask application
│   └── vault.db        # SQLite database
├── static/
│   ├── css/
│   │   └── style.css   # Greek styling
│   ├── js/
│   │   └── dashboard.js
│   └── uploads/        # Encrypted files
│       ├── documents/
│       ├── images/
│       ├── videos/
│       ├── apk/
│       └── others/
├── templates/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   └── dashboard.html
├── Procfile            # Railway deploy config
├── railway.json        # Railway settings
├── nixpacks.toml       # Build configuration
├── requirements.txt
├── run.bat
└── README.md
`

## 🛠️ Teknologi

- **Backend**: Python Flask
- **Database**: SQLite
- **Encryption**: Fernet (AES-256)
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Custom Greek Theme

## 📝 Catatan

- Maksimal ukuran file: 500MB
- Username minimal 4 karakter
- Password minimal 8 karakter

## 🔗 Platform Deploy

| Platform | Status | Keterangan |
|----------|--------|------------|
| Railway | ✅ Recommended | Gratis, mudah, support penuh |
| Render | ✅ Supported | Free tier available |
| PythonAnywhere | ✅ Supported | Khusus Python |
| Heroku | ✅ Supported | Butuh add-on storage |

---
Built with ⚡ by Olympus Vault Team
