/*
BY XRIZAL
*/

console.clear();
console.log("starting...");
require("./settings");
process.on("uncaughtException", console.error);

const {
    default: makeWASocket,
    prepareWAMessageMedia,
    removeAuthState,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateWAMessageFromContent,
    generateWAMessageContent,
    generateWAMessage,
    jidDecode,
    proto,
    delay,
    relayWAMessage,
    getContentType,
    generateMessageTag,
    getAggregateVotesInPollMessage,
    downloadContentFromMessage,
    fetchLatestWaWebVersion,
    InteractiveMessage,
    makeCacheableSignalKeyStore,
    Browsers,
    generateForwardMessageContent,
    MessageRetryMap,
} = require("@whiskeysockets/baileys");

const chalk = require("chalk");
const cfont = require("cfonts");
const pino = require("pino");
const FileType = require("file-type");
const readline = require("readline");
const axios = require("axios");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const cron = require("node-cron");
const qrcode = require("qrcode-terminal");
const pairingCode = process.argv.includes("-pairing");
const PhoneNumber = require("awesome-phonenumber");
const util = require("util");
const {
    spawn,
    exec,
    execSync
} = require("child_process");
const {
    Boom
} = require("@hapi/boom");
const {
    color
} = require("./lib/color");

const {
    smsg,
    sleep,
    getBuffer
} = require("./lib/myfunction");
const { restoreAllJadiBots } = require('./lib/jadibot')

async function checkAccess(num) {
    try {
        console.log(chalk.blueBright(`[ ACCESS ] Mengecek akses: ${num}`));
        const res = await axios.get("https://api.denayrestapi.xyz/api/v1/tools/addaccessbot", {
            params: {
                mode: "check",
                num,
                apikey: "dra_e461420817a040693d299a79c252cdb3fd92895101137ec16e3a342697761853"
            },
            timeout: 8000,
        });
        console.log(chalk.greenBright(`[ ACCESS ] Status: ${res.status}`));
        if (res.status === 200 && res.data?.registered === true) {
            console.log(chalk.greenBright(`[ ACCESS ] DIIZINKAN: ${num}`));
            return {
                allowed: true,
                body: res.data
            };
        }
        console.log(chalk.redBright(`[ ACCESS ] DITOLAK: ${num}`));
        return {
            allowed: false,
            body: res.data
        };
    } catch (err) {
        const status = err?.response?.status;
        if (status === 409) {
            console.log(chalk.greenBright(`[ ACCESS ] DIIZINKAN (409): ${num}`));
            return {
                allowed: true,
                body: err.response?.data
            };
        }
        console.log(chalk.redBright(`[ ACCESS ] ERROR: ${err.message}`));
        if (err?.response?.data) console.log(chalk.yellowBright(err.response.data));
        return {
            allowed: false,
            error: err
        };
    }
}

const {
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid,
    addExif,
    initializeCore,
} = require("./lib/exif");

function createTmpFolder() {
    const folderName = "tmp";
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
        console.log(chalk.blue.bold(`Folder '${folderName}' berhasil dibuat.`))
    } else {
        //console.log(chalk.blue(`Folder '${folderName}' sudah ada.`))
    }
}
createTmpFolder();
// DATABASE
global.db = JSON.parse(fs.readFileSync("./lib/database/database.json"));
if (global.db)
    global.db.data = {
        sticker: {},
        database: {},
        game: {},
        others: {},
        users: {},
        chats: {},
        rpg: {},
        settings: {},
        anonymous: {},
        ...(global.db.data || {}),
    };
const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(text, resolve);
    });
};

