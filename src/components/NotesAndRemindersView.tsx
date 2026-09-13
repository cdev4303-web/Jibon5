import React, { useState } from 'react';
import { FileText, Bell, Trash2, CheckCircle2, Calendar, Plus, Search } from 'lucide-react';
import { PersonalNote, ReminderItem } from '../types';
import { StorageService } from '../utils/storage';
import { GREGORIAN_MONTHS_BN, toBengaliNumeral } from '../calendar/bangla-digits';

interface NotesAndRemindersViewProps {
  notes: PersonalNote[];
  reminders: ReminderItem[];
  onDataChanged: () => void;
  onSelectDateToView: (d: Date) => void;
}

export const NotesAndRemindersView: React.FC<NotesAndRemindersViewProps> = ({
  notes,
  reminders,
  onDataChanged,
  onSelectDateToView
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'reminders'>('notes');
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteDate, setNoteDate] = useState(new Date().toISOString().slice(0, 10));
  const [noteText, setNoteText] = useState('');

  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [remDate, setRemDate] = useState(new Date().toISOString().slice(0, 10));
  const [remTime, setRemTime] = useState('10:00');
  const [remTitle, setRemTitle] = useState('');
  const [remNote, setRemNote] = useState('');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    StorageService.addNote(noteDate, noteText);
    setNoteText('');
    setIsAddingNote(false);
    onDataChanged();
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remTitle.trim()) return;
    StorageService.addReminder(
      remDate,
      remTime,
      remTitle.trim(),
      remNote.trim() || undefined
    );
    setRemTitle('');
    setRemNote('');
    setIsAddingReminder(false);
    onDataChanged();
  };

  const formatDateDisplay = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      const d = Number(parts[2]);
      return `${toBengaliNumeral(d)} ${GREGORIAN_MONTHS_BN[m]} ${toBengaliNumeral(y)}`;
    }
    return dateStr;
  };

  const filteredNotes = notes.filter((n) =>
    searchQuery.trim() ? n.text.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const filteredReminders = reminders.filter((r) =>
    searchQuery.trim() ? r.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-8 border border-[#E0E4D9] dark:border-stone-800 shadow-xs text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2F1C] dark:text-stone-100">
          ব্যক্তিগত নোট ও রিমাইন্ডার
        </h2>
        <p className="text-xs sm:text-sm text-[#4A5D4C] dark:text-stone-400 mt-1 max-w-md mx-auto">
          ক্যালেন্ডারের নির্দিষ্ট তারিখের সাথে সংরক্ষিত আপনার গুরুত্বপূর্ণ তথ্যসমূহ
        </p>

        {/* Tab switch */}
        <div className="flex justify-center gap-2 mt-5">
          <div className="inline-flex bg-[#F0F2EB] dark:bg-stone-800 p-1 rounded-full border border-[#D1D8C5] dark:border-stone-700 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('notes')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${
                activeSubTab === 'notes'
                  ? 'bg-[#056608] text-white shadow-xs'
                  : 'text-[#4A5D4C] dark:text-stone-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>নোটসমূহ ({notes.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('reminders')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${
                activeSubTab === 'reminders'
                  ? 'bg-[#D2122E] text-white shadow-xs'
                  : 'text-[#4A5D4C] dark:text-stone-300'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>রিমাইন্ডারসমূহ ({reminders.length})</span>
            </button>
          </div>
        </div>

        {/* Search & Add button */}
        <div className="mt-5 flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8A967E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নোট বা রিমাইন্ডার খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#F9FAF7] dark:bg-stone-800 border border-[#D1D8C5] dark:border-stone-700 text-xs sm:text-sm text-[#1A2F1C] dark:text-stone-100 focus:ring-2 focus:ring-[#056608]"
            />
          </div>

          <button
            onClick={() =>
              activeSubTab === 'notes' ? setIsAddingNote(true) : setIsAddingReminder(true)
            }
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold shrink-0 transition-colors shadow-xs ${
              activeSubTab === 'notes'
                ? 'bg-[#056608] hover:bg-emerald-800'
                : 'bg-[#D2122E] hover:bg-red-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{activeSubTab === 'notes' ? 'নতুন নোট' : 'নতুন রিমাইন্ডার'}</span>
          </button>
        </div>
      </div>

      {/* Add Note Modal / Form inline */}
      {isAddingNote && (
        <form
          onSubmit={handleCreateNote}
          className="bg-white dark:bg-stone-900 p-6 rounded-[32px] border border-[#056608] shadow-xs space-y-4"
        >
          <h3 className="text-sm font-bold text-[#1A2F1C] dark:text-stone-100">
            নতুন নোট তৈরি করুন
          </h3>
          <div>
            <label className="text-xs font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
              তারিখ
            </label>
            <input
              type="date"
              value={noteDate}
              onChange={(e) => setNoteDate(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-[#D1D8C5] dark:border-stone-700 bg-[#F9FAF7] dark:bg-stone-800"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
              নোটের বিবরণ
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="আপনার নোট লিখুন..."
              className="w-full text-xs p-3 rounded-2xl border border-[#D1D8C5] dark:border-stone-700 min-h-[90px] bg-[#F9FAF7] dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#056608]"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="px-4 py-2 rounded-full border border-[#D1D8C5] text-xs font-medium text-[#4A5D4C] hover:bg-[#F0F2EB]"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full text-xs font-bold bg-[#056608] hover:bg-emerald-800 text-white"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      )}

      {/* Add Reminder Modal / Form inline */}
      {isAddingReminder && (
        <form
          onSubmit={handleCreateReminder}
          className="bg-white dark:bg-stone-900 p-6 rounded-[32px] border border-[#D2122E] shadow-xs space-y-4"
        >
          <h3 className="text-sm font-bold text-[#1A2F1C] dark:text-stone-100">
            নতুন রিমাইন্ডার সেট করুন
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
                তারিখ
              </label>
              <input
                type="date"
                value={remDate}
                onChange={(e) => setRemDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#D1D8C5] dark:border-stone-700 bg-[#F9FAF7] dark:bg-stone-800"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
                সময়
              </label>
              <input
                type="time"
                value={remTime}
                onChange={(e) => setRemTime(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#D1D8C5] dark:border-stone-700 bg-[#F9FAF7] dark:bg-stone-800"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
              শিরোনাম
            </label>
            <input
              type="text"
              value={remTitle}
              onChange={(e) => setRemTitle(e.target.value)}
              placeholder="রিমাইন্ডারের বিষয়..."
              className="w-full text-xs p-2.5 rounded-xl border border-[#D1D8C5] dark:border-stone-700 bg-[#F9FAF7] dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#D2122E]"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#1A2F1C] dark:text-stone-300 block mb-1">
              বিস্তারিত নোট (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={remNote}
              onChange={(e) => setRemNote(e.target.value)}
              placeholder="অতিরিক্ত তথ্য..."
              className="w-full text-xs p-2.5 rounded-xl border border-[#D1D8C5] dark:border-stone-700 bg-[#F9FAF7] dark:bg-stone-800"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingReminder(false)}
              className="px-4 py-2 rounded-full border border-[#D1D8C5] text-xs font-medium text-[#4A5D4C] hover:bg-[#F0F2EB]"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full text-xs font-bold bg-[#D2122E] hover:bg-red-700 text-white"
            >
              রিমাইন্ডার সেট করুন
            </button>
          </div>
        </form>
      )}

      {/* Main List */}
      {activeSubTab === 'notes' ? (
        <div className="space-y-3">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-stone-900 p-5 rounded-[24px] border border-[#E0E4D9] dark:border-stone-800 shadow-xs flex items-start justify-between gap-3 hover:border-[#056608] transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <button
                    onClick={() => {
                      const [y, m, d] = note.dateStr.split('-').map(Number);
                      onSelectDateToView(new Date(y, m - 1, d));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF0E4] dark:bg-stone-800 text-[#056608] dark:text-emerald-400 text-xs font-semibold hover:underline"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateDisplay(note.dateStr)}</span>
                  </button>
                  <p className="text-sm text-[#1A2F1C] dark:text-stone-200 whitespace-pre-wrap leading-relaxed">
                    {note.text}
                  </p>
                </div>
                <button
                  onClick={() => {
                    StorageService.deleteNote(note.id);
                    onDataChanged();
                  }}
                  className="p-2 text-[#8A967E] hover:text-[#D2122E] hover:bg-[#FFF1F1] rounded-full transition-colors shrink-0"
                  title="নোট মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-[32px] border border-[#E0E4D9] dark:border-stone-800">
              <FileText className="w-8 h-8 text-[#8A967E] mx-auto mb-2 opacity-50" />
              <p className="text-sm text-[#8A967E]">কোনো নোট পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReminders.length > 0 ? (
            filteredReminders.map((rem) => (
              <div
                key={rem.id}
                className={`bg-white dark:bg-stone-900 p-5 rounded-[24px] border shadow-xs flex items-center justify-between gap-3 transition-colors ${
                  rem.completed
                    ? 'border-[#E0E4D9] opacity-60'
                    : 'border-red-200 dark:border-red-900/40 hover:border-[#D2122E]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => {
                      StorageService.toggleReminder(rem.id);
                      onDataChanged();
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      rem.completed ? 'text-[#056608]' : 'text-[#8A967E] hover:text-[#056608]'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <div className="min-w-0 space-y-0.5">
                    <span
                      className={`text-sm font-bold block truncate ${
                        rem.completed ? 'line-through text-[#8A967E]' : 'text-[#1A2F1C] dark:text-stone-100'
                      }`}
                    >
                      {rem.title}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-[#4A5D4C]">
                      <span>{formatDateDisplay(rem.dateStr)}</span>
                      <span>•</span>
                      <span>সময়: {rem.time}</span>
                      {rem.note && (
                        <>
                          <span>•</span>
                          <span className="italic">{rem.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const [y, m, d] = rem.dateStr.split('-').map(Number);
                      onSelectDateToView(new Date(y, m - 1, d));
                    }}
                    className="p-2 text-[#4A5D4C] hover:text-[#056608] hover:bg-[#EBF0E4] rounded-full transition-colors"
                    title="ক্যালেন্ডারে দেখুন"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      StorageService.deleteReminder(rem.id);
                      onDataChanged();
                    }}
                    className="p-2 text-[#8A967E] hover:text-[#D2122E] hover:bg-[#FFF1F1] rounded-full transition-colors"
                    title="রিমাইন্ডার মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-[32px] border border-[#E0E4D9] dark:border-stone-800">
              <Bell className="w-8 h-8 text-[#8A967E] mx-auto mb-2 opacity-50" />
              <p className="text-sm text-[#8A967E]">কোনো রিমাইন্ডার পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
