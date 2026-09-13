import { PersonalNote, ReminderItem, UserSettings } from '../types';
import { DEFAULT_SETTINGS } from './storage';

const DB_NAME = 'BanglaCalendarDB';
const DB_VERSION = 1;

const STORES = {
  NOTES: 'notes',
  REMINDERS: 'reminders',
  SETTINGS: 'settings'
};

export class IndexedDBService {
  private static dbPromise: Promise<IDBDatabase> | null = null;

  private static getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB not supported in this environment'));
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORES.NOTES)) {
          const notesStore = db.createObjectStore(STORES.NOTES, { keyPath: 'id' });
          notesStore.createIndex('dateStr', 'dateStr', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.REMINDERS)) {
          const remStore = db.createObjectStore(STORES.REMINDERS, { keyPath: 'id' });
          remStore.createIndex('dateStr', 'dateStr', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // --- Notes Operations ---
  public static async getAllNotes(): Promise<PersonalNote[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORES.NOTES, 'readonly');
        const store = transaction.objectStore(STORES.NOTES);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  public static async saveNote(note: PersonalNote): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.NOTES, 'readwrite');
        const store = transaction.objectStore(STORES.NOTES);
        const req = store.put(note);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('IndexedDB saveNote error', e);
    }
  }

  public static async deleteNote(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.NOTES, 'readwrite');
        const store = transaction.objectStore(STORES.NOTES);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('IndexedDB deleteNote error', e);
    }
  }

  // --- Reminders Operations ---
  public static async getAllReminders(): Promise<ReminderItem[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORES.REMINDERS, 'readonly');
        const store = transaction.objectStore(STORES.REMINDERS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  public static async saveReminder(reminder: ReminderItem): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.REMINDERS, 'readwrite');
        const store = transaction.objectStore(STORES.REMINDERS);
        const req = store.put(reminder);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('IndexedDB saveReminder error', e);
    }
  }

  public static async deleteReminder(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.REMINDERS, 'readwrite');
        const store = transaction.objectStore(STORES.REMINDERS);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('IndexedDB deleteReminder error', e);
    }
  }
}
