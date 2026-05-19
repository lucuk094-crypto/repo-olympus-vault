#!/bin/bash

# Startup Script untuk Bot WhatsApp V9
# Fixed by: bos Alwiy

clear

echo "╔════════════════════════════════════════╗"
echo "║   BOT WHATSAPP V9 - FURINA MD         ║"
echo "║   Fixed Version for Termux            ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Cek apakah Node.js terinstall
if ! command -v node &> /dev/null
then
    echo "❌ Node.js belum terinstall!"
    echo "📦 Jalankan: pkg install nodejs"
    exit 1
fi

# Cek apakah node_modules ada
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependencies belum terinstall!"
    echo "📦 Menjalankan npm install..."
    npm install
    echo ""
fi

# Cek apakah file index-fixed.js ada
if [ ! -f "index-fixed.js" ]; then
    echo "❌ File index-fixed.js tidak ditemukan!"
    echo "⚠️  Menggunakan index.js original..."

    if [ ! -f "index.js" ]; then
        echo "❌ File index.js juga tidak ditemukan!"
        exit 1
    fi

    node index.js
else
    echo "✅ Memulai bot..."
    echo ""
    node index-fixed.js
fi
