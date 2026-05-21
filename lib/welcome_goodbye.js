// welcome_goodbye.js
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { join } = require('path');

/**
 * Membuat gambar ucapan selamat datang / selamat tinggal
 * @param {Object} params
 * @param {string} params.type - 'welcome' atau 'goodbye'
 * @param {string} params.userPhotoUrl - URL foto profil user
 * @param {string} params.groupPhotoUrl - URL foto profil group
 * @param {string} params.userName - Nama user
 * @param {string} params.groupName - Nama group
 * @param {string} params.backgroundUrl - URL background
 * @returns {Promise<Buffer>} - Buffer gambar PNG
 */
async function createWelcomeCanvas({ type, userPhotoUrl, groupPhotoUrl, userName, groupName, backgroundUrl }) {
    // Ukuran canvas
    const width = 1024;
    const height = 450;

    // Buat canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 1. Gambar background (dari URL)
    try {
        const bgImage = await loadImage(backgroundUrl);
        ctx.drawImage(bgImage, 0, 0, width, height);
    } catch (e) {
        // Fallback warna gradien
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(1, '#3498db');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    // Overlay gelap agar teks terbaca
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Shadow global untuk elemen (akan direset sesuai kebutuhan)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;

    // ========== FOTO PROFILE USER (kiri) ==========
    const userPicSize = 180;
    const userX = 100;
    const userY = (height - userPicSize) / 2; // 135

    // Buat lingkaran dengan shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(userX + userPicSize/2, userY + userPicSize/2, userPicSize/2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Gambar foto user
    try {
        const userPic = await loadImage(userPhotoUrl);
        ctx.drawImage(userPic, userX, userY, userPicSize, userPicSize);
    } catch (e) {
        // Fallback jika gagal: lingkaran abu-abu
        ctx.fillStyle = '#95a5a6';
        ctx.fill();
    }
    ctx.restore();

    // Border putih di sekitar lingkaran (dengan shadow)
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    ctx.beginPath();
    ctx.arc(userX + userPicSize/2, userY + userPicSize/2, userPicSize/2 + 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    // ========== FOTO PROFILE GROUP (kecil, kanan atas) ==========
    const groupPicSize = 70;
    const groupX = width - 150;
    const groupY = 50;

    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.arc(groupX + groupPicSize/2, groupY + groupPicSize/2, groupPicSize/2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    try {
        const groupPic = await loadImage(groupPhotoUrl);
        ctx.drawImage(groupPic, groupX, groupY, groupPicSize, groupPicSize);
    } catch (e) {
        ctx.fillStyle = '#bdc3c7';
        ctx.fill();
    }
    ctx.restore();

    // Border lingkaran group
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.arc(groupX + groupPicSize/2, groupY + groupPicSize/2, groupPicSize/2 + 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // ========== TEKS ==========
    // Reset shadow untuk teks agar tidak terlalu blur
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = '#ffffff';

    // Teks utama (welcome/goodbye)
    const mainText = type === 'welcome' ? 'Selamat Datang' : 'Selamat Tinggal';
    ctx.font = 'bold 48px "Segoe UI", "Poppins", Arial, sans-serif';
    ctx.fillText(mainText, 350, 170);

    // Nama user
    ctx.font = 'bold 42px "Segoe UI", "Poppins", Arial, sans-serif';
    ctx.fillText(userName, 350, 250);

    // Nama group dengan icon (atau tanpa icon)
    ctx.font = '30px "Segoe UI", "Poppins", Arial, sans-serif';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText(groupName, 350, 330);

    // Garis dekoratif di bawah teks (opsional)
    ctx.shadowBlur = 5;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 360);
    ctx.lineTo(650, 360);
    ctx.stroke();

    // ========== ELEMEN TAMBAHAN (bingkai modern) ==========
    // Kita bisa tambahkan bingkai tipis di sekeliling canvas
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 15, width - 30, height - 30);

    // Kembalikan buffer
    return canvas.toBuffer('image/png');
}

module.exports = { createWelcomeCanvas };