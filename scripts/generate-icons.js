import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Master Icon SVG
const masterSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#056608" />
      <stop offset="100%" stop-color="#023b04" />
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E51837" />
      <stop offset="100%" stop-color="#B20D23" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F5F7F2" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="116" fill="url(#bgGrad)" />

  <!-- Subtle Inner Border -->
  <rect x="14" y="14" width="484" height="484" rx="104" fill="none" stroke="#22C55E" stroke-width="3" stroke-opacity="0.3" />

  <!-- Calendar Page Container with Shadow -->
  <g filter="url(#shadow)">
    <!-- Calendar Card Base -->
    <rect x="76" y="80" width="360" height="360" rx="36" fill="url(#cardGrad)" />

    <!-- Calendar Red Header Strip -->
    <path d="M 76 116 C 76 96 96 80 116 80 L 396 80 C 416 80 436 96 436 116 L 436 180 L 76 180 Z" fill="url(#headerGrad)" />
    
    <!-- Red Header Fine Gold Divider -->
    <line x1="76" y1="180" x2="436" y2="180" stroke="#FFD700" stroke-width="4" stroke-opacity="0.7" />

    <!-- Binder Rings -->
    <!-- Ring 1 -->
    <rect x="144" y="60" width="24" height="42" rx="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3" />
    <circle cx="156" cy="88" r="4" fill="#0F172A" />

    <!-- Ring 2 (Center) -->
    <rect x="244" y="60" width="24" height="42" rx="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3" />
    <circle cx="256" cy="88" r="4" fill="#0F172A" />

    <!-- Ring 3 -->
    <rect x="344" y="60" width="24" height="42" rx="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3" />
    <circle cx="356" cy="88" r="4" fill="#0F172A" />

    <!-- Header Text: বাংলা ক্যালেন্ডার -->
    <text x="256" y="145" font-family="'Noto Serif Bengali', 'Hind Siliguri', 'Tiro Bangla', sans-serif" font-size="30" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
      বাংলা ক্যালেন্ডার
    </text>

    <!-- Month Sub-title -->
    <text x="256" y="235" font-family="'Noto Serif Bengali', 'Hind Siliguri', 'Tiro Bangla', sans-serif" font-size="28" font-weight="700" fill="#056608" text-anchor="middle">
      বৈশাখ — চৈত্র
    </text>

    <!-- Prominent Big Year: ১৪৩৩ -->
    <text x="256" y="340" font-family="'Noto Serif Bengali', 'Hind Siliguri', 'Tiro Bangla', sans-serif" font-size="86" font-weight="900" fill="#D2122E" text-anchor="middle">
      ১৪৩৩
    </text>

    <!-- Region Indicators (BD & WB) -->
    <g transform="translate(256, 395)">
      <!-- Pill background -->
      <rect x="-140" y="-18" width="280" height="32" rx="16" fill="#EBF0E4" stroke="#D1D8C5" stroke-width="1.5" />
      <text x="0" y="5" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#1A2F1C" text-anchor="middle">
        বাংলাদেশ 🇧🇩 • 🇮🇳 পশ্চিমবঙ্গ
      </text>
    </g>
  </g>

  <!-- Decorative Corner Sun Burst -->
  <circle cx="430" cy="82" r="14" fill="#FFD700" />
  <circle cx="430" cy="82" r="22" fill="none" stroke="#FFD700" stroke-width="2" stroke-dasharray="4 3" opacity="0.8" />
</svg>
`;

// 2. Maskable Icon SVG (with padding so content is strictly inside the central 80% circle)
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#056608" />
      <stop offset="100%" stop-color="#023b04" />
    </linearGradient>
    <linearGradient id="headerGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E51837" />
      <stop offset="100%" stop-color="#B20D23" />
    </linearGradient>
    <linearGradient id="cardGradMask" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F5F7F2" />
    </linearGradient>
    <filter id="shadowMask" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Full-bleed background for maskable icon -->
  <rect width="512" height="512" fill="url(#bgGradMask)" />

  <!-- Inner Content scaled to 78% and centered in safe-zone -->
  <g transform="translate(56, 56) scale(0.78)" filter="url(#shadowMask)">
    <!-- Calendar Card Base -->
    <rect x="76" y="80" width="360" height="360" rx="36" fill="url(#cardGradMask)" />

    <!-- Calendar Red Header Strip -->
    <path d="M 76 116 C 76 96 96 80 116 80 L 396 80 C 416 80 436 96 436 116 L 436 180 L 76 180 Z" fill="url(#headerGradMask)" />
    <line x1="76" y1="180" x2="436" y2="180" stroke="#FFD700" stroke-width="4" stroke-opacity="0.7" />

    <!-- Binder Rings -->
    <rect x="144" y="60" width="24" height="42" rx="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3" />
    <circle cx="156" cy="88" r="4" fill="#0F172A" />

    <rect x="244" y="60" width="24" height="42" rx="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3" />
    <circle cx="256" cy="88" r="4" fill="#0F172A" />

    <rect x="344" y="60" width="24" height="42" rx="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3" />
    <circle cx="356" cy="88" r="4" fill="#0F172A" />

    <!-- Header Text -->
    <text x="256" y="145" font-family="'Noto Serif Bengali', 'Hind Siliguri', 'Tiro Bangla', sans-serif" font-size="30" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      বাংলা ক্যালেন্ডার
    </text>

    <!-- Month Sub-title -->
    <text x="256" y="235" font-family="'Noto Serif Bengali', 'Hind Siliguri', 'Tiro Bangla', sans-serif" font-size="28" font-weight="700" fill="#056608" text-anchor="middle">
      বৈশাখ — চৈত্র
    </text>

    <!-- Prominent Big Year: ১৪৩৩ -->
    <text x="256" y="340" font-family="'Noto Serif Bengali', 'Hind Siliguri', 'Tiro Bangla', sans-serif" font-size="86" font-weight="900" fill="#D2122E" text-anchor="middle">
      ১৪৩৩
    </text>

    <!-- Region Indicators -->
    <g transform="translate(256, 395)">
      <rect x="-140" y="-18" width="280" height="32" rx="16" fill="#EBF0E4" stroke="#D1D8C5" stroke-width="1.5" />
      <text x="0" y="5" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#1A2F1C" text-anchor="middle">
        বাংলাদেশ 🇧🇩 • 🇮🇳 পশ্চিমবঙ্গ
      </text>
    </g>
  </g>
</svg>
`;

async function generate() {
  console.log('Writing calendar-icon.svg...');
  fs.writeFileSync(path.join(publicDir, 'calendar-icon.svg'), masterSvg);

  console.log('Generating 512x512 icon-512.png...');
  await sharp(Buffer.from(masterSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'));

  console.log('Generating 192x192 icon-192.png...');
  await sharp(Buffer.from(masterSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'));

  console.log('Generating 512x512 icon-maskable-512.png...');
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'));

  console.log('Generating favicon.png (64x64)...');
  await sharp(Buffer.from(masterSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('Icons generated successfully!');
}

generate().catch(console.error);
