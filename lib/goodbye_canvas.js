// goodbye_canvas.js
const { createCanvas, loadImage } = require('@napi-rs/canvas');

/**
 * Membuat gambar ucapan selamat tinggal dengan gaya modern
 * @param {Object} params
 * @param {string} params.userPhotoUrl - URL foto profil user
 * @param {string} params.userName - Nama user
 * @param {string} params.groupName - Nama grup
 * @param {number} params.memberCount - Jumlah member saat ini (opsional)
 * @param {string} params.backgroundUrl - URL background
 * @returns {Promise<Buffer>} Buffer gambar PNG
 */
async function createGoodbyeCanvas({ userPhotoUrl, userName, groupName, memberCount, backgroundUrl }) {
    const width = 1024;
    const height = 450;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Gambar background
    try {
        const bg = await loadImage(backgroundUrl);
        ctx.drawImage(bg, 0, 0, width, height);
    } catch {
        // Fallback gradient
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(1, '#4a5b6e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    // Overlay gelap
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, width, height);

    // Shadow untuk elemen
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;

    // ===== FOTO PROFIL (lingkaran besar) =====
    const picSize = 200;
    const picX = 120;
    const picY = (height - picSize) / 2; // 125

    // Lingkaran dengan border putih
    ctx.save();
    ctx.beginPath();
    ctx.arc(picX + picSize/2, picY + picSize/2, picSize/2, 0, Math.PI*2);
    ctx.closePath();
    ctx.clip();

    try {
        const userPic = await loadImage(userPhotoUrl);
        ctx.drawImage(userPic, picX, picY, picSize, picSize);
    } catch {
        ctx.fillStyle = '#7f8c8d';
        ctx.fill();
    }
    ctx.restore();

    // Border
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    ctx.beginPath();
    ctx.arc(picX + picSize/2, picY + picSize/2, picSize/2 + 3, 0, Math.PI*2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();

    // ===== TEKS UTAMA =====
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = '#ffffff';

    // Judul besar "GOODBYE"
    ctx.font = 'bold 70px "Segoe UI", "Poppins", Arial, sans-serif';
    ctx.fillText('GOODBYE', 380, 150);

    // Subjudul "LEAVING FROM AREA"
    ctx.font = '30px "Segoe UI", "Poppins", Arial, sans-serif';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('LEAVING FROM AREA', 380, 220);

    // Nama user
    ctx.font = 'bold 45px "Segoe UI", "Poppins", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(userName, 380, 290);

    // Nama grup
    ctx.font = '28px "Segoe UI", "Poppins", Arial, sans-serif';
    ctx.fillStyle = '#bdc3c7';
    ctx.fillText(groupName, 380, 350);

    // Member count (jika ada)
    if (memberCount) {
        ctx.font = '24px "Segoe UI", "Poppins", Arial, sans-serif';
        ctx.fillStyle = '#f1c40f';
        ctx.fillText(`- ${memberCount}th MEMBER !`, 380, 400);
    }

    // ===== DEKORASI (garis miring atau elemen) =====
    ctx.shadowBlur = 5;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(360, 190);
    ctx.lineTo(680, 190);
    ctx.stroke();

    // Bingkai luar tipis
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 15, width - 30, height - 30);

    return canvas.toBuffer('image/png');
}

module.exports = { createGoodbyeCanvas };