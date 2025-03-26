const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors
const primaryColor = '#E63946'; // South African red
const textColor = '#FFFFFF';

// Asset paths
const assetsDir = path.join(__dirname, 'app', 'assets');

// Make sure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create icon.png (1024x1024)
const iconCommand = `
echo '<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="${primaryColor}"/>
  <text x="512" y="512" font-family="Arial" font-size="100" text-anchor="middle" fill="${textColor}" dominant-baseline="middle">PLAASJAPIE</text>
  <text x="512" y="612" font-family="Arial" font-size="60" text-anchor="middle" fill="${textColor}" dominant-baseline="middle">Dating App</text>
</svg>' > temp-icon.svg && npx sharp-cli temp-icon.svg -o app/assets/icon.png resize 1024 1024
`;

// Create adaptive-icon.png (1024x1024)
const adaptiveIconCommand = `
echo '<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="${primaryColor}"/>
  <text x="512" y="512" font-family="Arial" font-size="100" text-anchor="middle" fill="${textColor}" dominant-baseline="middle">PLAASJAPIE</text>
</svg>' > temp-adaptive-icon.svg && npx sharp-cli temp-adaptive-icon.svg -o app/assets/adaptive-icon.png resize 1024 1024
`;

// Create splash.png (2048x2048)
const splashCommand = `
echo '<svg width="2048" height="2048" xmlns="http://www.w3.org/2000/svg">
  <rect width="2048" height="2048" fill="${primaryColor}"/>
  <text x="1024" y="1024" font-family="Arial" font-size="200" text-anchor="middle" fill="${textColor}" dominant-baseline="middle">PLAASJAPIE</text>
  <text x="1024" y="1224" font-family="Arial" font-size="120" text-anchor="middle" fill="${textColor}" dominant-baseline="middle">Dating App</text>
</svg>' > temp-splash.svg && npx sharp-cli temp-splash.svg -o app/assets/splash.png resize 2048 2048
`;

// Create favicon.png (32x32)
const faviconCommand = `
echo '<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="${primaryColor}"/>
  <text x="16" y="16" font-family="Arial" font-size="10" text-anchor="middle" fill="${textColor}" dominant-baseline="middle">PJ</text>
</svg>' > temp-favicon.svg && npx sharp-cli temp-favicon.svg -o app/assets/favicon.png resize 32 32
`;

try {
  console.log('Generating icon...');
  execSync(iconCommand, { stdio: 'inherit' });
  
  console.log('Generating adaptive icon...');
  execSync(adaptiveIconCommand, { stdio: 'inherit' });
  
  console.log('Generating splash screen...');
  execSync(splashCommand, { stdio: 'inherit' });
  
  console.log('Generating favicon...');
  execSync(faviconCommand, { stdio: 'inherit' });
  
  // Clean up temporary SVG files
  fs.unlinkSync('temp-icon.svg');
  fs.unlinkSync('temp-adaptive-icon.svg');
  fs.unlinkSync('temp-splash.svg');
  fs.unlinkSync('temp-favicon.svg');
  
  console.log('All assets generated successfully!');
} catch (error) {
  console.error('Error generating assets:', error);
} 