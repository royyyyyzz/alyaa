// ===============================
// Require Library
// ===============================
const axios = require("axios");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const gis = require("g-i-s");
const fs = require("fs");
const crypto = require("crypto");
const { loadImage, createCanvas } = require("canvas");
const { fromBuffer } = require("file-type");
const util = require("util");
const { basename, extname } = require("path");
const baseURL = "https://fdownloader.net/id";
const apiURL = "https://v3.fdownloader.net/api/ajaxSearch?lang=en";

// ===============================
// JADWAL SHOLAT
// ===============================
async function jadwalSholat(kode_daerah) {
  try {
    const response = await axios.get(
      "https://jadwalsholat.org/jadwal-sholat/daily.php?id=" + kode_daerah
    );
    const html = response.data;
    const $ = cheerio.load(html);
    const row = $("tr.table_light, tr.table_dark").find("td");

    return {
      bulan: $("h2").text().trim(),
      tanggal: $(row[0]).text().trim(),
      imsyak: $(row[1]).text().trim(),
      shubuh: $(row[2]).text().trim(),
      terbit: $(row[3]).text().trim(),
      dhuha: $(row[4]).text().trim(),
      dzuhur: $(row[5]).text().trim(),
      ashr: $(row[6]).text().trim(),
      maghrib: $(row[7]).text().trim(),
      isya: $(row[8]).text().trim(),
    };
  } catch (error) {
    return { status: "error", error: error.message };
  }
}

// ===============================
// FIND KODE DAERAH
// ===============================
async function findKodeDaerah(nama_daerah) {
  try {
    const response = await axios.get(
      "https://jadwalsholat.org/jadwal-sholat/monthly.php"
    );
    const html = response.data;
    const $ = cheerio.load(html);
    const options = $("select[name='kota'] option");
    const kodeDaerah = {};

    options.each((i, el) => {
      kodeDaerah[$(el).text().trim().toLowerCase()] = $(el).attr("value");
    });

    const region = nama_daerah.toLowerCase();
    if (kodeDaerah[region]) {
      return {
        status: "ok",
        creator: "SatganzDevs",
        kode_daerah: kodeDaerah[region],
      };
    }

    return { status: "error", message: "Region not found" };
  } catch (error) {
    return { status: "error", error: error.message };
  }
}

// ===============================
// SCRAPE TIKTOK (downloader.bot)
// ===============================
async function scrapeTikTok(url) {
  try {
    const res = await axios.post(
      "https://downloader.bot/api/tiktok/info",
      { url },
      {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );

    const data = res.data.data;
    return {
      username: data.nick,
      title: data.video_info,
      thumbnail: data.video_img,
      video: data.mp4,
      audio: data.mp3,
      timestamp: data.video_date,
    };
  } catch (err) {
    return null;
  }
}

// ===============================
// DUOTONE
// ===============================
async function duotone(inputPath, outputPath, color1, color2) {
  const img = await loadImage(inputPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
    lum = Math.pow(lum, 0.6);

    data[i] = color1[0] * (1 - lum) + color2[0] * lum;
    data[i + 1] = color1[1] * (1 - lum) + color2[1] * lum;
    data[i + 2] = color1[2] * (1 - lum) + color2[2] * lum;
  }

  ctx.putImageData(imageData, 0, 0);
  fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));
}

// ===============================
// YOUSEARCH
// ===============================
const yousearch = axios.create({
  baseURL: "https://app.yoursearch.ai",
  headers: { "content-type": "application/json" },
});

async function youSearch(query) {
  try {
    const res = await yousearch.post("/api", {
      searchTerm: query,
      promptTemplate: `Search term: '{searchTerm}'`,
      searchParameters: "{}",
      searchResultTemplate: `[{order}] '{snippet}'\nURL: {link}`,
    });
    return res.data.response;
  } catch (e) {
    throw e;
  }
}

// ===============================
// PINTEREST IMAGE SCRAPER
// ===============================
async function pinterest(query) {
  return new Promise((resolve) => {
    gis({ searchTerm: query + " site:id.pinterest.com" }, (err, res) => {
      if (err) return resolve([]);
      resolve(res.map((x) => x.url));
    });
  });
}

