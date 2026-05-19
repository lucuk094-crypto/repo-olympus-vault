# VANX-Contributor

Platform kontributor untuk upload dan share aplikasi Android dengan sistem reward dan referral.

## 🚀 Fitur Utama

- **Upload Aplikasi/Mod**: Upload APK dengan form yang mudah digunakan
- **Sistem Poin**: Dapatkan poin untuk setiap upload yang disetujui
- **Program Referral**: Ajak teman dan dapatkan bonus poin
- **Leaderboard Global**: Kompetisi dengan kontributor lainnya
- **Dashboard Lengkap**: Pantau statistik dan aktivitas Anda
- **Responsive Design**: Tampilan optimal di desktop dan mobile

## 📁 Struktur Project

```
vanx distributor/
├── css/
│   ├── style.css          # Style utama
│   └── mobile.css         # Style responsive mobile
├── js/
│   ├── script.js          # Fungsi umum
│   ├── dashboard.js       # Logika dashboard
│   └── loader.js          # Preloader
├── index.html             # Landing page
├── login.html             # Halaman login
├── register.html          # Halaman registrasi
├── dashboard.html         # Dashboard kontributor
└── README.md              # Dokumentasi
```

## 🎨 Teknologi

- **HTML5** - Struktur halaman
- **CSS3** - Styling dengan custom properties
- **JavaScript (Vanilla)** - Logika aplikasi
- **LocalStorage** - Database lokal
- **Font Awesome 6.5.1** - Icon library
- **Google Fonts (Space Grotesk)** - Typography

## 🔧 Instalasi & Setup

1. **Clone atau Download Project**
   ```bash
   git clone [repository-url]
   cd vanx-distributor
   ```

2. **Buka dengan Browser**
   - Buka file `index.html` di browser
   - Atau gunakan live server untuk development

3. **Tidak Perlu Instalasi Dependencies**
   - Project ini menggunakan vanilla JavaScript
   - Semua library dimuat via CDN

## 📱 Cara Penggunaan

### Untuk User Baru:

1. **Registrasi**
   - Klik "Join Contributor" di homepage
   - Isi form registrasi lengkap
   - Dapatkan +50 bonus poin jika menggunakan referral link

2. **Login**
   - Masukkan email/username dan password
   - Centang "Remember me" untuk login otomatis

3. **Upload Aplikasi**
   - Buka menu "Upload" di dashboard
   - Isi detail aplikasi (nama, versi, kategori, deskripsi)
   - Upload file APK (max 100MB)
   - Tunggu approval dari admin

4. **Referral Program**
   - Copy link referral Anda di menu "Referral"
   - Share ke teman-teman
   - Dapatkan +50 poin untuk setiap referral yang join

5. **Leaderboard**
   - Lihat ranking kontributor terbaik
   - Kompetisi untuk posisi teratas
   - Top kontributor mendapat privilege khusus

## 💾 Database Structure

Project ini menggunakan LocalStorage dengan struktur:

```javascript
{
  "users": [
    {
      "id": "user_timestamp",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "password": "hashed_password",
      "bio": "Bio text",
      "refCode": "VANX1234",
      "referralCount": 0,
      "joinedAt": "2026-05-14T00:00:00.000Z"
    }
  ],
  "uploads": [
    {
      "id": "timestamp",
      "userId": "user_id",
      "name": "App Name",
      "version": "v1.0.0",
      "category": "mod|game|tool|other",
      "description": "Description",
      "fileName": "app.apk",
      "fileSize": "50.00",
      "status": "pending|approved|rejected",
      "createdAt": "2026-05-14T00:00:00.000Z"
    }
  ],
  "referrals": [
    {
      "id": "timestamp",
      "userId": "referrer_user_id",
      "name": "Referred User Name",
      "joinedAt": "2026-05-14T00:00:00.000Z"
    }
  ]
}
```

## 🎯 Sistem Poin

- **Upload Approved**: +100 poin per aplikasi
- **Referral Signup**: +50 poin per referral
- **Bonus Signup**: +50 poin jika join via referral link

## 🎨 Design System

### Color Palette:
- **Primary**: `#6C63FF` (Purple)
- **Secondary**: `#FF7A59` (Orange)
- **Accent**: `#00D1B2` (Teal)
- **Dark**: `#121212` (Black)
- **Base**: `#F4F6FA` (Light Gray)

### Typography:
- **Font Family**: Space Grotesk
- **Weights**: 400, 500, 600, 700, 800

### Design Style:
- Neo-brutalism design
- Bold borders (2px solid)
- Box shadows untuk depth
- Rounded corners (12px - 32px)
- Smooth animations

## 🔐 Security Notes

⚠️ **PENTING**: Project ini menggunakan LocalStorage untuk demo purposes.

Untuk production:
- Implementasi backend API (Node.js, PHP, Python, dll)
- Gunakan database real (MySQL, PostgreSQL, MongoDB)
- Hash password dengan bcrypt/argon2
- Implementasi JWT untuk authentication
- Validasi file upload di server-side
- Implementasi rate limiting
- HTTPS wajib untuk production

## 📝 TODO / Roadmap

- [ ] Backend API integration
- [ ] Real database implementation
- [ ] File upload ke cloud storage
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Admin panel untuk approval
- [ ] Search & filter uploads
- [ ] User profile pictures
- [ ] Notification system
- [ ] Download tracking
- [ ] Rating & review system

## 🐛 Known Issues

- File upload hanya simulasi (tidak benar-benar upload)
- Password disimpan plain text di LocalStorage
- Tidak ada validasi email format
- Tidak ada rate limiting
- Tidak ada CSRF protection

## 📄 License

© 2026 VANX-Contributor. Developed by VANX Team.

## 👨‍💻 Developer

Developed by **VANX Team**

## 🤝 Contributing

Untuk berkontribusi:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

Untuk bantuan atau pertanyaan:
- Email: support@vanx-contributor.com
- Website: https://vanx-contributor.com

---

**Status**: ✅ Ready for Production (Frontend Only)

**Last Updated**: May 14, 2026
