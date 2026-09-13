import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  MapPin,
  Sun,
  Moon,
  Clock,
  Compass,
  Sparkles,
  AlertTriangle,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Flame,
  Star,
  Heart
} from 'lucide-react';
import { UserSettings, LocationCity } from '../types';
import { ALL_CITIES_PANJIKA, AstronomicalEngine } from '../calendar/astronomical-engine';
import { BangladeshCalendarEngine } from '../calendar/bangladesh-calendar';
import { WestBengalCalendarEngine } from '../calendar/west-bengal-calendar';
import { HolidayDatabaseService } from '../calendar/holiday-database';
import { toBengaliNumeral } from '../calendar/bangla-digits';
import { VivahaMuhurthaSection } from './VivahaMuhurthaSection';
import { YatraMuhurthaSection } from './YatraMuhurthaSection';
import { VivahaYatraEngine } from '../calendar/vivaha-yatra-engine';

interface VedicPanjikaViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const VedicPanjikaView: React.FC<VedicPanjikaViewProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeCityId, setActiveCityId] = useState<string>(settings.cityId || 'kolkata');
  const [showCustomCoords, setShowCustomCoords] = useState<boolean>(false);
  const [customLat, setCustomLat] = useState<string>('22.5726');
  const [customLng, setCustomLng] = useState<string>('88.3639');
  const [panjikaTab, setPanjikaTab] = useState<'panchanga' | 'vivaha' | 'yatra' | 'all'>('panchanga');

  // Selected city
  const currentCity = useMemo(() => {
    return ALL_CITIES_PANJIKA.find((c) => c.id === activeCityId) || ALL_CITIES_PANJIKA[8]; // Default Kolkata
  }, [activeCityId]);

  // Coordinates resolution
  const effectiveCoords = useMemo(() => {
    if (showCustomCoords) {
      const lat = parseFloat(customLat) || 22.5726;
      const lng = parseFloat(customLng) || 88.3639;
      const tzOffset = lng > 89 ? 6.0 : 5.5;
      return { lat, lng, label: 'কাস্টম স্থানাঙ্ক', tzOffset };
    }
    return {
      lat: currentCity.lat,
      lng: currentCity.lng,
      label: currentCity.nameBn,
      tzOffset: currentCity.tzOffset
    };
  }, [showCustomCoords, customLat, customLng, currentCity]);

  // Full Panjika calculation
  const panjikaData = useMemo(() => {
    return AstronomicalEngine.getFullPanjika(
      selectedDate,
      activeCityId,
      showCustomCoords ? effectiveCoords : undefined
    );
  }, [selectedDate, activeCityId, showCustomCoords, effectiveCoords]);

  // Sun and Moon times
  const sunMoonInfo = useMemo(() => {
    return AstronomicalEngine.getSunMoonInfo(
      selectedDate,
      activeCityId,
      showCustomCoords ? effectiveCoords : undefined
    );
  }, [selectedDate, activeCityId, showCustomCoords, effectiveCoords]);

  // Bengali Dates for both WB and BD
  const wbBanglaDate = useMemo(() => {
    return WestBengalCalendarEngine.fromGregorian(selectedDate);
  }, [selectedDate]);

  const bdBanglaDate = useMemo(() => {
    return BangladeshCalendarEngine.fromGregorian(selectedDate);
  }, [selectedDate]);

  // Holiday & Festival Events for this day
  const dailyEvents = useMemo(() => {
    return HolidayDatabaseService.getEventsForDate(selectedDate, 'both');
  }, [selectedDate]);

  // Vivaha muhurtha for this day
  const todayVivaha = useMemo(() => {
    return VivahaYatraEngine.getVivahaMuhurthaForDate(
      selectedDate,
      activeCityId,
      showCustomCoords ? effectiveCoords : undefined
    );
  }, [selectedDate, activeCityId, showCustomCoords, effectiveCoords]);

  // Yatra judgment for this day
  const todayYatra = useMemo(() => {
    return VivahaYatraEngine.getYatraJudgment(
      selectedDate,
      activeCityId,
      showCustomCoords ? effectiveCoords : undefined
    );
  }, [selectedDate, activeCityId, showCustomCoords, effectiveCoords]);

  // Date Navigation handlers
  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split('-').map(Number);
      setSelectedDate(new Date(y, m - 1, d));
    }
  };

  const handlePrint = () => {
    document.body.classList.add('print-panjika-mode');
    window.print();
    const cleanup = () => {
      document.body.classList.remove('print-panjika-mode');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 2500);
  };

  const dateInputVal = selectedDate.toISOString().slice(0, 10);
  const weekdayNames = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const currentWeekday = weekdayNames[selectedDate.getDay()];

  return (
    <div id="vedic-panjika-container" className="space-y-6 max-w-5xl mx-auto pb-12 panjika-section">
      {/* Top Header & Intro */}
      <div id="panjika-header-card" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300">
                বৈদিক দৃক পঞ্চাঙ্গ ও পঞ্জিকা
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                লাহিড়ী (চিত্রপক্ষ) অয়নাংশ নির্ভুল জ্যোতির্বিজ্ঞানসম্মত হিসাব
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 font-serif">
              ভারতীয় পঞ্জিকা ও শুভ মুহূর্ত
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              পশ্চিমবঙ্গ ও সমগ্র ভারতের জন্য তিথি, নক্ষত্র, যোগ, করণ, শুভ-অশুভ কাল ও চন্দ্র-সূর্য সময়ের নির্ভুল হিসাব।
            </p>
          </div>

          <button
            id="print-panjika-btn"
            onClick={handlePrint}
            className="no-print self-start md:self-center inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
            title="দৈনিক পঞ্জিকা প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট / PDF</span>
          </button>
        </div>

        {/* Printable location and date header */}
        <div className="hidden print:block pt-3 border-t border-zinc-200 text-xs text-zinc-800">
          <div><strong>স্থান:</strong> {effectiveCoords.label} (অক্ষাংশ: {effectiveCoords.lat.toFixed(4)}°, দ্রাঘিমাংশ: {effectiveCoords.lng.toFixed(4)}°, সময় অঞ্চল: UTC+{effectiveCoords.tzOffset})</div>
          <div><strong>তারিখ:</strong> {toBengaliNumeral(selectedDate.getDate())} {selectedDate.toLocaleString('bn-BD', { month: 'long' })} {toBengaliNumeral(selectedDate.getFullYear())} | পশ্চিমবঙ্গ: {wbBanglaDate.dayBn} {wbBanglaDate.monthNameBn} {wbBanglaDate.yearBn} | বাংলাদেশ: {bdBanglaDate.dayBn} {bdBanglaDate.monthNameBn} {bdBanglaDate.yearBn}</div>
        </div>

        {/* City and Location Bar */}
        <div id="panjika-city-bar" className="no-print mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">স্থান নির্বাচন:</span>
          </div>

          {/* Quick city pills */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {ALL_CITIES_PANJIKA.slice(0, 10).map((city) => (
              <button
                key={city.id}
                id={`city-pill-${city.id}`}
                onClick={() => {
                  setActiveCityId(city.id);
                  setShowCustomCoords(false);
                  onUpdateSettings({ cityId: city.id });
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  !showCustomCoords && activeCityId === city.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {city.nameBn}
              </button>
            ))}

            <button
              id="toggle-custom-coords-btn"
              onClick={() => setShowCustomCoords(!showCustomCoords)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                showCustomCoords
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              অন্যান্য স্থান / GPS
            </button>
          </div>
        </div>

        {/* Custom Coordinates input if enabled */}
        {showCustomCoords && (
          <div id="custom-coords-panel" className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/60 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <label className="text-zinc-600 dark:text-zinc-400">অক্ষাংশ (Lat):</label>
              <input
                type="number"
                step="0.0001"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                className="w-24 px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-zinc-600 dark:text-zinc-400">দ্রাঘিমাংশ (Lng):</label>
              <input
                type="number"
                step="0.0001"
                value={customLng}
                onChange={(e) => setCustomLng(e.target.value)}
                className="w-24 px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <span className="text-zinc-500 dark:text-zinc-400 italic">
              (টাইমজোন স্বয়ংক্রিয়ভাবে নির্ধারিত)
            </span>
          </div>
        )}
      </div>

      {/* Date Navigation Strip */}
      <div id="panjika-date-nav" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="no-print flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            id="panjika-prev-day-btn"
            onClick={handlePrevDay}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            title="পূর্ববর্তী দিন"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            id="panjika-today-btn"
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
          >
            আজকের পঞ্জিকা
          </button>

          <button
            id="panjika-next-day-btn"
            onClick={handleNextDay}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            title="পরবর্তী দিন"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Date Display */}
        <div className="text-center sm:text-left">
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {toBengaliNumeral(selectedDate.getDate())} {selectedDate.toLocaleString('bn-BD', { month: 'long' })} {toBengaliNumeral(selectedDate.getFullYear())}, {currentWeekday}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center justify-center sm:justify-start gap-2">
            <span>পশ্চিমবঙ্গ: {wbBanglaDate.dayBn} {wbBanglaDate.monthNameBn} {wbBanglaDate.yearBn} বঙ্গাব্দ</span>
            <span>•</span>
            <span>বাংলাদেশ: {bdBanglaDate.dayBn} {bdBanglaDate.monthNameBn} {bdBanglaDate.yearBn} বঙ্গাব্দ</span>
          </div>
        </div>

        {/* Date Picker Input */}
        <div className="no-print flex items-center gap-2">
          <label htmlFor="panjika-jump-date" className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>তারিখে যান:</span>
          </label>
          <input
            id="panjika-jump-date"
            type="date"
            value={dateInputVal}
            onChange={handleDateChange}
            className="px-3 py-1.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Panjika Sub-Navigation Bar */}
      <div id="panjika-sub-nav" className="no-print flex items-center gap-1.5 overflow-x-auto p-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60">
        <button
          id="btn-subnav-panchanga"
          onClick={() => setPanjikaTab('panchanga')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            panjikaTab === 'panchanga'
              ? 'bg-white dark:bg-zinc-900 text-[#056608] dark:text-emerald-400 shadow-sm border border-zinc-200 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>দৈনিক পঞ্চাঙ্গ ও মুহূর্ত</span>
        </button>

        <button
          id="btn-subnav-vivaha"
          onClick={() => setPanjikaTab('vivaha')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            panjikaTab === 'vivaha'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>💍 শুভ বিবাহ লগ্ন ও দিনপঞ্জি</span>
          {todayVivaha.hasVivahaLagna && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white text-rose-700 font-black animate-pulse">
              আজ লগ্ন আছে
            </span>
          )}
        </button>

        <button
          id="btn-subnav-yatra"
          onClick={() => setPanjikaTab('yatra')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            panjikaTab === 'yatra'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>🧭 যাত্রা বিচার ও দিকশূল</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
            panjikaTab === 'yatra' ? 'bg-amber-800 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
          }`}>
            দিকশূল: {todayYatra.dishaShool.forbiddenDirection.split(' ')[0]}
          </span>
        </button>

        <button
          id="btn-subnav-all"
          onClick={() => setPanjikaTab('all')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            panjikaTab === 'all'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <span>সার্বিক পঞ্জিকা (সবকিছু)</span>
        </button>
      </div>

      {/* Vivaha Section when active */}
      {(panjikaTab === 'vivaha' || panjikaTab === 'all') && (
        <VivahaMuhurthaSection
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          cityId={activeCityId}
          cityNameBn={effectiveCoords.label}
          customCoords={showCustomCoords ? effectiveCoords : undefined}
        />
      )}

      {/* Yatra Section when active */}
      {(panjikaTab === 'yatra' || panjikaTab === 'all') && (
        <YatraMuhurthaSection
          selectedDate={selectedDate}
          cityId={activeCityId}
          cityNameBn={effectiveCoords.label}
          customCoords={showCustomCoords ? effectiveCoords : undefined}
        />
      )}

      {/* Primary Panchanga Elements & Muhurthas */}
      {(panjikaTab === 'panchanga' || panjikaTab === 'all') && (
        <>
          {/* True Sankranti Banner if Active */}
      {panjikaData.isSankranti && (
        <div id="sankranti-alert-banner" className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 flex items-center gap-3 text-amber-900 dark:text-amber-200">
          <Flame className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <span>আজ {panjikaData.sankranti}</span>
              {panjikaData.sankrantiMoment && (
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                  সংক্রান্তি প্রবেশের সময়: {panjikaData.sankrantiMoment}
                </span>
              )}
            </h3>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5">
              সূর্যদেব একটি নতুন রাশিতে প্রবেশ করছেন। সংক্রান্তি কাল অতি পুণ্যকাল হিসেবে পরিগণিত।
            </p>
          </div>
        </div>
      )}

      {/* Primary Panchanga Elements Grid (তিথি, নক্ষত্র, যোগ, করণ) */}
      <div id="panchanga-core-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tithi Card */}
        <div id="card-tithi" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              তিথি
            </span>
            <span className="px-2 py-0.5 text-xs rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
              {panjikaData.paksha}
            </span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-serif">
            {panjikaData.tithi}
          </h2>
          <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
            <p className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-300">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{panjikaData.tithiEndTime}</span>
            </p>
            {panjikaData.nextTithi && (
              <p className="text-zinc-500 dark:text-zinc-500">
                পরবর্তী তিথি: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{panjikaData.nextTithi}</span>
              </p>
            )}
          </div>
        </div>

        {/* Nakshatra Card */}
        <div id="card-nakshatra" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              নক্ষত্র
            </span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-serif">
            {panjikaData.nakshatra.split(' ')[0]}
          </h2>
          <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
            <p className="flex items-center gap-1.5 font-medium text-indigo-800 dark:text-indigo-300">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{panjikaData.nakshatraEndTime}</span>
            </p>
            {panjikaData.nextNakshatra && (
              <p className="text-zinc-500 dark:text-zinc-500">
                পরবর্তী নক্ষত্র: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{panjikaData.nextNakshatra.split(' ')[0]}</span>
              </p>
            )}
          </div>
        </div>

        {/* Yoga Card */}
        <div id="card-yoga" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              যোগ
            </span>
            <Compass className="w-4 h-4 text-violet-500" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-serif">
            {panjikaData.yoga}
          </h2>
          <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
            <p className="flex items-center gap-1.5 font-medium text-violet-800 dark:text-violet-300">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{panjikaData.yogaEndTime}</span>
            </p>
            {panjikaData.nextYoga && (
              <p className="text-zinc-500 dark:text-zinc-500">
                পরবর্তী যোগ: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{panjikaData.nextYoga}</span>
              </p>
            )}
          </div>
        </div>

        {/* Karana Card */}
        <div id="card-karana" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              করণ
            </span>
            <Star className="w-4 h-4 text-teal-500" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-serif">
            {panjikaData.karana.split(' ')[0]}
          </h2>
          <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
            <p className="flex items-center gap-1.5 font-medium text-teal-800 dark:text-teal-300">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{panjikaData.karanaEndTime}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Sun/Moon Times & Rashi Details */}
      <div id="panjika-astronomy-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Sun and Moon Astro Timings */}
        <div id="sun-moon-timings-card" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>সূর্য ও চন্দ্রের সময়সূচী ({effectiveCoords.label})</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40">
              <div className="text-xs text-amber-800 dark:text-amber-400 font-medium">সূর্যোদয়</div>
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {sunMoonInfo.sunrise}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/40">
              <div className="text-xs text-orange-800 dark:text-orange-400 font-medium">সূর্যাস্ত</div>
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {sunMoonInfo.sunset}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40">
              <div className="text-xs text-indigo-800 dark:text-indigo-400 font-medium">চন্দ্রোদয়</div>
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {sunMoonInfo.moonrise || 'অদৃশ্য'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40">
              <div className="text-xs text-blue-800 dark:text-blue-400 font-medium">চন্দ্রাস্ত</div>
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {sunMoonInfo.moonset || 'অদৃশ্য'}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
            <div>
              দিনমান: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{sunMoonInfo.dayLength}</span>
            </div>
            <div>
              চন্দ্রকলা: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{sunMoonInfo.moonPhaseBn}</span> ({sunMoonInfo.moonPhaseIcon})
            </div>
          </div>
        </div>

        {/* Chandra & Surya Rashi Details */}
        <div id="rashi-card" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            <span>চন্দ্র ও সূর্য রাশি</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">চন্দ্র রাশি (Moon Sign)</div>
              <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-serif">
                {panjikaData.chandraRashi || 'নির্ধারণযোগ্য নয়'}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                মানসিক অবস্থা ও রাশিফল নির্দেশক
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">সূর্য রাশি (Sun Sign)</div>
              <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-serif">
                {panjikaData.suryaRashi || 'নির্ধারণযোগ্য নয়'}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                সৌর মাস ও সংক্রান্তির ভিত্তি
              </div>
            </div>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl">
            জ্যোতির্বিজ্ঞানসম্মত লাহিড়ী নিরয়ণ অয়নাংশ অনুযায়ী চন্দ্র ও সূর্যের তৎকালীন প্রকৃত অবস্থান থেকে এই রাশিদ্বয় পরিগণিত।
          </div>
        </div>
      </div>

      {/* Vedic Muhurthas & Kaal (শুভ ও অশুভ কাল) */}
      <div id="vedic-muhurthas-card" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>শুভ ও বর্জনীয় কাল (মুহূর্ত বিচার)</span>
          </h3>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            স্থানীয় সূর্যোদয় ও সূর্যাস্তের অনুপাতে গণনা
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-sm">
          {/* Rahu Kalam */}
          <div id="rahu-kalam-box" className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
            <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-400 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>রাহুকাল (বর্জনীয়)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-200/70 dark:bg-rose-900/50 text-[10px]">অশুভ</span>
            </div>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {panjikaData.rahuKalam?.text || 'তথ্য নেই'}
            </div>
            <p className="text-[11px] text-rose-700/80 dark:text-rose-400/80 mt-1">
              নতুন শুভকর্ম, যাত্রা বা চুক্তি সম্পাদন বর্জনীয়।
            </p>
          </div>

          {/* Yamagandam */}
          <div id="yamagandam-box" className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
            <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-400 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>যমগণ্ড (অশুভ কাল)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-200/70 dark:bg-amber-900/50 text-[10px]">বর্জনীয়</span>
            </div>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {panjikaData.yamagandam?.text || 'তথ্য নেই'}
            </div>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1">
              যমগণ্ড কালে গুরুত্বপূর্ণ শুভ অনুষ্ঠান এড়িয়ে চলা হয়।
            </p>
          </div>

          {/* Gulika Kalam */}
          <div id="gulika-box" className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
            <div className="flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
              <span>গুলিককাল (গুলিক মুহূর্ত)</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-[10px]">মধ্যম</span>
            </div>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {panjikaData.gulikaKalam?.text || 'তথ্য নেই'}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              শনিদেবের পুত্রের প্রভাবকাল, মধ্যম মানের সময়।
            </p>
          </div>

          {/* Abhijit Muhurtha */}
          <div id="abhijit-box" className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
            <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-400 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>অভিজিৎ মুহূর্ত (অতি শুভ)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-200/70 dark:bg-emerald-900/50 text-[10px]">শুভ সময়</span>
            </div>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {panjikaData.abhijitMuhurtha?.text || 'তথ্য নেই'}
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-1">
              সর্বশুভ কার্যারম্ভের শ্রেষ্ঠ সময় (বুধবার বর্জনীয়)।
            </p>
          </div>

          {/* Brahma Muhurtha */}
          <div id="brahma-box" className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 sm:col-span-2">
            <div className="flex items-center justify-between text-xs text-indigo-800 dark:text-indigo-400 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                <span>ব্রাহ্মমুহূর্ত (প্রাতঃকাল)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-200/70 dark:bg-indigo-900/50 text-[10px]">সাধনার কাল</span>
            </div>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {panjikaData.brahmaMuhurtha?.text || 'তথ্য নেই'}
            </div>
            <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80 mt-1">
              সূর্যোদয়ের দেড় ঘণ্টা পূর্বে ধ্যান, প্রাণায়াম, জপ ও পাঠাভ্যাসের জন্য শ্রেষ্ঠ সময়।
            </p>
          </div>
        </div>
      </div>

      {/* Vratas, Festivals & Observances on this Day */}
      <div id="panjika-vratas-card" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span>আজকের ব্রত, পূজা ও উৎসব</span>
        </h3>

        {/* Astronomical Vratas */}
        {panjikaData.vratas && panjikaData.vratas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {panjikaData.vratas.map((vrata, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-semibold text-amber-900 dark:text-amber-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{vrata}</span>
              </div>
            ))}
          </div>
        )}

        {/* Festivals and Holidays from database */}
        {dailyEvents.length > 0 ? (
          <div className="space-y-2.5 pt-2">
            {dailyEvents.map((event) => (
              <div
                key={event.id}
                className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {event.titleBn}
                    </span>
                    {event.isHoliday && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                        ছুটি
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                      {event.region === 'wb' ? 'পশ্চিমবঙ্গ' : event.region === 'bd' ? 'বাংলাদেশ' : 'সার্বজনীন'}
                    </span>
                  </div>
                  {event.descriptionBn && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      {event.descriptionBn}
                    </p>
                  )}
                </div>
                {event.source && (
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                    উৎস: {event.source}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          (!panjikaData.vratas || panjikaData.vratas.length === 0) && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              আজকের দিনে কোনো বিশেষ তিথিমূলক ব্রত বা সার্বজনীন সরকারি উৎসব তালিকাভুক্ত নেই।
            </p>
          )
        )}
      </div>
      </>
      )}

      {/* Methodological Transparency Note */}
      <div id="panjika-methodology-note" className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
        <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          পঞ্জিকা গণনা পদ্ধতি ও তথ্যসূত্র:
        </p>
        <p>
          এই পঞ্জিকার তিথি, নক্ষত্র, যোগ, করণ এবং সংক্রান্তি Jean Meeus-এর জ্যোতির্বিজ্ঞান সূত্র এবং ভারতীয় দৃক পঞ্চাঙ্গ অনুসারে লাহিড়ী (চিত্রপক্ষ) অয়নাংশে পরিগণিত। নির্বাচিত শহর বা স্থানাঙ্কের প্রকৃত স্থানীয় অক্ষাংশ, দ্রাঘিমাংশ এবং বায়ুমণ্ডলীয় প্রতিসরণ (-০.৮৩৩° দিগন্ত সংশোধন) প্রয়োগ করে সূর্যোদয় ও সূর্যাস্তের নিখুঁত হিসাব করা হয়। এটি কোনো আনুমানিক তালিকা নয়, সম্পূর্ণ নির্ভুল অ্যালগরিদমিক হিসাব।
        </p>
      </div>
    </div>
  );
};
