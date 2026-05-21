const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    makeInMemoryStore
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const fs = require("fs")
const path = require("path")
const { Boom } = require("@hapi/boom")
const { patchClone } = require("./patchClone")

global.cloneBots = global.cloneBots || new Map()
global.cloneBotTimers = global.cloneBotTimers || new Map()

function normalNumber(num) {
    num = String(num || "").replace(/\D/g, "")
    if (num.startsWith("0")) num = "62" + num.slice(1)
    if (num.startsWith("8")) num = "62" + num
    return num
}

function ensureJadiBotDb() {
    global.db.data.jadibot = global.db.data.jadibot || {
        open: true,
        users: {},
        pending: {}
    }
    global.db.data.jadibot.users = global.db.data.jadibot.users || {}
    global.db.data.jadibot.pending = global.db.data.jadibot.pending || {}
}

async function startJadiBot(Izuka, m, data) {
    ensureJadiBotDb()

    const num = normalNumber(data.number)
    const days = Number(data.days) || 1
    const expired = data.expired || (Date.now() + days * 86400000)

    if (!num || num.length < 10) {
        if (m) return m.reply("❌ Nomor tidak valid.")
        return false
    }

    if (global.cloneBotTimers.has(num)) {
        clearTimeout(global.cloneBotTimers.get(num))
        global.cloneBotTimers.delete(num)
    }

    if (global.cloneBots.has(num)) {
        const oldClone = global.cloneBots.get(num)
        try {
            oldClone.ev.removeAllListeners()
            await oldClone.ws?.close?.()
        } catch (_) {}
        global.cloneBots.delete(num)
    }

    const sessionDir = path.join(__dirname, "../jadibot_sessions", num)

    if (data.resetSession === true && fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true })
    }

    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true })
    }

    const store = makeInMemoryStore({
        logger: pino().child({ level: "silent", stream: "store" })
    })

    const { state, saveCreds: _saveCreds } = await useMultiFileAuthState(sessionDir)

    // Wrap saveCreds agar tidak crash kalau folder hilang
    const saveCreds = async () => {
        try {
            if (!fs.existsSync(sessionDir)) {
                fs.mkdirSync(sessionDir, { recursive: true })
            }
            await _saveCreds()
        } catch (e) {
            console.log(`[ JADIBOT ] saveCreds error ${num}:`, e.message)
        }
    }

    let version = [2, 3000, 1033916097]

    const clone = makeWASocket({
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ["Ubuntu", "Chrome", "22.04.2"],
        generateHighQualityLinkPreview: true,
        version,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
                return msg?.message || undefined
            }
            return { conversation: "WhatsApp Bot By XRizal" }
        }
    })

    store.bind(clone.ev)
    clone.ev.on("creds.update", saveCreds)

    // Simpan store di clone agar getName bisa akses contacts
    clone.store = store

    // ✅ Patch semua method custom agar command bisa jalan di clone
    patchClone(clone)

    global.db.data.jadibot.users[num] = {
        number: num,
        user: data.user,
        days,
        price: data.price || 0,
        trxId: data.trxId || `MANUAL-${Date.now()}`,
        active: false, // jadi true saat connection open
        createdAt: Date.now(),
        expired
    }

    global.cloneBots.set(num, clone)

    let alreadyOpenNotified = false
    let isStopping = false
    let reconnectCount = 0
    const MAX_RECONNECT = 5

    clone.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "open") {
            reconnectCount = 0
            isStopping = false

            if (global.db.data.jadibot.users[num]) {
                global.db.data.jadibot.users[num].active = true
            }

            if (!alreadyOpenNotified) {
                alreadyOpenNotified = true
                await Izuka.sendMessage(data.user, {
                    text: `✅ Jadi bot berhasil aktif.\n\nNomor : ${num}\nDurasi : ${days} hari\nExpired : ${new Date(expired).toLocaleString("id-ID")}`
                }).catch(() => {})
            }
        }

        if (connection === "close") {
            const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode
            console.log(`[ JADIBOT ] ${num} disconnected. Code: ${statusCode}`)

            if (isStopping) return

            if (statusCode === DisconnectReason.loggedOut) {
                isStopping = true
                global.cloneBots.delete(num)

                if (global.db.data.jadibot.users[num]) {
                    global.db.data.jadibot.users[num].active = false
                }

                if (fs.existsSync(sessionDir)) {
                    fs.rmSync(sessionDir, { recursive: true, force: true })
                }

                await Izuka.sendMessage(data.user, {
                    text: `⚠️ Jadi bot nomor *${num}* terputus karena logout.\nSilakan aktifkan ulang.`
                }).catch(() => {})

            } else if (
                statusCode === DisconnectReason.restartRequired ||
                statusCode === DisconnectReason.connectionReplaced ||
                statusCode === 408 ||
                statusCode === 503
            ) {
                reconnectCount++

                if (reconnectCount > MAX_RECONNECT) {
                    console.log(`[ JADIBOT ] ${num} max reconnect reached. Stopping.`)
                    isStopping = true
                    await stopJadiBot(num, Izuka, "reconnect_failed")
                    await Izuka.sendMessage(data.user, {
                        text: `❌ Jadi bot nomor *${num}* gagal terhubung setelah ${MAX_RECONNECT}x percobaan.\n\nSilakan coba lagi dengan reset session.`
                    }).catch(() => {})
                    return
                }

                const delay = Math.min(5000 * reconnectCount, 30000)
                console.log(`[ JADIBOT ] ${num} reconnect dalam ${delay}ms... (${reconnectCount}/${MAX_RECONNECT})`)

                setTimeout(async () => {
                    if (isStopping) return
                    if (!global.cloneBots.has(num)) return
                    alreadyOpenNotified = false
                    await startJadiBot(Izuka, m, { ...data, resetSession: false })
                }, delay)

            } else {
                isStopping = true
                if (global.db.data.jadibot.users[num]) {
                    global.db.data.jadibot.users[num].active = false
                }
                global.cloneBots.delete(num)
            }
        }
    })

    // Request pairing code jika belum terdaftar
    if (!clone.authState.creds.registered) {
        await new Promise(resolve => setTimeout(resolve, 3000))

        let code = null
        for (let i = 0; i < 5; i++) {
            try {
                code = await clone.requestPairingCode(num)
                break
            } catch (e) {
                console.log(`[ JADIBOT ] Pairing retry ${i + 1}/5:`, e?.message)
                await new Promise(resolve => setTimeout(resolve, 3000))
            }
        }

        if (!code) {
            isStopping = true
            clone.ev.removeAllListeners()
            try { await clone.ws?.close?.() } catch (_) {}
            global.cloneBots.delete(num)

            if (m) {
                await Izuka.sendMessage(m.chat, {
                    text: `❌ Gagal membuat pairing code.\n\nSilakan coba lagi beberapa detik.\nJika masih gagal, gunakan reset session lalu coba ulang.`
                }, { quoted: m }).catch(() => {})
            }
            return false
        }

        await Izuka.sendMessage(
            data.user,
            {
                text: `╭─「 JADI BOT 」\n│\n│ Nomor  : ${num}\n│ Durasi : ${days} hari\n│ Status : Menunggu pairing\n│\n│ Pairing Code:\n│ ${code}\n│\n│ Buka WhatsApp:\n│ Perangkat Tertaut > Tautkan Perangkat\n╰────────────`,
                footer: global.namaStore || global.namabot,
                buttons: [
                    {
                        buttonId: "copy_pairing",
                        buttonText: { displayText: "📋 Copy Pairing Code" },
                        type: 4,
                        nativeFlowInfo: {
                            name: "cta_copy",
                            paramsJson: JSON.stringify({
                                display_text: "Copy Pairing Code",
                                id: "copy_pairing",
                                copy_code: code
                            })
                        }
                    }
                ]
            },
            { quoted: m }
        )
    }

    clone.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            const latest = global.db.data.jadibot?.users?.[num]
            if (!latest || !latest.active) return

            if (Date.now() >= latest.expired) {
                await stopJadiBot(num, Izuka, "expired")
                return
            }

            if (chatUpdate.type !== "notify") return

            const mek = chatUpdate.messages?.[0]
            if (!mek?.message) return
            if (mek.key?.fromMe) return
            if (mek.key?.remoteJid === "status@broadcast") return

            if (Object.keys(mek.message)[0] === "ephemeralMessage") {
                mek.message = mek.message.ephemeralMessage.message
            }

            const rawId = mek.key?.id
            if (!rawId) return
            if (rawId.startsWith("BAE5") || rawId.startsWith("3EB0")) return

            const { smsg } = require("./myfunction")

            // Pastikan clone sudah ter-patch sebelum dipakai
            patchClone(clone)

            const cm = smsg(clone, mek, store)

            require("../commands")(clone, cm, chatUpdate, mek, store)
        } catch (e) {
            console.log("Clone bot error:", e)
        }
    })

    const delayExpired = expired - Date.now()

    if (delayExpired > 1000) {
        const timer = setTimeout(async () => {
            const latest = global.db.data.jadibot?.users?.[num]
            if (!latest || !latest.active) return
            if (Date.now() < latest.expired) return
            await stopJadiBot(num, Izuka, "expired")
        }, delayExpired)

        global.cloneBotTimers.set(num, timer)
    } else {
        await stopJadiBot(num, Izuka, "expired")
    }

    return clone
}


