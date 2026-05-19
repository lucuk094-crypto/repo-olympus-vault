#!/bin/bash

# Script Instalasi Bot WhatsApp untuk Termux
# Created by: FALLZX INFINITY
# Fixed by: bos Alwiy

echo "=================================="
echo "  INSTALASI BOT WHATSAPP V9"
echo "  Fixed Version for Termux"
echo "=================================="
echo ""

# Update dan upgrade Termux
echo "📦 Updating Termux packages..."
pkg update -y && pkg upgrade -y

# Install dependencies yang diperlukan
echo ""
echo "📦 Installing required packages..."
pkg install -y nodejs git ffmpeg imagemagick yarn

# Cek versi Node.js
echo ""
echo "✅ Node.js version:"
node --version

# Cek versi npm
echo "✅ NPM version:"
npm --version

# Install dependencies npm
echo ""
echo "📦 Installing npm dependencies..."
npm install

# Buat folder session jika belum ada
echo ""
echo "📁 Creating session folder..."
mkdir -p session

# Buat folder database jika belum ada
mkdir -p database
if [ ! -f "database/database.json" ]; then
    echo '{"users":{},"chats":{},"groups":{},"settings":{},"sticker":{},"database":{},"game":{},"others":{}}' > database/database.json
fi

echo ""
echo "=================================="
echo "  ✅ INSTALASI SELESAI!"
echo "=================================="
echo ""
echo "Cara menjalankan bot:"
echo "1. Jalankan: node index-fixed.js"
echo "2. Masukkan nomor WhatsApp dengan kode negara (contoh: 628123456789)"
echo "3. Masukkan kode pairing yang muncul di WhatsApp"
echo ""
echo "Atau gunakan QR Code:"
echo "1. Edit file index-fixed.js"
echo "2. Ubah 'printQRInTerminal': !pairingCode menjadi 'printQRInTerminal': true"
echo "3. Jalankan: node index-fixed.js"
echo ""
