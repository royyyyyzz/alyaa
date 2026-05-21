const BodyForm = require('form-data')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const FormData = require('form-data');
const { fromBuffer } = require("file-type");
const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');
const path = require("path");
// by udin-zaenal ganteng


async function getFileData(buffer) {
    const { ext } = await fromBuffer(buffer);
    const filename = 'izumi-' + Date.now() + '.' + ext;
    return { filename, ext };
}

// ======================================================================
// TOP4TOP
// ======================================================================
async function top4top(buffer) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!buffer) return console.warn('Mana Buffer Nya !');

            const origin = 'https://top4top.io';
            const data = new FormData();
            const { filename, ext } = await getFileData(buffer);

            data.append('file_1_', buffer, { filename });
            data.append('submitr', '[ رفع الملفات ]');

            console.log('uploading file.. ' + filename);

            const r = await fetch(origin + '/index.php', {
                method: 'POST',
                body: data
            });

            if (!r.ok)
                throw Error(`${r.status} ${r.statusText}\n${await r.text()}`);

            const html = await r.text();
            const matches = html.matchAll(
                /<input readonly="readonly" class="all_boxes" onclick="this.select\(\);" type="text" value="(.+?)" \/>/g
            );

            const arr = Array.from(matches);
            if (!arr.length) throw Error(`gagal mengupload file`);

            const downloadUrl = arr.map(v => v[1]).find(v => v.endsWith(ext));
            const deleteUrl = arr.map(v => v[1]).find(v => v.endsWith('html'));
            const qrcodeUrl =
                origin + '/' + html.match(/<div class="qr_img"><img src="(.+?)"/)?.[1];

            resolve({ downloadUrl, deleteUrl, qrcodeUrl });
        } catch (err) {
            reject({ msg: 'Gomene Error Tourl' });
            console.error('Error', err);
        }
    });
}

// ======================================================================
// RYZUMI
// ======================================================================
async function ryzumi(buffer) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!buffer) return console.warn('Mana Buffer Nya !');

            const { filename } = await getFileData(buffer);
            const data = new FormData();
            data.append('file', buffer, { filename });

            const { data: ryz } = await axios.post(
                'https://api.ryzumi.vip/api/uploader/ryzencdn',
                data,
                { headers: { ...data.getHeaders(), referrer: "https://api.ryzumi.vip/" } }
            );

            resolve(ryz);
        } catch (err) {
            reject({ msg: 'Gomene Error Tourl' });
            console.error('Error', err);
        }
    });
}

// ======================================================================
// CLOUDKU
// ======================================================================
async function cloudku(buffer) {
    return new Promise(async (resolve, reject) => {
        try {
            const { filename } = await getFileData(buffer);
            const data = new FormData();
            data.append('file', buffer, { filename });

            await axios.post('https://www.cloudkuimages.guru/upload', data, {
                headers: {
                    ...data.getHeaders(),
                    "User-Agent":
                        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
                    "Referer": "https://www.cloudkuimages.guru/"
                }
            });

            resolve();
        } catch (err) {
            reject({ msg: 'Gomene Error Tourl' });
            console.error('Error', err);
        }
    });
}

// ======================================================================
// CATBOX
// ======================================================================
async function catbox(buffer) {
    return new Promise(async (resolve, reject) => {
        try {
            const { filename } = await getFileData(buffer);
            const data = new FormData();

            data.append('reqtype', 'fileupload');
            data.append('userhash', '');
            data.append('fileToUpload', buffer, { filename });

            const api = await axios.post(
                'https://catbox.moe/user/api.php',
                data,
                {
                    headers: {
                        ...data.getHeaders(),
                        'User-Agent':
                            'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0'
                    }
                }
            );

            resolve(api.data);
        } catch (err) {
            reject({ msg: 'Gomene Error Tourl' });
            console.error('Error', err);
        }
    });
}

