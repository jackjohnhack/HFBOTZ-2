let { webp2mp4, webp2png } = require('../lib/webp2mp4');
let { getBuffer } = require('../lib/myfunc');

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw `Balas stiker dengan caption *${usedPrefix + command}*`;
  let mime = m.quoted.mimetype || '';
  if (!/webp/.test(mime)) throw `Balas stiker dengan caption *${usedPrefix + command}*`;
  let media = await m.quoted.download();
  let out = Buffer.alloc(0);
  m.reply(wait)
  	
  if (command === 'tovideo' || command === 'tovid' || command === 'togif') {
    out = await webp2mp4(media);
    const vd = await getBuffer(out);
    await conn.sendFile(m.chat, vd, 'out.mp4', null, m);
  } else if (command === 'toimg') {
    out = await webp2png(media);
    await conn.sendFile(m.chat, out, 'out.png', '*DONE*', m, false, {
      thumbnail: Buffer.alloc(0)
    });
  }
}

handler.command = ['tovideo', 'togif', 'tovid', 'toimg'];
handler.help = ['tovideo', 'togif', 'tovid', 'toimg (reply)'];
handler.tags = ['sticker'];
handler.group = false;

module.exports = handler;

