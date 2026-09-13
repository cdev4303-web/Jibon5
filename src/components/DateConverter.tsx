import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, RotateCcw, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { BanglaDateResult, HijriDateResult, Region } from '../types';
import { BangladeshCalendarEngine } from '../calendar/bangladesh-calendar';
import { WestBengalCalendarEngine } from '../calendar/west-bengal-calendar';
import { HijriCalendarEngine } from '../calendar/hijri-calendar';
import {
  BANGLA_MONTHS_BN,
  GREGORIAN_MONTHS_BN,
  toBengaliNumeral
} from '../calendar/bangla-digits';

interface DateConverterProps {
  initialDate?: Date;
  region: Region;
  useBengaliDigits: boolean;
}

export const DateConverter: React.FC<DateConverterProps> = ({
  initialDate = new Date(),
  region,
  useBengaliDigits
}) => {
  // Conversion Direction: 'en_to_bn' or 'bn_to_en'
  const [direction, setDirection] = useState<'en_to_bn' | 'bn_to_en'>('en_to_bn');
  const [selectedEngine, setSelectedEngine] = useState<'bangladesh' | 'west_bengal'>(
    region === 'west_bengal' ? 'west_bengal' : 'bangladesh'
  );

  // English input state
  const [gregorianInput, setGregorianInput] = useState<string>(
    initialDate.toISOString().slice(0, 10)
  );

  // Bangla input state
  const [banglaYearInput, setBanglaYearInput] = useState<number>(1431);
  const [banglaMonthInput, setBanglaMonthInput] = useState<number>(4); // Bhadro (0-indexed 4)
  const [banglaDayInput, setBanglaDayInput] = useState<number>(23);

  // Calculation Results
  const [result, setResult] = useState<{
    bangla: BanglaDateResult;
    gregorian: Date;
    hijri: HijriDateResult;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Run conversion whenever triggered
  const handleConvert = () => {
    setError(null);
    try {
      if (direction === 'en_to_bn') {
        const [y, m, d] = gregorianInput.split('-').map(Number);
        const gDate = new Date(y, m - 1, d);

        const bangla =
          selectedEngine === 'bangladesh'
            ? BangladeshCalendarEngine.fromGregorian(gDate)
            : WestBengalCalendarEngine.fromGregorian(gDate);

        const hijri = HijriCalendarEngine.fromGregorian(gDate);

        setResult({ bangla, gregorian: gDate, hijri });
      } else {
        // Bangla to English
        const gDate =
          selectedEngine === 'bangladesh'
            ? BangladeshCalendarEngine.toGregorian(banglaYearInput, banglaMonthInput, banglaDayInput)
            : WestBengalCalendarEngine.toGregorian(banglaYearInput, banglaMonthInput, banglaDayInput);

        const bangla =
          selectedEngine === 'bangladesh'
            ? BangladeshCalendarEngine.fromGregorian(gDate)
            : WestBengalCalendarEngine.fromGregorian(gDate);

        const hijri = HijriCalendarEngine.fromGregorian(gDate);

        setResult({ bangla, gregorian: gDate, hijri });
      }
    } catch (err: any) {
      setError(err.message || 'তারিখ রূপান্তরে ত্রুটি হয়েছে। অনুগ্রহ করে সঠিক ইনপুট দিন।');
    }
  };

  // Convert immediately on mount
  React.useEffect(() => {
    handleConvert();
  }, [direction, selectedEngine, gregorianInput]);

  const handleReset = () => {
    const today = new Date();
    setGregorianInput(today.toISOString().slice(0, 10));
    setBanglaYearInput(1431);
    setBanglaMonthInput(4);
    setBanglaDayInput(23);
    setError(null);
  };

  const handleCopy = () => {
    if (!result) return;
    const gDay = useBengaliDigits ? toBengaliNumeral(result.gregorian.getDate()) : result.gregorian.getDate();
    const gMonth = GREGORIAN_MONTHS_BN[result.gregorian.getMonth()];
    const gYear = useBengaliDigits ? toBengaliNumeral(result.gregorian.getFullYear()) : result.gregorian.getFullYear();

    const text = `বাংলা তারিখ: ${result.bangla.dayBn} ${result.bangla.monthNameBn} ${result.bangla.yearBn} বঙ্গাব্দ (${result.bangla.seasonBn}কাল)\nইংরেজি তারিখ: ${gDay} ${gMonth} ${gYear} (${result.bangla.weekdayBn})\nহিজরি তারিখ: ${result.hijri.dayBn} ${result.hijri.monthNameBn} ${result.hijri.yearBn} হিজরি\n[${selectedEngine === 'bangladesh' ? 'বাংলাদেশ একাডেমি ক্যালেন্ডার' : 'পশ্চিমবঙ্গ সূর্যসিদ্ধান্ত পঞ্জিকা'}]`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Title card */}
      <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-8 border border-[#E0E4D9] dark:border-stone-800 shadow-xs text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#EBF0E4] dark:bg-stone-800 border border-[#D1D8C5] dark:border-stone-700 text-[#056608] dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <ArrowLeftRight className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2F1C] dark:text-stone-100">
          তারিখ রূপান্তরক (Date Converter)
        </h2>
        <p className="text-xs sm:text-sm text-[#4A5D4C] dark:text-stone-400 mt-1 max-w-md mx-auto">
          ইংরেজি ও বাংলা ক্যালেন্ডারের মধ্যে সঠিক জ্যোতির্বৈজ্ঞানিক ও একাডেমি নিয়মে নিখুঁত রূপান্তর
        </p>

        {/* Engine and Direction Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {/* Region selector */}
          <div className="inline-flex bg-[#F0F2EB] dark:bg-stone-800 p-1 rounded-full border border-[#D1D8C5] dark:border-stone-700 text-xs font-semibold">
            <button
              onClick={() => setSelectedEngine('bangladesh')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                selectedEngine === 'bangladesh'
                  ? 'bg-[#056608] text-white shadow-xs'
                  : 'text-[#4A5D4C] dark:text-stone-300'
              }`}
            >
              🇧🇩 বাংলাদেশ নিয়ম
            </button>
            <button
              onClick={() => setSelectedEngine('west_bengal')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                selectedEngine === 'west_bengal'
                  ? 'bg-[#056608] text-white shadow-xs'
                  : 'text-[#4A5D4C] dark:text-stone-300'
              }`}
            >
              🇮🇳 পশ্চিমবঙ্গ পঞ্জিকা
            </button>
          </div>

          {/* Direction toggle */}
          <button
            onClick={() => {
              setDirection(direction === 'en_to_bn' ? 'bn_to_en' : 'en_to_bn');
              handleConvert();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EBF0E4] dark:bg-stone-800 border border-[#D1D8C5] dark:border-stone-700 text-[#056608] dark:text-emerald-400 text-xs font-bold hover:bg-[#E0E4D9] transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>
              {direction === 'en_to_bn'
                ? 'ইংরেজি → বাংলা'
                : 'বাংলা → ইংরেজি'}
            </span>
          </button>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-8 border border-[#E0E4D9] dark:border-stone-800 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A5D4C] dark:text-stone-400 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#056608]" />
          <span>
            {direction === 'en_to_bn'
              ? 'ইংরেজি তারিখ নির্বাচন করুন'
              : 'বাংলা তারিখ ইনপুট দিন'}
          </span>
        </h3>

        {direction === 'en_to_bn' ? (
          <div>
            <label className="text-xs font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1.5">
              ইংরেজি ক্যালেন্ডারের তারিখ (YYYY-MM-DD):
            </label>
            <input
              type="date"
              value={gregorianInput}
              onChange={(e) => setGregorianInput(e.target.value)}
              className="w-full text-base p-3.5 rounded-2xl border border-[#D1D8C5] dark:border-stone-700 bg-[#F9FAF7] dark:bg-stone-800 text-[#1A2F1C] dark:text-stone-100 focus:ring-2 focus:ring-[#056608] font-sans"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
                দিন
              </label>
              <input
                type="number"
                min="1"
                max="32"
                value={banglaDayInput}
                onChange={(e) => setBanglaDayInput(Number(e.target.value))}
                className="w-full text-base p-3 rounded-2xl border border-[#D1D8C5] dark:border-stone-700 bg-[#F9FAF7] dark:bg-stone-800 text-[#1A2F1C] dark:text-stone-100 focus:ring-2 focus:ring-[#056608]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
                মাস
              </label>
              <select
                value={banglaMonthInput}
                onChange={(e) => setBanglaMonthInput(Number(e.target.value))}
                className="w-full text-base p-3 rounded-2xl border border-[#D1D8C5] dark:border-stone-700 bg-[#F9FAF7] dark:bg-stone-800 text-[#1A2F1C] dark:text-stone-100 focus:ring-2 focus:ring-[#056608]"
              >
                {BANGLA_MONTHS_BN.map((name, idx) => (
                  <option key={idx} value={idx}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
                বঙ্গাব্দ (বছর)
              </label>
              <input
                type="number"
                min="1"
                max="3000"
                value={banglaYearInput}
                onChange={(e) => setBanglaYearInput(Number(e.target.value))}
                className="w-full text-base p-3 rounded-2xl border border-[#D1D8C5] dark:border-stone-700 bg-[#F9FAF7] dark:bg-stone-800 text-[#1A2F1C] dark:text-stone-100 focus:ring-2 focus:ring-[#056608]"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D1D8C5] dark:border-stone-700 hover:bg-[#F9FAF7] dark:hover:bg-stone-800 text-[#4A5D4C] dark:text-stone-300 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>মুছে ফেলুন</span>
          </button>
          <button
            onClick={handleConvert}
            className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-[#056608] hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>রূপান্তর করুন</span>
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-[#FFF1F1] text-[#D2122E] text-xs font-medium border border-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Result Presentation Card */}
      {result && (
        <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-8 border border-[#E0E4D9] dark:border-stone-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E0E4D9] dark:border-stone-800 pb-3 mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#056608] dark:text-emerald-400">
              রূপান্তরের ফলাফল ({selectedEngine === 'bangladesh' ? 'বাংলাদেশ একাডেমি' : 'পশ্চিমবঙ্গ পঞ্জিকা'})
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D1D8C5] dark:border-stone-700 hover:bg-[#F9FAF7] text-[#1A2F1C] dark:text-stone-200 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#056608]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Big Bangla Date */}
            <div>
              <span className="text-xs text-[#4A5D4C] dark:text-stone-400 font-medium">বাংলা তারিখ</span>
              <div className="text-3xl sm:text-4xl font-bold text-[#056608] dark:text-emerald-400">
                {result.bangla.dayBn} {result.bangla.monthNameBn}, {result.bangla.yearBn} বঙ্গাব্দ
              </div>
              <div className="text-xs text-[#4A5D4C] dark:text-stone-400 font-semibold mt-1">
                বার: {result.bangla.weekdayBn} • ঋতু: {result.bangla.seasonBn}কাল • {result.bangla.totalDaysInMonth} দিনের মাস
              </div>
            </div>

            {/* Gregorian Date */}
            <div className="pt-3 border-t border-[#E0E4D9] dark:border-stone-800">
              <span className="text-xs text-[#4A5D4C] dark:text-stone-400 font-medium">ইংরেজি (গ্রেগরিয়ান) তারিখ</span>
              <div className="text-xl font-bold text-[#1A2F1C] dark:text-stone-200">
                {useBengaliDigits ? toBengaliNumeral(result.gregorian.getDate()) : result.gregorian.getDate()}{' '}
                {GREGORIAN_MONTHS_BN[result.gregorian.getMonth()]}{' '}
                {useBengaliDigits ? toBengaliNumeral(result.gregorian.getFullYear()) : result.gregorian.getFullYear()}{' '}
                খ্রিস্টাব্দ
              </div>
            </div>

            {/* Hijri Date */}
            <div className="pt-3 border-t border-[#E0E4D9] dark:border-stone-800">
              <span className="text-xs text-[#4A5D4C] dark:text-stone-400 font-medium">হিজরি (ইসলামিক) তারিখ</span>
              <div className="text-base font-semibold text-[#056608] dark:text-emerald-400">
                {result.hijri.dayBn} {result.hijri.monthNameBn} {result.hijri.yearBn} হিজরি
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
