const toMs = require('ms')

// Message filter
const usedCommandRecently = new Set()

/**
 * Check is number filtered.
 * @param {String} from 
 * @returns {Boolean}
 */
const isFiltered = (from) => {
    return !!usedCommandRecently.has(from)
}

/**
 * Add number to filter.
 * @param {String} from 
 */
const addFilter = (from) => {
    usedCommandRecently.add(from)
    setTimeout(() => {
        return usedCommandRecently.delete(from)
    }, 5000) // Cooldown command diset 5 detik
}

const addSpam = (sender, _db) => {
    let position = false
    Object.keys(_db).forEach((i) => {
        if (_db[i].id === sender) {
            position = i
        }
    })
    if (position !== false) {
        _db[position].spam += 1
    } else {
        const bulin = ({
            id: sender,
            spam: 1,
            expired: Date.now() + toMs('1m') // Sesuai request: Ban cuma 1 menit!
        })
        _db.push(bulin)
    }
}
const ResetSpam = (_dir, _usersdb) => {
    setInterval(() => {
        let position = null
        Object.keys(_dir).forEach((i) => {
            if (Date.now() >= _dir[i].expired) {
                position = i
            }
        })
        if (position !== null) {
            const targetId = _dir[position].id
            console.log(`Spam expired: ${targetId}`)
            
            if (_usersdb && _usersdb[targetId]) {
                _usersdb[targetId].banned = false;
            }
            
            _dir.splice(position, 1); // Menghapus user dari list spam/timer
        }
    }, 1000)
}


const isSpam = (sender, _db) => {
    let found = false
    for (let i of _db) {
        if (i.id === sender) {
            let spam = i.spam
            if (spam >= 6) {
                found = true
                return true
            } else {
                found = true
                return false
            }
        }
    }
    return false
}

module.exports = {
    isFiltered,
    addFilter,
    addSpam,
    ResetSpam,
    isSpam
}