let isReconnecting = false
async function StartTheBots() {
    const usePairingcod = true;
    console.log(
        chalk.magenta.bold(`
╭────────────────────────────────────╮
│ ALYA BOTZ MULTI DEVICE
│ ─────────────────────────────────
│ CREATOR : XRizal (Izuka Dev)
╰────────────────────────────────────╯
`)
    );
    const store = {
    contacts: {},
    loadMessage: async () => undefined,
    bind: () => {}
};
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState("session");
    let version = [2, 3000, 1033916097];

    const Izuka = await makeWASocket({
        printQRInTerminal: false,
        logger: pino({
            level: "silent"
        }),
        auth: state,
        browser: ["Ubuntu", "Chrome", "22.04.2"],
        generateHighQualityLinkPreview: true,
        version,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(
                    key.remoteJid,
                    key.id,
                    undefined
                );
                return msg?.message || undefined;
            }
            return {
                conversation: "WhatsApp Bot By XRizal",
            };
        },
    });
    cfont.say("</> ALYA BOTZ </>", {
        font: "chrome",
        align: "left",
        colors: ["red", "green"],
        background: "blue",
        letterSpacing: 1,
        lineHeight: 1,
        space: false,
        maxLength: "20",
    });
    const darkGreen2 = chalk.hex("#0B7A0B")
    const greenBold2 = chalk.hex("#0B7A0B").bold
    const whit = chalk.white.bold
    const soft = chalk.hex("#145A14")

    console.log("\n")
    console.log(greenBold2("🍃 CONNECTED TO YOUR BOT NUMBER\n"))

    console.log(darkGreen2("Bot Information"))
    console.log(soft(`• Name Bot        : ${whit(global.namabot)}`))
    console.log(soft(`• Creator Script  : ${whit("XRizal")}`))
    console.log(soft(`• Type Bot        : ${whit("Case & Plugin (CJS)")}`))

    console.log("\n" + darkGreen2("Special Thanks"))
    console.log(soft("• Allah SWT"))
    console.log(soft("• Orang Tua"))
    console.log(soft("• Fadil"))
    console.log(soft("• Nex - Core"))
    console.log(soft("• Romzi"))
    console.log(soft("• Ryan"))

    console.log(greenBold2("\nBot is running successfully...\n"));
    const darkGreen = chalk.hex("#0B7A0B") // hijau tua
    const greenBold = chalk.hex("#0B7A0B").bold
    const line = darkGreen("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    if (usePairingcod && !Izuka.authState.creds.registered) {
        console.clear()

        console.log(greenBold(`
╔══════════════════════════════════════════════╗
║              IZUKA BOT PAIRING               ║
╚══════════════════════════════════════════════╝
`))

        const phoneNumber = await question(
            greenBold("📱 Masukkan Nomor WhatsApp (628xxx / 08xxx): ")
        )

        // normalisasi ke angka saja + format 62
        let num = String(phoneNumber || "").replace(/\D+/g, "")
        if (num.startsWith("0")) num = "62" + num.slice(1)
        if (num.startsWith("8")) num = "62" + num

/*        console.log("\n" + line)
        console.log(darkGreen(`🛡️  [ ACCESS ] Mengecek akses: ${chalk.white.bold(num)}`))
        console.log(line)

        const access = await checkAccess(num)

        if (!access?.allowed) {
            console.log(chalk.redBright(`\n❌ [ ACCESS ] DITOLAK → ${num}\n`))
            process.exit(1)
        }

        console.log(greenBold(`\n✅ [ ACCESS ] DIIZINKAN → ${num}\n`))*/

        // ✅ PENTING: pastikan num yang dikirim (bukan string mentah input)
        const code = await Izuka.requestPairingCode(num, global.pairing)

        console.log(greenBold(`
╭──────────────────────────────────────────────╮
│              ✅ PAIRING CODE READY           │
├──────────────────────────────────────────────┤
│ STATUS CONNECTION : ${chalk.white.bold("CONNECTED")}
│ BAILEYS VERSION   : ${chalk.white.bold(`v${version.join(".")}`)}
│ PAIRING CODE      : ${chalk.white.bold(code)}
├──────────────────────────────────────────────┤
│ Cara pakai:
│ WhatsApp → Setelan → Perangkat tertaut → Tautkan perangkat
╰──────────────────────────────────────────────╯
`))
    }
    const processed = new Set();

function unwrapMessage(mek) {
  let msg = mek?.message;
  if (!msg) return null;

  if (msg.ephemeralMessage?.message) msg = msg.ephemeralMessage.message;
  if (msg.viewOnceMessage?.message) msg = msg.viewOnceMessage.message;
  if (msg.viewOnceMessageV2?.message) msg = msg.viewOnceMessageV2.message;
  if (msg.viewOnceMessageV2Extension?.message) msg = msg.viewOnceMessageV2Extension.message;
  if (msg.documentWithCaptionMessage?.message) msg = msg.documentWithCaptionMessage.message;

  return msg;
}

function isSystemMessage(msgObj) {
  if (!msgObj) return true;
  const k = Object.keys(msgObj)[0];
  // pesan sistem yang sering “nyusup” sebelum pesan user
  return (
    k === "senderKeyDistributionMessage" ||
    k === "protocolMessage" ||
    k === "messageContextInfo"
  );
}

