const fs = require('fs')
const toMs = require('ms')
const { sleep } = require("./myfunction");


/**
 * Add Sewa group.
 * @param {String} gid 
 * @param {String} expired 
 * @param {Object} _dir 
 */
const addSewaGroup = (gid, expired) => {
    let _dir = JSON.parse(fs.readFileSync('./lib/database/sewa.json'));
    const obj = { id: gid, expired: Date.now() + toMs(expired), status: true }
    _dir.push(obj)
    fs.writeFileSync('./lib/database/sewa.json', JSON.stringify(_dir, null, 2))
}

/**
 * Get sewa group position.
 * @param {String} gid 
 * @param {Object} _dir 
 * @returns {Number}
 */
const getSewaPosition = (gid) => {
    let _dir = JSON.parse(fs.readFileSync('./lib/database/sewa.json'));
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === gid) {
            position = i
        }
    })
    if (position !== null) {
        return position
    }
}

/**
 * Get sewa group expire.
 * @param {String} gid 
 * @param {Object} _dir 
 * @returns {Number}
 */
const getSewaExpired = (gid) => {
    let _dir = JSON.parse(fs.readFileSync('./lib/database/sewa.json'));
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === gid) {
            position = i
        }
    })
    if (position !== null) {
        return _dir[position].expired
    }
}

/**
 * Check group is sewa.
 * @param {String} userId 
 * @param {Object} _dir 
 * @returns {Boolean}
 */
const checkSewaGroup = (gid) => {
    let _dir = JSON.parse(fs.readFileSync('./lib/database/sewa.json'));
    let status = false
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === gid) {
            status = true
        }
    })
    return status
}

/**
 * Constantly checking sewa.
 * @param {object} WAConnection
 * @param {Object} _dir 
 */
const expiredCheck = (client) => {
    setInterval(() => {
    let _dir = JSON.parse(fs.readFileSync('./lib/database/sewa.json'));
        let position = null
        Object.keys(_dir).forEach((i) => {
            if (Date.now() >= _dir[i].expired) {
                position = i
            }
        })
        if (position !== null) {
            let teks = `*</> SEWA EXPIRED </>*

*Sewa expired, bot otomatis keluar!*
_bayy member tercintahh_
`
            		const contentText = {
            			text: teks,
            			contextInfo: {
            				mentionedJid: client.ments(teks),
            				externalAdReply: {
        					title: `SEWA EXPIRED 💫`,
        					previewType: "PHOTO",
        					thumbnailUrl: `https://pomf2.lain.la/f/lswq2r83.jpg`,
        					sourceUrl: "-"
            				}
            			}
            		};
            		client.sendMessage(_dir[position].id, contentText)
            .then( res => {
              client.groupLeave(_dir[position].id)
              _dir.splice(position, 1)
              fs.writeFileSync('./lib/database/sewa.json', JSON.stringify(_dir, null, 2))
            })
        }
    }, 1000)
}

/**
 * Get all premium user ID.
 * @param {Object} _dir 
 * @returns {String[]}
 */
const getAllPremiumUser = () => {
    let _dir = JSON.parse(fs.readFileSync('./lib/database/sewa.json'));
    const array = []
    Object.keys(_dir).forEach((i) => {
        array.push(_dir[i].id)
    })
    return array
}

module.exports = {
    addSewaGroup,
    getSewaExpired,
    getSewaPosition,
    expiredCheck,
    checkSewaGroup,
    getAllPremiumUser
}