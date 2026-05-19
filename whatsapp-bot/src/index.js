const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const games = require('./games');
const utils = require('./lib/utils');
const dl = require('./downloader');
const { createBratSticker } = require('./tools/brat');

const configPath = path.join(__dirname, '../config/config.json');
let config = {};
if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: path.join(__dirname, '../session')
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('\n========================================');
    console.log('Scan QR Code dengan WhatsApp:');
    console.log('========================================\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n========================================');
    console.log('Bot WhatsApp Siap Digunakan!');
    console.log('========================================\n');
});

client.on('message', async (message) => {
    try {
        const chat = await message.getChat();
        const messageBody = message.body.toLowerCase().trim();
        const sender = message.from;
        
        if (!messageBody || messageBody.length === 0) return;
        
        console.log(`[${new Date().toLocaleString()}] ${sender}: ${message.body}`);
        
        if (messageBody.startsWith('!') || messageBody.startsWith('/')) {
            const args = messageBody.slice(1).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            switch (command) {
                case 'menu':
                case 'help':
                    await message.reply(`🤖 *MENU BOT WHATSAPP*

🎮 *Game:*
/game tebak - Tebak Kata
/game suit <batu/gunting/kertas>
/game math - Math Quiz
/game family - Family 100

📥 *Downloader:*
/dl tiktok <url>
/dl ig <url>
/dl yt <url>

🔧 *Tools:*
/brat <text> - Brat Sticker
/sticker - Buat Sticker

ℹ️ *Info:*
/ping - Cek bot
/info - Info bot`);
                    break;
                    
                case 'game':
                    const gameType = args[0] ? args[0].toLowerCase() : '';
                    switch (gameType) {
                        case 'tebak':
                            const q = games.tebakKata.getRandom();
                            await message.reply(`❓ TEBAK KATA\n\n${q.q}\n\nReply jawaban!`);
                            break;
                        case 'suit':
                            const pilihan = args[1];
                            if (['batu','gunting','kertas'].includes(pilihan)) {
                                const res = games.suit(pilihan);
                                await message.reply(`✊ SUIT\n\nKamu: ${pilihan}\nBot: ${res.bot}\n\nHasil: ${res.result}`);
                            } else {
                                await message.reply('Pilih: batu, gunting, kertas');
                            }
                            break;
                        case 'math':
                            const m = games.mathQuiz();
                            await message.reply(`🔢 MATH QUIZ\n\n${m.q} = ?`);
                            break;
                        default:
                            await message.reply('Game: tebak, suit, math, family');
                    }
                    break;
                    
                case 'dl':
                    const dlType = args[0] ? args[0].toLowerCase() : '';
                    const url = args[1];
                    if (!url) {
                        await message.reply('Contoh: /dl tiktok <url>');
                        return;
                    }
                    await message.reply('⏳ Downloading...');
                    try {
                        let res;
                        switch (dlType) {
                            case 'tiktok': res = await dl.tiktok(url); break;
                            case 'ig': res = await dl.instagram(url); break;
                            case 'yt': res = await dl.youtube(url); break;
                            default: res = await dl.tiktok(url);
                        }
                        if (res.success) {
                            await message.reply('✅ Download sukses!');
                        } else {
                            await message.reply('❌ Gagal: ' + res.error);
                        }
                    } catch (e) {
                        await message.reply('❌ Error: ' + e.message);
                    }
                    break;
                    
                case 'brat':
                    const text = args.join(' ');
                    if (!text) {
                        await message.reply('Contoh: /brat halo');
                        return;
                    }
                    try {
                        const buffer = await createBratSticker(text);
                        await message.reply(buffer, message.from, {
                            sendMediaAsSticker: true,
                            stickerName: 'Brat Sticker',
                            stickerAuthor: 'Bot'
                        });
                    } catch (e) {
                        await message.reply('❌ Error: ' + e.message);
                    }
                    break;
                    
                case 'sticker':
                case 's':
                    if (message.hasMedia) {
                        const media = await message.downloadMedia();
                        await message.reply(media, message.from, {
                            sendMediaAsSticker: true,
                            stickerName: 'Bot Sticker',
                            stickerAuthor: 'WhatsApp Bot'
                        });
                    } else {
                        await message.reply('📷 Kirim gambar dengan caption /sticker');
                    }
                    break;
                    
                case 'ping':
                    await message.reply('🏓 Pong! Bot aktif.');
                    break;
                    
                case 'info':
                    await message.reply(`🤖 *INFO BOT*\n\nNama: ${config.botName || 'WhatsApp Bot'}\nVersi: 2.0\nStatus: Aktif`);
                    break;
                    
                default:
                    if (command) await message.reply('❓ Ketik /menu');
            }
        }
    } catch (err) {
        console.error('Error:', err);
    }
});

client.initialize();
console.log('Bot starting...');
