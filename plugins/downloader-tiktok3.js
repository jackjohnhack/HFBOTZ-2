const https = require('https');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
      throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://vt.tiktok.com/ZSFNnpxvP/`
    }
try {
    if (!args[0].match(/tiktok/gi)) {
      throw `URL Tidak Ditemukan!`
    }
    m.reply('*Mohon tunggu..*')
    const api = await https.get(`https://api.betabotz.eu.org/api/download/tiktok?url=${args[0]}&apikey=${lann}`, response => {
      let data = '';
      response.on('data', chunk => {
        data += chunk;
      });
      response.on('end', async () => {
        const res = JSON.parse(data);
        var { 
          video, 
          title, 
          title_audio,
          audio
        } = res.result
        await conn.sendFile(m.chat, video, null, `Title: ${title}\nDeskripsi: ${title_audio}\nAudio: ${audio[0]}`, m);
          conn.sendMessage(m.chat, { audio: { url: audio[0] }, mimetype: 'audio/mpeg' }, { quoted: m });
      });
    }).on('error', error => {
      console.log(error);
      throw error.message
    });
  } catch (e) {
    console.log(e)
    throw `Terjadi Kesalahan!`
  }
};

handler.help = ['tiktok3'];
handler.command = /^(tiktok3|tt3|tiktokdl3|tiktoknowm3|ttdl3|tikdl3)$/i
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

module.exports = handler;
