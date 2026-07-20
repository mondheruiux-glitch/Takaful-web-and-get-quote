const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const filesToCompress = [
  'bg-image-1.png',
  'bg-image-2.png',
  'IMAGE1.png',
  'IMAGE2.png',
];

async function compressImages() {
  for (const filename of filesToCompress) {
    const inputPath = path.join(publicDir, filename);
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);
    const outputPath = path.join(publicDir, baseName + '.webp');
    
    if (fs.existsSync(inputPath)) {
      console.log(`Compressing ${filename}...`);
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
        
      console.log(`Created ${baseName}.webp`);
      // Delete the original
      fs.unlinkSync(inputPath);
    }
  }
}

compressImages().catch(console.error);
