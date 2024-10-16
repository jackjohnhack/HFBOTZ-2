const axios = require("axios");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const moment = require("moment");

const ranNumb = (min, max = null) => max !== null ? Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min) : Math.floor(Math.random() * min) + 1;

const padLead = (num, size) => {
  let s = num.toString();
  while (s.length < size) s = "0" + s;
  return s;
};

const niceBytes = x => {
  let l = 0,
    n = parseInt(x, 10) || 0;
  while (n >= 1024 && ++l) n /= 1024;
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][l];
};

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const isNumber = number => number ? typeof(number = parseInt(number)) === "number" && !isNaN(number) : number;

const runtime = seconds => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / 86400),
    h = Math.floor(seconds % 86400 / 3600),
    m = Math.floor(seconds % 3600 / 60),
    s = Math.floor(seconds % 60);
  return (d > 0 ? `${d} ${d === 1 ? "day, " : "days, "}` : "") + (h > 0 ? `${h} ${h === 1 ? "hour, " : "hours, "}` : "") + (m > 0 ? `${m} ${m === 1 ? "minute, " : "minutes, "}` : "") + (s > 0 ? `${s} ${s === 1 ? "second" : "seconds"}` : "");
};

const runtimes = seconds => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / 86400),
    h = Math.floor(seconds % 86400 / 3600),
    m = Math.floor(seconds % 3600 / 60),
    s = Math.floor(seconds % 60);
  return (d > 0 ? `${d}d ` : "") + (h < 10 ? `0${h}:` : h > 0 ? `${h}:` : "") + (m < 10 ? `0${m}:` : m > 0 ? `${m}:` : "") + (s < 10 ? `0${s}` : s > 0 ? `${s}` : "");
};

const clockString = ms => {
  if (isNaN(ms) || ms < 0) return "Invalid input";
  const duration = moment.duration(ms);
  const tahun = Math.floor(duration.asYears());
  const bulan = duration.months();
  const minggu = Math.floor((duration.asDays() - tahun * 365 - bulan * 30) / 7);
  const hari = duration.days() % 7;
  const jam = duration.hours();
  const menit = duration.minutes();
  const detik = duration.seconds();
  return `${tahun ? `*\`${tahun}\`* Tahun ` : ""}` + `${bulan || tahun ? `*\`${bulan}\`* Bulan ` : ""}` + `${minggu || bulan || tahun ? `*\`${minggu}\`* Minggu ` : ""}` + `${hari || minggu || bulan || tahun ? `*\`${hari}\`* Hari ` : ""}` + `${jam || hari || minggu || bulan || tahun ? `*\`${jam}\`* Jam ` : ""}` + `${menit || jam || hari || minggu || bulan atau tahun ? `*\`${menit}\`* Menit ` : ""}` + `*\`${detik}\`* Detik`;
};

const cerpen = async category => {
  return new Promise(async (resolve, reject) => {
    let length, judul = category.toLowerCase().replace(/[()*]/g, "").replace(/\s/g, "-");
    try {
      const res = await axios.get(`http://cerpenmu.com/category/cerpen-${judul}`);
      length = cheerio.load(res.data)("html body div#wrap div#content article.post div.wp-pagenavi a")[4]?.attribs.href.split("/").pop();
    } catch {
      length = 0;
    }
    const page = Math.floor(Math.random() * parseInt(length));
    axios.get(`http://cerpenmu.com/category/cerpen-${judul}/page/${page}`).then(get => {
      const $ = cheerio.load(get.data);
      const link = [];
      $("article.post").each((a, b) => {
        link.push($(b).find("a").attr("href"));
      });
      const random = link[Math.floor(Math.random() * link.length)];
      axios.get(random).then(res => {
        const $$ = cheerio.load(res.data);
        const hasil = {
          title: $$("#content > article > h1").text(),
          author: $$("#content > article").text().split("Cerpen Karangan: ")[1].split("Kategori: ")[0],
          kategori: $$("#content > article").text().split("Kategori: ")[1].split("\n")[0],
          lolos: $$("#content > article").text().split("Lolos moderasi pada: ")[1].split("\n")[0],
          cerita: $$("#content > article > p").text()
        };
        resolve(hasil);
      });
    });
  });
};

