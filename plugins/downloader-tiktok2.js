const fetch = require('node-fetch');

let handler = async (m, { conn, usedPrefix, args, command, text }) => {
  if (!text) throw `Linknya Mana?`
  m.reply('Mohon Menunggu Sebentar!');
  try {
    let anu = await fetch(`https://ssa-api.vercel.app/api/tiktok?url=${text}`);
    let result = await anu.json();
    await conn.sendFile(m.chat, result.data.response.nowm, 'anu.mp4', `*Description:* ${result.data.response.title}`, m);
  } catch (e) {
    conn.sendFile(m.chat, 'eror', null, null, m, true, {
      type: "audioMessage",
      ptt: true,
    });
  }
};

handler.help = ['tiktok2'];
handler.tags = ['downloader'];
handler.command = /^(tiktok2|tt2|tiktokdl2|tiktoknowm2|ttdl2|tikdl2)$/i;
handler.limit = true;

module.exports = handler;