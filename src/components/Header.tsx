import React, { useState } from 'react';
import { Menu, Settings as SettingsIcon, Search, MapPin, X, ArrowRight } from 'lucide-react';
import { Region, CityLocationId } from '../types';
import { DateSearchService, DateSearchResult } from '../calendar/date-search';
import { BANGLADESH_DISTRICTS, WEST_BENGAL_DISTRICTS } from '../calendar/astronomy';

interface HeaderProps {
  region: Region;
  cityId: CityLocationId;
  onRegionChange: (r: Region) => void;
  onOpenSettings: () => void;
  onOpenSidebar: () => void;
  onSelectSearchedDate: (d: Date) => void;
}

export const Header: React.FC<HeaderProps> = ({
  region,
  cityId,
  onRegionChange,
  onOpenSettings,
  onOpenSidebar,
  onSelectSearchedDate
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<DateSearchResult | null>(null);

  // Find city name
  const allDistricts = [...BANGLADESH_DISTRICTS, ...WEST_BENGAL_DISTRICTS];
  const currentCity = allDistricts.find((d) => d.id === cityId) || BANGLADESH_DISTRICTS[0];

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      const res = DateSearchService.searchDate(val, region);
      setSearchResult(res);
    } else {
      setSearchResult(null);
    }
  };

  const handleSelectResult = (date: Date) => {
    onSelectSearchedDate(date);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResult(null);
  };

  return (
    <header className="bg-white dark:bg-stone-900 border-b border-[#E0E4D9] dark:border-stone-800 sticky top-0 z-30 transition-colors shadow-xs no-print print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            id="btn-sidebar-toggle"
            onClick={onOpenSidebar}
            aria-label="মেনু খুলুন"
            className="w-10 h-10 flex items-center justify-center bg-[#056608] hover:bg-[#045006] text-white rounded-xl transition-colors shadow-xs touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#056608]/40"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>

          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#056608] dark:text-emerald-400 leading-tight">
              বাংলা ক্যালেন্ডার
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] text-[#4A5D4C] dark:text-stone-400 font-medium">
              <span>{region === 'bangladesh' ? '🇧🇩 বাংলাদেশ' : region === 'west_bengal' ? '🇮🇳 পশ্চিমবঙ্গ' : '🇧🇩 ও 🇮🇳'}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-[#056608] dark:text-emerald-400 font-semibold">
                <MapPin className="w-2.5 h-2.5" />
                {currentCity.nameBn}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Trigger on Desktop / Tablet */}
        <div className="hidden lg:flex flex-1 max-w-sm mx-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full py-2 px-3.5 rounded-full bg-[#F0F2EB] dark:bg-stone-800 border border-[#D1D8C5] dark:border-stone-700 text-xs text-[#4A5D4C] dark:text-stone-400 flex items-center justify-between hover:bg-[#E7ECE0] dark:hover:bg-stone-700/80 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#056608] dark:text-emerald-400" />
              <span>তারিখ খুঁজুন (যেমন: ২৩ ভাদ্র বা 7 Sep)...</span>
            </span>
            <kbd className="text-[10px] bg-white dark:bg-stone-900 px-1.5 py-0.5 rounded border border-[#D1D8C5] dark:border-stone-700 font-mono">
              /
            </kbd>
          </button>
        </div>

        {/* Right: Region Selector & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Icon button on mobile */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="তারিখ অনুসন্ধান"
            className="lg:hidden p-2 rounded-full text-[#4A5D4C] dark:text-stone-300 hover:bg-[#F0F2EB] dark:hover:bg-stone-800 transition-colors"
          >
            <Search className="w-5 h-5 text-[#056608] dark:text-emerald-400" />
          </button>

          {/* Desktop Region Selector */}
          <div className="hidden md:flex items-center bg-[#F0F2EB] dark:bg-stone-800 p-1 rounded-full border border-[#D1D8C5] dark:border-stone-700">
            <button
              id="region-btn-bd-desktop"
              onClick={() => onRegionChange('bangladesh')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                region === 'bangladesh'
                  ? 'bg-[#056608] text-white shadow-xs'
                  : 'text-[#4A5D4C] dark:text-stone-300 hover:text-[#1A2F1C]'
              }`}
            >
              🇧🇩 বাংলাদেশ
            </button>
            <button
              id="region-btn-wb-desktop"
              onClick={() => onRegionChange('west_bengal')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                region === 'west_bengal'
                  ? 'bg-[#056608] text-white shadow-xs'
                  : 'text-[#4A5D4C] dark:text-stone-300 hover:text-[#1A2F1C]'
              }`}
            >
              🇮🇳 পশ্চিমবঙ্গ
            </button>
            <button
              id="region-btn-both-desktop"
              onClick={() => onRegionChange('both')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                region === 'both'
                  ? 'bg-[#056608] text-white shadow-xs'
                  : 'text-[#4A5D4C] dark:text-stone-300 hover:text-[#1A2F1C]'
              }`}
            >
              🔄 উভয়
            </button>
          </div>

          {/* Settings Button */}
          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            aria-label="সেটিংস"
            className="p-2 rounded-full text-[#4A5D4C] dark:text-stone-300 hover:bg-[#F0F2EB] dark:hover:bg-stone-800 transition-colors"
          >
            <SettingsIcon className="w-5 h-5 text-[#4A5D4C] dark:text-stone-300" />
          </button>
        </div>
      </div>

      {/* Mobile-only Region Selector (< md) */}
      <div className="md:hidden bg-[#F9FAF7] dark:bg-stone-900 border-t border-[#E0E4D9] dark:border-stone-800 px-3 py-1.5">
        <div className="flex bg-[#F0F2EB] dark:bg-stone-800 p-0.5 rounded-full border border-[#D1D8C5] dark:border-stone-700 w-full justify-between">
          <button
            id="region-btn-bd-mobile"
            onClick={() => onRegionChange('bangladesh')}
            className={`flex-1 py-1 rounded-full text-[11px] font-semibold text-center transition-all ${
              region === 'bangladesh'
                ? 'bg-[#056608] text-white shadow-xs'
                : 'text-[#4A5D4C] dark:text-stone-300'
            }`}
          >
            🇧🇩 বাংলাদেশ
          </button>
          <button
            id="region-btn-wb-mobile"
            onClick={() => onRegionChange('west_bengal')}
            className={`flex-1 py-1 rounded-full text-[11px] font-semibold text-center transition-all ${
              region === 'west_bengal'
                ? 'bg-[#056608] text-white shadow-xs'
                : 'text-[#4A5D4C] dark:text-stone-300'
            }`}
          >
            🇮🇳 পশ্চিমবঙ্গ
          </button>
          <button
            id="region-btn-both-mobile"
            onClick={() => onRegionChange('both')}
            className={`flex-1 py-1 rounded-full text-[11px] font-semibold text-center transition-all ${
              region === 'both'
                ? 'bg-[#056608] text-white shadow-xs'
                : 'text-[#4A5D4C] dark:text-stone-300'
            }`}
          >
            🔄 উভয়
          </button>
        </div>
      </div>

      {/* Interactive Date Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-[28px] max-w-lg w-full p-4 sm:p-6 border border-[#E0E4D9] dark:border-stone-800 shadow-2xl mt-12 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0E4D9] dark:border-stone-800">
              <div className="flex items-center gap-2 text-sm font-bold text-[#056608] dark:text-emerald-400">
                <Search className="w-4 h-4" />
                <span>তারিখ অনুসন্ধান ও জাম্প</span>
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  setSearchResult(null);
                }}
                className="w-8 h-8 rounded-full border border-[#E0E4D9] dark:border-stone-700 flex items-center justify-center text-[#1A2F1C] dark:text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="যেমন: ২৩ ভাদ্র ১৪৩৩, ৭ সেপ্টেম্বর ২০২৬, 7 Sep 2026..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResult) {
                    handleSelectResult(searchResult.date);
                  }
                }}
                className="w-full p-3.5 pr-10 rounded-2xl border-2 border-[#056608] bg-[#F9FAF7] dark:bg-stone-800 text-sm font-bold text-[#1A2F1C] dark:text-stone-100 placeholder-[#8A967E] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Result or Helper Examples */}
            {searchResult ? (
              <div
                onClick={() => handleSelectResult(searchResult.date)}
                className="p-4 rounded-2xl bg-[#EBF0E4] dark:bg-stone-800 border-2 border-[#056608] flex items-center justify-between cursor-pointer hover:bg-[#E0E4D9] dark:hover:bg-stone-700 transition-colors shadow-xs"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#056608] dark:text-emerald-400 block mb-0.5">
                    সনাক্তকৃত তারিখ:
                  </span>
                  <div className="text-sm sm:text-base font-bold text-[#1A2F1C] dark:text-stone-100">
                    {searchResult.label}
                  </div>
                  <span className="text-[11px] text-[#4A5D4C] dark:text-stone-400">
                    গ্রেগরিয়ান: {searchResult.date.toLocaleDateString('bn-BD', { dateStyle: 'full' })}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#056608] text-white flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ) : searchQuery.trim().length >= 2 ? (
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-500 text-xs text-center">
                এই বিন্যাসে কোনো নির্দিষ্ট তারিখ পাওয়া যায়নি। অনুগ্রহ করে &quot;২৩ ভাদ্র ১৪৩৩&quot; বা &quot;7 Sep 2026&quot; আকারে লিখুন।
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#4A5D4C] dark:text-stone-400 uppercase tracking-wider block">
                  উদাহরণসমূহ (ক্লিক করে পরীক্ষা করুন):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    '৭ সেপ্টেম্বর ২০২৬',
                    '২৩ ভাদ্র ১৪৩৩',
                    '১৪ এপ্রিল ২০২৬',
                    '১ বৈশাখ ১৪৩৩',
                    '26 March 2026',
                    '16 December 2026'
                  ].map((eg) => (
                    <button
                      key={eg}
                      onClick={() => handleSearchChange(eg)}
                      className="px-3 py-1.5 rounded-xl bg-[#F0F2EB] dark:bg-stone-800 hover:bg-[#E0E4D9] text-xs font-semibold text-[#1A2F1C] dark:text-stone-200 border border-[#D1D8C5] dark:border-stone-700 transition-colors"
                    >
                      {eg}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
