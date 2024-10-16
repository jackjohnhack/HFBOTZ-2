const fg = require('api-dylux');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `Contoh pemakaian: ${usedPrefix + command} https://fb.watch/d7nB8-L-gR/`;
  try {
    let result = await fg.fbdl(args[0]);
    let tex = `
 ┌─⊷ *Dylux FBDL Premium*
 ▢ *Judul:* ${result.title}
 └───────────`;
    conn.sendFile(m.chat, result.videoUrl, 'fb.mp4', tex, m);
  } catch (error) {
    m.reply(`Error: ${error}`);
  }
};

handler.help = ['facebook2'];
handler.tags = ['downloader'];
handler.command = /^(facebook2|fb2|fbdl2|facebookdl2|fbdown2|dlfb2|fesbuk2)$/i;
handler.limit = true;

module.exports = handler;