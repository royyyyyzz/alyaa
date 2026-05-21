require('../lib/canvas')
const fs = require('fs')
const chalk = require('chalk')
const PhoneNumber = require('awesome-phonenumber')
const path = require('path')
const {
    getRandom,
    smsg,
    isUrl,
    generateMessageTag,
    getBuffer,
    getSizeMedia,
    fetchJson,
    await,
    sleep
} = require('./myfunction')
const {
    delay,
    proto,
    jidDecode,
    jidNormalizedUser,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    downloadContentFromMessage,
} = require('@whiskeysockets/baileys')
const moment = require('moment-timezone')
const {
    createCanvas,
    loadImage
} = require('canvas')
const welcomeCanvas = require('./welcomeCanvas.js');
/* ======================
   TEXT UTILS
====================== */

module.exports.welcome = async (Izuka, anu) => {
    console.log(anu)
    try {
        let metadata = await Izuka.groupMetadata(anu.id)
        let namagc = metadata.subject
        let groupDesc = metadata.desc
        let participants = anu.participants
        let memeg = metadata.participants.length;
        let membr = metadata.participants.length
        const groupName = metadata.subject
        
        const xtime = moment.tz('Asia/Jakarta').format('HH:mm:ss')
        const xdate = moment.tz('Asia/Jakarta').format('DD/MM/YYYY')
        for (let num of participants) {
            const author = anu.author ?? null
            let userName = await Izuka.getName(num);
            const check = Boolean(author && author !== num)
            const tag = check ? [author, num] : [num]
            let nameUser = await Izuka.getName(num)
            const nomor = PhoneNumber('+' + num.replace('@s.whatsapp.net', '')).getNumber('international');
            const fkontaku = {
                key: {
                    participant: `0@s.whatsapp.net`,
                    ...(anu.id ? {
                        remoteJid: `status@broadcast`
                    } : {})
                },
                message: {
                    'contactMessage': {
                        'displayName': ``,
                        'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;,;;;\nFN:,\nitem1.TEL;waid=${num.split('@')[0]}:${num.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                        'jpegThumbnail': global.thumbnail,
                        thumbnail: global.thumbnail,
                        sendEphemeral: true
                    }
                }
            }
            try {
                ppuser = await Izuka.profilePictureUrl(num, 'image')
            } catch {
                ppuser = 'https://raw.githubusercontent.com/NdikzDatabase/Database/main/Database/1756427274412-s265c4.jpg'
            }
            try {
                ppgroup = await Izuka.profilePictureUrl(anu.id, 'image')
            } catch {
                ppgroup = 'https://raw.githubusercontent.com/NdikzDatabase/Database/main/Database/1756427393254-cfibym.jpg'
            }
            async function notifGroup() {
				const backgroundURL = path.join(__dirname, 'media', 'bg_wel.jpg')
				const avatarURL = `${ppuser}`
				const title = `Has Ben To Admin`
				const description = `${groupName}`
				const width = 700;
				const height = 350;
				const canvas = createCanvas(width, height);
				const ctx = canvas.getContext('2d');
				ctx.clearRect(0, 0, width, height);
				const background = await loadImage(backgroundURL);
				ctx.drawImage(background, 0, 0, width, height);
				const overlayX = 10;
				const overlayY = 10;
				const overlayWidth = width - 20;
				const overlayHeight = height - 20;
				const overlayRadius = 50;
				ctx.save();
				ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
				ctx.beginPath();
				ctx.moveTo(overlayX + overlayRadius, overlayY);
				ctx.arcTo(overlayX + overlayWidth, overlayY, overlayX + overlayWidth, overlayY + overlayHeight, overlayRadius);
				ctx.arcTo(overlayX + overlayWidth, overlayY + overlayHeight, overlayX, overlayY + overlayHeight, overlayRadius);
				ctx.arcTo(overlayX, overlayY + overlayHeight, overlayX, overlayY, overlayRadius);
				ctx.arcTo(overlayX, overlayY, overlayX + overlayWidth, overlayY, overlayRadius);
				ctx.closePath();
				ctx.fill();
				ctx.strokeStyle = '#87CEEB';
				ctx.lineWidth = 10;
				ctx.stroke();
				ctx.restore();
				const avatar = await loadImage(avatarURL);
				const avatarSize = 150;
				const avatarX = width / 2 - avatarSize / 2;
				const avatarY = height / 2 - 140;
				ctx.save();
				ctx.beginPath();
				ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
				ctx.restore();
				ctx.beginPath();
				ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
				ctx.closePath();
				ctx.strokeStyle = '#87CEEB';
				ctx.lineWidth = 6;
				ctx.stroke();
				ctx.font = 'bold 40px Arial';
				ctx.fillStyle = '#FFFFFF';
				ctx.textAlign = 'center';
				ctx.fillText(title, width / 2, avatarY + avatarSize + 50);
				ctx.font = '22px Arial';
				ctx.fillStyle = '#FFFFFF';
				ctx.fillText(description, width / 2, avatarY + avatarSize + 90);
				ctx.globalCompositeOperation = 'destination-in';
				ctx.beginPath();
				ctx.moveTo(overlayX + overlayRadius, overlayY);
				ctx.arcTo(overlayX + overlayWidth, overlayY, overlayX + overlayWidth, overlayY + overlayHeight, overlayRadius);
				ctx.arcTo(overlayX + overlayWidth, overlayY + overlayHeight, overlayX, overlayY + overlayHeight, overlayRadius);
				ctx.arcTo(overlayX, overlayY + overlayHeight, overlayX, overlayY, overlayRadius);
				ctx.arcTo(overlayX, overlayY, overlayX + overlayWidth, overlayY, overlayRadius);
				ctx.closePath();
				ctx.fill();
				return canvas.toBuffer();
			}
            async function notifGroupLeft() {
				const backgroundURL = path.join(__dirname, 'media', 'bg_wel.jpg')
				const avatarURL = `${ppuser}`
				const title = `Has Ben Remove To Admin`
				const description = `${groupName}`
				const width = 700;
				const height = 350;
				const canvas = createCanvas(width, height);
				const ctx = canvas.getContext('2d');
				ctx.clearRect(0, 0, width, height);
				const background = await loadImage(backgroundURL);
				ctx.drawImage(background, 0, 0, width, height);
				const overlayX = 10;
				const overlayY = 10;
				const overlayWidth = width - 20;
				const overlayHeight = height - 20;
				const overlayRadius = 50;
				ctx.save();
				ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
				ctx.beginPath();
				ctx.moveTo(overlayX + overlayRadius, overlayY);
				ctx.arcTo(overlayX + overlayWidth, overlayY, overlayX + overlayWidth, overlayY + overlayHeight, overlayRadius);
				ctx.arcTo(overlayX + overlayWidth, overlayY + overlayHeight, overlayX, overlayY + overlayHeight, overlayRadius);
				ctx.arcTo(overlayX, overlayY + overlayHeight, overlayX, overlayY, overlayRadius);
				ctx.arcTo(overlayX, overlayY, overlayX + overlayWidth, overlayY, overlayRadius);
				ctx.closePath();
				ctx.fill();
				ctx.strokeStyle = '#87CEEB';
				ctx.lineWidth = 10;
				ctx.stroke();
				ctx.restore();
				const avatar = await loadImage(avatarURL);
				const avatarSize = 150;
				const avatarX = width / 2 - avatarSize / 2;
				const avatarY = height / 2 - 140;
				ctx.save();
				ctx.beginPath();
				ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
				ctx.restore();
				ctx.beginPath();
				ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
				ctx.closePath();
				ctx.strokeStyle = '#87CEEB';
				ctx.lineWidth = 6;
				ctx.stroke();
				ctx.font = 'bold 40px Arial';
				ctx.fillStyle = '#FFFFFF';
				ctx.textAlign = 'center';
				ctx.fillText(title, width / 2, avatarY + avatarSize + 50);
				ctx.font = '22px Arial';
				ctx.fillStyle = '#FFFFFF';
				ctx.fillText(description, width / 2, avatarY + avatarSize + 90);
				ctx.globalCompositeOperation = 'destination-in';
				ctx.beginPath();
				ctx.moveTo(overlayX + overlayRadius, overlayY);
				ctx.arcTo(overlayX + overlayWidth, overlayY, overlayX + overlayWidth, overlayY + overlayHeight, overlayRadius);
				ctx.arcTo(overlayX + overlayWidth, overlayY + overlayHeight, overlayX, overlayY + overlayHeight, overlayRadius);
				ctx.arcTo(overlayX, overlayY + overlayHeight, overlayX, overlayY, overlayRadius);
				ctx.arcTo(overlayX, overlayY, overlayX + overlayWidth, overlayY, overlayRadius);
				ctx.closePath();
				ctx.fill();
				return canvas.toBuffer();
			}
let namaMem = userName || num.split('@')[0]
const imageWel = await new welcomeCanvas.Welcome()
.setUsername(namaMem)
.setGuildName(groupName)
.setGuildIcon(ppgroup)
.setMemberCount(memeg)
.setAvatar(ppuser)
.setBackground(path.join(__dirname, 'media', 'bg_wel.jpg'))
.toAttachment();

const imageLeft = await new welcomeCanvas.Goodbye()
.setUsername(namaMem)
.setGuildName(groupName)
.setGuildIcon(ppgroup)
.setMemberCount(memeg)
.setAvatar(ppuser)
.setBackground(path.join(__dirname, 'media', 'bg_wel.jpg'))
.toAttachment();

let datawel = imageWel.toBuffer();

const memekmu = await notifGroup();
const memekmantan = await notifGroupLeft();
            ImageLeftWel = await getBuffer(ppuser)
            if (anu.action == 'add') {
                if (global.db.data.chats[anu.id].setwelcome) {
                    var get_teks_welcome = await global.db.data.chats[anu.id].setwelcome
                    var replace_pesan = (get_teks_welcome.replace(/@user/gi, `@${num.split('@')[0]}`))
                    var full_pesan = (replace_pesan.replace(/@group/gi, namagc).replace(/@desc/gi, groupDesc))
                    if (global.db.data.chats[anu.id].setintro) {
                        const getText = global.db.data.chats[anu.id].setintro
                       
Izuka.sendMessage(anu.id, {
    image: imageWel.toBuffer(),
    caption: full_pesan,
    mentions: [num],
    footer: groupName,

    interactiveButtons: [
        {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: "< KARTU INTRO >",
                id: "intro_copy",
                copy_code: getText
            })
        }
    ],

    viewOnce: false,
    headerType: 6
},{
                            quoted: fkontaku
                        })
                    } else {
                    Izuka.sendMessage(anu.id, {
    image: imageWel.toBuffer(),
    caption: full_pesan,
    mentions: [num],
    footer: groupName,

    interactiveButtons: [
        {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: "< KARTU INTRO >",
                id: "intro_copy",
                copy_code: `-- About me --
𓂃𓏲࣪  ʚɞ Self Info ♡. 。°˖

┊Name :
┊Age / Grade :
┊Birthday :
┊Height :
┊Status :
┊Race :
┊Zodiac :
┊Sexuality :
┊Random :

𓂃𓏲࣪  ʚɞ Likes And Dislikes ♡. 。°˖

┊Likes :
┊Dislikes :
┊Favourite Colour :
┊Extra :
╰┈┈┈➤ ♡. 。°`
            })
        }
    ],

    viewOnce: false,
    headerType: 6
},{
                            quoted: fkontaku
                        })
                    }
                } else {
                    if (global.db.data.chats[anu.id].setintro) {
                        const getText = global.db.data.chats[anu.id].setintro
                        const uploadFile = {
                            upload: Izuka.waUploadToServer
                        };
                       Izuka.sendMessage(anu.id, {
    image: imageWel.toBuffer(),
    caption: `ʚ ︵‿︵‿︵꒰ welcome ꒱︵‿︵‿︵ ɞ
┊﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍┊
*꒰ ɴᴀᴍᴀ ɢʀᴏᴜᴘ ꒱ ${namagc}*
*꒰ ᴀɴɢɢᴏᴛᴀ ꒱ ${memeg}*
*꒰ ᴛᴀɢ ꒱* @${num.split("@")[0]}
*꒰ ᴡᴀᴋᴛᴜ ꒱ ${xtime} ᴡɪʙ*
﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍
︶︶︶︶︶︶︶︶︶︶︶︶

> *sᴇʟᴀᴍᴀᴛ ᴅᴀᴛᴀɴɢ ᴋᴀᴋ*
> *sᴇᴍᴏɢᴀ ʙᴇᴛᴀʜ ᴅɪɢʀᴏᴜᴘ ɪɴɪ*
> *ᴍᴏʜᴏɴ ᴅɪʙᴀᴄᴀ ᴘᴇʀᴀᴛᴜʀᴀɴ ᴅɪsɪɴɪ*
「 ${global.namabot} あ⁩ 」`,
    mentions: [num],
    footer: groupName,

    interactiveButtons: [
        {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: "< KARTU INTRO >",
                id: "intro_copy",
                copy_code: getText
            })
        }
    ],

    viewOnce: false,
    headerType: 6
},{
                            quoted: fkontaku
                        })
                    } else {
                    Izuka.sendMessage(anu.id, {
    image: imageWel.toBuffer(),
    caption: `ʚ ︵‿︵‿︵꒰ welcome ꒱︵‿︵‿︵ ɞ
┊﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍┊
*꒰ ɴᴀᴍᴀ ɢʀᴏᴜᴘ ꒱ ${namagc}*
*꒰ ᴀɴɢɢᴏᴛᴀ ꒱ ${memeg}*
*꒰ ᴛᴀɢ ꒱* @${num.split("@")[0]}
*꒰ ᴡᴀᴋᴛᴜ ꒱ ${xtime} ᴡɪʙ*
﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍
︶︶︶︶︶︶︶︶︶︶︶︶

> *sᴇʟᴀᴍᴀᴛ ᴅᴀᴛᴀɴɢ ᴋᴀᴋ*
> *sᴇᴍᴏɢᴀ ʙᴇᴛᴀʜ ᴅɪɢʀᴏᴜᴘ ɪɴɪ*
> *ᴍᴏʜᴏɴ ᴅɪʙᴀᴄᴀ ᴘᴇʀᴀᴛᴜʀᴀɴ ᴅɪsɪɴɪ*
「 ${global.namabot} あ⁩ 」`,
    mentions: [num],
    footer: groupName,
    interactiveButtons: [
        {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: "< KARTU INTRO >",
                id: "intro_copy",
                copy_code: `-- About me --
𓂃𓏲࣪  ʚɞ Self Info ♡. 。°˖

┊Name : 
┊Age / Grade : 
┊Birthday : 
┊Height : 
┊Status : 
┊Race : 
┊Zodiac : 
┊Sexuality : 
┊Random : 

𓂃𓏲࣪  ʚɞ Likes And Dislikes ♡. 。°˖

┊Likes : 
┊Dislikes : 
┊Favourite Colour :  
┊Extra : 
╰┈┈┈➤ ♡. 。°`
            })
        }
    ],

    viewOnce: false,
    headerType: 6
},{
                            quoted: fkontaku
                        })
                    }
                }
            }
            if (anu.action == 'remove') {
                if (global.db.data.chats[anu.id].setleft) {
                    var get_teks_left = await global.db.data.chats[anu.id].setleft
                    var replace_pesan = (get_teks_left.replace(/@user/gi, `@${num.split('@')[0]}`))
                    var full_pesan = (replace_pesan.replace(/@group/gi, namagc).replace(/@desc/gi, groupDesc))
                    /*let thumbnail = `https://canvas.denayrestapi.xyz/api/v1/welcome/5?background=https://files.catbox.moe/e2wdib.jpg&profile=${ppuser}&name=${num.split("@")[0]}&group=${namagc}&welcomeText=GoodBye`*/
                    Izuka.sendMessage(anu.id, {
                        image: imageLeft.toBuffer(),
                        caption: full_pesan,
                        footer: global.footer,
                        

                        interactiveButtons: [{
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "GoodBye :)",
                                id: "!" // payload yang diterima bot
                            })
                        }],

                        contextInfo: {
                        mentionedJid: [num],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: global.idsaluran,
                                newsletterName: `${global.namabot} • Follow Our Channel`,
                                serverMessageId: -1
                            }
                        },

                        viewOnce: false,
                        headerType: 6
                    }, {
                        quoted: fkontaku
                    })
                } else {
                    Izuka.sendMessage(anu.id, {
                    image: imageLeft.toBuffer(),
                        caption: `ʚ ︵‿︵‿︵꒰ ɢᴏᴏᴅ ʙʏᴇ ꒱︵‿︵‿︵ ɞ
┊﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍┊
*꒰ ɴᴀᴍᴇ ɢʀᴏᴜᴘ ꒱ ${namagc}*
*꒰ sɪsᴀ ᴀɴɢɢᴏᴛᴀ ꒱ ${memeg}*
*꒰ ᴛᴀɢ ꒱* @${num.split("@")[0]}
*꒰ ᴋᴇʟᴜᴀʀ ᴘᴀᴅᴀ ᴛᴀɴɢɢᴀʟ ꒱ ${xdate}*
*꒰ ᴡᴀᴋᴛᴜ ꒱ ${xtime} WIB*
﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍﹍
︶︶︶︶︶︶︶︶︶︶︶︶

> *Selamat tinggal kak*
> *Semoga tenang dialam sana*
> *Jika kembali mohon membawa gorengan:D*
「 ${global.namabot} あ⁩ 」`,
                        footer: global.footer,
                        
                        interactiveButtons: [{
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "GoodBye :)",
                                id: "!" // payload yang diterima bot
                            })
                        }],

                        contextInfo: {
                        mentionedJid: [num],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: global.idsaluran,
                                newsletterName: `${global.namabot} • Follow Our Channel`,
                                serverMessageId: -1
                            }
                        },

                        viewOnce: false,
                        headerType: 6
                    }, {
                        quoted: fkontaku
                    })
                }
            }
            if (anu.action == "promote") {
                Izuka.sendMessage(anu.id, {
                    text: `@${anu.author.split("@")[0]} has made @${num.split("@")[0]} as admin of this group`,
                    contextInfo: {
                        mentionedJid: [...tag],
                        externalAdReply: {
                            thumbnail: memekmu,
                            title: '© Promote Message',
                            body: '',
                            renderLargerThumbnail: true,
                            sourceUrl: global.linkch,
                            mediaType: 1
                        }
                    }
                })
            }
            if (anu.action == "demote") {
                Izuka.sendMessage(anu.id, {
                    text: `@${anu.author.split("@")[0]} has removed @${num.split("@")[0]} as admin of this group`,
                    contextInfo: {
                        mentionedJid: [...tag],
                        externalAdReply: {
                            thumbnail: memekmantan,
                            title: '© Demote Message',
                            body: '',
                            renderLargerThumbnail: true,
                            sourceUrl: global.linkch,
                            mediaType: 1
                        }
                    }
                })
            }
        }
    } catch (err) {
        console.log(err)
    }
}




let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})