const fetch = require('node-fetch');
const api = require('api-dylux');

async function handler(m, { conn, args, text, usedPrefix, command }) {
  if (!args[0]) throw `Contoh pemakaian: ${usedPrefix + command} https://vt.tiktok.com/ZSFejUP4F/`;

  let f;
  try {
    // Ambil informasi video dari API Dylux TikTok
    f = await api.tiktok(args[0]);
  } catch (error) {
    console.error(error);
    throw 'Terjadi kesalahan saat mengambil data video TikTok.';
  }

  await conn.sendMessage(m.chat, { react: { text: "🕑", key: m.key } });

  // Buat caption dengan informasi video
  let cap = `DOWNLOADER TIKTOK\n\n`;
  cap += `Nickname: ${f.nickname}\n`;
  cap += `Duration: ${f.duration}\n`;
  cap += `Description: ${f.description}`;

  try {
    // Kirim file video ke chat
    await conn.sendFile(m.chat, f.play, 'ttmp4', cap, m);
  } catch (error) {
    console.error(error);
    throw 'Terjadi kesalahan saat mengirim file video TikTok.';
  }
}

handler.help = ['tiktok5'];
handler.tags = ['downloader'];
handler.command = /^(ttdl5|tiktok5|tiktokdl5|tiktokdownload5|tt5|tiktokvid5|ttvid5|ttnowm5|tiktoknowm5)$/i;
handler.premium = false;

module.exports = handler;