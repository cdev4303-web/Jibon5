import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const iconSource = path.join(publicDir, 'icons', 'icon-512.png');
const androidRes = path.resolve('android', 'app', 'src', 'main', 'res');

const iconSizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

async function generateAndroidIcons() {
  if (!fs.existsSync(iconSource)) {
    console.error('Source icon does not exist:', iconSource);
    return;
  }

  for (const { dir, size } of iconSizes) {
    const targetDir = path.join(androidRes, dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Square launcher icon
    await sharp(iconSource)
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round launcher icon (circle mask)
    const circleSvg = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff" /></svg>`
    );
    
    await sharp(iconSource)
      .resize(size, size)
      .composite([{ input: circleSvg, blend: 'dest-in' }])
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // Foreground icon for adaptive icons (108x108 for adaptive icon grid)
    const adaptiveSize = Math.round(size * (108 / 48));
    await sharp(iconSource)
      .resize(Math.round(adaptiveSize * 0.72), Math.round(adaptiveSize * 0.72))
      .extend({
        top: Math.round(adaptiveSize * 0.14),
        bottom: Math.round(adaptiveSize * 0.14),
        left: Math.round(adaptiveSize * 0.14),
        right: Math.round(adaptiveSize * 0.14),
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .resize(adaptiveSize, adaptiveSize)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`Generated icons for ${dir} (${size}x${size})`);
  }

  console.log('All Android launcher icons successfully updated!');
}

generateAndroidIcons().catch(console.error);
