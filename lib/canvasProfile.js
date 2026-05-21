const Canvas = require('canvas');
const { registerFont } = require('canvas');

// Register font keren (opsional, bisa pakai default)
registerFont('./media/gaming.ttf', { family: 'GameFont' });
// Helper function untuk rounded rectangle - PINDAHKAN KE SINI (ATAS)
function roundRect(ctx, x, y, w, h, r) {
    // Tambahkan ini untuk cek
    if (!ctx || typeof ctx.beginPath !== 'function') {
        console.error('ctx tidak valid:', ctx);
        return;
    }
    
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    return ctx;
}
async function createProfileCanvas(userData) {
    // Destructure data user
    const { 
        profilePicUrl, 
        username, 
        rank, 
        currentExp, 
        maxExp,
        backgroundUrl 
    } = userData;

    // Ukuran canvas
    const width = 1024;
    const height = 450;
    
    // Buat canvas
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 1. Gambar background dari URL
    const background = await Canvas.loadImage(backgroundUrl);
    ctx.drawImage(background, 0, 0, width, height);

    // 2. Overlay gelap agar teks lebih terbaca
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, width, height);

    // 3. Border glow effect
    ctx.strokeStyle = '#8a2be2';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // 4. Profile Picture dengan efek
    try {
        const profilePic = await Canvas.loadImage(profilePicUrl);
        
        // Buat lingkaran untuk profile pic
        ctx.save();
        ctx.beginPath();
        ctx.arc(200, height/2, 120, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        // Gambar profile pic dengan efek glow
        ctx.shadowColor = '#8a2be2';
        ctx.shadowBlur = 20;
        ctx.drawImage(profilePic, 80, height/2 - 120, 240, 240);
        ctx.restore();

        // Border lingkaran
        ctx.save();
        ctx.beginPath();
        ctx.arc(200, height/2, 120, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#8a2be2';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();

    } catch (error) {
        // Fallback jika gambar gagal dimuat
        ctx.fillStyle = '#2a2a2a';
        ctx.beginPath();
        ctx.arc(200, height/2, 120, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px "GameFont", Arial';
        ctx.fillText('?', 170, height/2 + 15);
    }

    // 5. Nama User dengan efek
    ctx.shadowColor = '#8a2be2';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px "GameFont", Arial, sans-serif';
    ctx.fillText(username, 350, 120);

    // 6. Rank dengan desain badge
    // Background badge
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(138, 43, 226, 0.3)';
    ctx.beginPath();
    roundRect(ctx, 350, 150, 200, 50, 25);
    ctx.fill();

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 30px "GameFont", Arial';
    ctx.fillText(`⚔️ ${rank} ⚔️`, 370, 190);

    // 7. EXP Bar dengan persentase
    const expBarX = 350;
    const expBarY = 250;
    const expBarWidth = 600;
    const expBarHeight = 40;

    // Background bar
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    roundRect((ctx, expBarX, expBarY, expBarWidth, expBarHeight, 20));
    ctx.fill();

    // Hitung persentase
    const expPercentage = (currentExp / maxExp) * 100;
    const filledWidth = (expPercentage / 100) * expBarWidth;

    // Gradient untuk EXP bar (ungu)
    const gradient = ctx.createLinearGradient(expBarX, expBarY, expBarX + expBarWidth, expBarY);
    gradient.addColorStop(0, '#9370db');
    gradient.addColorStop(0.5, '#8a2be2');
    gradient.addColorStop(1, '#4b0082');

    // Filled bar dengan efek glow
    ctx.shadowColor = '#8a2be2';
    ctx.shadowBlur = 20;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    roundRect((ctx, expBarX, expBarY, filledWidth, expBarHeight, 20));
    ctx.fill();

    // Border bar
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    roundRect((ctx, expBarX, expBarY, expBarWidth, expBarHeight, 20));
    ctx.stroke();

    // Teks EXP
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 25px "GameFont", Arial';
    ctx.shadowBlur = 10;
    ctx.fillText(`EXP: ${currentExp}/${maxExp}`, expBarX, expBarY - 10);

    // Persentase di dalam bar
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "GameFont", Arial';
    ctx.shadowBlur = 5;
    ctx.fillText(`${expPercentage.toFixed(1)}%`, expBarX + expBarWidth - 100, expBarY + 30);

    // 8. Dekorasi tambahan
    // Star di pojok
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffd700';
    ctx.font = '30px Arial';
    ctx.fillText('⭐', 950, 60);

    // Level indicator
    ctx.fillStyle = 'rgba(138, 43, 226, 0.5)';
    ctx.beginPath();
    roundRect((ctx, 850, 370, 150, 50, 25));
    ctx.fill();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 25px "GameFont", Arial';
    ctx.fillText('LEVEL UP!', 870, 410);

    // Convert ke buffer
    return canvas.toBuffer();
}


// Contoh penggunaan di command handler
async function handleProfileCommand(sock, senderJid, userData) {
    try {
        const profileData = {
            profilePicUrl: 'https://example.com/user-profile.jpg',
            username: userData.name || 'Player 1',
            rank: userData.rank || 'Bronze Warrior',
            currentExp: userData.exp || 750,
            maxExp: 1000,
            backgroundUrl: 'https://example.com/game-bg.jpg'
        };

        const profileImage = await createProfileCanvas(profileData);
        
        await sock.sendMessage(senderJid, {
            image: profileImage,
            caption: `✨ *PROFILE CARD* ✨\n\nNama: ${profileData.username}\nRank: ${profileData.rank}\nExp: ${profileData.currentExp}/${profileData.maxExp}`
        });
    } catch (error) {
        console.error('Error creating profile:', error);
        await sock.sendMessage(senderJid, { text: 'Gagal membuat profile card!' });
    }
}

module.exports = { createProfileCanvas };