/*
    [FITUR BY EGVUAXRL GAUSAH DI APUS]

    link ch egvuaxrl untuk fitur yang lain : https://whatsapp.com/channel/0029Va9iaylFy724TO4TSc0J
    
    link gc untuk saran : https://chat.whatsapp.com/Gz3xoYG4mzaFP0xamibtFy

SAMPAIKAN KE KOMINFO FITUR PASSWORD GENERATOR INI BIAR DIA BISA KORUP LEBIH BANYAK KRN SUDAH ADA TINDAKAN GANTI PW DENGAN LEBIH AMAN
*/

const { createHash } = require('crypto');
const { randomBytes } = require('crypto');

const egvuaxrl = async (m, { conn, text }) => {
  if (!text) throw 'Teksnya mana? contoh: .generatepw lemah/sedang/kuat/kuatsekali <panjang pw> <karakter khusus> <karakter blokir>';
  
word = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };
  
    const generateWeakPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateMediumPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };
  
  const generateStrongPassword = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateStrongestPassword = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generatePassword = (strength, length) => {
    switch (strength) {
      case 'lemah':
        return generateWeakPassword();
      case 'sedang':
        return generateMediumPassword(length);
      case 'kuat':
        return generateStrongPassword(length);
      case 'kuatsekali':
        return generateStrongestPassword(length);
      default:
        return generateMediumPassword(length);
    }
  };

  const parseCommand = (input) => {
    const parts = input.split(' ');
    const strength = parts[0].replace('.generatepw', '').trim();
    let specialChars = '';
    let blockWord = '';
    let length = 10;

    if (parts.length > 1) {
      length = parseInt(parts[1].replace(/[^0-9]/g, ''), 10);
    }

    if (parts.length > 2) {
      specialChars = parts[2].replace(/[^a-zA-Z0-9]/g, '');
    }

    if (parts.length > 3) {
      blockWord = parts.slice(3).join(' ').replace(/[^a-zA-Z]/g, '');
    }

    return { strength, length, specialChars, blockWord };
  };

  const { strength, length, specialChars, blockWord } = parseCommand(text);

  let password = '';

  while (true) {
    password = generatePassword(strength, length);

    if (specialChars) {
      password = password + specialChars;
    }

    if (blockWord && password.includes(blockWord)) {
      continue;
    }

    break;
  }

  m.reply(`Password ${strength} (${length} karakter): ${password}`);
};

egvuaxrl.help = ['generatepw <kekuatan> <panjang_karakter> <karakter_khusus> <kata_blok>'];
egvuaxrl.tags = ['tools'];
egvuaxrl.command = /^(generatepw)$/i;

module.exports = egvuaxrl;