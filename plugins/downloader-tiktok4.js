let { ttdl } = require('btch-downloader')

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, `• *Example :* .tiktok https://vm.tiktok.com/xxxxxxxxxxxxxx`, m);
  }
  if (!text.match(/tiktok/gi)) {
    return conn.reply(m.chat, 'Make sure the link is from TikTok', m);
  }
  try {
    let p = await ttdl(`${text}`);
    await conn.sendFile(m.chat, p.video, 'tiktok.mp4', p.title, m);
  } catch (e) {
    console.error(e);
  }
};

handler.help = ['tiktok4'];
handler.tags = ['downloader'];
handler.command = /^(ttdl4|tiktok4|tiktokdl4|tiktokdownload4|tt4|tiktokvid4|ttvid4|ttnowm4|tiktoknowm4)$/i;
handler.premium = false;

module.exports = handler;
