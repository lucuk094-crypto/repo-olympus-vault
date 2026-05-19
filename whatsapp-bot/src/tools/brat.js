const { createCanvas } = require('canvas');
async function createBratSticker(text) {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 496, 496);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 256);
    return canvas.toBuffer('image/png');
}
module.exports = { createBratSticker };
