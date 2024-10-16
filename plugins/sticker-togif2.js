const { webp2mp4 } = require('../../lib/webp2mp4');

const handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  if (!m.quoted) throw new Error(`Balas stiker dengan caption *${usedPrefix}${command}*`);
  
  let q = m.quoted ? m.quoted : m,
      mime = (q.msg || q).mimetype || "";

  if (!/\bwebp\b/i.test(mime)) throw new Error(`Balas stiker dengan caption *${usedPrefix}${command}*`);

  let media = await q?.download(),
      out = Buffer.alloc(0);

  /\bwebp\b/i.test(mime) && (out = await webp2mp4(media));

  await conn.sendMessage(m.chat, {
    video: {
      url: out.toString()
    },
    caption: '✅ Sticker A Gif',
    gifPlayback: true,
    gifAttribution: Math.floor(Math.random() * 3)
  }, {
    quoted: m
  });

};

// Mengatur bantuan dan tag untuk komando.
handler.help = ['togif(reply media)'],
handler.tags  	= ['sticker'],
handler.command = /^(togif2?)$/i;

// Menyimpan handler sebagai export default agar dapat diakses dari luar file.

module.exports.handler = handler;