// pastiin ini ada di atas (global / luar event)
Izuka.ev.on("messages.upsert", async (chatUpdate) => {
  try {
    // 1) only notify
    if (chatUpdate.type !== "notify") return

    // 2) validasi messages
    if (!chatUpdate.messages || !chatUpdate.messages[0]) return
    let mek = chatUpdate.messages[0]

    // 3) abaikan status
    if (mek.key?.remoteJid === "status@broadcast") return

 // 4) abaikan pesan bot sendiri (Loloskan jika itu command self-bot)
    if (mek.key?.fromMe) {
      const prefixes = [".", "!", "#", "/"]; // sesuaikan dengan prefix botmu
      const unwrapM = unwrapMessage(mek);
      const checkText = unwrapM?.conversation || unwrapM?.extendedTextMessage?.text || "";
      const isCommandSelf = prefixes.some((p) => checkText.trim().startsWith(p));
      
      // Jika nomor bot sendiri ngetik command, loloskan ke commands.js. Jika cuma chat biasa, skip.
      if (!isCommandSelf) return;
    }


    // 5) handle ephemeral
    if (!mek.message) return
    mek.message =
      Object.keys(mek.message)[0] === "ephemeralMessage"
        ? mek.message.ephemeralMessage.message
        : mek.message

    // 6) filter pesan sistem Baileys (kadang spam)
    const rawId = mek.key?.id
    if (!rawId) return
    if (rawId.startsWith("BAE5") || rawId.startsWith("3EB0")) return

    // =========================
    // ✅ DETEKSI PESAN EDIT
    // =========================
    let isEdited = false
    let editedText = null

    const pm = mek.message?.protocolMessage
    if (pm?.editedMessage?.message) {
      isEdited = true

      const emsg = pm.editedMessage.message
      editedText =
        emsg?.conversation ||
        emsg?.extendedTextMessage?.text ||
        emsg?.imageMessage?.caption ||
        emsg?.videoMessage?.caption ||
        null
    }

    // ✅ kalau pesan edit tapi hasil edit bukan command => skip
    // (biar gak kejadian ".ping" diedit jadi "P" terus bot jawab ngawur)
    const prefixes = [".", "!", "#", "/"] // sesuaikan sama prefix botmu
    if (isEdited) {
      const t = String(editedText || "").trim()
      const isCommandEdit = prefixes.some((p) => t.startsWith(p))
      if (!isCommandEdit) return
    }

    // =========================
    // ✅ ANTI DUPLICATE
    // =========================
    // edit harus bisa diproses walau message id sama, jadi bedain id
    let msgId = rawId
    if (isEdited) msgId = msgId + "_edit"

    if (processed.has(msgId)) return
    processed.add(msgId)
    setTimeout(() => processed.delete(msgId), 60 * 1000)

    // =========================
    // ✅ BUILD MESSAGE OBJECT
    // =========================
    const m = smsg(Izuka, mek, store)

    // Kalau ini pesan edit, paksa text m.text jadi hasil edit
    // biar command parser kamu kebaca dari text baru
    if (isEdited && editedText) {
      m.text = editedText
      m.body = editedText
      // beberapa base memakai "budy" dari m.text/m.body, ini bantu kompatibel
    }

    // =========================
    // ✅ RUN COMMANDS
    // =========================
    require("./commands")(Izuka, m, chatUpdate, mek, store)
  } catch (err) {
    console.log("Error messages.upsert:", err)
  }
})

    Izuka.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return (
                (decode.user &&
                    decode.server &&
                    decode.user + "@" + decode.server) ||
                jid
            );
        } else return jid;
    };
    Izuka.lidToJid = async (chatId, lid) => {
        if (!chatId.endsWith("@g.us")) return null;
        if (!lid.endsWith("@lid")) lid = lid + "@lid";
        let users = await Izuka.groupMetadata(chatId);
        let peserta = users.participants.find((p) => p.lid === lid);
        return peserta ? peserta.jid : null;
    };
    Izuka.ev.on("contacts.update", (update) => {
        for (let contact of update) {
            let id = Izuka.decodeJid(contact.id);
            if (store && store.contacts)
                store.contacts[id] = {
                    id,
                    name: contact.notify,
                };
        }
    });

    Izuka.public = global.status;

    Izuka.ev.on("connection.update", async (update) => {
        const {
            connection,
            lastDisconnect
        } = update
        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode

            console.log(chalk.red("❌ Connection closed. Reason:", reason))

            if (reason === DisconnectReason.badSession) {
                console.log("Bad Session File, delete session & scan ulang")
                process.exit(1)

            } else if (reason === DisconnectReason.loggedOut) {
                console.log("Device logged out, delete session & scan ulang")
                process.exit(1)

            } else {
                if (!isReconnecting) {
                    isReconnecting = true
                    console.log(chalk.yellow("🔄 Reconnecting..."))
                    setTimeout(() => {
                        isReconnecting = false
                        StartTheBots()
                    }, 3000)
                }
            }
        }
        if (connection === "open") {
            const C = {
  g: chalk.hex("#22c55e"),        // green
  g2: chalk.hex("#16a34a"),       // darker green
  c: chalk.hex("#06b6d4"),        // cyan
  y: chalk.hex("#facc15"),        // yellow
  w: chalk.white,
  dim: chalk.gray
};

const line = C.g2("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

console.log("\n" + line);
console.log(
  C.g.bold("🍁 BOT CONNECTED ") +
  C.dim("• ") +
  C.c.bold(new Date().toLocaleString("id-ID"))
);
console.log(line);

console.log(
  `${C.c("🤖 Name Bot   :")} ${C.w.bold(global.namabot)}\n` +
  `${C.c("👑 Creator    :")} ${C.w.bold("XRizal")}\n` +
  `${C.c("🧩 Type       :")} ${C.w.bold("Case & Plugin (CJS)")}\n` +
  `${C.c("✅ Status     :")} ${C.g.bold("ONLINE")}`
);

console.log(line + "\n");
setTimeout(() => {
        restoreAllJadiBots(Izuka).catch(console.error)
    }, 5000) // delay 5 detik biar bot utama stabil dulu
        }
    })

    Izuka.ev.on("group-participants.update", async (anu) => {
        const {
            welcome
        } = require("./lib/welcome");
        welcome(Izuka, anu);
    });

    Izuka.ev.on("call", async (call) => {
        let botNumber = await Izuka.decodeJid(Izuka.user.id);
        let settingsdb = global.db.data.settings;
        if (settingsdb[botNumber].anticall) {
            for (let id of call) {
                if (id.status === "offer") {
                    let msg = await Izuka.sendMessage(id.from, {
                        text: `Maaf ya, kami nggak bisa menerima panggilan *${
                            id.isVideo ? "video" : "suara"
                        }* saat ini. 🙏\nKalau @${
                            id.from.split("@")[0]
                        } butuh bantuan, langsung hubungi owner aja ya! 😊`,
                        mentions: [id.from],
                    });
                    await Izuka.sendContact(id.from, global.owner, msg);
                    await Izuka.rejectCall(id.id, id.from).then(async () => {
                        await Izuka.updateBlockStatus(id.id, "block");
                    })
                }
            }
        }
    });

    Izuka.sendContact = async (jid, kon, quoted = "", opts = {}) => {
        let list = [];
        for (let i of kon) {
            list.push({
                displayName: await Izuka.getName(i + "@s.whatsapp.net"),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await Izuka.getName(
                    i + "@s.whatsapp.net"
                )}\nFN:${await Izuka.getName(
                    i + "@s.whatsapp.net"
                )}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:rizal34@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://bit.ly/420u6GX\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
            });
        }
        Izuka.sendMessage(
            jid, {
                contacts: {
                    displayName: `${list.length} Kontak`,
                    contacts: list,
                },
                ...opts,
            }, {
                quoted,
            }
        );
    };
    Izuka.deleteMessage = async (chatId, key) => {
        try {
            await Izuka.sendMessage(chatId, {
                delete: key
            });
            console.log(`Pesan dihapus: ${key.id}`);
        } catch (error) {
            console.error("Gagal menghapus pesan:", error);
        }
    };
    /**
     * By XRizal Gans
     * Izuka.parseMention()
     * Mengambil semua @tag (berbentuk @628xx atau @username) dari text
     */

    Izuka.parseMention = function(text = "") {
        try {
            if (typeof text !== "string") text = String(text);

            // Cari pola @xxxx yang berisi angka atau huruf/underscore
            const regex = /@([0-9A-Za-z_]+)/g;
            const results = [];
            let match;

            while ((match = regex.exec(text))) {
                // Hasil dikeluarkan dalam format JID WA
                // Jika angka → anggap nomor WA
                if (/^\d+$/.test(match[1])) {
                    results.push(match[1] + "@s.whatsapp.net");
                } else {
                    // Jika bukan angka → anggap username WA lama (rare)
                    results.push(match[1] + "@s.whatsapp.net");
                }
            }

            return results;
        } catch (e) {
            console.error("Error in Izuka.parseMention:", e);
            return [];
        }
    };
    Izuka.sendText = async (jid, text, quoted = "", options) => {
        Izuka.sendMessage(
            jid, {
                text: text,
                ...options,
            }, {
                quoted
            }
        );
    };
    Izuka.sendInteractive = async (chat, opt = {}, quoted = {}) => {
        try {
            const uploadFile = {
                upload: Izuka.waUploadToServer
            };

            // kalau ada fake pdf
            let docMsg, imgMsg, vidMsg;
            // Fake document
            if (opt.document) {
                docMsg = await prepareWAMessageMedia({
                        document: opt.document,
                        mimetype: opt.mimetype || "application/pdf",
                        fileLength: opt.fileLength || null,
                        pageCount: opt.pageCount || null,
                        fileName: opt.fileName || "Fake.pdf",
                        jpegThumbnail: opt.jpegThumbnail || null,
                    },
                    uploadFile
                );
            }

            // Image
            if (opt.image) {
                imgMsg = await prepareWAMessageMedia({
                        image: opt.image,
                    },
                    uploadFile
                );
            }

            // Video / GIF
            if (opt.video) {
                vidMsg = await prepareWAMessageMedia({
                        video: opt.video,
                        gifPlayback: opt.gifPlayback ? true : false,
                    },
                    uploadFile
                );
            }

            let msg = generateWAMessageFromContent(
                chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2,
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                contextInfo: opt.contextInfo,
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: opt.text
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: opt.footer || null
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: opt.title || null,
                                    subtitle: opt.subtitle || null,
                                    documentMessage: docMsg ?
                                        docMsg.documentMessage : null,
                                    imageMessage: imgMsg ?
                                        imgMsg.imageMessage : null,
                                    videoMessage: vidMsg ?
                                        vidMsg.videoMessage : null,
                                    hasMediaAttachment: !!(
                                        docMsg ||
                                        imgMsg ||
                                        vidMsg
                                    ),
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: opt.buttons || null,
                                    messageParamsJson: opt.messageParamsJson || null,
                                }),
                            }),
                        },
                    },
                }, {
                    ...quoted
                }
            );

            await Izuka.relayMessage(msg.key.remoteJid, msg.message, {
                messageId: msg.key.id,
            });
            return msg;
        } catch (e) {
            throw e;
        }
    };
    Izuka.ments = (teks = "") => {
        return teks.match("@") ? [...teks.matchAll(/@([0-9]{5,16}|0)/g)].map(
            (v) => v[1] + "@s.whatsapp.net"
        ) : [];
    };
    Izuka.getName = (jid, withoutContact = false) => {
        id = Izuka.decodeJid(jid);
        withoutContact = Izuka.withoutContact || withoutContact;
        let v;
        if (id.endsWith("@g.us"))
            return new Promise(async (resolve) => {
                v = store.contacts[id] || {};
                if (!(v.name || v.subject)) v = Izuka.groupMetadata(id) || {};
                resolve(
                    v.name ||
                    v.subject ||
                    PhoneNumber(
                        "+" + id.replace("@s.whatsapp.net", "")
                    ).getNumber("international")
                );
            });
        else
            v =
            id === "0@s.whatsapp.net" ? {
                id,
                name: "WhatsApp",
            } :
            id === Izuka.decodeJid(Izuka.user.id) ?
            Izuka.user :
            store.contacts[id] || {};
        return (
            (withoutContact ? "" : v.name) ||
            v.subject ||
            v.verifiedName ||
            PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
                "international"
            )
        );
    };
    Izuka.downloadMediaMessage = async (message) => {
        let quoted = message.msg ? message.msg : message;
        let isFile = message.mtype === "viewOnceMessageV2";
        let mime =
            (isFile ? quoted.message[getContentType(quoted.message)] : quoted)
            .mimetype || "";
        let messageType = message.mtype ?
            message.mtype.replace(/Message/gi, "") :
            mime.split("/")[0];
        const stream = await downloadContentFromMessage(
            isFile ? quoted.message[getContentType(quoted.message)] : quoted,
            messageType
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    };
    let fdoc = {
        key: {
            remoteJid: "status@broadcast",
            participant: "0@s.whatsapp.net",
        },
        message: {
            documentMessage: {
                title: "𝐃 𝐀 𝐓 𝐀 𝐁 𝐀 𝐒 𝐄",
            },
        },
    };
    let requestOptions = {
        method: "GET",
        redirect: "follow",
    };
    async function Backup() {
        let database = fs.readFileSync("./lib/database/database.json");
        await Izuka.sendMessage(
            global.owner + "@s.whatsapp.net", {
                text: "*Notification auto backup*"
            }, {
                quoted: fdoc
            }
        );
        Izuka.sendMessage(
            global.owner + "@s.whatsapp.net", {
                document: database,
                mimetype: "application/json",
                fileName: "database.json",
            }, {
                quoted: fdoc
            }
        );
    }

    cron.schedule(
        "0 0 * * *",
        async () => {
            await Backup();
        }, {
            scheduled: true,
            timezone: "Asia/Jakarta"
        }
    );

    Izuka.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ?
            path :
            /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`, ` [1], "base64") :
            /^https?:\/\//.test(path) ?
            await await getBuffer(path) :
            fs.existsSync(path) ?
            fs.readFileSync(path) :
            Buffer.alloc(0);

        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options);
        } else {
            buffer = await addExif(buff);
        }

        await Izuka.sendMessage(
            jid, {
                sticker: {
                    url: buffer
                },
                ...options,
            }, {
                quoted
            }
        );
        return buffer;
    };
    Izuka.downloadAndSaveMediaMessage = async (
        message,
        filename,
        attachExtension = true
    ) => {
        let quoted = message.msg ? message.msg : message;
        let isFile = message.mtype === "viewOnceMessageV2";
        let mime =
            (isFile ? quoted.message[getContentType(quoted.message)] : quoted)
            .mimetype || "";
        let messageType = isFile ?
            getContentType(quoted.message).replace(/Message/gi, "") :
            message.mtype ?
            message.mtype.replace(/Message/gi, "") :
            mime.split("/")[0];
        const stream = await downloadContentFromMessage(
            isFile ? quoted.message[getContentType(quoted.message)] : quoted,
            messageType
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        let type = await FileType.fromBuffer(buffer);
        let trueFileName = attachExtension ?
            "./sticker/" + filename + "." + type.ext :
            "./sticker/" + filename;
        // save to file
        await fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
    };
    Izuka.setStatus = (status) => {
        Izuka.query({
            tag: "iq",
            attrs: {
                to: "@s.whatsapp.net",
                type: "set",
                xmlns: "status",
            },
            content: [{
                tag: "status",
                attrs: {},
                content: Buffer.from(status, "utf-8"),
            }, ],
        });
        return status;
    };
    Izuka.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ?
            path :
            /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`, ` [1], "base64") :
            /^https?:\/\//.test(path) ?
            await await getBuffer(path) :
            fs.existsSync(path) ?
            fs.readFileSync(path) :
            Buffer.alloc(0);

        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options);
        } else {
            buffer = await videoToWebp(buff);
        }

        await Izuka.sendMessage(
            jid, {
                sticker: {
                    url: buffer
                },
                ...options,
            }, {
                quoted
            }
        );
        return buffer;
    };
    Izuka.sendTextWithMentions = async (jid, text, quoted, options = {}) =>
        Izuka.sendMessage(
            jid, {
                text: text,
                mentions: [...text.matchAll(/@(\d{0,16})/g)].map(
                    (v) => v[1] + "@s.whatsapp.net"
                ),
                ...options,
            }, {
                quoted,
            }
        );

    Izuka.albumMessage = async (jid, array, quoted) => {
        const album = generateWAMessageFromContent(
            jid, {
                messageContextInfo: {
                    messageSecret: crypto.randomBytes(32),
                },

                albumMessage: {
                    expectedImageCount: array.filter((a) =>
                        a.hasOwnProperty("image")
                    ).length,
                    expectedVideoCount: array.filter((a) =>
                        a.hasOwnProperty("video")
                    ).length,
                },
            }, {
                userJid: Izuka.user.jid,
                quoted,
                upload: Izuka.waUploadToServer,
            }
        );

        await Izuka.relayMessage(jid, album.message, {
            messageId: album.key.id,
        });

        for (let content of array) {
            const img = await generateWAMessage(jid, content, {
                upload: Izuka.waUploadToServer,
            });

            img.message.messageContextInfo = {
                messageSecret: crypto.randomBytes(32),
                messageAssociation: {
                    associationType: 1,
                    parentMessageKey: album.key,
                },
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast",
                forwardingScore: 99999,
                isForwarded: true,
                mentionedJid: [jid],
                starred: true,
                labels: ["Y", "Important"],
                isHighlighted: true,
                businessMessageForwardInfo: {
                    businessOwnerJid: jid,
                },
                dataSharingContext: {
                    showMmDisclosure: true,
                },
            };

            img.message.forwardedNewsletterMessageInfo = {
                newsletterJid: "0@newsletter",
                serverMessageId: 1,
                newsletterName: `WhatsApp`,
                contentType: 1,
                timestamp: new Date().toISOString(),
                senderName: "✧ Dittsans",
                content: "Text Message",
                priority: "high",
                status: "sent",
            };

            img.message.disappearingMode = {
                initiator: 3,
                trigger: 4,
                initiatorDeviceJid: jid,
                initiatedByExternalService: true,
                initiatedByUserDevice: true,
                initiatedBySystem: true,
                initiatedByServer: true,
                initiatedByAdmin: true,
                initiatedByUser: true,
                initiatedByApp: true,
                initiatedByBot: true,
                initiatedByMe: true,
            };

            await Izuka.relayMessage(jid, img.message, {
                messageId: img.key.id,
                quoted: {
                    key: {
                        remoteJid: album.key.remoteJid,
                        id: album.key.id,
                        fromMe: true,
                        participant: Izuka.user.jid,
                    },
                    message: album.message,
                },
            });
        }
        return album;
    };

    Izuka.getFile = async (PATH, returnAsFilename) => {
        let res, filename;
        const data = Buffer.isBuffer(PATH) ?
            PATH :
            /^data:.*?\/.*?;base64,/i.test(PATH) ?
            Buffer.from(PATH.split`,` [1], "base64") :
            /^https?:\/\//.test(PATH) ?
            await (res = await fetch(PATH)).buffer() :
            fs.existsSync(PATH) ?
            ((filename = PATH), fs.readFileSync(PATH)) :
            typeof PATH === "string" ?
            PATH :
            Buffer.alloc(0);
        if (!Buffer.isBuffer(data))
            throw new TypeError("Result is not a buffer");
        const type = (await FileType.fromBuffer(data)) || {
            mime: "application/octet-stream",
            ext: ".bin",
        };

        if (data && returnAsFilename && !filename)
            (filename = path.join(
                __dirname,
                "./tmp/" + new Date() * 1 + "." + type.ext
            )),
            await fs.promises.writeFile(filename, data);
        return {
            res,
            filename,
            ...type,
            data,
            deleteFile() {
                return filename && fs.promises.unlink(filename);
            },
        };
    };
    /**
 * Copy and Forward Message
 * @param {String} jid - ID Chat/Grup tujuan forward
 * @param {Object} message - Objek pesan asli (m atau res) yang mau di-forward
 * @param {Boolean|Object} forceForward - true jika ingin menyembunyikan tanda forward biasa
 * @param {Object} options - Opsi tambahan dari Baileys (contextInfo, quoted, dll)
 */
