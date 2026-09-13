/**
 * Generate a high-resolution Bengali Date Card image using HTML5 Canvas
 * in the "Editorial Aesthetic" (Deep green #056608, Accent red #D2122E, Off-white #F9FAF7).
 * Compatible with all desktop browsers, mobile browsers, and Android WebViews.
 */
export function generateDateCardImage(params: {
  weekdayBn: string;
  banglaDateBn: string;
  banglaYearBn: string;
  banglaMonthBn: string;
  gregorianDateStr: string;
  hijriDateStr: string;
  regionTitleBn: string;
  festivalName?: string;
}): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    // 1. Background (Editorial Canvas #F9FAF7)
    ctx.fillStyle = '#F9FAF7';
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Outer decorative emerald border
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#056608';
    ctx.strokeRect(40, 40, 1000, 1000);

    // 3. Inner fine neutral border
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#D1D8C5';
    ctx.strokeRect(58, 58, 964, 964);

    // 4. Header Badge (বাংলা ক্যালেন্ডার)
    ctx.fillStyle = '#056608';
    ctx.beginPath();
    ctx.roundRect(340, 85, 400, 60, 30);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Noto Serif Bengali", "Hind Siliguri", "Tiro Bangla", serif';
    ctx.textAlign = 'center';
    ctx.fillText('বাংলা ক্যালেন্ডার', 540, 126);

    // 5. Region Indicator
    ctx.fillStyle = '#4A5D4C';
    ctx.font = '500 26px "Noto Serif Bengali", "Hind Siliguri", sans-serif';
    ctx.fillText(params.regionTitleBn, 540, 195);

    // 6. Weekday (e.g. সোমবার)
    ctx.fillStyle = '#D2122E';
    ctx.font = 'bold 48px "Noto Serif Bengali", "Hind Siliguri", serif';
    ctx.fillText(params.weekdayBn, 540, 280);

    // 7. Big Bangla Day & Month
    ctx.fillStyle = '#056608';
    ctx.font = 'bold 125px "Noto Serif Bengali", "Hind Siliguri", serif';
    ctx.fillText(`${params.banglaDateBn} ${params.banglaMonthBn}`, 540, 440);

    // 8. Bangla Year
    ctx.fillStyle = '#1A2F1C';
    ctx.font = 'bold 60px "Noto Serif Bengali", "Hind Siliguri", serif';
    ctx.fillText(`${params.banglaYearBn} বঙ্গাব্দ`, 540, 530);

    // 9. Horizontal Divider
    ctx.strokeStyle = '#D1D8C5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(220, 585);
    ctx.lineTo(860, 585);
    ctx.stroke();

    // 10. Gregorian Date
    ctx.fillStyle = '#1A2F1C';
    ctx.font = '600 42px "Noto Serif Bengali", "Hind Siliguri", sans-serif';
    ctx.fillText(params.gregorianDateStr, 540, 660);

    // 11. Hijri Date
    ctx.fillStyle = '#056608';
    ctx.font = '500 34px "Noto Serif Bengali", "Hind Siliguri", sans-serif';
    ctx.fillText(`হিজরি: ${params.hijriDateStr}`, 540, 725);

    // 12. Festival/Holiday if present
    if (params.festivalName) {
      ctx.fillStyle = '#FFF1F1';
      ctx.beginPath();
      ctx.roundRect(140, 780, 800, 80, 24);
      ctx.fill();

      ctx.strokeStyle = '#FCA5A5';
      ctx.lineWidth = 2;
      ctx.strokeRect(140, 780, 800, 80);

      ctx.fillStyle = '#D2122E';
      ctx.font = 'bold 34px "Noto Serif Bengali", "Hind Siliguri", serif';
      ctx.fillText(`★ ${params.festivalName} ★`, 540, 832);
    }

    // 13. Footer branding
    ctx.fillStyle = '#8A967E';
    ctx.font = '22px "Noto Serif Bengali", "Hind Siliguri", sans-serif';
    ctx.fillText('বাংলাদেশ 🇧🇩 ও পশ্চিমবঙ্গ 🇮🇳 নির্ভরযোগ্য পঞ্জিকা ও ক্যালেন্ডার', 540, 990);

    const dataUrl = canvas.toDataURL('image/png');
    resolve(dataUrl);
  });
}

/**
 * Download a data URL as an image file safely with Android WebView fallback
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${dataUrl}" alt="Bangla Calendar Date Card" style="max-width:100%"/>`);
    }
  }
}
