import { PersonalNote, ReminderItem, ReminderRepeat, UserSettings } from '../types';
import { IndexedDBService } from './indexed-db';

const STORAGE_KEYS = {
  SETTINGS: 'bangla_calendar_settings_v2',
  NOTES: 'bangla_calendar_notes_v2',
  REMINDERS: 'bangla_calendar_reminders_v2'
};

export const DEFAULT_SETTINGS: UserSettings = {
  region: 'bangladesh',
  theme: 'light',
  systemTheme: false,
  themeColorPalette: 'editorial_green',
  language: 'bn',
  useBengaliDigits: true,
  hijriAdjustment: 0,
  cityId: 'dhaka',
  dailyNotification: false,
  hasSelectedInitialRegion: false,
  calendarViewMode: 'month',
  homeWidgets: {
    banglaDate: true,
    gregorianDate: true,
    hijriDate: true,
    sunrise: true,
    sunset: true,
    moonPhase: true,
    todayEvent: true
  }
};

export class StorageService {
  /**
   * Load user settings
   */
  public static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          homeWidgets: {
            ...DEFAULT_SETTINGS.homeWidgets,
            ...(parsed.homeWidgets || {})
          }
        };
      }
    } catch (e) {
      console.warn('Could not read settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  }

  /**
   * Save user settings
   */
  public static saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }

  /**
   * Load all notes
   */
  public static getNotes(): PersonalNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read notes from localStorage', e);
    }
    return [];
  }

  /**
   * Get notes for a specific date (YYYY-MM-DD)
   */
  public static getNotesForDate(dateStr: string): PersonalNote[] {
    const notes = this.getNotes();
    return notes.filter((n) => n.dateStr === dateStr);
  }

  /**
   * Add a new personal note
   */
  public static addNote(dateStr: string, text: string): PersonalNote {
    const notes = this.getNotes();
    const newNote: PersonalNote = {
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      dateStr,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };
    notes.unshift(newNote);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      IndexedDBService.saveNote(newNote).catch(() => {});
    } catch (e) {
      console.error('Failed to save note', e);
    }
    return newNote;
  }

  /**
   * Update an existing note
   */
  public static updateNote(id: string, text: string): void {
    const notes = this.getNotes();
    const target = notes.find((n) => n.id === id);
    if (target) {
      target.text = text.trim();
      target.updatedAt = new Date().toISOString();
      try {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        IndexedDBService.saveNote(target).catch(() => {});
      } catch (e) {
        console.error('Failed to update note', e);
      }
    }
  }

  /**
   * Delete a note
   */
  public static deleteNote(id: string): void {
    const notes = this.getNotes().filter((n) => n.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      IndexedDBService.deleteNote(id).catch(() => {});
    } catch (e) {
      console.error('Failed to delete note', e);
    }
  }

  /**
   * Load all reminders
   */
  public static getReminders(): ReminderItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read reminders from localStorage', e);
    }
    return [];
  }

  /**
   * Add a new reminder with repeat option
   */
  public static addReminder(
    dateStr: string,
    time: string,
    title: string,
    note?: string,
    repeat: ReminderRepeat = 'none'
  ): ReminderItem {
    const reminders = this.getReminders();
    const newReminder: ReminderItem = {
      id: 'rem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      dateStr,
      time,
      title: title.trim(),
      note: note ? note.trim() : undefined,
      completed: false,
      repeat,
      createdAt: new Date().toISOString()
    };
    reminders.push(newReminder);
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
      IndexedDBService.saveReminder(newReminder).catch(() => {});
    } catch (e) {
      console.error('Failed to save reminder', e);
    }
    return newReminder;
  }

  /**
   * Toggle completed status of a reminder
   */
  public static toggleReminder(id: string): void {
    const reminders = this.getReminders().map((r) =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
      const target = reminders.find((r) => r.id === id);
      if (target) IndexedDBService.saveReminder(target).catch(() => {});
    } catch (e) {
      console.error('Failed to update reminder', e);
    }
  }

  /**
   * Delete a reminder
   */
  public static deleteReminder(id: string): void {
    const reminders = this.getReminders().filter((r) => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
      IndexedDBService.deleteReminder(id).catch(() => {});
    } catch (e) {
      console.error('Failed to delete reminder', e);
    }
  }

  /**
   * Export all user data as clean JSON
   */
  public static exportBackup(): string {
    const backup = {
      appName: 'BanglaCalendar',
      version: 2,
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      notes: this.getNotes(),
      reminders: this.getReminders()
    };
    return JSON.stringify(backup, null, 2);
  }

  /**
   * Import user data from JSON string with validation
   */
  public static importBackup(jsonString: string): { success: boolean; message: string; counts?: { notes: number; reminders: number } } {
    try {
      const data = JSON.parse(jsonString);
      let notesCount = 0;
      let remsCount = 0;

      if (data.notes && Array.isArray(data.notes)) {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
        notesCount = data.notes.length;
        data.notes.forEach((n: PersonalNote) => IndexedDBService.saveNote(n).catch(() => {}));
      }

      if (data.reminders && Array.isArray(data.reminders)) {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(data.reminders));
        remsCount = data.reminders.length;
        data.reminders.forEach((r: ReminderItem) => IndexedDBService.saveReminder(r).catch(() => {}));
      }

      if (data.settings && typeof data.settings === 'object') {
        const validatedSettings: UserSettings = {
          ...DEFAULT_SETTINGS,
          ...data.settings,
          homeWidgets: {
            ...DEFAULT_SETTINGS.homeWidgets,
            ...(data.settings.homeWidgets || {})
          }
        };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(validatedSettings));
      }

      return {
        success: true,
        message: `সফলভাবে ব্যাকআপ পুনরুদ্ধার করা হয়েছে (${notesCount}টি নোট, ${remsCount}টি রিমাইন্ডার)।`,
        counts: { notes: notesCount, reminders: remsCount }
      };
    } catch (e: any) {
      return { success: false, message: 'ফাইলটি ত্রুটিপূর্ণ বা অবৈধ: ' + (e?.message || 'অজ্ঞাত সমস্যা') };
    }
  }
}
