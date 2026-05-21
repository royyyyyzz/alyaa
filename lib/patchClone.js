/**
 * patchClone.js
 * Patch semua method custom Izuka ke clone bot
 * agar clone bisa pakai sendText, sendInteractive, getName, dll
 */

const {
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    jidDecode,
    proto,
    getContentType,
} = require('@whiskeysockets/baileys')

const fs = require('fs')
const path = require('path')
const FileType = require('file-type')
const axios = require('axios')

function patchClone(clone) {
    if (clone.__patched) return clone
    clone.__patched = true

    // ─── decodeJid ───────────────────────────────────────────
    clone.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return (decode.user && decode.server && decode.user + '@' + decode.server) || jid
        }
        return jid
    }

    // ─── getName ─────────────────────────────────────────────
    clone.getName = (jid, withoutContact = false) => {
        const id = clone.decodeJid(jid)
        const v = clone.store?.contacts?.[id]
        return (
            (!withoutContact ? v?.name || v?.notify : '') ||
            (id?.endsWith('@g.us') ? id : id?.replace('@s.whatsapp.net', '')) ||
            ''
        )
    }

    // ─── ments ───────────────────────────────────────────────
    clone.ments = (teks = '') => {
        return teks.match('@')
            ? [...teks.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
            : []
    }

    // ─── parseMention ─────────────────────────────────────────
    clone.parseMention = (text = '') => {
        try {
            if (typeof text !== 'string') text = String(text)
            const regex = /@([0-9A-Za-z_]+)/g
            const results = []
            let match
            while ((match = regex.exec(text))) {
                results.push(match[1] + '@s.whatsapp.net')
            }
            return results
        } catch (e) {
            return []
        }
    }

    // ─── sendText ────────────────────────────────────────────
    clone.sendText = async (jid, text, quoted = '', options = {}) => {
        return clone.sendMessage(jid, { text, ...options }, { quoted })
    }

    // ─── sendMedia ───────────────────────────────────────────
    clone.sendMedia = async (jid, buffer, type = 'image', caption = '', quoted = '', options = {}) => {
        return clone.sendMessage(jid, { [type]: buffer, caption, ...options }, { quoted })
    }

    // ─── sendInteractive ─────────────────────────────────────
    clone.sendInteractive = async (chat, opt = {}, quoted = {}) => {
        try {
            const uploadFile = { upload: clone.waUploadToServer }

            let docMsg, imgMsg, vidMsg
            if (opt.document) {
                docMsg = await prepareWAMessageMedia(
                    { document: opt.document, mimetype: opt.mimetype || 'application/pdf', fileName: opt.fileName || 'File.pdf' },
                    uploadFile
                )
            }
            if (opt.image) {
                imgMsg = await prepareWAMessageMedia({ image: opt.image }, uploadFile)
            }
            if (opt.video) {
                vidMsg = await prepareWAMessageMedia({ video: opt.video, gifPlayback: !!opt.gifPlayback }, uploadFile)
            }

            let msg = generateWAMessageFromContent(
                chat,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                contextInfo: opt.contextInfo,
                                body: proto.Message.InteractiveMessage.Body.create({ text: opt.text }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: opt.footer || null }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: opt.title || null,
                                    subtitle: opt.subtitle || null,
                                    documentMessage: docMsg?.documentMessage || null,
                                    imageMessage: imgMsg?.imageMessage || null,
                                    videoMessage: vidMsg?.videoMessage || null,
                                    hasMediaAttachment: !!(docMsg || imgMsg || vidMsg),
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: opt.buttons || null,
                                    messageParamsJson: opt.messageParamsJson || null,
                                }),
                            }),
                        },
                    },
                },
                { ...quoted }
            )

            await clone.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })
            return msg
        } catch (e) {
            throw e
        }
    }

    // ─── sendTextWithMentions ────────────────────────────────
    clone.sendTextWithMentions = async (jid, text, quoted = '', options = {}) => {
        return clone.sendMessage(
            jid,
            { text, mentions: clone.parseMention(text), ...options },
            { quoted }
        )
    }

    // ─── copyNForward ────────────────────────────────────────
    clone.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vM = message?.fakeObj || message
        let m = generateWAMessageFromContent(
            jid,
            { forward: vM, ...(forceForward ? { contextInfo: { forwardingScore: 9999999, isForwarded: true } } : {}) },
            { ...options }
        )
        await clone.relayMessage(jid, m.message, { messageId: m.key.id })
        return m
    }

    // ─── getFile ─────────────────────────────────────────────
    clone.getFile = async (PATH, returnAsFilename) => {
        let res, filename
        const data = Buffer.isBuffer(PATH)
            ? PATH
            : /^data:.*?\/.*?;base64,/i.test(PATH)
            ? Buffer.from(PATH.split(',')[1], 'base64')
            : /^https?:\/\//.test(PATH)
            ? await (res = await fetch(PATH)).buffer()
            : fs.existsSync(PATH)
            ? ((filename = PATH), fs.readFileSync(PATH))
            : typeof PATH === 'string'
            ? PATH
            : Buffer.alloc(0)

        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        const type = (await FileType.fromBuffer(data)) || { mime: 'application/octet-stream', ext: '.bin' }

        if (data && returnAsFilename && !filename) {
            filename = path.join(process.cwd(), './tmp/' + Date.now() + '.' + type.ext)
            await fs.promises.writeFile(filename, data)
        }
        return { res, filename, ...type, data, deleteFile() { return filename && fs.promises.unlink(filename) } }
    }

    // ─── sendFile ────────────────────────────────────────────
    clone.sendFile = async (jid, filePath, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await clone.getFile(filePath, true)
        let { data: file, filename: pathFile } = type

        let mtype = ''
        let mimetype = type.mime
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
        else if (/image/.test(type.mime)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime)) { mtype = 'audio'; mimetype = 'audio/ogg; codecs=opus' }
        else mtype = 'document'
        if (options.asDocument) mtype = 'document'

        return clone.sendMessage(
            jid,
            { caption, ptt, [mtype]: { url: pathFile }, mimetype, ...options },
            { filename, quoted, ...options }
        )
    }

    // ─── sendContact ─────────────────────────────────────────
    clone.sendContact = async (jid, numbers, quoted = '', opts = {}) => {
        let list = numbers.map(i => ({
            displayName: i,
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${i}\nitem1.TEL;waid=${i}:${i}\nEND:VCARD`
        }))
        return clone.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
    }

    return clone
}

module.exports = { patchClone }
