import { BANGLA_MONTHS_BN, BANGLA_MONTHS_EN, fromBengaliNumeral } from './bangla-digits';
import { BangladeshCalendarEngine } from './bangladesh-calendar';
import { WestBengalCalendarEngine } from './west-bengal-calendar';
import { Region } from '../types';

export interface DateSearchResult {
  date: Date;
  label: string;
  sourceType: 'gregorian_bn' | 'gregorian_en' | 'bangla_bn' | 'bangla_en' | 'iso';
}

const GREGORIAN_MONTHS_BN: Record<string, number> = {
  'জানুয়ারি': 0, 'জানুয়ারি': 0, 'জানু': 0,
  'ফেব্রুয়ারি': 1, 'ফেব্রুয়ারি': 1, 'ফেব্রু': 1,
  'মার্চ': 2,
  'এপ্রিল': 3,
  'মে': 4,
  'জুন': 5,
  'জুলাই': 6,
  'আগস্ট': 7, 'অগাস্ট': 7,
  'সেপ্টেম্বর': 8, 'সেপ্টে': 8, 'সেপ্টেম্বের': 8,
  'অক্টোবর': 9,
  'নভেম্বর': 10,
  'ডিসেম্বর': 11
};

const GREGORIAN_MONTHS_EN: Record<string, number> = {
  january: 0, jan: 0,
  february: 1, feb: 1,
  march: 2, mar: 2,
  april: 3, apr: 3,
  may: 4,
  june: 5, jun: 5,
  july: 6, jul: 6,
  august: 7, aug: 7,
  september: 8, sep: 8, sept: 8,
  october: 9, oct: 9,
  november: 10, nov: 10,
  december: 11, dec: 11
};

const BANGLA_MONTH_MAP_BN: Record<string, number> = {
  'বৈশাখ': 0, 'বোশেখ': 0,
  'জ্যৈষ্ঠ': 1, 'জৈষ্ঠ': 1, 'জৈষ্ঠ্য': 1,
  'আষাঢ়': 2, 'আষাঢ়': 2,
  'শ্রাবণ': 3,
  'ভাদ্র': 4, 'ভাদর': 4,
  'আশ্বিন': 5,
  'কার্তিক': 6, 'কাত্তিক': 6,
  'অগ্রহায়ণ': 7, 'অগ্রহায়ণ': 7, 'আঘন': 7,
  'পৌষ': 8,
  'মাঘ': 9,
  'ফাল্গুন': 10, 'ফাগুন': 10,
  'চৈত্র': 11, 'চৈত': 11
};

const BANGLA_MONTH_MAP_EN: Record<string, number> = {
  boishakh: 0, baisakh: 0, baishakh: 0,
  joishtho: 1, jaishtha: 1, jaistha: 1, jyeshtha: 1,
  ashar: 2, ashadh: 2, ashadha: 2,
  shrabon: 3, sravana: 3, srabon: 3, shravan: 3,
  bhadro: 4, bhadra: 4,
  ashwin: 5, aswin: 5, ashwina: 5,
  kartik: 6, kartika: 6,
  ogrohayon: 7, agrahayana: 7, agrahayan: 7,
  poush: 8, pous: 8, paush: 8,
  magh: 9, magha: 9,
  falgun: 10, phalguna: 10, phalgun: 10,
  chaitra: 11, choitro: 11
};

export class DateSearchService {
  /**
   * Normalize input string: convert Bengali digits to English, trim, lowercase English
   */
  public static normalize(text: string): string {
    let result = text.trim();
    // Convert Bengali numerals to Arabic digits
    result = fromBengaliNumeral(result);
    return result;
  }

  /**
   * Search date alias
   */
  public static searchDate(query: string, preferredRegion: Region = 'bangladesh'): DateSearchResult | null {
    return this.parse(query, preferredRegion);
  }

  /**
   * Parse user query into a Date
   */
  public static parse(query: string, preferredRegion: Region = 'bangladesh'): DateSearchResult | null {
    if (!query || !query.trim()) return null;

    const raw = query.trim();
    const normalized = this.normalize(raw);

    // 1. ISO format: YYYY-MM-DD
    const isoMatch = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoMatch) {
      const y = parseInt(isoMatch[1], 10);
      const m = parseInt(isoMatch[2], 10) - 1;
      const d = parseInt(isoMatch[3], 10);
      const dt = new Date(y, m, d);
      if (!isNaN(dt.getTime())) {
        return { date: dt, label: `${d} ${Object.keys(GREGORIAN_MONTHS_EN)[m * 2]} ${y}`, sourceType: 'iso' };
      }
    }

