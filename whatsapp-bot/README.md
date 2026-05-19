# WhatsApp Bot v2.0

Bot WhatsApp dengan fitur lengkap untuk grup/saluran.

## Fitur

### Game
- `/game tebak` - Tebak Kata
- `/game suit <batu/gunting/kertas>` - Suit Batu Gunting Kertas
- `/game math` - Math Quiz
- `/game family` - Family 100

### Downloader
- `/dl tiktok <url>` - Download TikTok
- `/dl ig <url>` - Download Instagram
- `/dl yt <url>` - Download YouTube

### Tools
- `/brat <text>` - Buat Brat Sticker
- `/sticker` - Buat Sticker dari gambar
- `/s` - Shortcut sticker

### Info
- `/menu` - Tampilkan menu
- `/ping` - Cek status bot
- `/info` - Info bot

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan bot:
```bash
npm start
```

3. Scan QR Code dengan WhatsApp di HP

## Struktur Folder

```
whatsapp-bot/
├── src/
│   ├── index.js          # File utama bot
│   ├── games/            # Modul game
│   ├── downloader/       # Modul downloader
│   ├── tools/            # Modul tools (brat, dll)
│   └── lib/              # Utility functions
├── config/
│   └── config.json       # Konfigurasi bot
├── package.json
└── README.md
```

## Konfigurasi

Edit file `config/config.json` untuk mengubah:
- `botName` - Nama bot
- `autoReplies` - Auto-reply messages

## Requirements

- Node.js v16+
- Google Chrome (untuk whatsapp-web.js)

## Catatan

- Bot akan menyimpan session di folder `session/`
- Untuk fitur brat sticker, pastikan `canvas` terinstall
