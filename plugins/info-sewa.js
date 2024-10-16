let fetch = require('node-fetch')

let handler = async (m, { conn, command }) => {
    let buffer = await fetch('https://telegra.ph/file/dcdedc277557f69bbe06b.jpg').then(res => res.buffer())
    conn.sendFile(m.chat, buffer, 'hasil.jpg', `Hai 👋
Ayo kakak kakak dan teman teman untuk ikut membantu owner HaFlazh-BOT menjadi lebih 
baik kembali dengan cara ikut berdonasi, opsi pembayarannya ada dibawah yaa kak

┏━━━ꕥ〔 Hafizh's 〕ꕥ━⬣ 
┃Pulsa: 085651307830 ( Im3 )
┃Pulsa: 085921738489 ( XL )
┃Gopay: 085651307830
┃Dana: 085651307830
┃ShopeePay: 085651307830
┃OVO: 085651307830
┃LinkAja: 085651307830
┗━━━ꕥ

┏━━━ꕥ〔 Website 〕ꕥ━⬣ 
┃Saweria: https://saweria.co/HafizhFlash
┃Trakteer: https://trakteer.id/HafizhFlash22
┃Socialbuzz: https://socialbuzz.com/hafizh_flash
┃Thanks for Donationing!
┗━━━ꕥ

Bagi kalian yang sudah berdonasi, chat owner ajaa untuk mendapatkan premium dengan 
ketik .owner lalu kirim bukti ke owner yaaa

Terimakasih atas donasinya kakak
Contact person Owner:
wa.me/6285651307830 (Owner)

donasi via follow ig juga boleh hehe...`, m)
}

handler.help = handler.command = ['donasi','donate','sewa','sewabot','belibot']
handler.tags = ['main']
module.exports = handler