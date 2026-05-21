const { createCanvas, loadImage } = require('@napi-rs/canvas');
const axios = require("axios");

/**
 * Generate Canvas Profile
 * Tema: Modern Digital / Sci-Fi Game HUD
 * Resolusi: 1280 x 720
 */
async function createProfileCard(userData) {
    const { name, rank, level, exp, maxExp, bgUrl, avatarUrl } = userData;

    const width = 1280;
    const height = 720;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

        // 1. DRAW BACKGROUND
    try {
        // Ambil data gambar lewat axios dulu biar dapet buffer murni
        const response = await axios.get(bgUrl, { responseType: 'arraybuffer' });
        const bgBuffer = Buffer.from(response.data, 'utf-8');
        const bg = await loadImage(bgBuffer);
        ctx.drawImage(bg, 0, 0, width, height);
    } catch (e) {
        console.error("Gagal render background via URL:", e);
        // Fallback warna gelap kalau tetep gagal
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
        
        // Kasih efek grid digital dikit biar gak sepi pas gagal load
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
        for (let i = 0; i < width; i += 50) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
        }
    }


    // 2. DRAW MAIN OVERLAY (Glass HUD Panel)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'; // Dark blue transparan
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(80, 140, 1120, 440, 30); // Panel memanjang di tengah
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow

    // 3. DRAW AVATAR (Di Sisi Kanan Sendiri)
    const avatarX = 1000;
    const avatarY = 360; // Posisi vertikal tengah
    const avatarRadius = 150;

    try {
        const avatar = await loadImage(avatarUrl);
        
        // Clipping gambar menjadi lingkaran
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        ctx.restore();

        // Cincin Neon di sekitar Avatar
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#00f3ff'; // Neon Cyan
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
    } catch (e) {
        console.error("Gagal load avatar:", e);
    }

    // 4. DRAW TEKS INFO (Di samping kiri avatar)
    const startX = 140;

    // Nama User
    ctx.font = 'bold 75px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name, startX, 260);

    // Nama Rank
    ctx.font = 'italic 45px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ff007f'; // Neon Pink
    ctx.fillText(`Rank: ${rank}`, startX, 325);

    // 5. DRAW EXP BAR
    const barX = startX;
    const barY = 380;
    const barWidth = 650;
    const barHeight = 45;
    
    // Kalkulasi persentase EXP (dibatasi maksimal 1 atau 100%)
    const expRatio = Math.min(exp / maxExp, 1);

    // Bar Background (Track kosong)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, 20);
    ctx.fill();

    // Bar Foreground (Isi EXP dengan Gradient)
    const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
    gradient.addColorStop(0, '#00f3ff'); // Cyan
    gradient.addColorStop(1, '#0055ff'); // Deep Blue
    
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth * expRatio, barHeight, 20);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Teks Info EXP (Di atas kanan Bar)
    ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'right';
    ctx.fillText(`${exp} / ${maxExp} EXP`, barX + barWidth, barY - 15);
    ctx.textAlign = 'left'; // Kembalikan ke kiri

    // 6. DRAW LEVEL (Di bawah EXP Bar)
    ctx.font = 'bold 60px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#00f3ff';
    ctx.fillText(`LEVEL ${level}`, startX, 510);

    // Return buffer gambar (siap dikirim sebagai pesan image)
    return await canvas.encode('png');
}

module.exports = { createProfileCard };
