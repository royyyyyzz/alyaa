/*


CREATED BY : IZUKA DEV


*/





const fs = require('fs')

//~~~~~~~~~ Setting Owner ~~~~~~~~~~//
global.owner = "6285729477827"
global.nomerOwner = "6285729477827@s.whatsapp.net"
global.namaowner = "XRizal"
global.namabot = "Alya Kujou"
global.footer = "©Izuka-Dev2021"
global.creator = "Izuka Dev"
global.botVersion = "8.3.2"
//~~~~~~~~~ Setting Channel ~~~~~~~~~~//
global.idsaluran = "120363425539577838@newsletter"
global.namasaluran = "Alya - Multi Device"
global.linksaluran = "https://whatsapp.com/channel/0029Vb667wO3GJP0zmJL013P"

//~~~~~~~~~ Setting Packname ~~~~~~~~~~//
global.packname = "Stiker bot by : "
global.author = "IZUKA BOTZ OFFICIAL"

//~~~~~~~~~ Setting Status ~~~~~~~~~~//
global.status = true
global.welcome = true

//~~~~~~~~~ Setting Pairing ~~~~~~~~~~//
global.pairing = "XRIZZDEV" //Minimal 8huruf jangan lebih

//~~~~~~~~~ Setting Sosmed ~~~~~~~~//
global.ig = 'https://www.instagram.com/kang_rizal404'
global.namaig = 'kang_rizal404'
global.tiktok = 'https://www.tiktok.com/@izukabotz?_t=ZS-8zVuFNZLhnU&_r=1'

//~~~~~~~~ Setting Panel ~~~~~~~~~~//
global.domain = '-'
global.apiuser = '-'
global.cred = '-'
global.nets = 5
global.eggs = 15
global.location = 1

//~~~~~~~~ Setting Panel V2~~~~~~~~~~//
global.domain2 = '-'
global.apiuser2 = '-'
global.cred2 = '-'
global.nets2 = 5
global.eggs2 = 15
global.location2 = 1

//~~~~~~~~~ Stting Jadwal Alarm Sholat ~~~~~~~//
global.waktuSholat = {
    SUBUH: "03:46",
    DZUHUR: "11:19",
    ASHAR: "14:36",
    MAGHRIB: "17:32",
    ISYA: "18:44",
};

//~~~~~~~~~~~~~~ Settings Pakasir (buypremium) ~~~~~~~~//
global.PakasirProject = "-" // Projek Name Pakasir
global.PakasirApikey = "-" // Apikey Pakasir
global.jadibotPaket = {
    1: 3000,
    3: 5000,
    7: 15000,
    15: 20000,
    30: 50000
}

global.hargaprem = {
  "1d": 1000,
  "2d": 2000,
  "3d": 3000,
  "4d": 4000,
  "5d": 5000,
  "7d": 7000,
  "15d": 15000,
  "30d": 20000
}


// Jangan Diotak atik
global.orderPrem ??= {}
global.sectionPrem = (sender) => ({
  title: "Durasi Premium",
  rows: Object.entries(global.hargaprem).map(([durasi, harga]) => ({
    title: `${durasi.toUpperCase()}`,
    description: `Harga: Rp${harga.toLocaleString("id-ID")}`,
    id: `.orderprem ${sender}|${durasi}`
  }))
})
global.hargasewa = {
  "5d": 5000,
  "7d": 7000,
  "15d": 8000,
  "30d": 10000
}