async function stopJadiBot(number, Izuka = null, reason = "manual") {
    ensureJadiBotDb()

    const num = normalNumber(number)
    const data = global.db.data.jadibot?.users?.[num]
    const sessionDir = path.join(__dirname, "../jadibot_sessions", num)

    if (global.cloneBotTimers.has(num)) {
        clearTimeout(global.cloneBotTimers.get(num))
        global.cloneBotTimers.delete(num)
    }

    if (global.cloneBots.has(num)) {
        const clone = global.cloneBots.get(num)
        try {
            clone.ev.removeAllListeners()
            await clone.logout().catch(() => {})
        } catch (_) {}
        global.cloneBots.delete(num)
    }

    if (data) {
        data.active = false

        if (Izuka && data.user && reason === "expired") {
            await Izuka.sendMessage(data.user, {
                text: `
𖥔 𝗝𝗮𝗱𝗶 𝗕𝗼𝘁 𝗘𝘅𝗽𝗶𝗿𝗲𝗱 𖥔

꒰ 📱 ꒱ 𝗡𝗼𝗺𝗼𝗿
⤷ ${data.number}

꒰ ⏳ ꒱ 𝗦𝘁𝗮𝘁𝘂𝘀
⤷ Masa aktif sudah habis

꒰ 📅 ꒱ 𝗘𝘅𝗽𝗶𝗿𝗲𝗱
⤷ ${new Date(data.expired).toLocaleString("id-ID")}

───────────────

Layanan jadi bot kamu sudah otomatis diputus.
Silakan order kembali jika ingin mengaktifkan lagi.
`.trim()
            }).catch(() => {})
        }

        if (reason === "expired") {
            if (fs.existsSync(sessionDir)) {
                fs.rmSync(sessionDir, { recursive: true, force: true })
            }
        }
    }

    return true
}


