import { HijriDateResult } from '../types';
import {
  HIJRI_MONTHS_BN,
  HIJRI_MONTHS_EN,
  toBengaliNumeral
} from './bangla-digits';

/**
 * Hijri (Islamic) Calendar Engine
 * Based on Umm al-Qura / Tabular Islamic algorithm with adjustable local moon sighting offset.
 */
export class HijriCalendarEngine {
  /**
   * Convert Julian Day to Hijri Date
   */
  private static jdToHijri(jd: number): { year: number; month: number; day: number } {
    const l = Math.floor(jd - 1948440 + 10632);
    const n = Math.floor((l - 1) / 10631);
    const l2 = Math.floor(l - 10631 * n + 354);
    const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) +
              (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
    const l3 = Math.floor(l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
               (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29);
    const month = Math.floor((24 * l3) / 709);
    const day = Math.floor(l3 - Math.floor((709 * month) / 24));
    const year = Math.floor(30 * n + j - 30);

    return { year, month: month - 1, day }; // month 0-indexed
  }

  /**
   * Convert Gregorian Date to Julian Day number
   */
  private static gregorianToJd(year: number, month: number, day: number): number {
    if (month < 3) {
      year -= 1;
      month += 12;
    }
    const a = Math.floor(year / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
  }

  /**
   * Convert a Gregorian Date to Hijri Date with optional user sighting adjustment
   * @param dateInput Date or YYYY-MM-DD
   * @param adjustmentDays -2, -1, 0, +1, +2 (default 0)
   */
  public static fromGregorian(dateInput: Date | string, adjustmentDays: number = 0): HijriDateResult {
    const date = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : new Date(dateInput.getTime());
    
    // Apply optional adjustment
    const adjustedDate = new Date(date.getTime());
    if (adjustmentDays !== 0) {
      adjustedDate.setDate(adjustedDate.getDate() + adjustmentDays);
    }

    const jd = this.gregorianToJd(
      adjustedDate.getFullYear(),
      adjustedDate.getMonth() + 1,
      adjustedDate.getDate()
    );

    const { year, month, day } = this.jdToHijri(jd);
    const safeMonth = Math.max(0, Math.min(11, month));

    return {
      year,
      monthIndex: safeMonth,
      monthNameBn: HIJRI_MONTHS_BN[safeMonth] || '',
      monthNameEn: HIJRI_MONTHS_EN[safeMonth] || '',
      day,
      dayBn: toBengaliNumeral(day),
      yearBn: toBengaliNumeral(year),
      isCalculated: true,
      calculationNote: 'গাণিতিক হিসাব (স্থানীয় চাঁদ দেখা সাপেক্ষে পরিবর্তনশীল)'
    };
  }
}
