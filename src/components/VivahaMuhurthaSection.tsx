import React, { useState } from 'react';
import { Heart, Sparkles, AlertCircle, Calendar, Clock, Search, Filter, CheckCircle2, ChevronRight, BookOpen, ShieldAlert } from 'lucide-react';
import { VivahaDateItem, VivahaYatraEngine, AUTHENTIC_VIVAHA_DATES } from '../calendar/vivaha-yatra-engine';
import { BANGLA_MONTHS_BN, toBengaliNumeral } from '../calendar/bangla-digits';

interface VivahaMuhurthaSectionProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  cityId: string;
  cityNameBn: string;
  customCoords?: { lat: number; lng: number; label: string; tzOffset?: number };
}

export const VivahaMuhurthaSection: React.FC<VivahaMuhurthaSectionProps> = ({
  selectedDate,
  onSelectDate,
  cityId,
  cityNameBn,
  customCoords
}) => {
  // Query today's wedding muhurtha
  const todayMuhurtha = VivahaYatraEngine.getVivahaMuhurthaForDate(selectedDate, cityId, customCoords);

  // Directory Filter States
  const [selectedYear, setSelectedYear] = useState<number>(1432); // Default 1432 বঙ্গাব্দ
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showShastraGuide, setShowShastraGuide] = useState<boolean>(false);

  // Filtered Vivaha Dates
  const filteredVivahaDates = AUTHENTIC_VIVAHA_DATES.filter((item) => {
    if (selectedYear !== 0 && item.banglaYear !== selectedYear) return false;
    if (selectedMonth !== 'all' && item.banglaMonthIndex !== selectedMonth) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMonth = item.banglaMonthNameBn.toLowerCase().includes(q);
      const matchTithi = item.tithiBn.toLowerCase().includes(q);
      const matchNakshatra = item.nakshatraBn.toLowerCase().includes(q);
      const matchDateStr = item.gregorianDateStr.includes(q);
      const matchDay = item.banglaDayBn.includes(q);
      return matchMonth || matchTithi || matchNakshatra || matchDateStr || matchDay;
    }
    return true;
  });

  // Selected date ISO string comparison
  const selectedDateStr = selectedDate.toISOString().slice(0, 10);

  return (
    <div id="vivaha-muhurtha-section" className="space-y-6">
      {/* Today's Vivaha Status Card */}
      <div
        id="today-vivaha-card"
        className={`rounded-2xl p-5 md:p-6 border shadow-sm transition-all ${
          todayMuhurtha.hasVivahaLagna
            ? 'bg-gradient-to-br from-rose-50/90 via-pink-50/50 to-amber-50/60 dark:from-rose-950/30 dark:via-pink-950/20 dark:to-zinc-900 border-rose-200 dark:border-rose-900/60'
            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-rose-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                todayMuhurtha.hasVivahaLagna
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
              }`}
            >
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {todayMuhurtha.hasVivahaLagna
                    ? 'আজ শুভ বিবাহ লগ্ন উপস্থিত'
                    : 'আজ সার্বজনীন বিবাহ লগ্ন নেই'}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    todayMuhurtha.hasVivahaLagna
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {todayMuhurtha.hasVivahaLagna ? 'মহালগ্ন' : 'বর্জিত কাল'}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                নির্বাচিত স্থান: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{cityNameBn}</span> • স্থানীয় গোধূলি লগ্ন: <span className="font-semibold text-rose-700 dark:text-rose-400">{todayMuhurtha.godhuliLagnaRange}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowShastraGuide(!showShastraGuide)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>{showShastraGuide ? 'নিয়মাবলী লুকান' : 'শাস্ত্রীয় নিয়মাবলী'}</span>
            </button>
          </div>
        </div>

        {/* If Vivaha Lagna exists for today */}
        {todayMuhurtha.hasVivahaLagna && todayMuhurtha.vivahaItem && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-rose-200/70 dark:border-rose-900/40">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">বাংলা তারিখ:</span>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">
                    {todayMuhurtha.vivahaItem.banglaDayBn} {todayMuhurtha.vivahaItem.banglaMonthNameBn} {toBengaliNumeral(todayMuhurtha.vivahaItem.banglaYear)}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">বার ও তিথি:</span>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">
                    {todayMuhurtha.vivahaItem.weekdayBn}, {todayMuhurtha.vivahaItem.tithiBn}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">শুভ নক্ষত্র:</span>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">
                    {todayMuhurtha.vivahaItem.nakshatraBn}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">তথ্যসূত্র:</span>
                  <div className="font-medium text-zinc-700 dark:text-zinc-300 text-xs mt-0.5">
                    {todayMuhurtha.vivahaItem.source}
                  </div>
                </div>
              </div>

              {todayMuhurtha.vivahaItem.shastraNotesBn && (
                <p className="mt-3 pt-3 border-t border-rose-100 dark:border-zinc-700/60 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{todayMuhurtha.vivahaItem.shastraNotesBn}</span>
                </p>
              )}
            </div>

            {/* List of Lagnas for today */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-rose-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                <span>আজকের শুভ বিবাহ লগ্ন ও সময়সারণী:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {todayMuhurtha.vivahaItem.lagnas.map((lagna, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-rose-200/80 dark:border-rose-900/50 shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {lagna.lagnaName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          lagna.quality === 'পরম শুভ'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : lagna.quality === 'অতি শুভ'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {lagna.quality}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{lagna.timeRange}</span>
                    </div>

                    {lagna.description && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5">
                        {lagna.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* If Vivaha Lagna does not exist today */}
        {!todayMuhurtha.hasVivahaLagna && (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              সনাতন জ্যোতিষ শাস্ত্রীয় নির্ণয় অনুযায়ী আজকের দিনটিতে সার্বজনীন শুভ বিবাহ লগ্ন অনুষ্ঠিত হয় না।
            </p>

            {todayMuhurtha.reasonsIfNotBn && todayMuhurtha.reasonsIfNotBn.length > 0 && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2">
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>শাস্ত্রীয় নিষেধ ও কারণসমূহ:</span>
                </div>
                <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  {todayMuhurtha.reasonsIfNotBn.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>স্থানীয় গোধূলি শুভকাল: <strong>{todayMuhurtha.godhuliLagnaRange}</strong></span>
              </span>
              <span className="text-[11px] text-amber-700 dark:text-amber-300 hidden sm:inline">
                (সূর্যাস্তের ১২ মিনিট পূর্ব থেকে ১২ মিনিট পর)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Shastra Principles Accordion Card */}
      {showShastraGuide && (
        <div id="shastra-guide-card" className="bg-amber-50/60 dark:bg-zinc-900 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>সনাতন জ্যোতিষ শাস্ত্রে শুভ বিবাহ লগ্ন বিচারের বিধিবিধান</span>
            </h4>
            <span className="text-xs text-amber-800/80 dark:text-amber-400">
              বৃহৎপরাশর সংহিতা ও মুহূর্তচিন্তামণি
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white/80 dark:bg-zinc-800/80 rounded-xl border border-amber-200/70 dark:border-zinc-700 space-y-1">
              <h5 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>শুভ মাসসমূহ</span>
              </h5>
              <p className="text-zinc-600 dark:text-zinc-400">
                বৈশাখ, জ্যৈষ্ঠ, আষাঢ় (হরিশয়ন পূর্ব পর্যন্ত), অগ্রহায়ণ (দেবউত্থান পর), মাঘ ও ফাল্গুন মাস বিবাহে শ্রেষ্ঠ ফলদায়ক।
              </p>
            </div>

            <div className="p-3 bg-white/80 dark:bg-zinc-800/80 rounded-xl border border-amber-200/70 dark:border-zinc-700 space-y-1">
              <h5 className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>বর্জিত ও নিষিদ্ধ কাল</span>
              </h5>
              <p className="text-zinc-600 dark:text-zinc-400">
                পৌষ মাস (মলমাস/খর মাস), চৈত্র মাস (মীন রাশিগত রবি), চাতুর্মাস্য শয়নকাল (শ্রাবণ-ভাদ্র-আশ্বিন) এবং রিক্তা তিথিতে বিবাহ নিষিদ্ধ।
              </p>
            </div>

            <div className="p-3 bg-white/80 dark:bg-zinc-800/80 rounded-xl border border-amber-200/70 dark:border-zinc-700 space-y-1">
              <h5 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>গোধূলি লগ্নের মহিমা</span>
              </h5>
              <p className="text-zinc-600 dark:text-zinc-400">
                সূর্যাস্তের পূর্বাপর ২৪ মিনিট কাল ‘গোধূলি লগ্ন’। এটি দশলক্ষ দোষ হরণকারী সর্বসিদ্ধিদায়ক লগ্ন হিসেবে স্বীকৃত।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Complete Vivaha Muhurtha Directory for 1431, 1432, 1433 Bangabda */}
      <div id="vivaha-directory-card" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#056608] dark:text-emerald-400" />
              <span>১৪৩১, ১৪৩২ ও ১৪৩৩ বঙ্গাব্দের শুভ বিবাহ দিনপঞ্জি</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              বিশুদ্ধ সিদ্ধান্ত ও বেণীমাধব শীল পঞ্জিকানুযায়ী সকল স্বীকৃত বিবাহ লগ্ন ও সময়সূচীর তালিকা
            </p>
          </div>

          {/* Year selector pills */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
            {[1431, 1432, 1433].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedYear === yr
                    ? 'bg-[#056608] text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {toBengaliNumeral(yr)} বঙ্গাব্দ
              </button>
            ))}
          </div>
        </div>

        {/* Filters Bar: Month Selector and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            <button
              onClick={() => setSelectedMonth('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
                selectedMonth === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              সব মাস ({AUTHENTIC_VIVAHA_DATES.filter(d => d.banglaYear === selectedYear).length})
            </button>
            {[0, 1, 2, 7, 9, 10].map((mIdx) => {
              const count = AUTHENTIC_VIVAHA_DATES.filter(
                (d) => d.banglaYear === selectedYear && d.banglaMonthIndex === mIdx
              ).length;
              if (count === 0) return null;
              return (
                <button
                  key={mIdx}
                  onClick={() => setSelectedMonth(mIdx)}
                  className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-colors ${
                    selectedMonth === mIdx
                      ? 'bg-rose-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                  }`}
                >
                  {BANGLA_MONTHS_BN[mIdx]} ({toBengaliNumeral(count)})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative shrink-0 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="নক্ষত্র, তিথি বা তারিখ খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#056608]"
            />
          </div>
        </div>

        {/* Vivaha Dates Cards Grid */}
        {filteredVivahaDates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVivahaDates.map((item) => {
              const isSelected = item.gregorianDateStr === selectedDateStr;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-500 dark:border-rose-600 ring-2 ring-rose-500/20 shadow-md'
                      : 'bg-zinc-50/60 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-rose-600/10 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
                          {item.banglaDayBn}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                            {item.banglaDayBn} {item.banglaMonthNameBn} {toBengaliNumeral(item.banglaYear)}
                          </h4>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {item.gregorianDateDisplayBn} • {item.weekdayBn}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                          আজ নির্বাচিত
                        </span>
                      )}
                    </div>

                    {/* Tithi & Nakshatra Pill */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-3">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-medium">
                        {item.tithiBn}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 font-medium">
                        {item.nakshatraBn}
                      </span>
                    </div>

                    {/* Auspicious Lagnas */}
                    <div className="space-y-1.5 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        উপস্থিত বিবাহ লগ্নসমূহ:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {item.lagnas.map((lag, lIdx) => (
                          <div
                            key={lIdx}
                            className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700 flex flex-col"
                          >
                            <span className="font-bold text-zinc-800 dark:text-zinc-200 text-[11px]">
                              {lag.lagnaName}
                            </span>
                            <span className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                              {lag.timeRange}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {item.shastraNotesBn && (
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 italic mb-2">
                        {item.shastraNotesBn}
                      </p>
                    )}
                  </div>

                  {/* Jump / View Date Button */}
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400">
                      উৎস: {item.source}
                    </span>
                    <button
                      onClick={() => onSelectDate(new Date(item.gregorianDateStr + 'T00:00:00'))}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#056608] dark:text-emerald-400 hover:underline"
                    >
                      <span>এই তারিখের বিস্তারিত দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 text-xs">
            নির্বাচিত ফিল্টারে কোনো শুভ বিবাহ লগ্ন পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
};