async function restoreAllJadiBots(Izuka) {
    ensureJadiBotDb()
    const users = global.db.data.jadibot?.users || {}

    for (const num in users) {
        const data = users[num]

        if (!data.active) continue
        if (Date.now() >= data.expired) {
            data.active = false
            continue
        }

        if (global.cloneBots.has(num)) continue

        // Skip kalau session tidak ada
        const sessionDir = path.join(__dirname, "../jadibot_sessions", num)
        if (!fs.existsSync(sessionDir) || !fs.existsSync(`${sessionDir}/creds.json`)) {
            console.log(`[ JADIBOT ] Skip restore ${num}: session tidak ada`)
            data.active = false
            continue
        }

        console.log(`[ JADIBOT ] Restoring clone: ${num}`)

        try {
            await startJadiBot(Izuka, null, {
                number: num,
                days: data.days,
                expired: data.expired,
                user: data.user,
                price: data.price,
                trxId: data.trxId,
                resetSession: false
            })
        } catch (e) {
            console.log(`[ JADIBOT ] Gagal restore ${num}:`, e.message)
        }

        await new Promise(r => setTimeout(r, 3000))
    }
}


module.exports = {
    startJadiBot,
    stopJadiBot,
    restoreAllJadiBots,
    ensureJadiBotDb
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log("\x1b[0;32m" + __filename + " \x1b[1;32mupdated!\x1b[0m")
    delete require.cache[file]
    require(file)
})
