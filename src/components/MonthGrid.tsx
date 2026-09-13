import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Printer, Grid } from 'lucide-react';
import { BanglaDateResult, HolidayEvent, PersonalNote, Region } from '../types';
import { BangladeshCalendarEngine } from '../calendar/bangladesh-calendar';
import { WestBengalCalendarEngine } from '../calendar/west-bengal-calendar';
import { CalendarDataService } from '../calendar/calendar-data';
import {
  BANGLA_MONTHS_BN,
  GREGORIAN_MONTHS_BN,
  toBengaliNumeral,
  WEEKDAYS_SHORT_BN
} from '../calendar/bangla-digits';
import { VivahaYatraEngine } from '../calendar/vivaha-yatra-engine';

interface MonthGridProps {
  currentDate: Date; // Today
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  region: Region;
  useBengaliDigits: boolean;
  notes: PersonalNote[];
}

export const MonthGrid: React.FC<MonthGridProps> = ({
  currentDate,
  selectedDate,
  onSelectDate,
  region,
  useBengaliDigits,
  notes
}) => {
  // Calendar mode: 'bangla_month', 'gregorian_month', or 'year_view'
  const [viewMode, setViewMode] = useState<'bangla_month' | 'gregorian_month' | 'year_view'>('bangla_month');

  // Currently viewed Bangla Month/Year
  const initialBangla = BangladeshCalendarEngine.fromGregorian(selectedDate);
  const [viewBanglaYear, setViewBanglaYear] = useState<number>(initialBangla.year);
  const [viewBanglaMonth, setViewBanglaMonth] = useState<number>(initialBangla.monthIndex);

  // Currently viewed Gregorian Month/Year
  const [viewGYear, setViewGYear] = useState<number>(selectedDate.getFullYear());
  const [viewGMonth, setViewGMonth] = useState<number>(selectedDate.getMonth());

  const getSafeWbDate = (d: Date): BanglaDateResult => {
    try {
      return WestBengalCalendarEngine.fromGregorian(d);
    } catch {
      return BangladeshCalendarEngine.fromGregorian(d);
    }
  };

  // Navigation handlers for Bangla Month view
  const handlePrevBanglaMonth = () => {
    if (viewBanglaMonth === 0) {
      setViewBanglaMonth(11);
      setViewBanglaYear((prev) => prev - 1);
    } else {
      setViewBanglaMonth((prev) => prev - 1);
    }
  };

  const handleNextBanglaMonth = () => {
    if (viewBanglaMonth === 11) {
      setViewBanglaMonth(0);
      setViewBanglaYear((prev) => prev + 1);
    } else {
      setViewBanglaMonth((prev) => prev + 1);
    }
  };

  // Navigation handlers for Gregorian Month view
  const handlePrevGMonth = () => {
    if (viewGMonth === 0) {
      setViewGMonth(11);
      setViewGYear((prev) => prev - 1);
    } else {
      setViewGMonth((prev) => prev - 1);
    }
  };

  const handleNextGMonth = () => {
    if (viewGMonth === 11) {
      setViewGMonth(0);
      setViewGYear((prev) => prev + 1);
    } else {
      setViewGMonth((prev) => prev + 1);
    }
  };

  // Print Calendar as dedicated A4/Letter Bengali Monthly Sheet
  const handlePrint = () => {
    document.body.classList.add('print-month-mode');
    window.print();
    const cleanup = () => {
      document.body.classList.remove('print-month-mode');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 2500);
  };

  // Calculate calendar grid days based on viewMode
  interface CellData {
    gregorianDate: Date;
    bdBangla: BanglaDateResult;
    wbBangla: BanglaDateResult;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    events: HolidayEvent[];
    hasNote: boolean;
  }

  const cells: CellData[] = [];
  const todayStr = currentDate.toISOString().slice(0, 10);
  const selectedStr = selectedDate.toISOString().slice(0, 10);

  if (viewMode === 'bangla_month') {
    // Generate all days of viewBanglaMonth in viewBanglaYear
    const totalDays = BangladeshCalendarEngine.getDaysInMonth(viewBanglaYear, viewBanglaMonth);
    const firstDayGDate = BangladeshCalendarEngine.toGregorian(viewBanglaYear, viewBanglaMonth, 1);
    const startWeekday = firstDayGDate.getDay(); // 0 = Sunday

    // Leading placeholder days from previous month
    for (let i = startWeekday - 1; i >= 0; i--) {
      const prevGDate = new Date(firstDayGDate);
      prevGDate.setDate(prevGDate.getDate() - (i + 1));
      const bdBangla = BangladeshCalendarEngine.fromGregorian(prevGDate);
      const wbBangla = getSafeWbDate(prevGDate);
      const dateStr = prevGDate.toISOString().slice(0, 10);
      cells.push({
        gregorianDate: prevGDate,
        bdBangla,
        wbBangla,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedStr,
        events: CalendarDataService.getEventsForDate(prevGDate, region),
        hasNote: notes.some((n) => n.dateStr === dateStr)
      });
    }

    // Days of current Bangla month
    for (let d = 1; d <= totalDays; d++) {
      const gDate = BangladeshCalendarEngine.toGregorian(viewBanglaYear, viewBanglaMonth, d);
      const bdBangla = BangladeshCalendarEngine.fromGregorian(gDate);
      const wbBangla = getSafeWbDate(gDate);
      const dateStr = gDate.toISOString().slice(0, 10);
      cells.push({
        gregorianDate: gDate,
        bdBangla,
        wbBangla,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedStr,
        events: CalendarDataService.getEventsForDate(gDate, region),
        hasNote: notes.some((n) => n.dateStr === dateStr)
      });
    }

    // Trailing days to fill 7-column grid up to a multiple of 7
    const remaining = (7 - (cells.length % 7)) % 7;
    const lastGDate = cells[cells.length - 1]?.gregorianDate || new Date();
    for (let i = 1; i <= remaining; i++) {
      const nextGDate = new Date(lastGDate);
      nextGDate.setDate(nextGDate.getDate() + i);
      const bdBangla = BangladeshCalendarEngine.fromGregorian(nextGDate);
      const wbBangla = getSafeWbDate(nextGDate);
      const dateStr = nextGDate.toISOString().slice(0, 10);
      cells.push({
        gregorianDate: nextGDate,
        bdBangla,
        wbBangla,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedStr,
        events: CalendarDataService.getEventsForDate(nextGDate, region),
        hasNote: notes.some((n) => n.dateStr === dateStr)
      });
    }
  } else if (viewMode === 'gregorian_month') {
    // Gregorian Month View
    const firstDay = new Date(viewGYear, viewGMonth, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(viewGYear, viewGMonth + 1, 0).getDate();

    // Leading days
    for (let i = startWeekday - 1; i >= 0; i--) {
      const prevGDate = new Date(viewGYear, viewGMonth, -i);
      const bdBangla = BangladeshCalendarEngine.fromGregorian(prevGDate);
      const wbBangla = getSafeWbDate(prevGDate);
      const dateStr = prevGDate.toISOString().slice(0, 10);
      cells.push({
        gregorianDate: prevGDate,
        bdBangla,
        wbBangla,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedStr,
        events: CalendarDataService.getEventsForDate(prevGDate, region),
        hasNote: notes.some((n) => n.dateStr === dateStr)
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const gDate = new Date(viewGYear, viewGMonth, d);
      const bdBangla = BangladeshCalendarEngine.fromGregorian(gDate);
      const wbBangla = getSafeWbDate(gDate);
      const dateStr = gDate.toISOString().slice(0, 10);
      cells.push({
        gregorianDate: gDate,
        bdBangla,
        wbBangla,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedStr,
        events: CalendarDataService.getEventsForDate(gDate, region),
        hasNote: notes.some((n) => n.dateStr === dateStr)
      });
    }

    // Trailing days
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextGDate = new Date(viewGYear, viewGMonth + 1, i);
      const bdBangla = BangladeshCalendarEngine.fromGregorian(nextGDate);
      const wbBangla = getSafeWbDate(nextGDate);
      const dateStr = nextGDate.toISOString().slice(0, 10);
      cells.push({
        gregorianDate: nextGDate,
        bdBangla,
        wbBangla,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedStr,
        events: CalendarDataService.getEventsForDate(nextGDate, region),
        hasNote: notes.some((n) => n.dateStr === dateStr)
      });
    }
  }

  // Unique holidays in current month for printable summary
  const monthHolidays: Array<{
    dateStr: string;
    banglaDateStr: string;
    gregorianDateStr: string;
    titleBn: string;
    isHoliday: boolean;
  }> = [];

  const seenEventIds = new Set<string>();
  cells
    .filter((c) => c.isCurrentMonth && c.events.length > 0)
    .forEach((c) => {
      const bDay = region === 'west_bengal' ? c.wbBangla.dayBn : c.bdBangla.dayBn;
      const bMonth = region === 'west_bengal' ? c.wbBangla.monthNameBn : c.bdBangla.monthNameBn;
      const gDay = toBengaliNumeral(c.gregorianDate.getDate());
      const gMonth = GREGORIAN_MONTHS_BN[c.gregorianDate.getMonth()];
      
      c.events.forEach((ev) => {
        const evKey = `${ev.id}_${c.gregorianDate.toISOString().slice(0, 10)}`;
        if (!seenEventIds.has(evKey)) {
          seenEventIds.add(evKey);
          monthHolidays.push({
            dateStr: c.gregorianDate.toISOString().slice(0, 10),
            banglaDateStr: `${bDay} ${bMonth}`,
            gregorianDateStr: `${gDay} ${gMonth}`,
            titleBn: ev.titleBn,
            isHoliday: ev.isHoliday
          });
        }
      });
    });

  return (
    <div className="bg-white dark:bg-stone-900 rounded-[32px] p-5 sm:p-7 border border-[#E0E4D9] dark:border-stone-800 flex flex-col shadow-xs transition-colors print:border-none print:shadow-none print:p-0">
      {/* Dedicated Printable Month Header (Visible Only When Printing) */}
      <div className="hidden print:block pb-3 mb-3 border-b-2 border-[#056608] text-center avoid-break">
        <div className="flex items-center justify-between text-xs text-zinc-600 mb-1">
          <span className="font-bold text-[#056608]">বাংলা ক্যালেন্ডার (Bangla Calendar)</span>
          <span className="font-semibold text-zinc-700">
            {region === 'bangladesh'
              ? '🇧🇩 বাংলাদেশ সরকারি ক্যালেন্ডার'
              : region === 'west_bengal'
              ? '🇮🇳 পশ্চিমবঙ্গ ঐতিহ্যবাহী পঞ্জিকা'
              : '🇧🇩 বাংলাদেশ ও 🇮🇳 পশ্চিমবঙ্গ ক্যালেন্ডার'}
          </span>
        </div>
        <h2 className="text-2xl font-black text-[#056608] tracking-tight">
          {viewMode === 'bangla_month'
            ? `${BANGLA_MONTHS_BN[viewBanglaMonth]} ${toBengaliNumeral(viewBanglaYear)} বঙ্গাব্দ`
            : `${GREGORIAN_MONTHS_BN[viewGMonth]} ${toBengaliNumeral(viewGYear)} খ্রিস্টাব্দ`}
        </h2>
        <p className="text-xs text-zinc-700 mt-0.5">
          {viewMode === 'bangla_month'
            ? `গ্রেগরিয়ান সমতুল্য: ${GREGORIAN_MONTHS_BN[cells[10]?.gregorianDate.getMonth() || 0]} ${toBengaliNumeral(cells[10]?.gregorianDate.getFullYear() || viewGYear)} খ্রিস্টাব্দ`
            : `বঙ্গাব্দ সমতুল্য: ${BANGLA_MONTHS_BN[cells[10]?.bdBangla.monthIndex || 0]} ${toBengaliNumeral(cells[10]?.bdBangla.year || viewBanglaYear)} বঙ্গাব্দ`}
        </p>
      </div>

      {/* Month Navigation & Title Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2 print:hidden no-print">
        <div className="flex items-center gap-2">
          {viewMode !== 'year_view' && (
            <button
              id="btn-prev-month"
              onClick={viewMode === 'bangla_month' ? handlePrevBanglaMonth : handlePrevGMonth}
              className="w-9 h-9 rounded-full border border-[#E0E4D9] dark:border-stone-700 flex items-center justify-center hover:bg-[#F9FAF7] dark:hover:bg-stone-800 text-[#1A2F1C] dark:text-stone-200 transition-colors touch-manipulation"
              aria-label="পূর্ববর্তী মাস"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            {viewMode === 'bangla_month' ? (
              <div className="flex items-center gap-1.5">
                <select
                  value={viewBanglaMonth}
                  onChange={(e) => setViewBanglaMonth(Number(e.target.value))}
                  className="font-bold text-lg sm:text-xl text-[#056608] dark:text-emerald-400 bg-transparent cursor-pointer focus:outline-none"
                >
                  {BANGLA_MONTHS_BN.map((m, idx) => (
                    <option key={idx} value={idx} className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={viewBanglaYear}
                  onChange={(e) => setViewBanglaYear(Number(e.target.value))}
                  className="font-bold text-lg sm:text-xl text-[#1A2F1C] dark:text-stone-100 bg-transparent cursor-pointer focus:outline-none"
                >
                  {[1428, 1429, 1430, 1431, 1432, 1433, 1434, 1435, 1436, 1437, 1438].map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
                      {toBengaliNumeral(y)} বঙ্গাব্দ
                    </option>
                  ))}
                </select>
              </div>
            ) : viewMode === 'gregorian_month' ? (
              <div className="flex items-center gap-1.5">
                <select
                  value={viewGMonth}
                  onChange={(e) => setViewGMonth(Number(e.target.value))}
                  className="font-bold text-lg sm:text-xl text-[#056608] dark:text-emerald-400 bg-transparent cursor-pointer focus:outline-none"
                >
                  {GREGORIAN_MONTHS_BN.map((m, idx) => (
                    <option key={idx} value={idx} className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={viewGYear}
                  onChange={(e) => setViewGYear(Number(e.target.value))}
                  className="font-bold text-lg sm:text-xl text-[#1A2F1C] dark:text-stone-100 bg-transparent cursor-pointer focus:outline-none"
                >
                  {[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031].map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
                      {toBengaliNumeral(y)} খ্রিস্টাব্দ
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <h4 className="text-xl font-bold text-[#056608] dark:text-emerald-400">
                বার্ষিক ক্যালেন্ডার ({toBengaliNumeral(viewBanglaYear)} বঙ্গাব্দ)
              </h4>
            )}
          </div>

          {viewMode !== 'year_view' && (
            <button
              id="btn-next-month"
              onClick={viewMode === 'bangla_month' ? handleNextBanglaMonth : handleNextGMonth}
              className="w-9 h-9 rounded-full border border-[#E0E4D9] dark:border-stone-700 flex items-center justify-center hover:bg-[#F9FAF7] dark:hover:bg-stone-800 text-[#1A2F1C] dark:text-stone-200 transition-colors touch-manipulation"
              aria-label="পরবর্তী মাস"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 rounded-full border border-[#E0E4D9] dark:border-stone-700 hover:bg-[#F9FAF7] dark:hover:bg-stone-800 text-[#4A5D4C] dark:text-stone-300 print:hidden"
            title="মাস প্রিন্ট করুন / PDF সংরক্ষণ"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onSelectDate(currentDate);
              const todayBn = BangladeshCalendarEngine.fromGregorian(currentDate);
              setViewBanglaYear(todayBn.year);
              setViewBanglaMonth(todayBn.monthIndex);
              setViewGYear(currentDate.getFullYear());
              setViewGMonth(currentDate.getMonth());
            }}
            className="text-xs font-semibold text-[#056608] dark:text-emerald-400 hover:underline px-2 py-1 print:hidden"
          >
            আজকে ফিরুন
          </button>
        </div>
      </div>

      {/* View Switcher: Bangla Month vs English Month vs 12-Month Year View */}
      <div className="flex items-center justify-between gap-2 mb-4 print:hidden">
        <div className="inline-flex bg-[#F0F2EB] dark:bg-stone-800 p-1 rounded-full border border-[#D1D8C5] dark:border-stone-700 text-xs font-medium">
          <button
            onClick={() => setViewMode('bangla_month')}
            className={`px-3 sm:px-4 py-1.5 rounded-full transition-all ${
              viewMode === 'bangla_month'
                ? 'bg-[#056608] text-white font-medium shadow-xs'
                : 'text-[#4A5D4C] dark:text-stone-300 hover:text-[#1A2F1C]'
            }`}
          >
            বাংলা মাস
          </button>
          <button
            onClick={() => setViewMode('gregorian_month')}
            className={`px-3 sm:px-4 py-1.5 rounded-full transition-all ${
              viewMode === 'gregorian_month'
                ? 'bg-[#056608] text-white font-medium shadow-xs'
                : 'text-[#4A5D4C] dark:text-stone-300 hover:text-[#1A2F1C]'
            }`}
          >
            ইংরেজি মাস
          </button>
          <button
            onClick={() => setViewMode('year_view')}
            className={`px-3 sm:px-4 py-1.5 rounded-full transition-all ${
              viewMode === 'year_view'
                ? 'bg-[#056608] text-white font-medium shadow-xs'
                : 'text-[#4A5D4C] dark:text-stone-300 hover:text-[#1A2F1C]'
            }`}
          >
            ১২ মাস (Year)
          </button>
        </div>
      </div>

      {/* Mode 1 & 2: Single Month 7-Column Grid */}
      {viewMode !== 'year_view' ? (
        <>
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center mb-2 print:gap-1.5 print:mb-2">
            {WEEKDAYS_SHORT_BN.map((name, idx) => (
              <div
                key={idx}
                className={`text-center text-xs font-bold py-1.5 rounded-lg print:border print:border-zinc-300 print:py-1 print:bg-zinc-100 ${
                  idx === 5
                    ? 'text-[#056608] bg-[#EBF0E4]/50 dark:bg-stone-800/40 print:text-[#056608] print:font-black' // Friday (Shukrobar - holy/weekend in BD)
                    : idx === 6 || idx === 0
                    ? 'text-[#D2122E] print:text-[#D2122E] print:font-black' // Saturday & Sunday
                    : 'text-[#4A5D4C] dark:text-stone-300 print:text-zinc-800'
                }`}
              >
                {name}
              </div>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 flex-1 print:gap-1.5">
            {cells.map((cell, idx) => {
              const displayBanglaDay =
                region === 'west_bengal' ? cell.wbBangla.dayBn : cell.bdBangla.dayBn;
              const displayGregorianDay = useBengaliDigits
                ? toBengaliNumeral(cell.gregorianDate.getDate())
                : cell.gregorianDate.getDate();

              const hasHoliday = cell.events.some((e) => e.isHoliday);
              const hasVivaha = VivahaYatraEngine.isVivahaDate(cell.gregorianDate);

              return (
                <button
                  key={idx}
                  onClick={() => onSelectDate(cell.gregorianDate)}
                  className={`calendar-day-cell min-h-[62px] sm:min-h-[70px] p-1.5 rounded-xl flex flex-col items-center justify-between transition-all text-center relative touch-manipulation group print:min-h-[58px] print:p-1 print:rounded-lg print:border print:border-zinc-300 print:bg-white print:shadow-none print:scale-100 ${
                    cell.isToday
                      ? 'bg-[#056608] text-white shadow-md scale-105 z-10 print:border-2 print:border-[#056608]'
                      : cell.isSelected
                      ? 'bg-[#EBF0E4] dark:bg-stone-800 border-2 border-[#056608] text-[#1A2F1C] dark:text-stone-100'
                      : !cell.isCurrentMonth
                      ? 'border border-transparent opacity-25 text-stone-400 print:opacity-20'
                      : hasHoliday
                      ? 'border border-[#F0F2EB] dark:border-stone-800 bg-[#FFF1F1] dark:bg-stone-800/80 text-[#D2122E] dark:text-red-400 print:bg-red-50/50 print:border-red-300'
                      : hasVivaha
                      ? 'border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[#1A2F1C] dark:text-stone-100'
                      : 'border border-[#F0F2EB] dark:border-stone-800/70 hover:bg-[#F9FAF7] dark:hover:bg-stone-800/60 text-[#1A2F1C] dark:text-stone-100'
                  }`}
                >
                  {/* Indicators Row */}
                  <div className="w-full flex items-center justify-between px-0.5 min-h-[6px] print:hidden">
                    <div className="flex items-center gap-1">
                      {cell.hasNote && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cell.isToday ? 'bg-amber-300' : 'bg-[#056608] dark:bg-emerald-400'
                          }`}
                          title="নোট যুক্ত আছে"
                        />
                      )}
                      {hasVivaha && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cell.isToday ? 'bg-rose-200' : 'bg-rose-500 ring-1 ring-rose-300'
                          }`}
                          title="শুভ বিবাহ লগ্ন"
                        />
                      )}
                    </div>

                    {hasHoliday && !cell.isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D2122E]" title="ছুটি" />
                    )}
                  </div>

                  {/* Main Bangla Date */}
                  <span
                    className={`block font-bold text-base sm:text-lg leading-none print:text-lg print:mt-0.5 ${
                      cell.isToday
                        ? 'text-white print:text-[#056608] print:font-black'
                        : hasHoliday
                        ? 'text-[#D2122E] dark:text-red-400 print:text-[#D2122E]'
                        : 'text-[#1A2F1C] dark:text-stone-100 print:text-zinc-900'
                    }`}
                  >
                    {displayBanglaDay}
                  </span>

                  {/* Small Gregorian Day */}
                  <span
                    className={`text-[9px] font-medium print:text-[10px] ${
                      cell.isToday ? 'text-emerald-100 font-bold print:text-zinc-600' : 'text-[#8A967E] dark:text-stone-400 print:text-zinc-600'
                    }`}
                  >
                    {displayGregorianDay}
                  </span>

                  {/* Printable holiday preview label */}
                  {hasHoliday && (
                    <span className="hidden print:block text-[8px] leading-tight font-bold text-[#D2122E] truncate w-full px-0.5 mt-0.5">
                      {cell.events[0]?.titleBn}
                    </span>
                  )}

                  {/* Both Mode Sub-Indicator for West Bengal */}
                  {region === 'both' && cell.bdBangla.day !== cell.wbBangla.day && (
                    <div
                      className={`text-[8px] font-semibold px-1 rounded-xs leading-tight print:hidden ${
                        cell.isToday
                          ? 'bg-white/20 text-white'
                          : 'bg-red-100 text-[#D2122E] dark:bg-red-950 dark:text-red-300'
                      }`}
                      title={`বাংলাদেশ: ${cell.bdBangla.dayBn}, পশ্চিমবঙ্গ: ${cell.wbBangla.dayBn}`}
                    >
                      প:{cell.wbBangla.dayBn}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Printable Holidays & Observances Summary */}
          <div className="hidden print:block mt-4 pt-3 border-t border-zinc-300 text-xs avoid-break">
            <h4 className="font-bold text-sm text-[#056608] mb-2 flex items-center justify-between">
              <span>📅 এই মাসের ছুটির তালিকা ও বিশেষ দিবসসমূহ:</span>
              <span className="text-[10px] text-zinc-500 font-normal">
                {monthHolidays.length > 0 ? `মোট ${toBengaliNumeral(monthHolidays.length)}টি দিবস` : ''}
              </span>
            </h4>
            {monthHolidays.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {monthHolidays.map((h, i) => (
                  <div key={i} className="flex items-baseline gap-2 text-xs border-b border-dashed border-zinc-200 pb-1">
                    <span className="font-bold text-zinc-900 whitespace-nowrap text-[11px]">
                      {h.banglaDateStr} ({h.gregorianDateStr}):
                    </span>
                    <span className={`text-[11px] truncate ${h.isHoliday ? 'font-bold text-[#D2122E]' : 'text-zinc-700'}`}>
                      {h.titleBn} {h.isHoliday && '(ছুটি)'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 italic">এই মাসে কোনো নির্ধারিত সাধারণ সরকারি ছুটি নেই।</p>
            )}

            <div className="mt-3 pt-2 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-400">
              <span>মুদ্রণ তারিখ: {new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>বাংলা ক্যালেন্ডার • বাংলাদেশ ও পশ্চিমবঙ্গ সংস্করণ</span>
            </div>
          </div>

          {/* Legend footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[#E0E4D9] dark:border-stone-800 text-[11px] text-[#4A5D4C] dark:text-stone-400 print:hidden no-print">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#056608]" />
                <span>আজকের দিন</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D2122E]" />
                <span>ছুটি / উৎসব</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#056608]" />
                <span>নোট সংরক্ষিত</span>
              </span>
            </div>
            {region === 'both' && (
              <span className="text-[#D2122E] font-medium">
                'প:' = পশ্চিমবঙ্গের পঞ্জিকা তারিখ
              </span>
            )}
          </div>
        </>
      ) : (
        /* Mode 3: Full 12-Month Year View Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {BANGLA_MONTHS_BN.map((monthName, mIdx) => {
            const mDays = BangladeshCalendarEngine.getDaysInMonth(viewBanglaYear, mIdx);
            const mStart = BangladeshCalendarEngine.toGregorian(viewBanglaYear, mIdx, 1);
            return (
              <div
                key={mIdx}
                onClick={() => {
                  setViewBanglaMonth(mIdx);
                  setViewMode('bangla_month');
                }}
                className="p-3 rounded-2xl border border-[#E0E4D9] dark:border-stone-800 bg-[#F9FAF7] dark:bg-stone-800/50 hover:border-[#056608] hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h5 className="font-bold text-xs text-[#056608] dark:text-emerald-400">
                    {monthName}
                  </h5>
                  <span className="text-[10px] text-[#8A967E]">
                    {toBengaliNumeral(mDays)} দিন
                  </span>
                </div>
                <div className="text-[10px] text-[#4A5D4C] dark:text-stone-400">
                  শুরু: {mStart.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
