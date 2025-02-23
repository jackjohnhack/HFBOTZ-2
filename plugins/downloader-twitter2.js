const fg = require('api-dylux');

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `📌 Contoh : \n*${usedPrefix + command}* https://twitter.com/fernandavasro/status/1569741835555291139?t=ADxk8P3Z3prq8USIZUqXCg&s=19`;
  m.react(rwait);
  try {
    let { SD, HD, desc, thumb, audio } = await fg.twitter(args[0]);
    let te = ` 
┌─⊷ *TWITTER DL*
▢ Deskripsi: ${desc}
└───────────`;
    conn.sendFile(m.chat, HD, 'twitter.mp4', te, m);
    m.react(done);
  } catch (e) {
    m.reply(`✳️ memverifikasi bahwa tautan berasal dari Twitter`);
  }
};

handler.help = ['twitter'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(twitter2|tw2|x2)$/i;
handler.limit = true;

module.exports = handler;