Izuka.copyNforward = async (jid, message, forceForward = false, options = {}) => {
    let vtype
    if (options.readViewOnce) {
        message.message = message.message && message.message.viewOnceMessage && message.message.viewOnceMessage.message ? message.message.viewOnceMessage.message : (message.message || undefined)
        vtype = Object.keys(message.message)[0]
        delete message.message[vtype].viewOnce
        message.message = {
            viewOnceMessage: {
                message: message.message
            }
        }
    }

    let mtype = Object.keys(message.message)[0]
    let content = await generateWAMessageFromContent(jid, message.message, { userJid: Izuka.user.id, ...options })
    let ctype = Object.keys(content.message)[0]

    if (forceForward && typeof forceForward === 'boolean') {
        content.message[ctype].contextInfo = {
            ...content.message[ctype].contextInfo,
            forwardingScore: 999,
            isForwarded: true
        }
    }

    // Jika ada options contextInfo tambahan dari parameter (seperti newsletter info bawaan bot lu)
    if (options.contextInfo) {
        content.message[ctype].contextInfo = {
            ...content.message[ctype].contextInfo,
            ...options.contextInfo
        }
    }

    content.key.id = message.key.id
    content.key.remoteJid = jid

    await Izuka.relayMessage(jid, content.message, { messageId: content.key.id, quoted: options.quoted })
    return content
}

    Izuka.sendFile = async (
        jid,
        path,
        filename = "",
        caption = "",
        quoted,
        ptt = false,
        options = {}
    ) => {
        let type = await Izuka.getFile(path, true);
        let {
            res,
            data: file,
            filename: pathFile
        } = type;
        if ((res && res.status !== 200) || file.length <= 65536) {
            try {
                throw {
                    json: JSON.parse(file.toString())
                };
            } catch (e) {
                if (e.json) throw e.json;
            }
        }

        let opt = {
            filename
        };
        if (quoted) opt.quoted = quoted;
        if (!type) options.asDocument = true;
        let mtype = "",
            mimetype = type.mime,
            convert;
        if (
            /webp/.test(type.mime) ||
            (/image/.test(type.mime) && options.asSticker)
        )
            mtype = "sticker";
        else if (
            /image/.test(type.mime) ||
            (/webp/.test(type.mime) && options.asImage)
        )
            mtype = "image";
        else if (/video/.test(type.mime)) mtype = "video";
        else if (/audio/.test(type.mime))
            (convert = await (ptt ? toPTT : toAudio)(file, type.ext)),
            (file = convert.data),
            (pathFile = convert.filename),
            (mtype = "audio"),
            (mimetype = "audio/ogg; codecs=opus");
        else mtype = "document";
        if (options.asDocument) mtype = "document";
        let message = {
            ...options,
            caption,
            ptt,
            [mtype]: {
                url: pathFile
            },
            mimetype,
        };
        let m;
        try {
            m = await Izuka.sendMessage(jid, message, {
                ...opt,
                ...options,
            });
        } catch (e) {
            console.error(e);
            m = null;
        } finally {
            if (!m)
                m = await Izuka.sendMessage(
                    jid, {
                        ...message,
                        [mtype]: file,
                    }, {
                        ...opt,
                        ...options,
                    }
                );
            return m;
        }
    };

    Izuka.sendStatusMention = async (content, jids = []) => {
        let users;
        for (let id of jids) {
            let userId = await Izuka.groupMetadata(id);
            users = await userId.participants.map((u) => Izuka.decodeJid(u.id));
        }

        let message = await Izuka.sendMessage("status@broadcast", content, {
            backgroundColor: "#000000",
            font: Math.floor(Math.random() * 9),
            statusJidList: users,
            additionalNodes: [{
                tag: "meta",
                attrs: {},
                content: [{
                    tag: "mentioned_users",
                    attrs: {},
                    content: jids.map((jid) => ({
                        tag: "to",
                        attrs: {
                            jid
                        },
                        content: undefined,
                    })),
                }, ],
            }, ],
        });

        jids.forEach((id) => {
            Izuka.relayMessage(
                id, {
                    groupStatusMentionMessage: {
                        message: {
                            protocolMessage: {
                                key: message.key,
                                type: 25,
                            },
                        },
                    },
                }, {}
            );
            delay(2500);
        });
        return message;
    };

    Izuka.ev.on("creds.update", saveCreds);
    return Izuka;
}

