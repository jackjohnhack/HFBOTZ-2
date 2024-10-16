/*
    [FITUR BY EGVUAXRL GAUSAH DI APUS]
    
    *DULU NIAT BIAR BISA BUAT VIDEO AESTETIK DARI BOT CUMA SUDAH PENSI NGEBOT JADI ELO LANJUTIN AJA NIH. BUAT CODE INI AGAR BISA ATUR FILTER VIDEO JADI GELAP KASIH SHAPE GELAP DAN BUAT AGAR BISA DI ATUR DAN KASIH FITUR YG LAIN KYK UBAH SUARA VIDEO DAN GA CUMA UBAH WARNA VIDEO YG JADI KYK ESTETIK" TAPI ADA EFEK" TRANSISI JUGA FLUENT FFMPEG BISA MLAKUKAN HAL TSB CUMA SY GA LANJUTIN MONGGO LANJUTIN
    
    link ch egvuaxrl untuk fitur yang lain : https://whatsapp.com/channel/0029Va9iaylFy724TO4TSc0J
    
    link gc untuk saran : https://chat.whatsapp.com/Gz3xoYG4mzaFP0xamibtFy
*/

const {promises} = require('fs');
const util = require('util');
const {exec} = require('child_process');
const ffmpeg = require('fluent-ffmpeg');

const execPromise = util.promisify(exec);

let egvuaxrl = async (m, {conn, args, usedPrefix, command}) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!/video/.test(mime)) {
        throw `Balas video yang ingin diubah dengan caption *${usedPrefix + command}*`;
    }
    let video = await q.download?.();
    if (!video) {
        throw 'Tidak dapat mengunduh video!';
    }
    if (!args[0]) {
        throw `Contoh: ${usedPrefix + command} <kecerahan> <kontras> <warna> <kecepatan>\n\n*Daftar Nilai:*\n- Kecerahan: -100 hingga 100 (default: 0)\n- Kontras: -100 hingga 100 (default: 0)\n- Warna: -100 hingga 100 (default: 0)\n- Kecepatan: 0.5 hingga 20 (default: 1)`;
    }
    let brightness = parseInt(args[0]);
    let contrast = parseInt(args[1]);
    let saturation = parseInt(args[2]);
    let speed = parseFloat(args[3]);
    if (isNaN(brightness) || isNaN(contrast) || isNaN(saturation) || isNaN(speed)) {
        throw 'Parameter harus berupa angka!';
    }
    if (brightness < -100 || brightness > 100 || contrast < -100 || contrast > 100 || saturation < -100 || saturation > 100) {
        throw 'Parameter harus berada dalam rentang -100 hingga 100!';
    }
    if (speed < 0.5 || speed > 20) {
        throw 'Kecepatan harus berada dalam rentang 0.5 hingga 20!';
    }
    let ran = (new Date() * 1) + '.mp4';
    let media = './tmp/' + ran;
    let filename = media + '.mp4';
    await promises.writeFile(media, video);
    try {
        await execPromise(`ffmpeg -i ${media} -vf "eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}" -filter:v "setpts=${1/speed}*PTS" -filter:a "atempo=${speed}" ${filename}`);
        await promises.unlink(media);
        let buff = await promises.readFile(filename);
        m.reply('_Sedang mengirim video..._');
        conn.sendFile(m.chat, buff, filename, null, m, true, {quoted: m, mimetype: 'video/mp4'});
        await promises.unlink(filename);
    } catch (err) {
        await promises.unlink(media);
        throw 'Terjadi kesalahan saat mengubah video!';
    }
};
egvuaxrl.help = ['colorfilter <kecerahan> <kontras> <warna> <kecepatan>'];
egvuaxrl.tags = ['colorfilter'];
egvuaxrl.command = /^(colorvidfilter)$/i;

module.exports = egvuaxrl;