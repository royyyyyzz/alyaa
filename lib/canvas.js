const fs = require('fs')
const chalk = require('chalk')
const ling = require('@clayzaaubert/canvix')
const { spawn } = require('child_process')
const { join } = require('path')

async function welcome1(a, b, c, d, e, f) {
  const imeg = await new ling.Welcome()
    .setUsername(a)
    .setGuildName(b)
    .setGuildIcon(c)
    .setMemberCount(d)
    .setAvatar(e)
    .setBackground(f)
    .toAttachment()

  const dat = imeg.toBuffer()
  await fs.writeFileSync('./tmp/welcome1.png', dat)
}

async function goodbye1(g, h, i, j, k, l) {
  const image = await new ling.Goodbye()
    .setUsername(g)
    .setGuildName(h)
    .setGuildIcon(i)
    .setMemberCount(j)
    .setAvatar(k)
    .setBackground(l)
    .toAttachment()

  const tad = image.toBuffer()
  await fs.writeFileSync('./tmp/goodbye1.png', tad)
}

/**
 * Levelup image (CJS Version)
 * @param {String} teks 
 * @param {Number} level 
 * @returns {Promise<Buffer>}
 */
function levelup(teks, level) {
  return new Promise(async (resolve, reject) => {
    if (!(global.support.convert || global.support.magick || global.support.gm))
      return reject('Not Support!')

    const font = join(__dirname, '../media/font')
    const fontLevel = join(font, './level_c.otf')
    const fontTexts = join(font, './texts.otf')
    const xtsx = join(__dirname, '../media/lvlup_template.png')

    let anotations = '+1385+260'
    if (level > 2) anotations = '+1370+260'
    if (level > 10) anotations = '+1330+260'
    if (level > 50) anotations = '+1310+260'
    if (level > 100) anotations = '+1260+260'

    const [_spawnprocess, ..._spawnargs] = [
      ...(global.support.gm ? ['gm'] : global.support.magick ? ['magick'] : []),
      'convert',
      xtsx,
      '-font', fontTexts,
      '-fill', '#0F3E6A',
      '-size', '1024x784',
      '-pointsize', '68',
      '-interline-spacing', '-7.5',
      '-annotate', '+153+200', teks,
      '-font', fontLevel,
      '-fill', '#0A2A48',
      '-size', '1024x784',
      '-pointsize', '140',
      '-interline-spacing', '-1.2',
      '-annotate', anotations, level,
      '-append',
      'jpg:-'
    ]

    const bufs = []
    const proc = spawn(_spawnprocess, _spawnargs)
    proc.stdout.on('data', chunk => bufs.push(chunk))
    proc.on('error', reject)
    proc.on('close', () => resolve(Buffer.concat(bufs)))
  })
}

global.welcome = welcome1
global.goodbye = goodbye1

module.exports = { levelup }

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright(`Update ${__filename}`))
  delete require.cache[file]
  require(file)
})