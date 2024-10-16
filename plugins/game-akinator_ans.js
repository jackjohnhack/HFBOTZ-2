const { Aki } = require('aki-api');

let handler = async (m, { conn, usedPrefix, args }) => {
    // Inisialisasi objek akinator jika belum ada
    conn.akinator = conn.akinator ? conn.akinator : {};

    // Cek apakah pengirim sudah ada dalam sesi akinator
    if (!(m.sender in conn.akinator)) return m.reply('Kamu belum ada di sesi akinator!');

    // Cek apakah ada argumen jawaban yang diberikan
    if (!args[0]) return m.reply('Masukan Jawaban Kamu!');

    // Validasi apakah jawaban yang diberikan adalah angka yang valid (0-4)
    if (!/0|1|2|3|4/i.test(args[0])) return m.reply('Invalid Number');

    // Hapus timeout sebelumnya untuk sesi pengguna
    clearTimeout(conn.akinator[m.sender].waktu);

    // Lanjutkan ke langkah berikutnya dalam sesi akinator
    await conn.akinator[m.sender].step(args[0]);

    let { question, currentStep, progress } = conn.akinator[m.sender];

    // Cek apakah progress atau langkah saat ini sudah mencukupi untuk menebak
    if (progress >= 70 || currentStep >= 78) {
        await conn.akinator[m.sender].win();
        let { answers } = conn.akinator[m.sender];

        // Membuat caption untuk jawaban Akinator
        let cap = `🎮 *Akinator Answer*\n\n`;
        cap += `Dia Adalah *${answers[0].name}* Dari *${answers[0].description}*`;

        // Mengirim gambar hasil tebakan bersama dengan caption
        conn.sendFile(m.chat, answers[0].absolute_picture_path, '', cap, m);

        // Menghapus sesi akinator untuk pengguna tersebut
        delete conn.akinator[m.sender];
    } else {
        // Membuat teks untuk pertanyaan Akinator berikutnya
        let txt = `🎮 *Akinator* 🎮\n\n@${m.sender.split('@')[0]}\n`;
        txt += `_step ${currentStep} ( ${progress.toFixed(2)} % )_\n\n${question}\n\n`;
        txt += '🎮 _*Silahkan Jawab Dengan Cara:*_\n';
        txt += `_*Ya* - ${usedPrefix}answer 0_\n`;
        txt += `_*Tidak* - ${usedPrefix}answer 1_\n`;
        txt += `_*Saya Tidak Tahu* - ${usedPrefix}answer 2_\n`;
        txt += `_*Mungkin* - ${usedPrefix}answer 3_\n`;
        txt += `_*Mungkin Tidak* - ${usedPrefix}answer 4_`;

        // Mengirim pertanyaan dan menyimpan referensi pesan untuk sesi pengguna
        conn.akinator[m.sender].chat = await conn.reply(m.chat, txt, m, { mentions: [m.sender] });

        // Mengatur timeout untuk sesi Akinator jika pengguna tidak menjawab
        conn.akinator[m.sender].waktu = setTimeout(() => {
            conn.reply(m.chat, `Waktu Memilih Akinator Habis`, conn.akinator[m.sender].chat);
            delete conn.akinator[m.sender];
        }, 60000);
    }
};

// Menentukan perintah yang akan memicu handler ini
handler.command = /^(answer)$/i;
handler.limit = false;
handler.group = true;

// Mengekspor handler sebagai modul
module.exports = handler;
