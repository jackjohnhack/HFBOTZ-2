const fetch = require('node-fetch');
const { facebook } = require('@xct007/frieren-scraper');
const { facebookdl } = require('@bochilteam/scraper');
const axios = require('axios');
const cheerio = require('cheerio');

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let imgr = getRandomImage();  // Perubahan di sini, pastikan getRandomImage() didefinisikan atau diganti sesuai kebutuhan

    let ends = [
        "v1",
        "v2",
        "v3",
        "v4"
    ];

    let [links, version, quality] = text.split(" ");
    const msgg = `Input query!\n*Example:*\n*- ${usedPrefix + command}* link v1 sd/hd\n*- ${usedPrefix + command}* link v2 sd/hd\n*- ${usedPrefix + command}* link v3 sd/hd`;
    version = version || ends[Math.floor(Math.random() * ends.length)];
    quality = quality || ['hd', 'sd'][Math.floor(Math.random() * 2)];
    if (!(links && version && quality)) return conn.reply(m.chat, msgg, m);

    if (ends.includes(version)) {
        if (version.toLowerCase() === "v1") {
            try {
                let results = await facebook.v1(links);
                if (!(quality)) return conn.reply(m.chat, msgg, m);
                let caption = `*[ F A C E B O O K   V1 ]*

*Title:* ${results.title}
*HD:* ${results.isHdAvailable}
    `;
                let out;
                if (quality == "hd") {
                    out = results.urls[0].hd ? results.urls[0].hd : (results.urls[1].sd ? results.urls[1].sd : giflogo);
                }
                if (quality == "sd") {
                    out = results.urls[1].sd ? results.urls[1].sd : (results.urls[0].hd ? results.urls[0].hd : giflogo);
                }
                await m.reply(wait);
                await conn.sendFile(m.chat, out, "", caption, m);
            } catch (e) {
                await m.reply(eror);
            }
        }
        if (version.toLowerCase() === "v2") {
            try {
                let results = await FbDownload(links);
                if (!(quality)) return conn.reply(m.chat, msgg, m);
                let caption = `*[ F A C E B O O K   V2 ]*

*Title:* ${results.title}`;

                let out;
                if (quality == "hd") {
                    out = results.links['Download High Quality'] ? results.links['Download High Quality'] : (results.links['Download Low Quality'] ? results.links['Download Low Quality'] : giflogo);
                }
                if (quality == "sd") {
                    out = results.links['Download Low Quality'] ? results.links['Download Low Quality'] : (results.links['Download High Quality'] ? results.links['Download High Quality'] : giflogo);
                }

                await m.reply(wait);
                await conn.sendFile(m.chat, out, "", caption, m);
            } catch (e) {
                await m.reply(eror);
            }
        }

        if (version.toLowerCase() === "v3") {
            try {
                if (!(quality)) return conn.reply(m.chat, msgg, m);
                const { result } = await facebookdl(links);
                const results = result;
                let caption = `*[ F A C E B O O K  V3 ]*

*Title:* ${results.title}`;

                let out;
                if (quality.toLowerCase() === "hd") {
                    out = results.find(video => video.quality === "hd") ? results.find(video => video.quality === "hd") : (results.find(video => video.quality === "sd") ? results.find(video => video.quality === "sd") : giflogo);
                }
                if (quality.toLowerCase() == "sd") {
                    out = results.find(video => video.quality === "sd") ? results.find(video => video.quality === "sd") : (results.find(video => video.quality === "hd") ? results.find(video => video.quality === "hd") : giflogo);
                }

                await m.reply(wait);
                await conn.sendFile(m.chat, out, "", caption, m);
            } catch (e) {
                await m.reply(eror);
            }
        }
        if (version.toLowerCase() === "v4") {
            try {
                let results = await facebookVideo(links);
                if (!(quality)) return conn.reply(m.chat, msgg, m);
                let caption = `*[ F A C E B O O K   V4 ]*

*Duration:* ${results.duration}`;
                let out;
                if (quality == "hd") {
                    out = results.result[0].url ? results.result[0].url : (results.result[1].url ? results.result[1].url : giflogo);
                }
                if (quality == "sd") {
                    out = results.result[1].url ? results.result[1].url : (results.result[0].url ? results.result[0].url : giflogo);
                }
                await m.reply(wait);
                await conn.sendFile(m.chat, out, "", caption, m);
            } catch (e) {
                await m.reply(eror);
            }
        }
    }
};

handler.help = ["facebook3"];
handler.tags = ["downloader"];
handler.command = /^((facebook|fbdl|fb|fbdown|fesbuk|dlfb|facebookdl))$/i;
module.exports = handler;

async function FbDownload(vid_url) {
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
    } catch (e) {
        return null;
    }
}

const baseURL = "https://fdownloader.net/id";
const apiURL = "https://v3.fdownloader.net/api/ajaxSearch?lang=en";

const facebookVideo = async (url) => {
    try {
        const { data } = await axios(baseURL, {
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
        const { data: apiData } = await axios(apiURL, {
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
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Function to get random image (dummy implementation)
function getRandomImage() {
    return 'https://telegra.ph/file/998289e64741b091596fb.jpg'; // Replace with actual implementation
}

// Dummy implementations for variables used in the code
const giflogo = 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHp5ajFmM2Y0dmQ3a3g4d2FrdGR3dnkweHE2bDl1cXY4b3FxaXhlZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3978y5HqiEtqupiM/giphy.webp'; // Replace with actual gif logo URL
const wait = 'Please wait...'; // Replace with actual wait message
const eror = 'An error occurred'; // Replace with actual error message