// ======================================================================
// UGUU
// ======================================================================
async function uguu(buffer) {
    return new Promise(async (resolve, reject) => {
        try {
            const { filename } = await getFileData(buffer);
            const data = new FormData();
            data.append('files[]', buffer, { filename });

            const api = await axios.post('https://uguu.se/upload.php', data, {
                headers: {
                    ...data.getHeaders(),
                    'User-Agent':
                        'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
                    "Referer": "https://uguu.se/"
                }
            });

            resolve(api.data);
        } catch (err) {
            reject({ msg: 'Gomene Error Tourl' });
            console.error('Error', err);
        }
    });
}

// ======================================================================
// TEMPFILES
// ======================================================================
async function tempfiles(buffer) {
    return new Promise(async (resolve, reject) => {
        try {
            const { filename } = await getFileData(buffer);
            const data = new FormData();
            data.append('file', buffer, { filename });

            const { data: api } = await axios.post(
                'https://tmpfiles.org/api/v1/upload',
                data,
                {
                    headers: {
                        ...data.getHeaders(),
                        'User-Agent':
                            'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
                        "Referer": "https://tmpfiles.org/"
                    }
                }
            );

            const match = /tmpfiles\.org\/([^"]+)/.exec(api.data.url);
            resolve("https://tmpfiles.org/dl/" + match[1]);
        } catch (err) {
            reject({ msg: 'Gomene Error Tourl' });
            console.error('Error', err);
        }
    });
}

async function pomfCDN(path) {
    try {
        const fileStream = fs.readFileSync(path);
        const formData = new BodyForm();
        const { ext, mime } = (await fromBuffer(fileStream)) || {};
        formData.append("fileToUpload", fileStream, "file." + ext);
        formData.append("reqtype", "fileupload");
        const response = await fetch("https://catbox.moe/user/api.php", {
            method: "POST",
            body: formData,
            headers: {
              ...formData.getHeaders(),
            }
        });
        return await response.text();
    } catch (error) {
        console.log("Error at catbox uploader in lib/uploader.js:", error)
        return "Terjadi kesalahan"
    }
}

function TelegraPh (Path) {
	return new Promise (async (resolve, reject) => {
		if (!fs.existsSync(Path)) return reject(new Error("File not Found"))
		try {
			const form = new BodyForm();
			form.append("file", fs.createReadStream(Path))
			const data = await  axios({
				url: "https://telegra.ph/upload",
				method: "POST",
				headers: {
					...form.getHeaders()
				},
				data: form
			})
			return resolve("https://telegra.ph" + data.data[0].src)
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}

async function UploadFileUgu (input) {
	return new Promise (async (resolve, reject) => {
			const form = new BodyForm();
			form.append("files[]", fs.createReadStream(input))
			await axios({
				url: "https://uguu.se/upload.php",
				method: "POST",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
					...form.getHeaders()
				},
				data: form
			}).then((data) => {
				resolve(data.data.files[0])
			}).catch((err) => reject(err))
	})
}

async function webp2mp4File(url) {
const res = await axios('https://ezgif.com/webp-to-mp4?url=' + url)
const $ = cheerio.load(res.data)      
        const file = $('input[name="file"]').attr('value')
        const data = {
          file: file,
          convert: 'Convert WebP to MP4!',
        }
  const res2 = await axios({
          method: 'post',
          url: 'https://ezgif.com/webp-to-mp4/' + data.file,
          data: new URLSearchParams(Object.entries(data)) 
         
         })  
  const $2 = cheerio.load(res2.data)  
  const link = $2('div#output > p.outfile > video > source').attr('src')
  return "https:" + link
}

module.exports = { 
    top4top,
    ryzumi,
    cloudku,
    catbox,
    uguu,
    tempfiles,
    pomfCDN, 
    TelegraPh, 
    UploadFileUgu, 
    webp2mp4File
}

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.redBright(`Update 'uploader.js'`));
});