global.orderSewa ??= {}
global.sectionSewa = (sender) => ({
  title: "Durasi Sewa Bot",
  rows: Object.entries(global.hargasewa).map(([durasi, harga]) => ({
    title: `${durasi.toUpperCase()}`,
    description: `Harga: Rp${harga.toLocaleString("id-ID")}`,
    id: `.ordersewa ${sender}|${durasi}`
  }))
})
//~~~~~~~~~ Setting Text Promosi Jpm ~~~~~~~~//
global.delayJpm = 7000 // 1000 = 1detik
global.text = {
    promosi: `📮 𝘐𝘡𝘜𝘒𝘈 𝘗𝘈𝘕𝘌𝘓 𝘚𝘛𝘖𝘙𝘌 🛍

✨
𝘒𝘢𝘮𝘪 𝘮𝘦𝘯𝘺𝘦𝘥𝘪𝘢𝘬𝘢𝘯 𝘱𝘢𝘯𝘦𝘭 𝘣𝘦𝘳𝘬𝘶𝘢𝘭𝘪𝘵𝘢𝘴 𝘵𝘦𝘳𝘣𝘢𝘪𝘬 𝘶𝘯𝘵𝘶𝘬 𝘣𝘰𝘵 𝘸𝘩𝘢𝘵𝘴𝘢𝘱𝘱 𝘢𝘯𝘥𝘢😉
𝘒𝘢𝘮𝘪 𝘣𝘦𝘳𝘢𝘯𝘪 𝘮𝘦𝘮𝘣𝘦𝘳𝘪𝘬𝘢𝘯 𝘨𝘢𝘳𝘢𝘯𝘴𝘪 20𝘩𝘢𝘳𝘪 𝘫𝘪𝘬𝘢 𝘢𝘯𝘥𝘢 𝘮𝘦𝘮𝘣𝘦𝘭𝘪 𝘱𝘢𝘯𝘦𝘭 𝘱𝘳𝘪𝘷𝘢𝘵𝘦 𝘬𝘢𝘮𝘪🥰
𝘋𝘦𝘯𝘨𝘢𝘯 𝘝𝘗𝘚 𝘣𝘦𝘳𝘬𝘶𝘢𝘭𝘪𝘵𝘢𝘴 𝘢𝘯𝘥𝘢 𝘣𝘪𝘴𝘢 𝘮𝘦𝘯𝘪𝘬𝘮𝘢𝘵𝘪 𝘣𝘰𝘵 𝘢𝘯𝘥𝘢 𝘵𝘢𝘯𝘱𝘢 𝘢𝘥𝘢𝘯𝘺𝘢 𝘥𝘦𝘭𝘢𝘺😋`,
    promosi1: `➣ List panel private

▣ 3Gb : Rp. 4.000
▣ 4Gb : Rp. 5.000
▣ 5Gb : Rp. 6.000
▣ 6Gb : Rp. 7.000
▣ 7Gb : Rp. 8.000
▣ 8Gb : Rp. 9.000
▣ 9Gb : Rp. 10.000
▣ 10Gb : Rp. 11.000
▣ Unlimited : Rp. 13.000

❬ 𝘉𝘦𝘯𝘦𝘧𝘪𝘵 𝘱𝘢𝘯𝘦𝘭 𝘱𝘳𝘪𝘷𝘢𝘵𝘦 ❭
- Sc dipastikan 100%aman no intip
- Support node 20+
- No Delay (tergantung scripnya)
- Anti DDOS
- Garansi 15hari 1× replace
- DO Premium-AMD r16 c8`,
    promosi2: `➣ List panel public

▣ 1Gb : Rp. 1.000
▣ 2Gb : Rp. 2.000
▣ 3Gb : Rp. 3.000
▣ 4Gb : Rp. 4.000
▣ 5Gb : Rp. 5.000
▣ 6Gb : Rp. 6.000
▣ 7Gb : Rp. 7.000
▣ 8Gb : Rp. 8.000
▣ 9Gb : Rp. 9.000
▣ 10Gb : Rp. 10.000
▣ Unlimited : Rp. 12.000
▣ Adimin Panel : Rp. 20.000

❬ 𝘉𝘦𝘯𝘦𝘧𝘪𝘵 𝘱𝘢𝘯𝘦𝘭 𝘱𝘶𝘣𝘭𝘪𝘤 ❭
- Dijamin 100% aman anti intip
- Menggunakan sistem anti intip + anti delete
- Anti dirusuhin admin lain
- Support node 20+
- No Delay (tergantung scripnya)
- Anti DDOS
- Garansi 10hari 1× replace
- DO Premium-AMD r16 c8`
}
global.linkpenjual = 'https://wa.me//6287711163787'
global.linkTesti = 'https://whatsapp.com/channel/0029Vb667wO3GJP0zmJL013P'

//~~~~~~~~~ Setting Payment ~~~~~~~~~//
global.imageqris = 'https://files.catbox.moe/szrutt.jpg'
global.payment = {
    dana: '0881026351241',
    gopay: '087711163787',
    rekening: '502351620891',
    namarek: 'Bank Jago'
    }
    // Jika tidak punya kasih tanda (-)
//~~~~~~~~~ Setting ApiKey ~~~~~~~~~//
global.apiexonity = 'E2XFYpETE6'
global.apiBtz = 'Btz-LKSjN'
global.termai = 'Fearless'
global.termaiweb = 'https://aihub.xtermai.xy'
global.fgsiApiKey = '-' // Ambil apikey di https://fgsi.dpdns.org/
//~~~~~~~~~ Setting Limit ~~~~~~~~~~~~//
global.set = {
    limit: 15,
    glimit: 30
    }

//~~~~~~~~~ Setting Bot ~~~~~~~~~~//
global.thumbOwner = "https://e.top4top.io/p_3677ou9ss1.jpg"
global.thumbnail = "https://l.top4top.io/p_36206sq5v1.jpg"
global.music = "https://files.catbox.moe/51ljp7.mp3"
global.jumlahtoxic = 5
global.tagwarn = 3
global.hias = '➣'
global.hituet = 0
global.rpg = {
emoticon(string) {
string = string.toLowerCase()
let emot = {
level: '📊',
limit: '🎫',
health: '❤️',
exp: '✨',
atm: '💳',
money: '💰',
bank: '🏦',
potion: '🥤',
diamond: '💎',
common: '📦',
uncommon: '🛍️',
mythic: '🎁',
legendary: '🗃️',
superior: '💼',
pet: '🔖',
trash: '🗑',
armor: '🥼',
sword: '⚔️',
pickaxe: '⛏️',
fishingrod: '🎣',
wood: '🪵',
rock: '🪨',
string: '🕸️',
horse: '🐴',
cat: '🐱',
dog: '🐶',
fox: '🦊',
robo: '🤖',
petfood: '🍖',
iron: '⛓️',
gold: '🪙',
emerald: '❇️',
upgrader: '🧰',
bibitanggur: '🌱',
bibitjeruk: '🌿',
bibitapel: '☘️',
bibitmangga: '🍀',
bibitpisang: '🌴',
anggur: '🍇',
jeruk: '🍊',
apel: '🍎',
mangga: '🥭',
pisang: '🍌',
botol: '🍾',
kardus: '📦',
kaleng: '🏮',
plastik: '📜',
gelas: '🫗',
chip: '♋',
umpan: '🪱',
skata: '🧩'
}
let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
if (!results.length) return ''
else return emot[results[0][0]]
}}

//~~~~~~~~~ Setting Message ~~~~~~~~~~//
global.mess = {
    premium: "Fitur ini khusus user premium",
    owner: "Fitur ini khusus untuk owner!", 
    group: "Fitur ini untuk dalam grup!", 
    private: "Fitur ini untuk dalam private chat!", 
    admin: "Fitur ini khusus admin",
    BotAdmn: "Fitur ini akan aktif jika bot sudah menjadi *Admin*"
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
