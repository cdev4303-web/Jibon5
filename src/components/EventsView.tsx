import React, { useState } from 'react';
import { Search, Calendar, Flag, Sparkles } from 'lucide-react';
import { HolidayEvent, Region } from '../types';
import { CalendarDataService } from '../calendar/calendar-data';
import { GREGORIAN_MONTHS_BN, toBengaliNumeral } from '../calendar/bangla-digits';

interface EventsViewProps {
  currentDate: Date;
  region: Region;
  onSelectDateToView: (d: Date) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  currentDate,
  region,
  onSelectDateToView
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'holiday' | 'national' | 'religious' | 'cultural'
  >('all');
  const [selectedRegion, setSelectedRegion] = useState<Region>(region);
  const [searchQuery, setSearchQuery] = useState('');

  const allEvents = CalendarDataService.getAllUpcomingEvents(currentDate, selectedRegion);

  const filteredEvents = allEvents.filter((ev) => {
    // Category filter
    if (selectedCategory === 'holiday' && !ev.isHoliday) return false;
    if (selectedCategory === 'national' && !(ev.category === 'national_bd' || ev.category === 'national_wb' || ev.category === 'bd_govt' || ev.category === 'wb_govt')) return false;
    if (selectedCategory === 'religious' && !(ev.category === 'islamic' || ev.category === 'hindu' || ev.category === 'christian' || ev.category === 'buddhist')) return false;
    if (selectedCategory === 'cultural' && ev.category !== 'cultural') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBn = ev.titleBn.toLowerCase().includes(q);
      const matchEn = ev.titleEn?.toLowerCase().includes(q);
      const matchDesc = ev.descriptionBn?.toLowerCase().includes(q);
      return matchBn || matchEn || matchDesc;
    }

    return true;
  });

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      const d = Number(parts[2]);
      return `${toBengaliNumeral(d)} ${GREGORIAN_MONTHS_BN[m]} ${toBengaliNumeral(y)}`;
    }
    return dateStr;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-8 border border-[#E0E4D9] dark:border-stone-800 shadow-xs text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2F1C] dark:text-stone-100">
          ছুটি ও ঐতিহাসিক দিবসের তালিকা
        </h2>
        <p className="text-xs sm:text-sm text-[#4A5D4C] dark:text-stone-400 mt-1 max-w-md mx-auto">
          বাংলাদেশ ও পশ্চিমবঙ্গের সরকারি ছুটি, জাতীয় দিবস ও ধর্মীয় উৎসবের নির্ভুল বিবরণ
        </p>

        {/* Region Filter */}
        <div className="flex justify-center gap-2 mt-5">
          <div className="inline-flex bg-[#F0F2EB] dark:bg-stone-800 p-1 rounded-full border border-[#D1D8C5] dark:border-stone-700 text-xs font-semibold">
            <button
              onClick={() => setSelectedRegion('bangladesh')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                selectedRegion === 'bangladesh'
                  ? 'bg-[#056608] text-white shadow-xs'
                  : 'text-[#4A5D4C] dark:text-stone-300'
              }`}
            >
              🇧🇩 বাংলাদেশ
            </button>
            <button
              onClick={() => setSelectedRegion('west_bengal')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                selectedRegion === 'west_bengal'
                  ? 'bg-[#056608] text-white shadow-xs'
                  : 'text-[#4A5D4C] dark:text-stone-300'
              }`}
            >
              🇮🇳 পশ্চিমবঙ্গ
            </button>
            <button
              onClick={() => setSelectedRegion('both')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                selectedRegion === 'both'
                  ? 'bg-[#056608] text-white shadow-xs'
                  : 'text-[#4A5D4C] dark:text-stone-300'
              }`}
            >
              🔄 উভয় অঞ্চল
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-5 relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-[#8A967E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ছুটি বা উৎসবের নাম লিখে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F9FAF7] dark:bg-stone-800 border border-[#D1D8C5] dark:border-stone-700 text-xs sm:text-sm text-[#1A2F1C] dark:text-stone-100 focus:ring-2 focus:ring-[#056608] transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'সব দিবস' },
          { id: 'holiday', label: 'সরকারি ছুটি' },
          { id: 'national', label: 'জাতীয় দিবস' },
          { id: 'religious', label: 'ধর্মীয় উৎসব' },
          { id: 'cultural', label: 'সাংস্কৃতিক' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#056608] text-white border-[#056608] shadow-xs'
                : 'bg-white dark:bg-stone-900 text-[#4A5D4C] dark:text-stone-300 border-[#E0E4D9] dark:border-stone-800 hover:bg-[#F9FAF7]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className={`bg-white dark:bg-stone-900 p-5 rounded-[24px] border transition-all hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                ev.isHoliday
                  ? 'border-[#D2122E]/30 bg-[#FFFDFD] dark:bg-stone-900'
                  : 'border-[#E0E4D9] dark:border-stone-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white ${
                    ev.isHoliday ? 'bg-[#D2122E]' : 'bg-[#056608]'
                  }`}
                >
                  {ev.category === 'national_bd' || ev.category === 'national_wb' || ev.category === 'bd_govt' || ev.category === 'wb_govt' ? (
                    <Flag className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-[#1A2F1C] dark:text-stone-100">
                      {ev.titleBn}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        ev.isHoliday
                          ? 'bg-[#FFF1F1] text-[#D2122E] dark:bg-red-950 dark:text-red-300'
                          : 'bg-[#EBF0E4] text-[#056608] dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {ev.isHoliday ? 'সরকারি ছুটি' : 'ঐতিহাসিক দিবস'}
                    </span>
                    <span className="text-[10px] text-[#8A967E] font-medium">
                      {ev.region === 'bd'
                        ? '🇧🇩 বাংলাদেশ'
                        : ev.region === 'wb'
                        ? '🇮🇳 পশ্চিমবঙ্গ'
                        : '🇧🇩 ও 🇮🇳 উভয়'}
                    </span>
                  </div>

                  {ev.descriptionBn && (
                    <p className="text-xs text-[#4A5D4C] dark:text-stone-400 mt-1 leading-relaxed">
                      {ev.descriptionBn}
                    </p>
                  )}

                  <div className="text-xs font-semibold text-[#056608] dark:text-emerald-400 mt-2.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDateDisplay(ev.dateStr)}</span>
                  </div>
                </div>
              </div>

              {ev.dateStr && (
                <button
                  onClick={() => {
                    const [y, m, d] = ev.dateStr!.split('-').map(Number);
                    onSelectDateToView(new Date(y, m - 1, d));
                  }}
                  className="sm:self-center px-4 py-2 rounded-full border border-[#D1D8C5] dark:border-stone-700 hover:bg-[#F9FAF7] dark:hover:bg-stone-800 text-[#1A2F1C] dark:text-stone-200 text-xs font-semibold transition-colors shrink-0"
                >
                  ক্যালেন্ডারে দেখুন
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="p-10 text-center bg-white dark:bg-stone-900 rounded-[32px] border border-[#E0E4D9] dark:border-stone-800">
            <p className="text-sm text-[#8A967E]">কোনো ছুটি বা দিবস খুঁজে পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
};
