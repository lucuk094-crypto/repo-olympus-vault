require("./settings");
const { WA_DEFAULT_EPHEMERAL } = require('lily-baileys').default

async function GroupParticipants(Zion, { id, participants, action, author }) {
    try {
        const gcdata = await Zion.groupMetadata(id)
        const subject = gcdata.subject
        const groupDesc = gcdata.desc || 'Tidak ada deskripsi'
        const totalMembers = gcdata.participants.length

        for (const jid of participants) {
            let check = author && author !== jid && author.length > 1
            let tag = check ? [author, jid] : [jid]

            // Get member profile picture
            let ppuser
            try {
                ppuser = await Zion.profilePictureUrl(jid, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg'
            }

            // Get group profile picture
            let ppgroup
            try {
                ppgroup = await Zion.profilePictureUrl(id, 'image')
            } catch {
                ppgroup = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg'
            }

            switch (action) {
                case "add":
                    // Welcome message dengan foto profil member
                    const welcomeText = `╭━━━━━━━━━━━━━━━╮
│ 👋 *SELAMAT DATANG* 👋
╰━━━━━━━━━━━━━━━╯

✨ *Member Baru:* @${jid.split("@")[0]}
📱 *Nomor:* ${jid.split("@")[0]}
👥 *Total Member:* ${totalMembers}
🏷️ *Grup:* ${subject}

━━━━━━━━━━━━━━━━━━━
📋 *PERKENALAN MEMBER BARU*
━━━━━━━━━━━━━━━━━━━

Silakan isi data berikut:
1️⃣ *Nama Lengkap:*
2️⃣ *Asal Kota:*
3️⃣ *Pekerjaan/Status:*
4️⃣ *Hobi:*

━━━━━━━━━━━━━━━━━━━
📜 *ATURAN GRUP*
━━━━━━━━━━━━━━━━━━━

✅ Baca deskripsi grup
✅ Patuhi peraturan yang ada
✅ Saling menghormati sesama member
✅ Jangan spam atau kirim konten tidak pantas
✅ Ijin jika ingin keluar grup

━━━━━━━━━━━━━━━━━━━
💬 *Deskripsi Grup:*
${groupDesc}
━━━━━━━━━━━━━━━━━━━

Selamat bergabung! 🎉
Semoga betah dan bermanfaat! 🤗`

                    await Zion.sendMessage(id, {
                        image: { url: ppuser },
                        caption: welcomeText,
                        contextInfo: { mentionedJid: [jid] }
                    }, { ephemeralExpiration: WA_DEFAULT_EPHEMERAL })
                    break

                case "remove":
                    // Left message dengan foto profil member
                    const leftText = `╭━━━━━━━━━━━━━━━╮
│ 👋 *SELAMAT JALAN* 👋
╰━━━━━━━━━━━━━━━╯

😢 *Member Keluar:* @${jid.split("@")[0]}
📱 *Nomor:* ${jid.split("@")[0]}
👥 *Sisa Member:* ${totalMembers}
🏷️ *Grup:* ${subject}

━━━━━━━━━━━━━━━━━━━

Terima kasih telah menjadi bagian dari grup ini! 🙏
Semoga sukses dan bahagia selalu! 🚀✨

Sampai jumpa lagi! 👋

━━━━━━━━━━━━━━━━━━━
💬 *Pesan untuk member lain:*
Jangan lupa ijin jika ingin keluar ya! 🤗
━━━━━━━━━━━━━━━━━━━`

                    await Zion.sendMessage(id, {
                        image: { url: ppuser },
                        caption: leftText,
                        contextInfo: { mentionedJid: [jid] }
                    }, { ephemeralExpiration: WA_DEFAULT_EPHEMERAL })
                    break

                case "promote":
                    if (author) {
                        const promoteText = `╭━━━━━━━━━━━━━━━╮
│ 👑 *PROMOTE ADMIN* 👑
╰━━━━━━━━━━━━━━━╯

🎉 Selamat! @${jid.split("@")[0]}

Kamu telah dipromosikan menjadi *ADMIN* oleh @${author.split("@")[0]}

━━━━━━━━━━━━━━━━━━━
📋 *Tugas Admin:*
━━━━━━━━━━━━━━━━━━━

✅ Menjaga ketertiban grup
✅ Membantu member yang bertanya
✅ Menghapus spam/konten tidak pantas
✅ Menegakkan aturan grup

Gunakan kekuatan dengan bijak! 💪✨`

                        await Zion.sendMessage(id, {
                            text: promoteText,
                            contextInfo: { mentionedJid: [...tag] }
                        }, { ephemeralExpiration: WA_DEFAULT_EPHEMERAL })
                    }
                    break

                case "demote":
                    if (author) {
                        const demoteText = `╭━━━━━━━━━━━━━━━╮
│ 🚫 *DEMOTE ADMIN* 🚫
╰━━━━━━━━━━━━━━━╯

😔 @${jid.split("@")[0]}

Kamu telah diturunkan dari jabatan *ADMIN* oleh @${author.split("@")[0]}

━━━━━━━━━━━━━━━━━━━

Terima kasih atas kontribusinya selama ini! 🙏
Tetap semangat sebagai member biasa! 💪`

                        await Zion.sendMessage(id, {
                            text: demoteText,
                            contextInfo: { mentionedJid: [...tag] }
                        }, { ephemeralExpiration: WA_DEFAULT_EPHEMERAL })
                    }
                    break

                default:
                    console.log(`⚠️ Aksi tidak dikenal: ${action} untuk ${jid} di grup ${subject}`)
            }
        }
    } catch (err) {
        console.error('❌ Error di GroupParticipants:', err)
    }
}

module.exports = GroupParticipants