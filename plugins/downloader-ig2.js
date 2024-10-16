const { instagramdl } = require("@bochilteam/scraper");
const { savefrom, snapsave } = require("@bochilteam/scraper-sosmed");
const fetch = require("node-fetch");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs").promises;

async function handler(m, { args, conn, usedPrefix, command }) {
  if (!args[0])
    throw `Contoh pemakaian: ${usedPrefix}${command} https://www.instagram.com/reel/C0EEgMNSSHw/?igshid=MzY1NDJmNzMyNQ==`;
  const instagramUrlRegex = /^(https?:\/\/)?(www\.)?instagram\.com/i;
  if (!instagramUrlRegex.test(args[0])) {
    conn.reply(
      m.chat,
      `Harap masukkan link instagram\nContoh pemakaian: ${usedPrefix}${command} https://www.instagram.com/reel/C0EEgMNSSHw/?igshid=MzY1NDJmNzMyNQ==`,
      m
    );
    return;
  }

  let res;
  try {
    res = await snapsave(args[0]);
    conn.reply(m.chat, "Sedang mengunduh video... pada server snapsave", m);
  } catch (error1) {
    try {
      res = await instagramdl(args[0]);
      conn.reply(
        m.chat,
        "Sedang mengunduh video... pada server instagramdl",
        m
      );
    } catch (error2) {
      try {
        res = await savefrom(args[0]);
        conn.reply(m.chat, "Sedang mengunduh video... pada server savefrom", m);
      } catch (error3) {
        console.log("error", error3);
        conn.reply(m.chat, "Gagal mengunduh video", m);
      }
    }
    conn.reply(m.chat, "error", m);
  }


  try {
    let media = await res[0].url;
    const sender = m.sender.split(`@`)[0];

    if (!res) throw "Tidak dapat mengunduh postingan";

    await conn.sendMessage(
      m.chat,
      {
        video: { url: media },
        caption: `Ini videonya @${sender}`,
        mentions: [m.sender],
      },
      m,
    );

    const mp3FileName = `suara.mp3`;
    await convertVideoToMp3(media, mp3FileName);

    await conn.sendFile(
      m.chat,
      mp3FileName,
      mp3FileName,
      `Versi audionya`,
      m,
    );

    await fs.unlink(mp3FileName);
  } catch (e) {
    try {
      let response = await fetch(
        `https://tr.deployers.repl.co/instagramdl?url=${encodeURIComponent(
          args[0],
        )}`,
      );
      let data = await response.json();

      if (data.image || data.video) {
        const sender = m.sender.split(`@`)[0];

        conn.reply(m.chat, "Sedang mengunduh video... pada server 2", m);

        await conn.sendMessage(
          m.chat,
          {
            video: data.video,
            caption: `Ini videonya @${sender}`,
            mentions: [m.sender],
          },
          m,
        );

        const mp3FileName = `suara.mp3`;
        await convertVideoToMp3(data.video, mp3FileName);

        await conn.sendFile(
          m.chat,
          mp3FileName,
          mp3FileName,
          `Versi audionya`,
          m,
        );

        await fs.unlink(mp3FileName);
      } else {
        throw "Gagal mengunduh video";
      }
    } catch (error) {
      conn.reply(m.chat, "Gagal mengunduh video", m);
    }
  }
}

async function convertVideoToMp3(videoUrl, outputFileName) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoUrl)
      .toFormat("mp3")
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(outputFileName);
  });
}

handler.help = ['ig'].map(v => v + ' <url>')
handler.tags = ["downloader"];
handler.command = /^(ig|instagram|instagramdl|igdl|igstory)$/i;
handler.limit = true;

module.exports = handler;