    // 2. Pohela Boishakh special
    if (raw.includes('পহেলা বৈশাখ') || raw.toLowerCase().includes('pohela boishakh') || raw.toLowerCase().includes('pahela baishakh')) {
      const yearMatch = normalized.match(/\d{4}/);
      const targetYear = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();
      // If year is < 1900, treat as Bangla year
      const gYear = targetYear > 1800 ? targetYear : targetYear + 593;
      const dt = new Date(gYear, 3, 14); // April 14
      return { date: dt, label: `পহেলা বৈশাখ (${gYear})`, sourceType: 'bangla_bn' };
    }

    // 3. Bengali Gregorian Date: e.g. "৭ সেপ্টেম্বর ২০২৬" or "৭ সেপ্টেম্বর"
    for (const [mName, mIndex] of Object.entries(GREGORIAN_MONTHS_BN)) {
      if (raw.includes(mName)) {
        // Find day and year
        const numbers = normalized.match(/\d+/g);
        if (numbers && numbers.length >= 1) {
          const day = parseInt(numbers[0], 10);
          const year = numbers.length >= 2 ? parseInt(numbers[1], 10) : new Date().getFullYear();
          if (day >= 1 && day <= 31) {
            const dt = new Date(year, mIndex, day);
            if (!isNaN(dt.getTime())) {
              return { date: dt, label: `${day} ${mName} ${year}`, sourceType: 'gregorian_bn' };
            }
          }
        }
      }
    }

    // 4. English Gregorian Date: e.g. "7 September 2026" or "7 Sep 2026"
    const lower = normalized.toLowerCase();
    for (const [mName, mIndex] of Object.entries(GREGORIAN_MONTHS_EN)) {
      const regex = new RegExp(`\\b${mName}\\b`, 'i');
      if (regex.test(lower)) {
        const numbers = normalized.match(/\d+/g);
        if (numbers && numbers.length >= 1) {
          const day = parseInt(numbers[0], 10);
          const year = numbers.length >= 2 ? parseInt(numbers[1], 10) : new Date().getFullYear();
          if (day >= 1 && day <= 31) {
            const dt = new Date(year, mIndex, day);
            if (!isNaN(dt.getTime())) {
              return { date: dt, label: `${day} ${mName.toUpperCase()} ${year}`, sourceType: 'gregorian_en' };
            }
          }
        }
      }
    }

    // 5. Bengali Bangla Date: e.g. "২৩ ভাদ্র ১৪৩৩" or "২৩ ভাদ্র"
    for (const [mName, mIndex] of Object.entries(BANGLA_MONTH_MAP_BN)) {
      if (raw.includes(mName)) {
        const numbers = normalized.match(/\d+/g);
        if (numbers && numbers.length >= 1) {
          const day = parseInt(numbers[0], 10);
          let bYear = numbers.length >= 2 ? parseInt(numbers[1], 10) : 1433;
          // If user gave Gregorian year instead of Bangla year (e.g. 2026)
          if (bYear > 1900) {
            bYear = bYear - 593;
          }
          try {
            const engine = preferredRegion === 'west_bengal' ? WestBengalCalendarEngine : BangladeshCalendarEngine;
            const dt = engine.toGregorian(bYear, mIndex, day);
            return {
              date: dt,
              label: `${day} ${mName} ${bYear}`,
              sourceType: 'bangla_bn'
            };
          } catch {
            // fallback attempt with BD engine
            try {
              const dt = BangladeshCalendarEngine.toGregorian(bYear, mIndex, day);
              return { date: dt, label: `${day} ${mName} ${bYear}`, sourceType: 'bangla_bn' };
            } catch {
              // ignore
            }
          }
        }
      }
    }

    // 6. English Transliterated Bangla Date: e.g. "23 Bhadra 1433"
    for (const [mName, mIndex] of Object.entries(BANGLA_MONTH_MAP_EN)) {
      const regex = new RegExp(`\\b${mName}\\b`, 'i');
      if (regex.test(lower)) {
        const numbers = normalized.match(/\d+/g);
        if (numbers && numbers.length >= 1) {
          const day = parseInt(numbers[0], 10);
          let bYear = numbers.length >= 2 ? parseInt(numbers[1], 10) : 1433;
          if (bYear > 1900) {
            bYear = bYear - 593;
          }
          try {
            const engine = preferredRegion === 'west_bengal' ? WestBengalCalendarEngine : BangladeshCalendarEngine;
            const dt = engine.toGregorian(bYear, mIndex, day);
            return {
              date: dt,
              label: `${day} ${mName} ${bYear}`,
              sourceType: 'bangla_en'
            };
          } catch {
            // ignore
          }
        }
      }
    }

    return null;
  }
}
