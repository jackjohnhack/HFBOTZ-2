const fg = require('api-dylux');
const { youtubedl, youtubedlv2, youtubedlv3 } = require('@bochilteam/scraper');
let limit = 350;
let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
    if (!args || !args[0]) throw `✳️ Contoh :\n${usedPrefix + command} https://youtu.be/YzkTFFwxtXI`;
    if (!args[0].match(/youtu/gi)) throw `❎ Memverifikasi bahwa link YouTube`;
    let chat = global.db.data.chats[m.chat];
    try {
        let q = args[1] || '360p';
        let v = args[0];
        const yt = await youtubedl(v).catch(async () => await youtubedlv2(v)).catch(async () => await youtubedlv3(v));
        const dl_url = await yt.video[q].download();
        const title = await yt.title;
        const size = await yt.video[q].fileSizeH;

        if (size.split('MB')[0] >= limit) return m.reply(` ≡  *PLAY YTDL*\n\n▢ *⚖️Size* : ${size}\n▢ *🎞️Kualitas* : ${q}\n\n▢ _File melebihi batas unduhan_ *+${limit} MB*`);
        conn.sendFile(m.chat, dl_url, title + '.mp4', `
 ≡  *PLAY YTDL PREM*
  
▢ *📌Titel* : ${title}
▢ *📟 Ext* : mp4
▢ *🎞️Kualitas* : ${q}
▢ *⚖️Size* : ${size}
`.trim(), m, false, { asDocument: chat.useDocument });
        m.react(done);

    } catch {

        m.reply(`✳️ Kesalahan mengunduh video coba yang lain`);
        /*const { title, result, quality, size, duration, thumb, channel } = await fg.ytv(args[0])
        if (size.split('MB')[0] >= limit) return m.reply(` ≡  *FG YTDL2*\n\n▢ *⚖️Ukuran* : ${size}\n▢ *🎞️Kualitas* : ${quality}\n\n▢ _The file exceeds the download limit_ *+${limit} MB*`)
    conn.sendFile(m.chat, result, title + '.mp4', `
     ≡  *FG YTDL2 PREM*
      
    ▢ *📌Judul* : ${title}
    ▢ *📟 Ext* : mp4
    ▢ *⚖️Ukuran* : ${size}
    `.trim(), m, false, { asDocument: chat.useDocument });
        m.react(done);*/
    }

}
handler.help = ['ytmp4 <link yt>'];
handler.tags = ['downloader'];
handler.command = ['ytmp42', 'fgmp42', 'ytv2'];
handler.limit = true;

module.exports = handler;
