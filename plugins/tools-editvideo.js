/*
    [FITUR BY EGVUAXRL GAUSAH DI APUS]
    [FITUR CUT VIDEO CUT AUDIO SPEED VIDEO DAN SPEED AUDIO DAN MENINGKATKAN VOLUME VIDEO ATAUPUN AUDIO. JANGAN HAPUS CR HARGAIN YANG BUAT]
    
    link ch egvuaxrl untuk fitur yang lain : https://whatsapp.com/channel/0029Va9iaylFy724TO4TSc0J
    
    link gc untuk saran : https://chat.whatsapp.com/Gz3xoYG4mzaFP0xamibtFy
*/

const { promises } = require('fs');
const { join } = require('path');
const { exec } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');

let egvuaxrl = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `example: ${usedPrefix + command} 0.5 atau cutvideo contoh: .cutvideo 00:00:10 00:00:20\n\n*Format Durasi:*\n- HH:MM:SS\n- MM:SS\n- SS\n\n*Contoh:*\n- 00:00:10 00:00:20 (Potong video dari detik 10 sampai 20)\n- 02:30 04:00 (Potong video dari menit 2 detik 30 sampai menit 4)\n- 30 40 (Potong video dari detik 30 sampai detik 40)\n atau cutaudio example: .cutaudio 00:00:25 00:00:30`;
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let speed = parseFloat(args[0]);
    if (isNaN(speed) || speed <= 0) throw 'Speed harus berupa angka yang lebih besar dari 0 atau jika ingin cutvideo contoh: .cutvideo 00:00:10 00:00:20\n\n*Format Durasi:*\n- HH:MM:SS\n- MM:SS\n- SS\n\n*Contoh:*\n- 00:00:10 00:00:20 (Potong video dari detik 10 sampai 20)\n- 02:30 04:00 (Potong video dari menit 2 detik 30 sampai menit 4)\n- 30 40 (Potong video dari detik 30 sampai detik 40)\n atau cutaudio example: .cutaudio 00:00:25 00:00:30';
    
    if (command === "speedaudio") {
        if (!/audio/.test(mime)) throw `Balas audio yang ingin diubah dengan caption *${usedPrefix + command}*`;
        let audio = await q.download?.();
        if (!audio) throw 'Can\'t download audio!';
        
        let ran = (new Date() * 1) + '.mp3';
        let media = './tmp/' + ran;
        let filename = media + '.mp3';
        await promises.writeFile(media, audio);
        
        exec(`ffmpeg -i ${media} -filter:a "atempo=${speed}" ${filename}`, async (err) => {
            await promises.unlink(media);
            if (err) return Promise.reject(`_*Error!*_`);
            
            let buff = await promises.readFile(filename);
            conn.sendFile(m.chat, buff, filename, null, m, true, { quoted: m, mimetype: 'audio/mp3' });
            await promises.unlink(filename);
        });
    } else if (command === "speedvideo") {
        if (!/video/.test(mime)) throw `Balas video yang ingin diubah dengan caption *${usedPrefix + command}*`;
        let video = await q.download?.();
        if (!video) throw 'Can\'t download video!';
        
        let ran = (new Date() * 1) + '.mp4';
        let media = './tmp/' + ran;
        let filename = media + '.mp4';
        await promises.writeFile(media, video);
        
        exec(`ffmpeg -i ${media} -filter:v "setpts=${1/speed}*PTS" -filter:a "atempo=${speed}" ${filename}`, async (err) => {
            await promises.unlink(media);
            if (err) return Promise.reject(`_*Error!*_`);
            
            let buff = await promises.readFile(filename);
            conn.sendFile(m.chat, buff, filename, null, m, true, { quoted: m, mimetype: 'video/mp4' });
            await promises.unlink(filename);
        });
    } else if (command === "volume") {
    let volumeFactor = args[0] === 'besar' ? 2.0 : args[0] === 'kecil' ? 0.5 : parseFloat(args[0])
    if (/audio/.test(mime)) {
        let audio = await q.download?.()
        if (!audio) throw 'Can\'t download audio!'
        
        let ran = (new Date() * 1) + '.mp3'
        let media = './tmp/' + ran
        let outputName = `./tmp/adjusted_${ran}`
        
        await promises.writeFile(media, audio)
        await adjustVolume(media, outputName, volumeFactor)
        
        let buff = await promises.readFile(outputName)
        m.reply('Berhasil menyesuaikan volume audio')
        conn.sendFile(m.chat, buff, outputName, null, m, true, { quoted: m, mimetype: 'audio/mp4' })
        
        await promises.unlink(media)
        await promises.unlink(outputName)
    } else if (/video/.test(mime)) {
        let video = await q.download?.()
        if (!video) throw 'Can\'t download video!'
        
        let ran = (new Date() * 1) + '.mp4'
        let media = './tmp/' + ran
        let outputName = `./tmp/adjusted_${ran}`
        
        await promises.writeFile(media, video)
        await adjustVideoVolume(media, outputName, volumeFactor)
        
        let buff = await promises.readFile(outputName)
        m.reply('Berhasil menyesuaikan volume video')
        conn.sendFile(m.chat, buff, outputName, null, m, true, { quoted: m, mimetype: 'video/mp4' })
        
        await promises.unlink(media)
        await promises.unlink(outputName)
    } else {
        throw `Balas vn/audio atau video yang ingin diubah dengan caption *${usedPrefix + command}*`
    };
    } else if (command === "cutaudio") {
        if (!/audio/.test(mime)) throw `Balas vn/audio yang ingin diubah dengan caption *${usedPrefix + command}*`
        let audio = await q.download?.()
        if (!audio) throw 'Can\'t download audio!'
        if (!args[0] || !args[1]) throw `example: ${usedPrefix + command} 00:00:30 00:00:30`
            let ran = (new Date * 1) + '.mp3'
            let media = './tmp/' + ran
            let filename = media + '.mp3'
            await promises.writeFile(media, audio)
            exec(`ffmpeg -ss ${args[0]} -i ${media} -t ${args[1]} -c copy ${filename}`, async (err) => {
                await promises.unlink(media)
                if (err) return Promise.reject( `_*Error!*_`)
                let buff = await promises.readFile(filename)
                m.reply(wait)
                conn.sendFile(m.chat, buff, filename, null, m, true, { quoted: m, mimetype: 'audio/mp4' })
                await promises.unlink(filename)
            });
            } else if (command === "cutvideo") {     
    if (!/video/.test(mime)) throw `Balas video yang ingin diubah dengan caption *${usedPrefix + command}*`;
    let video = await q.download();
    if (!video) throw 'Tidak dapat mengunduh video!';
    if (!args[0] || !args[1]) throw `Contoh: ${usedPrefix + command} 00:00:10 00:00:20\n\n*Format Durasi:*\n- HH:MM:SS\n- MM:SS\n- SS\n\n*Contoh:*\n- 00:00:10 00:00:20 (Potong video dari detik 10 sampai 20)\n- 02:30 04:00 (Potong video dari menit 2 detik 30 sampai menit 4)\n- 30 40 (Potong video dari detik 30 sampai detik 40)`;
    let startDuration = args[0];
    let endDuration = args[1];
    let ran = (new Date() * 1) + '.mp4';
    let media = './tmp/' + ran;
    let filename = './tmp/' + ran + '.mp4';
    await promises.writeFile(media, video);
    exec(`ffmpeg -i ${media} -ss ${startDuration} -to ${endDuration} -c:v libx264 -c:a aac ${filename}`, async (err) => {
        await promises.unlink(media);
        if (err) return Promise.reject('Terjadi kesalahan saat memotong video!');
        let buff = await promises.readFile(filename);
        m.reply('_Sedang mengirim video..._');
        conn.sendFile(m.chat, buff, filename, null, m, true, { quoted: m, mimetype: 'video/mp4' });
        await promises.unlink(filename);
    });
    }
};

egvuaxrl.help = ['speedaudio', 'speedvideo', 'volume', 'cutaudio', 'cutvideo']
egvuaxrl.tags = ['audio'];
egvuaxrl.command = /^(speedaudio|speedvideo|volume|cutaudio|cutvideo)$/i;

module.exports = egvuaxrl;

const adjustVolume = async (filePath, outputName, volumeFactor) => {
    return new Promise((resolve, reject) => {
        exec(`ffmpeg -i ${filePath} -af volume=${volumeFactor} ${outputName}`, async (err) => {
            if (err) {
                reject('Failed to adjust volume')
            } else {
                resolve(outputName)
            }
        })
    })
}

const adjustVideoVolume = async (filePath, outputName, volumeFactor) => {
    return new Promise((resolve, reject) => {
        exec(`ffmpeg -i ${filePath} -af volume=${volumeFactor} -vcodec copy ${outputName}`, async (err) => {
            if (err) {
                reject('Failed to adjust volume on video')
            } else {
                resolve(outputName)
            }
        })
    })
}