async function _quickTest() {
    const cmds = [
        ["ffmpeg"],
        ["ffprobe"],
        [
            "ffmpeg",
            [
                "-hide_banner",
                "-loglevel",
                "error",
                "-filter_complex",
                "color",
                "-frames:v",
                "1",
                "-f",
                "webp",
                "-",
            ],
        ],
        ["convert"],
        ["magick"],
        ["gm"],
        ["find", ["--version"]],
    ];

    const test = await Promise.all(
        cmds.map(
            ([cmd, args]) =>
            new Promise((resolve) => {
                const p = spawn(cmd, args || []);
                p.on("close", (code) => resolve(code !== 127));
                p.on("error", () => resolve(false));
            })
        )
    );

    const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;

    let s = (global.support = {
        ffmpeg,
        ffprobe,
        ffmpegWebp,
        convert,
        magick,
        gm,
        find,
    });

    // 🔧 Fallback jika tidak ada convert/magick/gm
    if (!s.convert && !s.magick && !s.gm) {
        console.log(
            "⚠️ Tidak ditemukan ImageMagick / GraphicsMagick di sistem, aktifkan fallback."
        );
        s.magick = true;
    }

    Object.freeze(global.support);
    console.log("🔍 Hasil deteksi support:", s);
}

_quickTest()
    .then(() =>
        console.log("☑️ Quick Test Done , nama file session ~> creds.json")
    )
    .catch(console.error);
const code = fs.readFileSync("./commands.js", "utf8");
var regex = /case\s+'([^']+)':/g;
var matches = [];
var match;
while ((match = regex.exec(code))) {
    matches.push(match[1]);
}
global.help = Object.values(matches)
    .flatMap((v) => v ?? [])
    .map((entry) => entry.trim().split(" ")[0].toLowerCase())
    .filter(Boolean);
global.handlers = [];
const handlersDir = path.join(__dirname, "plugins");
console.log(chalk.white.bold("Memuat plugin..."));
fs.readdirSync(handlersDir).forEach((file) => {
    const filePath = path.join(handlersDir, file);
    if (fs.statSync(filePath).isFile() && file.endsWith(".js")) {
        const handler = require(filePath);
        global.handlers.push(handler);
        global.help.push(...handler.command);
        console.log(chalk.green(filePath));
    }
});

StartTheBots();

let file = require.resolve(__filename);
require("fs").watchFile(file, () => {
    require("fs").unwatchFile(file);
    console.log("\x1b[0;32m" + __filename + " \x1b[1;32mupdated!\x1b[0m");
    delete require.cache[file];
    require(file);
});