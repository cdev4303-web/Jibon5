import React, { useState } from 'react';
import {
  X,
  Share2,
  Printer,
  Image as ImageIcon,
  FileText,
  Bell,
  Trash2,
  CheckCircle2,
  Plus,
  Heart,
  Compass
} from 'lucide-react';
import {
  BanglaDateResult,
  HijriDateResult,
  HolidayEvent,
  PersonalNote,
  Region,
  ReminderItem,
  SunMoonInfo
} from '../types';
import { GREGORIAN_MONTHS_BN, toBengaliNumeral } from '../calendar/bangla-digits';
import { StorageService } from '../utils/storage';
import { VivahaYatraEngine } from '../calendar/vivaha-yatra-engine';

interface DateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  bdDate: BanglaDateResult;
  wbDate: BanglaDateResult;
  hijriDate: HijriDateResult;
  sunMoon: SunMoonInfo;
  events: HolidayEvent[];
  notes: PersonalNote[];
  reminders: ReminderItem[];
  region: Region;
  useBengaliDigits: boolean;
  onNotesUpdated: () => void;
  onRemindersUpdated: () => void;
  onShare: () => void;
  onSaveImage: () => void;
}

export const DateDetailsModal: React.FC<DateDetailsModalProps> = ({
  isOpen,
  onClose,
  date,
  bdDate,
  wbDate,
  hijriDate,
  sunMoon,
  events,
  notes,
  reminders,
  useBengaliDigits,
  onNotesUpdated,
  onRemindersUpdated,
  onShare,
  onSaveImage
}) => {
  if (!isOpen) return null;

  const dateStr = date.toISOString().slice(0, 10);
  const dateNotes = notes.filter((n) => n.dateStr === dateStr);
  const dateReminders = reminders.filter((r) => r.dateStr === dateStr);

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('10:00');
  const [reminderNote, setReminderNote] = useState('');

  const gDay = useBengaliDigits ? toBengaliNumeral(date.getDate()) : date.getDate();
  const gMonth = GREGORIAN_MONTHS_BN[date.getMonth()];
  const gYear = useBengaliDigits ? toBengaliNumeral(date.getFullYear()) : date.getFullYear();

  // Vivaha & Yatra information
  const vivahaInfo = VivahaYatraEngine.getVivahaMuhurthaForDate(date);
  const yatraInfo = VivahaYatraEngine.getYatraJudgment(date);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    StorageService.addNote(dateStr, newNoteText);
    setNewNoteText('');
    setIsAddingNote(false);
    onNotesUpdated();
  };

  const handleDeleteNote = (id: string) => {
    StorageService.deleteNote(id);
    onNotesUpdated();
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;
    StorageService.addReminder(
      dateStr,
      reminderTime,
      reminderTitle.trim(),
      reminderNote.trim() || undefined
    );
    setReminderTitle('');
    setReminderTime('10:00');
    setReminderNote('');
    setIsAddingReminder(false);
    onRemindersUpdated();
  };

  const handleToggleReminder = (id: string) => {
    StorageService.toggleReminder(id);
    onRemindersUpdated();
  };

  const handleDeleteReminder = (id: string) => {
    StorageService.deleteReminder(id);
    onRemindersUpdated();
  };

  const handlePrint = () => {
    document.body.classList.add('print-modal-mode');
    window.print();
    const cleanup = () => {
      document.body.classList.remove('print-modal-mode');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs date-details-modal-wrapper print-modal-active">
      <div className="bg-white dark:bg-stone-900 rounded-[32px] max-w-xl w-full border border-[#E0E4D9] dark:border-stone-800 shadow-xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col transition-colors print:max-h-none print:shadow-none print:border-zinc-300 print:rounded-2xl">
        {/* Dedicated Printable Header */}
        <div className="hidden print:block p-4 border-b-2 border-[#056608] text-center avoid-break">
          <div className="flex items-center justify-between text-xs text-zinc-600 mb-1">
            <span className="font-bold text-[#056608]">বাংলা ক্যালেন্ডার (Bangla Calendar)</span>
            <span>দৈনিক পূর্ণ বিবরণ ও পঞ্জিকা নথি</span>
          </div>
          <h2 className="text-xl font-black text-[#056608]">
            {bdDate.weekdayBn}, {gDay} {gMonth} {gYear} খ্রিস্টাব্দ
          </h2>
          <p className="text-xs text-zinc-700">
            বাংলাদেশ: {bdDate.dayBn} {bdDate.monthNameBn} {bdDate.yearBn} বঙ্গাব্দ • পশ্চিমবঙ্গ: {wbDate.dayBn} {wbDate.monthNameBn} {wbDate.yearBn} বঙ্গাব্দ
          </p>
        </div>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E0E4D9] dark:border-stone-800 flex items-center justify-between bg-[#F9FAF7] dark:bg-stone-900 print:hidden no-print">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#056608] dark:text-emerald-400 block mb-0.5">
              তারিখের পূর্ণ বিবরণ
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#1A2F1C] dark:text-stone-100">
              {bdDate.weekdayBn}, {gDay} {gMonth} {gYear}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-9 h-9 rounded-full border border-[#E0E4D9] dark:border-stone-700 hover:bg-white dark:hover:bg-stone-800 flex items-center justify-center text-[#1A2F1C] dark:text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Dual Region Calendar Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Bangladesh */}
            <div className="p-4 rounded-[20px] bg-[#EBF0E4] dark:bg-stone-800 border border-[#D1D8C5] dark:border-stone-700">
              <span className="text-xs font-bold text-[#056608] dark:text-emerald-400 block mb-1">
                🇧🇩 বাংলাদেশ একাডেমি তারিখ
              </span>
              <div className="text-2xl font-bold text-[#056608] dark:text-emerald-400">
                {bdDate.dayBn} {bdDate.monthNameBn}
              </div>
              <div className="text-sm font-semibold text-[#1A2F1C] dark:text-stone-300">
                {bdDate.yearBn} বঙ্গাব্দ
              </div>
              <div className="text-[11px] text-[#4A5D4C] dark:text-stone-400 mt-1">
                ঋতু: {bdDate.seasonBn}কাল • {bdDate.totalDaysInMonth} দিনের মাস
              </div>
            </div>

            {/* West Bengal */}
            <div className="p-4 rounded-[20px] bg-[#FFF1F1] dark:bg-stone-800 border border-red-200 dark:border-red-900/60">
              <span className="text-xs font-bold text-[#D2122E] dark:text-red-400 block mb-1">
                🇮🇳 পশ্চিমবঙ্গ পঞ্জিকা
              </span>
              <div className="text-2xl font-bold text-[#D2122E] dark:text-red-400">
                {wbDate.dayBn} {wbDate.monthNameBn}
              </div>
              <div className="text-sm font-semibold text-[#1A2F1C] dark:text-stone-300">
                {wbDate.yearBn} বঙ্গাব্দ
              </div>
              <div className="text-[11px] text-[#4A5D4C] dark:text-stone-400 mt-1">
                সংক্রান্তি ও নিরয়ন সৌরভিত্তিক • {wbDate.totalDaysInMonth} দিনের মাস
              </div>
            </div>
          </div>

          {/* Hijri Date and Astronomical row */}
          <div className="p-4 rounded-[20px] bg-[#F0F2EB] dark:bg-stone-800/60 border border-[#E0E4D9] dark:border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#4A5D4C] dark:text-stone-400">
                🌙 হিজরি ও জ্যোতির্বিজ্ঞান তথ্য
              </span>
              <span className="text-xs font-bold text-[#056608] dark:text-emerald-400">
                {hijriDate.dayBn} {hijriDate.monthNameBn} {hijriDate.yearBn} হিজরি
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#D1D8C5] dark:border-stone-700">
              <div>
                <span className="text-[10px] text-[#8A967E] block">সূর্যোদয়</span>
                <span className="text-xs font-bold text-[#1A2F1C] dark:text-stone-200">
                  {sunMoon.sunrise}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8A967E] block">সূর্যাস্ত</span>
                <span className="text-xs font-bold text-[#1A2F1C] dark:text-stone-200">
                  {sunMoon.sunset}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8A967E] block">চাঁদের রূপ</span>
                <span className="text-xs font-bold text-[#1A2F1C] dark:text-stone-200">
                  {sunMoon.moonPhaseIcon} {sunMoon.moonPhasePct}%
                </span>
              </div>
            </div>
          </div>

          {/* Traditional Panjika Details (Tithi, Paksha, Nakshatra, Yoga, Karana) */}
          {sunMoon.panjika?.isAvailable && (
            <div className="p-4 rounded-[20px] bg-[#FFF8E7] dark:bg-stone-800 border border-amber-300 dark:border-stone-700">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block mb-2">
                🕉️ ঐতিহ্যবাহী পঞ্জিকা ও পঞ্চাঙ্গ তথ্য (জ্যোতির্বিজ্ঞানীয় হিসাব)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-900/60">
                  <span className="text-[10px] text-[#8A967E] block">তিথি</span>
                  <span className="font-bold text-[#1A2F1C] dark:text-stone-200">{sunMoon.panjika.tithi}</span>
                  {sunMoon.panjika.tithiEndTime && (
                    <span className="text-[10px] text-[#4A5D4C] dark:text-stone-400 block mt-0.5">
                      {sunMoon.panjika.tithiEndTime}
                    </span>
                  )}
                </div>
                <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-900/60">
                  <span className="text-[10px] text-[#8A967E] block">পক্ষ</span>
                  <span className="font-bold text-[#1A2F1C] dark:text-stone-200">{sunMoon.panjika.paksha}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-900/60">
                  <span className="text-[10px] text-[#8A967E] block">নক্ষত্র</span>
                  <span className="font-bold text-[#1A2F1C] dark:text-stone-200">{sunMoon.panjika.nakshatra}</span>
                  {sunMoon.panjika.nakshatraEndTime && (
                    <span className="text-[10px] text-[#4A5D4C] dark:text-stone-400 block mt-0.5">
                      {sunMoon.panjika.nakshatraEndTime}
                    </span>
                  )}
                </div>
                <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-900/60">
                  <span className="text-[10px] text-[#8A967E] block">যোগ</span>
                  <span className="font-bold text-[#1A2F1C] dark:text-stone-200">{sunMoon.panjika.yoga}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-900/60">
                  <span className="text-[10px] text-[#8A967E] block">করণ</span>
                  <span className="font-bold text-[#1A2F1C] dark:text-stone-200">{sunMoon.panjika.karana}</span>
                </div>
                {sunMoon.panjika.isSankranti && (
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 font-bold border border-amber-300">
                    <span className="text-[10px] block">সংক্রান্তি</span>
                    <span>{sunMoon.panjika.sankranti || 'সংক্রান্তি'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sanatan Vivaha & Yatra Muhurtha Quick Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Vivaha Status */}
            <div className={`p-3.5 rounded-2xl border ${
              vivahaInfo.hasVivahaLagna
                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                : 'bg-zinc-50 dark:bg-stone-800/60 border-zinc-200 dark:border-stone-700'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>বিবাহ লগ্ন</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  vivahaInfo.hasVivahaLagna
                    ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                    : 'bg-zinc-200 dark:bg-stone-700 text-zinc-600 dark:text-stone-300'
                }`}>
                  {vivahaInfo.hasVivahaLagna ? 'মহাশুভ লগ্ন' : 'লগ্ন নেই'}
                </span>
              </div>

              {vivahaInfo.hasVivahaLagna && vivahaInfo.vivahaItem ? (
                <div className="space-y-2 text-xs mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {vivahaInfo.vivahaItem.lagnas.map((l, i) => (
                      <div key={i} className="bg-white/90 dark:bg-stone-800/90 border border-rose-200/90 dark:border-rose-900/60 rounded-lg px-2 py-1.5 text-[11px] flex items-center justify-between shadow-2xs">
                        <span className="font-bold text-rose-900 dark:text-rose-200">{l.lagnaName}</span>
                        <span className="text-zinc-800 dark:text-stone-200 font-medium text-[10.5px] bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-900/40">{l.timeRange}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-zinc-700 dark:text-stone-300 flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-rose-100 dark:border-rose-900/40">
                    <span>তিথি ও নক্ষত্র: <strong>{vivahaInfo.vivahaItem.tithiBn}</strong> • <strong>{vivahaInfo.vivahaItem.nakshatraBn}</strong></span>
                    <span className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold">{vivahaInfo.vivahaItem.source}</span>
                  </div>
                  {vivahaInfo.vivahaItem.shastraNotesBn && (
                    <p className="text-[10.5px] text-rose-900 dark:text-rose-200 bg-rose-100/60 dark:bg-rose-950/50 p-2 rounded-lg leading-relaxed border border-rose-200/50 dark:border-rose-900/40">
                      <strong>জ্যোতিষ শাস্ত্রীয় বিচার:</strong> {vivahaInfo.vivahaItem.shastraNotesBn}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500 dark:text-stone-400">
                  আজ শাস্ত্রীয় শুভ বিবাহ লগ্ন নেই। গোধূলি শুভকাল: {vivahaInfo.godhuliLagnaRange}
                </p>
              )}
            </div>

            {/* Yatra / Disha Shool Status */}
            <div className="p-3.5 rounded-2xl border bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>যাত্রা ও দিকশূল</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900/70 dark:text-amber-200">
                  {yatraInfo.dishaShool.forbiddenDirection.split(' ')[0]} নিষেধ
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-amber-950 dark:text-amber-200">
                  বর্জনীয়: <strong>{yatraInfo.dishaShool.forbiddenDirection}</strong>
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-stone-400">
                  কালবেলা: {yatraInfo.baraKalaBela.kalaBela.text}
                </p>
              </div>
            </div>
          </div>

          {/* Events & Holidays on this date */}
          {events.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5D4C] dark:text-stone-400">
                উৎসব ও ছুটি
              </h4>
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-3.5 rounded-2xl border ${
                    ev.isHoliday
                      ? 'bg-[#FFF1F1] border-red-200 text-[#D2122E] dark:bg-stone-800'
                      : 'bg-[#EBF0E4] border-[#D1D8C5] text-[#056608] dark:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{ev.titleBn}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 dark:bg-stone-900">
                      {ev.isHoliday ? 'ছুটি' : 'দিবস'}
                    </span>
                  </div>
                  {ev.descriptionBn && (
                    <p className="text-xs mt-1 text-[#4A5D4C] dark:text-stone-300">
                      {ev.descriptionBn}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Personal Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5D4C] dark:text-stone-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#056608]" />
                <span>ব্যক্তিগত নোট ({dateNotes.length})</span>
              </h4>
              {!isAddingNote && (
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="text-xs font-semibold text-[#056608] dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নোট যোগ করুন</span>
                </button>
              )}
            </div>

            {isAddingNote && (
              <form
                onSubmit={handleSaveNote}
                className="p-3.5 rounded-2xl bg-[#F9FAF7] dark:bg-stone-800 border border-[#056608] space-y-2"
              >
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="এই তারিখের জন্য আপনার নোট লিখুন..."
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D1D8C5] dark:border-stone-700 bg-white dark:bg-stone-900 text-[#1A2F1C] dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#056608] min-h-[70px]"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNote(false)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#D1D8C5] text-[#4A5D4C] dark:text-stone-300 hover:bg-[#F0F2EB]"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#056608] hover:bg-emerald-800 text-white shadow-xs"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            )}

            {dateNotes.length > 0 ? (
              <div className="space-y-2">
                {dateNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-2xl bg-[#F0F2EB] dark:bg-stone-800 border border-[#D1D8C5] dark:border-stone-700 flex items-start justify-between gap-2"
                  >
                    <p className="text-xs text-[#1A2F1C] dark:text-stone-200 leading-relaxed whitespace-pre-wrap">
                      {note.text}
                    </p>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-[#8A967E] hover:text-[#D2122E] p-1 transition-colors"
                      title="নোট মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              !isAddingNote && (
                <p className="text-[11px] text-[#8A967E] italic">
                  এই তারিখে কোনো ব্যক্তিগত নোট নেই।
                </p>
              )
            )}
          </div>

          {/* Reminders Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5D4C] dark:text-stone-400 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#D2122E]" />
                <span>রিমাইন্ডার ({dateReminders.length})</span>
              </h4>
              {!isAddingReminder && (
                <button
                  onClick={() => setIsAddingReminder(true)}
                  className="text-xs font-semibold text-[#D2122E] dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>রিমাইন্ডার যোগ করুন</span>
                </button>
              )}
            </div>

            {isAddingReminder && (
              <form
                onSubmit={handleSaveReminder}
                className="p-3.5 rounded-2xl bg-[#F9FAF7] dark:bg-stone-800 border border-[#D2122E] space-y-2"
              >
                <div>
                  <label className="text-[11px] font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
                    রিমাইন্ডারের শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    placeholder="যেমন: মিটিং, বিল পরিশোধ, জন্মদিন..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D1D8C5] dark:border-stone-700 bg-white dark:bg-stone-900 text-[#1A2F1C] dark:text-stone-100 focus:ring-2 focus:ring-[#D2122E]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
                      সময়
                    </label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#D1D8C5] dark:border-stone-700 bg-white dark:bg-stone-900 text-[#1A2F1C] dark:text-stone-100 focus:ring-2 focus:ring-[#D2122E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
                      অতিরিক্ত বিবরণ (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={reminderNote}
                      onChange={(e) => setReminderNote(e.target.value)}
                      placeholder="স্থান বা বিশেষ বিবরণ"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#D1D8C5] dark:border-stone-700 bg-white dark:bg-stone-900 text-[#1A2F1C] dark:text-stone-100 focus:ring-2 focus:ring-[#D2122E]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingReminder(false)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#D1D8C5] text-[#4A5D4C] hover:bg-[#F0F2EB]"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#D2122E] hover:bg-red-700 text-white shadow-xs"
                  >
                    রিমাইন্ডার সেট করুন
                  </button>
                </div>
              </form>
            )}

            {dateReminders.length > 0 ? (
              <div className="space-y-2">
                {dateReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                      rem.completed
                        ? 'bg-[#F0F2EB] border-[#D1D8C5] text-[#8A967E] line-through'
                        : 'bg-[#FFF1F1] border-red-200 dark:border-red-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => handleToggleReminder(rem.id)}
                        className={`p-1 rounded-full ${
                          rem.completed ? 'text-[#056608]' : 'text-[#8A967E] hover:text-[#056608]'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#1A2F1C] dark:text-stone-200 truncate block">
                          {rem.title}
                        </span>
                        <span className="text-[10px] text-[#4A5D4C]">
                          সময়: {rem.time} {rem.note && `• ${rem.note}`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="text-[#8A967E] hover:text-[#D2122E] p-1"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              !isAddingReminder && (
                <p className="text-[11px] text-[#8A967E] italic">
                  এই তারিখে কোনো রিমাইন্ডার নেই।
                </p>
              )
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="pt-4 border-t border-[#E0E4D9] dark:border-stone-800 grid grid-cols-3 gap-2 print:hidden no-print">
            <button
              onClick={onShare}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full border border-[#D1D8C5] dark:border-stone-700 hover:bg-[#F9FAF7] dark:hover:bg-stone-800 text-[#1A2F1C] dark:text-stone-200 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#056608]" />
              <span>শেয়ার</span>
            </button>
            <button
              onClick={onSaveImage}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full border border-[#D1D8C5] dark:border-stone-700 hover:bg-[#F9FAF7] dark:hover:bg-stone-800 text-[#1A2F1C] dark:text-stone-200 text-xs font-semibold transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-[#D2122E]" />
              <span>ছবি সংরক্ষণ</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full border border-[#D1D8C5] dark:border-stone-700 hover:bg-[#F9FAF7] dark:hover:bg-stone-800 text-[#1A2F1C] dark:text-stone-200 text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4 text-[#056608]" />
              <span>প্রিন্ট</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
