import React from 'react';
import { PartyPopper, Flag, Sparkles } from 'lucide-react';
import { HolidayEvent, Region } from '../types';

interface TodayEventsProps {
  events: HolidayEvent[];
  region: Region;
  seasonBn: string;
}

export const TodayEvents: React.FC<TodayEventsProps> = ({ events, region, seasonBn }) => {
  const primaryEvent = events[0];
  const additionalEvents = events.slice(1);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-[28px] border border-[#E0E4D9] dark:border-stone-800 shadow-xs p-5 transition-colors space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-bold text-[#1A2F1C] dark:text-stone-100 flex items-center gap-2">
          <PartyPopper className="w-5 h-5 text-[#D2122E]" />
          <span>আজকের দিবস ও ছুটি</span>
        </h3>
        <span className="text-xs font-semibold text-[#056608] dark:text-emerald-400 bg-[#EBF0E4] dark:bg-stone-800 px-3 py-1 rounded-full border border-[#D1D8C5] dark:border-stone-700">
          {seasonBn}কাল
        </span>
      </div>

      {primaryEvent ? (
        <div className="space-y-2.5">
          {/* Featured Editorial Holiday Banner */}
          <div className="bg-[#D2122E] text-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl">🎉</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-85">
                    {primaryEvent.isHoliday ? 'সরকারি ছুটি' : 'আজকের বিশেষ দিবস'}
                  </p>
                  <span className="text-[10px] opacity-80 font-medium">
                    ({primaryEvent.region === 'bd' ? '🇧🇩 বাংলাদেশ' : primaryEvent.region === 'wb' ? '🇮🇳 পশ্চিমবঙ্গ' : '🇧🇩 ও 🇮🇳'})
                  </span>
                </div>
                <p className="font-bold text-base sm:text-lg mt-0.5 leading-snug">
                  {primaryEvent.titleBn}
                </p>
                {primaryEvent.descriptionBn && (
                  <p className="text-xs opacity-90 mt-1 leading-relaxed">
                    {primaryEvent.descriptionBn}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional events if multiple on this date */}
          {additionalEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-xl border border-[#D1D8C5] dark:border-stone-700 bg-[#F0F2EB]/70 dark:bg-stone-800/60 flex items-start gap-3"
            >
              <div className="p-1.5 rounded-lg bg-[#056608] text-white mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#1A2F1C] dark:text-stone-100">
                    {ev.titleBn}
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF0E4] text-[#056608]">
                    {ev.isHoliday ? 'ছুটি' : 'বিশেষ দিবস'}
                  </span>
                </div>
                {ev.descriptionBn && (
                  <p className="text-xs text-[#4A5D4C] dark:text-stone-300 mt-0.5">
                    {ev.descriptionBn}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#F9FAF7] dark:bg-stone-800/40 border border-dashed border-[#D1D8C5] dark:border-stone-700 text-[#4A5D4C] dark:text-stone-400 text-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EBF0E4] dark:bg-stone-700 flex items-center justify-center shrink-0 text-base">
            ✨
          </div>
          <p className="leading-relaxed">
            আজ কোনো সাধারণ সরকারি ছুটি নির্ধারিত নেই। এটি একটি নিয়মিত কর্মদিবস।
          </p>
        </div>
      )}
    </div>
  );
};
