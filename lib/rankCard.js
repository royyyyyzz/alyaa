/**
 * 🍌 PROFESSIONAL PROFILE CANVAS GENERATOR v2
 * Enhanced for Izuka Store
 */

const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const fs = require('fs');

// --- CONFIGURATION ---
const ASSETS_PATH = path.join(__dirname, 'media');
const BG_IMAGE_NAME = 'background_profile.png';
const DEFAULT_PP_NAME = 'default_pp.png';

/**
 * 1. AUTO FONT LOADER
 */
const loadFonts = () => {
    const fonts = fs.readdirSync(ASSETS_PATH).filter(file => file.endsWith('.ttf'));
    fonts.forEach(font => {
        const family = path.parse(font).name;
        registerFont(path.join(ASSETS_PATH, font), { family });
        console.log(`✅ Font Loaded: ${family}`);
    });
};
loadFonts();

/**
 * 2. RUMUS POSISI & UTILITAS
 */
const drawStyledText = (ctx, text, x, y, font, color, stroke = false) => {
    ctx.font = font;
    ctx.fillStyle = color;
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    if (stroke) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.strokeText(text, x, y);
    }
    
    ctx.fillText(text, x, y);
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
};

async function generateProfessionalProfile(userData) {
    const { name, level, rank, currentExp, maxExp, ppUrl } = userData;

    const canvas = createCanvas(1000, 450);
    const ctx = canvas.getContext('2d');

    // Load Background
    const bgImage = await loadImage(path.join(ASSETS_PATH, BG_IMAGE_NAME));
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // --- LOGIKA POSISI DINAMIS (UPDATE V3) ---
    const config = {
        // PP digeser kanan (x+) dan dinaikkan (y-)
        pp: { x: 92, y: 130, size: 218 }, 
        
        // Nama diturunkan sedikit biar rata tengah dengan "NAMA :"
        name: { x: 275, y: 105 },          
        
        // Bar EXP digeser ke kanan (x+) dan disesuaikan panjangnya (w)
        expBar: { x: 500, y: 180, w: 420, h: 22 }, 
        
        // Level dinaikkan jauh ke atas (y-) biar sejajar tulisan "LEVEL :"
        level: { x: 480, y: 258 },        
        
        // Rank diturunkan (y+) biar pas di tengah box biru
        rank: { x: 855, y: 410 }          
    };

    // 3. Draw Profile Picture (Circular)
    try {
        const userPP = await loadImage(ppUrl || path.join(ASSETS_PATH, DEFAULT_PP_NAME));
        ctx.save();
        ctx.beginPath();
        ctx.arc(config.pp.x + config.pp.size / 2, config.pp.y + config.pp.size / 2, config.pp.size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(userPP, config.pp.x, config.pp.y, config.pp.size, config.pp.size);
        ctx.restore();
    } catch (e) { console.error("Gagal load PP:", e.message); }

    // 4. Draw Name 
    ctx.textAlign = 'left'; 
    drawStyledText(ctx, name.toUpperCase(), config.name.x, config.name.y, '55px Bangers', '#FFFFFF', true);

    // 5. Draw Level 
    drawStyledText(ctx, String(level), config.level.x, config.level.y, '55px Bangers', '#FFD700', true);

    // 6. EXP Bar
    const percentage = Math.min(currentExp / maxExp, 1);
    
    // BG Bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.roundRect(config.expBar.x, config.expBar.y, config.expBar.w, config.expBar.h, 10);
    ctx.fill();

    // Progress (Gradient)
    const grad = ctx.createLinearGradient(config.expBar.x, 0, config.expBar.x + config.expBar.w, 0);
    grad.addColorStop(0, '#00d2ff'); 
    grad.addColorStop(1, '#3a7bd5'); 
    
    ctx.fillStyle = grad;
    if (percentage > 0) {
        ctx.beginPath();
        ctx.roundRect(config.expBar.x, config.expBar.y, config.expBar.w * percentage, config.expBar.h, 10);
        ctx.fill();
    }

    // Teks EXP (Tengah-tengah Bar)
    const expText = `${currentExp} / ${maxExp} XP`;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left'; 
    const expTextWidth = ctx.measureText(expText).width;
    const expTextX = config.expBar.x + (config.expBar.w / 2) - (expTextWidth / 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(expText, expTextX, config.expBar.y + 16);

    // 7. Rank 
    ctx.textAlign = 'center'; 
    drawStyledText(ctx, rank, config.rank.x, config.rank.y, '40px Bangers', '#FFFFFF');

    return canvas.toBuffer('image/png');
}

module.exports = { generateProfessionalProfile };
