import React from 'react';
import { Sunrise, Sunset, Share2, Image as ImageIcon, BookOpen, Printer, Sparkles, Moon } from 'lucide-react';
import { BanglaDateResult, HijriDateResult, Region, SunMoonInfo, UserSettings } from '../types';
import { toBengaliNumeral, GREGORIAN_MONTHS_BN } from '../calendar/bangla-digits';

interface BigDateCardProps {
  currentDate: Date;
  bdDate: BanglaDateResult;
  wbDate: BanglaDateResult;
  hijriDate: HijriDateResult;
  sunMoon: SunMoonInfo;
  region: Region;
  useBengaliDigits: boolean;
  homeWidgets?: UserSettings['homeWidgets'];
  onOpenDetails: () => void;
  onShare: () => void;
  onSaveImage: () => void;
}

export const BigDateCard: React.FC<BigDateCardProps> = ({
  currentDate,
  bdDate,
  wbDate,
  hijriDate,
  sunMoon,
  region,
  useBengaliDigits,
  homeWidgets = {
    showSunriseSunset: true,
    showMoonPhase: true,
    showPanjika: true,
    showHijriDate: true,
    showSeason: true
  },
  onOpenDetails,
  onShare,
  onSaveImage
}) => {
  const gDay = useBengaliDigits ? toBengaliNumeral(currentDate.getDate()) : currentDate.getDate();
  const gMonthBn = GREGORIAN_MONTHS_BN[currentDate.getMonth()];
  const gYear = useBengaliDigits ? toBengaliNumeral(currentDate.getFullYear()) : currentDate.getFullYear();
  const gregorianStrBn = `${gDay} ${gMonthBn} ${gYear} খ্রিস্টাব্দ`;

  const formatHijriStr = `${hijriDate.dayBn} ${hijriDate.monthNameBn} ${hijriDate.yearBn} হিজরি`;

  const isToday = new Date().toDateString() === currentDate.toDateString();

  const handlePrintDaily = () => {
    document.body.classList.add('print-daily-mode');
    window.print();
    const cleanup = () => {
      document.body.classList.remove('print-daily-mode');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 2500);
  };

  return (
    <div className="w-full space-y-4">
      {/* Dedicated Daily Print Header (Visible only when printing) */}
      <div className="hidden print:block pb-2 mb-2 border-b-2 border-[#056608] text-center w-full avoid-break">
        <div className="flex items-center justify-between text-xs text-zinc-600 mb-0.5">
          <span className="font-bold text-[#056608]">বাংলা ক্যালেন্ডার • দৈনিক দিনপঞ্জি</span>
          <span className="text-zinc-700 font-semibold">
            {region === 'bangladesh' ? '🇧🇩 বাংলাদেশ' : region === 'west_bengal' ? '🇮🇳 পশ্চিমবঙ্গ' : '🇧🇩 বাংলাদেশ ও 🇮🇳 পশ্চিমবঙ্গ'}
          </span>
        </div>
      </div>

      {/* Primary Big Date Card */}
      <div className="bg-white dark:bg-stone-900 border-2 border-[#056608] dark:border-emerald-700/80 rounded-[32px] p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_rgba(5,102,8,0.08)] relative overflow-hidden transition-all print:shadow-none print:p-5 print:rounded-2xl print:border-zinc-400">
        {/* Accent Red Corner badge when today */}
        {isToday && (
          <div
            className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-[#D2122E] flex items-center justify-center pointer-events-none z-10"
            style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
          >
            <span className="text-white font-bold mb-7 ml-7 sm:mb-8 sm:ml-8 text-[11px] sm:text-xs">
              আজ
            </span>
          </div>
        )}

        {/* Weekday */}
        <p className="text-[#D2122E] dark:text-red-400 font-bold text-lg sm:text-xl mb-1 tracking-wide">
          {bdDate.weekdayBn}
        </p>

        {/* Date Display */}
        {region !== 'both' ? (
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-[#4A5D4C] dark:text-stone-400 mb-1">
              {region === 'bangladesh' ? '🇧🇩 বাংলাদেশ সরকারি ক্যালেন্ডার' : '🇮🇳 পশ্চিমবঙ্গ ঐতিহ্যবাহী পঞ্জিকা'}
            </span>
            <h2 className="text-[80px] sm:text-[100px] md:text-[116px] font-black leading-none text-[#056608] dark:text-emerald-400 tracking-tighter my-1">
              {region === 'bangladesh' ? bdDate.dayBn : wbDate.dayBn}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black mt-1 text-[#1A2F1C] dark:text-stone-100">
              {region === 'bangladesh'
                ? `${bdDate.monthNameBn} ${bdDate.yearBn}`
                : `${wbDate.monthNameBn} ${wbDate.yearBn}`}
            </h3>
            {homeWidgets.showSeason && (
              <span className="mt-1 text-xs font-semibold text-[#4A5D4C] dark:text-stone-400">
                🌿 ঋতু: {region === 'bangladesh' ? bdDate.seasonBn : wbDate.seasonBn}কাল
              </span>
            )}
          </div>
        ) : (
          /* Both Regions side-by-side */
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
            {/* Bangladesh */}
            <div className="p-4 rounded-2xl bg-[#EBF0E4]/60 dark:bg-stone-800/50 border border-[#D1D8C5] dark:border-stone-700 flex flex-col items-center">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-0.5 rounded-full bg-[#056608] text-white mb-2">
                🇧🇩 বাংলাদেশ
              </span>
              <div className="text-4xl sm:text-5xl font-black text-[#056608] dark:text-emerald-400">
                {bdDate.dayBn}
              </div>
              <div className="text-base font-bold text-[#1A2F1C] dark:text-stone-100 mt-0.5">
                {bdDate.monthNameBn} {bdDate.yearBn}
              </div>
              {homeWidgets.showSeason && (
                <span className="text-[11px] text-[#4A5D4C] dark:text-stone-400 mt-1">
                  ঋতু: {bdDate.seasonBn}কাল
                </span>
              )}
            </div>

            {/* West Bengal */}
            <div className="p-4 rounded-2xl bg-[#FFF1F1]/70 dark:bg-stone-800/50 border border-red-200 dark:border-stone-700 flex flex-col items-center">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-0.5 rounded-full bg-[#D2122E] text-white mb-2">
                🇮🇳 পশ্চিমবঙ্গ
              </span>
              <div className="text-4xl sm:text-5xl font-black text-[#D2122E] dark:text-red-400">
                {wbDate.dayBn}
              </div>
              <div className="text-base font-bold text-[#1A2F1C] dark:text-stone-100 mt-0.5">
                {wbDate.monthNameBn} {wbDate.yearBn}
              </div>
              <span className="text-[11px] text-[#4A5D4C] dark:text-stone-400 mt-1">
                ঐতিহ্যবাহী পঞ্জিকা
              </span>
            </div>
          </div>
        )}

        {/* Secondary Dates: Gregorian & Hijri */}
        <div className="mt-5 pt-5 border-t border-[#E0E4D9] dark:border-stone-800 w-full space-y-1">
          <p className="text-base sm:text-lg font-bold text-[#4A5D4C] dark:text-stone-200">
            {gregorianStrBn}
          </p>
          {homeWidgets.showHijriDate && (
            <p className="text-xs sm:text-sm font-medium text-[#8A967E] dark:text-stone-400">
              🕋 {formatHijriStr}
            </p>
          )}
        </div>

        {/* Panjika Highlights if available */}
        {homeWidgets.showPanjika && sunMoon.panjika?.isAvailable && (
          <div className="mt-4 pt-3 border-t border-[#E0E4D9]/60 dark:border-stone-800/60 w-full flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[#056608] dark:text-emerald-400">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#EBF0E4] dark:bg-stone-800" title={sunMoon.panjika.tithiEndTime}>
              তিথি: {sunMoon.panjika.tithi}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#EBF0E4] dark:bg-stone-800">
              পক্ষ: {sunMoon.panjika.paksha}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#EBF0E4] dark:bg-stone-800" title={sunMoon.panjika.nakshatraEndTime}>
              নক্ষত্র: {sunMoon.panjika.nakshatra.split(' ')[0]}
            </span>
            {sunMoon.panjika.isSankranti && (
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300">
                আজ {sunMoon.panjika.sankranti}
              </span>
            )}
          </div>
        )}

        {/* Quick Actions Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 print:hidden no-print">
          <button
            id="btn-date-details-view"
            onClick={onOpenDetails}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#056608] hover:bg-[#045006] text-white text-xs font-bold transition-colors shadow-xs touch-manipulation"
          >
            <BookOpen className="w-4 h-4" />
            <span>বিস্তারিত ও নোট</span>
          </button>

          <button
            id="btn-share-date"
            onClick={onShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F0F2EB] dark:bg-stone-800 hover:bg-[#E0E4D9] dark:hover:bg-stone-700 text-[#1A2F1C] dark:text-stone-200 border border-[#D1D8C5] dark:border-stone-700 text-xs font-semibold transition-colors touch-manipulation"
            title="শেয়ার করুন"
          >
            <Share2 className="w-4 h-4 text-[#056608] dark:text-emerald-400" />
            <span>শেয়ার</span>
          </button>

          <button
            id="btn-save-date-image"
            onClick={onSaveImage}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F0F2EB] dark:bg-stone-800 hover:bg-[#E0E4D9] dark:hover:bg-stone-700 text-[#1A2F1C] dark:text-stone-200 border border-[#D1D8C5] dark:border-stone-700 text-xs font-semibold transition-colors touch-manipulation"
            title="ছবি হিসেবে সংরক্ষণ করুন"
          >
            <ImageIcon className="w-4 h-4 text-[#D2122E] dark:text-red-400" />
            <span>ছবি</span>
          </button>

          <button
            id="btn-print-date-card"
            onClick={handlePrintDaily}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F0F2EB] dark:bg-stone-800 hover:bg-[#E0E4D9] dark:hover:bg-stone-700 text-[#1A2F1C] dark:text-stone-200 border border-[#D1D8C5] dark:border-stone-700 text-xs font-semibold transition-colors touch-manipulation"
            title="দৈনিক দিনপঞ্জি প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন"
          >
            <Printer className="w-4 h-4 text-[#056608] dark:text-emerald-400" />
            <span>প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* Solar/Lunar Stats in Editorial Green Palette */}
      {(homeWidgets.showSunriseSunset || homeWidgets.showMoonPhase) && (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {/* Sunrise */}
          {homeWidgets.showSunriseSunset && (
            <div className="bg-[#EBF0E4] dark:bg-stone-900 p-3 rounded-2xl flex flex-col items-center border border-[#D1D8C5] dark:border-stone-800 text-center">
              <span className="text-base sm:text-lg mb-0.5">🌅</span>
              <span className="text-[10px] uppercase font-bold text-[#4A5D4C] dark:text-stone-400 tracking-wider">
                সূর্যোদয়
              </span>
              <span className="font-bold text-xs sm:text-sm text-[#1A2F1C] dark:text-stone-200 mt-0.5">
                {sunMoon.sunrise}
              </span>
            </div>
          )}

          {/* Sunset */}
          {homeWidgets.showSunriseSunset && (
            <div className="bg-[#EBF0E4] dark:bg-stone-900 p-3 rounded-2xl flex flex-col items-center border border-[#D1D8C5] dark:border-stone-800 text-center">
              <span className="text-base sm:text-lg mb-0.5">🌇</span>
              <span className="text-[10px] uppercase font-bold text-[#4A5D4C] dark:text-stone-400 tracking-wider">
                সূর্যাস্ত
              </span>
              <span className="font-bold text-xs sm:text-sm text-[#1A2F1C] dark:text-stone-200 mt-0.5">
                {sunMoon.sunset}
              </span>
            </div>
          )}

          {/* Moon */}
          {homeWidgets.showMoonPhase && (
            <div className="bg-[#EBF0E4] dark:bg-stone-900 p-3 rounded-2xl flex flex-col items-center border border-[#D1D8C5] dark:border-stone-800 text-center">
              <span className="text-base sm:text-lg mb-0.5">{sunMoon.moonPhaseIcon || '🌙'}</span>
              <span className="text-[10px] uppercase font-bold text-[#4A5D4C] dark:text-stone-400 tracking-wider">
                চাঁদের কলা ({sunMoon.moonIlluminationPctBn || '০%'})
              </span>
              <span className="font-bold text-xs sm:text-sm text-[#1A2F1C] dark:text-stone-200 mt-0.5 truncate max-w-[80px] sm:max-w-none">
                {sunMoon.moonPhaseBn.split(' ')[0]}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
