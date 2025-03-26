const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Colors
const primaryColor = '#E63946'; // South African red
const textColor = '#FFFFFF';

// Asset paths
const assetsDir = path.join(__dirname, 'app', 'assets');

// Make sure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Helper function to create an SVG with text
function createSvg(width, height, text, fontSize) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${primaryColor}"/>
      <text x="${width/2}" y="${height/2}" font-family="Arial" font-size="${fontSize}" text-anchor="middle" fill="${textColor}" dominant-baseline="middle">${text}</text>
    </svg>
  `);
}

// Create icon (1024x1024)
sharp(createSvg(1024, 1024, 'PLAASJAPIE', 120))
  .png()
  .toFile(path.join(assetsDir, 'icon.png'), (err) => {
    if (err) {
      console.error('Error creating icon:', err);
    } else {
      console.log('Icon created successfully!');
    }
  });

// Create adaptive icon (1024x1024)
sharp(createSvg(1024, 1024, 'PJ', 400))
  .png()
  .toFile(path.join(assetsDir, 'adaptive-icon.png'), (err) => {
    if (err) {
      console.error('Error creating adaptive icon:', err);
    } else {
      console.log('Adaptive icon created successfully!');
    }
  });

// Create splash screen (2048x2048)
sharp(createSvg(2048, 2048, 'PLAASJAPIE', 200))
  .png()
  .toFile(path.join(assetsDir, 'splash.png'), (err) => {
    if (err) {
      console.error('Error creating splash screen:', err);
    } else {
      console.log('Splash screen created successfully!');
    }
  });

// Create favicon (32x32)
sharp(createSvg(32, 32, 'PJ', 12))
  .png()
  .toFile(path.join(assetsDir, 'favicon.png'), (err) => {
    if (err) {
      console.error('Error creating favicon:', err);
    } else {
      console.log('Favicon created successfully!');
    }
  }); 