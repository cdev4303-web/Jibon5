import React, { useState } from 'react';
import { Compass, AlertTriangle, ShieldCheck, CheckCircle2, Clock, Sparkles, AlertCircle, Sun, Moon, ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Info } from 'lucide-react';
import { VivahaYatraEngine, YatraJudgmentResult, ChoghadiyaItem } from '../calendar/vivaha-yatra-engine';
import { toBengaliNumeral } from '../calendar/bangla-digits';

interface YatraMuhurthaSectionProps {
  selectedDate: Date;
  cityId: string;
  cityNameBn: string;
  customCoords?: { lat: number; lng: number; label: string; tzOffset?: number };
}

export const YatraMuhurthaSection: React.FC<YatraMuhurthaSectionProps> = ({
  selectedDate,
  cityId,
  cityNameBn,
  customCoords
}) => {
  const yatraData: YatraJudgmentResult = VivahaYatraEngine.getYatraJudgment(
    selectedDate,
    cityId,
    customCoords
  );

  const [activeChoghadiyaTab, setActiveChoghadiyaTab] = useState<'day' | 'night'>('day');

  // Direction icon helper
  const getDirectionIcon = (dir: string) => {
    if (dir.includes('উত্তর') || dir.includes('North')) return <ArrowUp className="w-4 h-4" />;
    if (dir.includes('দক্ষিণ') || dir.includes('South')) return <ArrowDown className="w-4 h-4" />;
    if (dir.includes('পূর্ব') || dir.includes('East')) return <ArrowRight className="w-4 h-4" />;
    if (dir.includes('পশ্চিম') || dir.includes('West')) return <ArrowLeft className="w-4 h-4" />;
    return <Compass className="w-4 h-4" />;
  };

  return (
    <div id="yatra-muhurtha-section" className="space-y-6">
      {/* Primary Disha Shool & Travel Status Banner */}
      <div
        id="disha-shool-hero-card"
        className="rounded-2xl p-5 md:p-6 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-emerald-50/50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 border border-amber-200 dark:border-zinc-700/80 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-amber-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 dark:bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  আজকের জ্যোতিষ শাস্ত্রীয় যাত্রা বিচার ও দিকশূল
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                  {yatraData.weekdayBn}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                স্থান: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{cityNameBn}</span> • সূর্যোদয়-সূর্যাস্তের অনুপাতে নিখুঁত ক্ষণগণনা
              </p>
            </div>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 italic">
            সূত্র: {yatraData.dishaShool.shastraReference}
          </div>
        </div>

        {/* Direction Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Forbidden Direction (দিকশূল) */}
          <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/20 border-2 border-rose-300 dark:border-rose-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>দিকশূল (বর্জনীয় দিক)</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900 dark:bg-rose-900/80 dark:text-rose-200">
                  যাত্রা নিষেধ
                </span>
              </div>
              <div className="text-xl font-black text-rose-900 dark:text-rose-300 flex items-center gap-2 mt-1">
                {getDirectionIcon(yatraData.dishaShool.forbiddenDirection)}
                <span>{yatraData.dishaShool.forbiddenDirection}</span>
              </div>
              <p className="text-xs text-rose-800/90 dark:text-rose-400 mt-2">
                আজকের বারে এই অভিমুখে দূরপাল্লার যাত্রা শাস্ত্রীয়ভাবে পরিহার করার বিধান রয়েছে।
              </p>
            </div>

            {/* Shastric Remedy */}
            <div className="mt-3 pt-3 border-t border-rose-200/60 dark:border-rose-900/50">
              <span className="text-[11px] font-bold text-rose-900 dark:text-rose-300 block mb-0.5">
                শাস্ত্রীয় প্রতিকার (জরুরি প্রয়োজনে):
              </span>
              <p className="text-xs text-rose-800 dark:text-rose-300/90">
                {yatraData.dishaShool.remedyBn}
              </p>
            </div>
          </div>

          {/* Favorable Directions (অনুকূল শুভ দিকসমূহ) */}
          <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>অনুকূল ও শুভ দিকসমূহ</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900 dark:bg-emerald-900/80 dark:text-emerald-200">
                  প্রশস্ত
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {yatraData.dishaShool.favorableDirections.map((dir, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 text-emerald-900 dark:text-emerald-300 font-bold text-sm border border-emerald-200 dark:border-emerald-800"
                  >
                    {getDirectionIcon(dir)}
                    <span>{dir}</span>
                  </span>
                ))}
              </div>
              <p className="text-xs text-emerald-800/90 dark:text-emerald-400 mt-3">
                আজকের দিনে উল্লেখিত দিকসমূহে যাত্রা করলে দিকশূলের কোনো দোষ স্পর্শ করে না।
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/50 text-[11px] text-emerald-700 dark:text-emerald-400">
              অভিজিৎ মুহূর্তে যাত্রা করলে সর্বদিকের দিকশূলের অশুভ প্রভাব দূরীভূত হয়।
            </div>
          </div>

          {/* Bengali Panjika Kala Bela & Bara Bela (কালবেলা ও বারবেলা) */}
          <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>কালবেলা ও বারবেলা</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200">
                  যাত্রা বর্জনীয়
                </span>
              </div>

              <div className="space-y-2 mt-2">
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-amber-200/70 dark:border-zinc-700">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">কালবেলা (দিবা):</span>
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {yatraData.baraKalaBela.kalaBela.text}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-amber-200/70 dark:border-zinc-700">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">বারবেলা (দিবা):</span>
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {yatraData.baraKalaBela.baraBela.text}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-amber-200/70 dark:border-zinc-700">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">কালরাত্রি (রাত্রি):</span>
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {yatraData.baraKalaBela.kalaRatri.text}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-400">
              {yatraData.baraKalaBela.significanceBn}
            </p>
          </div>
        </div>
      </div>

      {/* Travel Windows Overview: Best Windows vs Forbidden Windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Auspicious Windows */}
        <div className="bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-950/70 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>যাত্রার শ্রেষ্ঠ শুভ সময়সমূহ:</span>
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              শুভ আরম্ভ
            </span>
          </div>

          <div className="space-y-2">
            {/* Abhijit Muhurtha Special Card */}
            {yatraData.abhijitMuhurtha && (
              <div className={`p-3 rounded-xl border ${
                yatraData.abhijitMuhurtha.isApplicable
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 opacity-60'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                  <span>অভিজিৎ মুহূর্ত (মহাশুভক্ষণ)</span>
                  <span>{yatraData.abhijitMuhurtha.text}</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  {yatraData.abhijitMuhurtha.note}
                </p>
              </div>
            )}

            {yatraData.bestTravelWindows.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between text-xs"
              >
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{item}</span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">অনুকূল</span>
              </div>
            ))}
          </div>
        </div>

        {/* Forbidden Windows */}
        <div className="bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-950/70 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <h4 className="font-bold text-sm text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>যাত্রার জন্য বর্জনীয় সময়সমূহ:</span>
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              পরিহার্য
            </span>
          </div>

          <div className="space-y-2">
            {yatraData.forbiddenTravelWindows.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 flex items-center justify-between text-xs"
              >
                <span className="font-medium text-rose-900 dark:text-rose-200">{item}</span>
                <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-400">বর্জনীয়</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl">
            কোনো কারণে জরুরি মুহূর্তে বের হতে হলে বর্জনীয় সময় অতিবাহিত হওয়ার পর গৃহত্যাগ করা শাস্ত্রানুমোদিত।
          </p>
        </div>
      </div>

      {/* Comprehensive 16-Part Day & Night Choghadiya Timetable */}
      <div id="choghadiya-table-card" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>আজকের সম্পূর্ণ চৌঘড়িয়া মুহূর্ত (দিবা ও রাত্রি ১৬টি প্রহর ভাগ)</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              যাত্রা ও মাঙ্গলিক কার্যের জন্য অমৃত, শুভ, লাভ, চল, রোগ, উদ্বেগ ও কাল মুহূর্তের নিখুঁত সময়কাল
            </p>
          </div>

          {/* Day / Night Toggle */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveChoghadiyaTab('day')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeChoghadiyaTab === 'day'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>দিবা চৌঘড়িয়া (৮ ভাগ)</span>
            </button>
            <button
              onClick={() => setActiveChoghadiyaTab('night')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeChoghadiyaTab === 'night'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>রাত্রি চৌঘড়িয়া (৮ ভাগ)</span>
            </button>
          </div>
        </div>

        {/* Choghadiya Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(activeChoghadiyaTab === 'day' ? yatraData.dayChoghadiyas : yatraData.nightChoghadiyas).map(
            (chog: ChoghadiyaItem, idx: number) => {
              const isAuspicious = chog.type === 'auspicious';
              const isNeutral = chog.type === 'neutral';
              const isInauspicious = chog.type === 'inauspicious';

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    isAuspicious
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                      : isNeutral
                      ? 'bg-sky-50/70 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/50'
                      : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                        {chog.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          chog.name === 'অমৃত'
                            ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                            : chog.name === 'শুভ' || chog.name === 'লাভ'
                            ? 'bg-teal-200 text-teal-900 dark:bg-teal-900 dark:text-teal-200'
                            : chog.name === 'চল'
                            ? 'bg-sky-200 text-sky-900 dark:bg-sky-900 dark:text-sky-200'
                            : chog.name === 'কাল'
                            ? 'bg-rose-300 text-rose-950 dark:bg-rose-950 dark:text-rose-200'
                            : 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                        }`}
                      >
                        {isAuspicious ? 'শুভ' : isNeutral ? 'চলনশীল' : 'বর্জনীয়'}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{chog.start} - {chog.end}</span>
                    </div>

                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      {chog.significanceBn}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Legend / Guidance Note */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span><strong>অমৃত, শুভ ও লাভ:</strong> যাত্রার জন্য পরম প্রশস্ত</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span><strong>চল:</strong> গতিশীল কাজের জন্য নিরাপদ</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span><strong>রোগ, উদ্বেগ ও কাল:</strong> যাত্রা বর্জনীয়</span>
            </span>
          </div>

          <span className="text-[11px] text-zinc-500 italic">
            মোট ৮টি দিবা ও ৮টি রাত্রি মুহূর্ত
          </span>
        </div>
      </div>

      {/* Actionable Shastra Travel Advice Card */}
      <div id="yatra-guidance-card" className="bg-emerald-50/60 dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 shadow-sm space-y-2">
        <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>জ্যোতিষ শাস্ত্রীয় সারসংক্ষেপ ও ভ্রমণ পরামর্শ</span>
        </h4>
        <p className="text-xs text-emerald-900/90 dark:text-emerald-300 leading-relaxed">
          {yatraData.travelGuidanceBn}
        </p>
      </div>
    </div>
  );
};