// ===============================
// HITAMKAN API
// ===============================
async function hitamkan(buffer, filter = "coklat") {
  try {
    const { data } = await axios.post(
      "https://negro.consulting/api/process-image",
      JSON.stringify({
        imageData: Buffer.from(buffer).toString("base64"),
        filter,
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
    return Buffer.from(data.processedImageUrl.split(",")[1], "base64");
  } catch (e) {
    throw e;
  }
}

// ===============================
// TikWM BASIC
// ===============================
async function tikwm(url) {
  let retries = 0;
  while (retries < 5) {
    try {
      const res = await axios.get(
        `https://tikwm.com/api/?url=${encodeURIComponent(url)}`
      );
      return res.data.data;
    } catch (e) {
      retries++;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  throw new Error("Gagal mengambil data TikWM");
}

// ===============================
// TikTok Downloader v2
// ===============================
async function tiktok2(query) {
  const params = new URLSearchParams();
  params.set("url", query);
  params.set("hd", "1");

  const response = await axios({
    method: "POST",
    url: "https://tikwm.com/api/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Cookie: "current_language=en",
    },
    data: params,
  });

  const videos = response.data.data;
  return {
    title: videos.title,
    cover: videos.cover,
    no_watermark: videos.play,
    watermark: videos.wmplay,
    music: videos.music,
  };
}

// ===============================
// SNAPSAVE FACEBOOK
// ===============================
async function snapsave(vid_url) {
  try {
    const data = {
      url: vid_url
    };
    const searchParams = new URLSearchParams();
    searchParams.append('url', data.url);
    const response = await fetch('https://facebook-video-downloader.fly.dev/app/main.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: searchParams.toString(),
    });
    const responseData = await response.json();
    return responseData;
  }
  catch (e) {
    return null;
  }
}
async function snapsavev2(url) {
  try {
    const {
      data
    } = await axios(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
      },
      data: new URLSearchParams(
        Object.entries({
          recaptchaToken: "",
          q: url,
          t: "media",
          lang: "en",
        })
      ),
    });
    const $ = cheerio.load(data);
    const script = $("body").find("script").text().trim();
    const k_token = script.split("k_token = ")[1].split(";")[0];
    const k_exp = script.split("k_exp = ")[1].split(";")[0];
    const {
      data: apiData
    } = await axios(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
      },
      data: new URLSearchParams(
        Object.entries({
          k_exp,
          k_token,
          q: url,
          lang: "en",
          web: "fdownloader.net",
          v: "v2",
          w: "",
        })
      ),
    });
    const $api = cheerio.load(apiData.data);
    const result = [];
    const duration = $api('div.clearfix > p').text().trim();
    $api('div.tab__content')
      .find('tbody > tr')
      .each((index, element) => {
        const quality = $api(element).find('td.video-quality').text();
        const videoUrl = $api(element).find('td > a').attr('href');
        if (quality && videoUrl) {
          result.push({
            quality,
            url: videoUrl,
          });
        }
      });
    return {
      duration,
      result,
    };
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}
// ===============================
// POMF/CDN CATBOX
// ===============================
async function pomfCDN(path) {
  try {
    const Form = require("form-data");
    const buffer = fs.readFileSync(path);
    const formData = new Form();
    const { ext } = await fromBuffer(buffer);

    formData.append("fileToUpload", buffer, "file." + ext);
    formData.append("reqtype", "fileupload");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    return await res.text();
  } catch {
    return "Error Upload";
  }
}

// ===============================
// NOWCHAT STREAM CHATBOT
// ===============================
async function nowchat(question) {
  const t = Date.now().toString();
  const s = "dfaugf098ad0g98-idfaugf098ad0g98-iduoafiunoa-...";
  const key = crypto.createHmac("sha512", s).update(t).digest("base64");

  const config = {
    method: "POST",
    url: "http://aichat.nowtechai.com/now/v1/ai",
    headers: {
      "User-Agent": "Ktor Izuka",
      Key: key,
      TimeStamps: t,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ content: question }),
    responseType: "stream",
  };

  return new Promise((resolve) => {
    axios.request(config).then((res) => {
      let result = "";
      res.data.on("data", (chunk) => {
        chunk
          .toString()
          .split("\n")
          .forEach((line) => {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const json = JSON.parse(line.replace("data: ", ""));
                const c = json?.choices?.[0]?.delta?.content;
                if (c) result += c;
              } catch {}
            }
          });
      });
      res.data.on("end", () => resolve(result.trim()));
    });
  });
}

// ===============================
// NOWART IMAGE GENERATOR
// ===============================
async function nowart(prompt) {
  const res = await axios.get(
    "http://art.nowtechai.com/art?name=" + prompt,
    {
      headers: { "User-Agent": "okhttp/5.0.0-alpha.9" },
    }
  );
  return res.data;
}

// ===============================
// IGDOWN, IGDL, MEDIAFIRE
// ===============================
async function igdown(q) {
  try {
    const response = await axios.post(
      "https://igdown.app/api/ajaxSearch",
      `q=${q}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return response.data;
  } catch (e) {
    return { error: "Failed", e };
  }
}

async function mediafire(url) {
  const $ = cheerio.load(await (await fetch(url)).text());
  const title = $("meta[property='og:title']").attr("content") || "Unknown";
  const size = /Download\s*\(([\d.]+\s*[KMGT]?B)\)/i.exec($.html())?.[1];
  const dl =
    $("a.popsok[href^='https://download']").attr("href") ||
    $("a.popsok:not([href^='javascript'])").attr("href");

  return {
    name: title,
    filename: basename(dl),
    type: extname(dl),
    size,
    download: dl,
  };
}
async function igDownloader(url) {
  try {
    const { data } = await axios.post(
      'https://yt1s.io/api/ajaxSearch',
      new URLSearchParams({ p: 'home', q: url, w: '', lang: 'en' }),
      {
        headers: {
          'User-Agent': 'Postify/1.0.0',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      }
    )

    if (data.status !== 'ok') return { error: true }

    const $ = cheerio.load(data.data)

    return $('a.abutton.is-success.is-fullwidth.btn-premium')
      .map((_, el) => ({
        title: $(el).attr('title'),
        url: $(el).attr('href'),
      }))
      .get()

  } catch {
    return { error: true }
  }
}

// ===============================
// MODULE EXPORTS
// ===============================
module.exports = {
  jadwalSholat,
  findKodeDaerah,
  scrapeTikTok,
  duotone,
  youSearch,
  pinterest,
  hitamkan,
  tikwm,
  tiktok2,
  pomfCDN,
  nowchat,
  nowart,
  igdown,
  igDownloader,
  mediafire,
  snapsave,
  snapsavev2
};