const quotesAnime = () => {
  return new Promise((resolve, reject) => {
    const page = Math.floor(185 * Math.random());
    axios.get(`https://otakotaku.com/quote/feed/${page}`).then(({
      data
    }) => {
      const $ = cheerio.load(data);
      const hasil = [];
      $("div.kotodama-list").each((l, h) => {
        hasil.push({
          link: $(h).find("a").attr("href"),
          gambar: $(h).find("img").attr("data-src"),
          karakter: $(h).find("div.char-name").text().trim(),
          anime: $(h).find("div.anime-title").text().trim(),
          episode: $(h).find("div.meta").text(),
          up_at: $(h).find("small.meta").text(),
          quotes: $(h).find("div.quote").text().trim()
        });
      });
      resolve(hasil);
    }).catch(reject);
  });
};

const getBuffer = async (url, options) => {
  try {
    const response = await axios({
      method: "get",
      url: url,
      headers: {
        DNT: 1,
        "Upgrade-Insecure-Request": 1
      },
      ...options,
      responseType: "arraybuffer"
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

const lirik = judul => {
  return new Promise(async (resolve, reject) => {
    axios.get(`https://www.musixmatch.com/search/${judul}`).then(async ({
      data
    }) => {
      const $ = cheerio.load(data);
      const hasil = {};
      const link = "https://www.musixmatch.com" + $("div.media-card-body > div > h2").find("a").attr("href");
      await axios.get(link).then(({
        data
      }) => {
        const $$ = cheerio.load(data);
        hasil.thumb = "https:" + $$("div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div").find("img").attr("src");
        $$("div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics").each((a, b) => {
          hasil.lirik = $$(b).find("span > p > span").text() + "\n" + $$(b).find("span > div > p > span").text();
        });
      });
      resolve(hasil);
    }).catch(reject);
  });
};

const wallpaper = query => {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.wallpaperflare.com/search?wallpaper=${query}`, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        cookie: "_ga=GA1.2.863074474.1624987429; _gid=GA1.2.857771494.1624987429; __gads=ID=84d12a6ae82d0a63-2242b0820eca0058:T=1624987427:RT=1624987427:S=ALNI_MaJYaH0-_xRbokdDkQ0BNSlKaa0Hg; __gpi=UID=00000c80e037ba0f:T=1624987427:RT=1624987427:S=ALNI_MayRtE5S5QU3D_-Os3Vu66RxMsUxg"
      }
    }).then(({
      data
    }) => {
      const $ = cheerio.load(data);
      const page = [];
      $("ul.wallpapers__list > li > figure > a").each(function (i, e) {
        page.push($(e).attr("href"));
      });
      const link = page[Math.floor(Math.random() * page.length)];
      axios.get(link, {
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          cookie: "_ga=GA1.2.863074474.1624987429; _gid=GA1.2.857771494.1624987429; __gads=ID=84d12a6ae82d0a63-2242b0820eca0058:T=1624987427:RT=1624987427:S=ALNI_MaJYaH0-_xRbokdDkQ0BNSlKaa0Hg; __gpi=UID=00000c80e037ba0f:T=1624987427:RT=1624987427:S=ALNI_MayRtE5S5QU3D_-Os3Vu66RxMsUxg"
        }
      }).then(({
        data
      }) => {
        const $$ = cheerio.load(data);
        const wall = [];
        $$("span.wf-wallpaper").each(function (e, i) {
          wall.push($$(i).attr("content"));
        });
        const random = wall[Math.floor(Math.random() * wall.length)];
        resolve({
          link: random
        });
      });
    });
  });
};

const webp2mp4File = async source => {
  const form = new FormData();
  const isUrl = typeof source === "string" && source.startsWith("http");
  if (isUrl) {
    form.append("new-image-url", source);
  } else {
    form.append("new-image", source, "image.webp");
  }
  const res = await fetch("https://ezgif.com/webp-to-mp4", {
    method: "POST",
    body: form
  });
  const $ = cheerio.load(await res.text());
  const file = $('form[method="POST"]').attr("action");
  const result = await fetch(`https://ezgif.com${file}`, {
    method: "POST",
    body: new URLSearchParams(new FormData($('form[method="POST"]')[0])).toString(),
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    }
  });
  const $2 = cheerio.load(await result.text());
  return $2("div#output > p.outfile > video > source").attr("src");
};

const webp2mp4Buffer = async source => {
  const url = await webp2mp4File(source);
  return getBuffer(url);
};

module.exports = {
  axios,
  cheerio,
  fetch,
  moment,
  ranNumb,
  padLead,
  niceBytes,
  capitalizeFirstLetter,
  isNumber,
  runtime,
  runtimes,
  clockString,
  cerpen,
  quotesAnime,
  getBuffer,
  lirik,
  wallpaper,
  webp2mp4File,
  webp2mp4Buffer
};
