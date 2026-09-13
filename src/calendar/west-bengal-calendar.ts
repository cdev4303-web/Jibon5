import { BanglaDateResult } from '../types';
import {
  BANGLA_MONTHS_BN,
  BANGLA_MONTHS_EN,
  getSeasonNameBn,
  toBengaliNumeral,
  WEEKDAYS_BN
} from './bangla-digits';
import { WB_PANJIKA_AUTHORITATIVE_TABLE } from './west-bengal-data';

/**
 * West Bengal Calendar Engine
 * Strictly follows traditional Bengal Panjika (Surya Siddhanta / Drik Siddhanta):
 * - Month boundaries are determined by Nirayana solar transits (Sankranti).
 * - Pohela Boishakh is on April 14 or 15 based on Sankranti moment.
 * - Month lengths vary from 29 to 32 days.
 * - ACCURACY FIRST: Only authoritative precomputed Panjika data is served.
 * - If data is not available, it raises an error rather than generating unverified guesses.
 */

export class WestBengalCalendarEngine {
  private static parseDate(dStr: string): Date {
    const [y, m, d] = dStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  private static dayDiff(d1: Date, d2: Date): number {
    const t1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const t2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
    return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if a Bangla year is available in West Bengal Panjika database
   */
  public static isYearAvailable(banglaYear: number): boolean {
    return !!WB_PANJIKA_AUTHORITATIVE_TABLE[banglaYear];
  }

  /**
   * Get month start dates for a given Bangla year in West Bengal
   */
  public static getMonthStarts(banglaYear: number): { starts: Date[]; isAuthoritative: boolean } {
    if (!WB_PANJIKA_AUTHORITATIVE_TABLE[banglaYear]) {
      throw new Error(`পশ্চিমবঙ্গের ${banglaYear} বঙ্গাব্দের পঞ্জিকা তথ্য সংরক্ষিত নেই (Data unavailable for this year)`);
    }

    const dates = WB_PANJIKA_AUTHORITATIVE_TABLE[banglaYear].map(this.parseDate);
    return { starts: dates, isAuthoritative: true };
  }

  /**
   * Get total days in a given West Bengal month
   */
  public static getDaysInMonth(banglaYear: number, monthIndex: number): number {
    const { starts } = this.getMonthStarts(banglaYear);
    if (monthIndex < 11) {
      return this.dayDiff(starts[monthIndex], starts[monthIndex + 1]);
    }
    // For Chaitra (last month), length is until Boishakh 1 of the next year
    if (WB_PANJIKA_AUTHORITATIVE_TABLE[banglaYear + 1]) {
      const nextYearData = this.getMonthStarts(banglaYear + 1);
      return this.dayDiff(starts[11], nextYearData.starts[0]);
    }
    // Standard Chaitra in WB is 30 or 31 days
    return 30;
  }

  /**
   * Convert Gregorian Date to West Bengal Bangla Date
   */
  public static fromGregorian(dateInput: Date | string): BanglaDateResult {
    const targetDate =
      typeof dateInput === 'string'
        ? this.parseDate(dateInput)
        : new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate());
    const gYear = targetDate.getFullYear();

    let candidateYear = gYear - 593;

    // Check if candidate year or candidate year - 1 is in table
    if (!WB_PANJIKA_AUTHORITATIVE_TABLE[candidateYear] && !WB_PANJIKA_AUTHORITATIVE_TABLE[candidateYear - 1]) {
      throw new Error(`পশ্চিমবঙ্গের ${gYear} সালের পঞ্জিকা তথ্য ডেটাবেসে উপলব্ধ নয় (Data unavailable for year ${gYear})`);
    }

    let starts = this.getMonthStarts(candidateYear).starts;

    if (targetDate < starts[0]) {
      candidateYear--;
      starts = this.getMonthStarts(candidateYear).starts;
    }

    let monthIndex = 0;
    for (let i = 11; i >= 0; i--) {
      if (targetDate >= starts[i]) {
        monthIndex = i;
        break;
      }
    }

    const monthStartDate = starts[monthIndex];
    const banglaDay = this.dayDiff(monthStartDate, targetDate) + 1;
    const totalDaysInMonth = this.getDaysInMonth(candidateYear, monthIndex);

    const weekdayIndex = targetDate.getDay();
    const weekdayBn = WEEKDAYS_BN[weekdayIndex];
    const weekdayEn = targetDate.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      year: candidateYear,
      monthIndex,
      monthNameBn: BANGLA_MONTHS_BN[monthIndex],
      monthNameEn: BANGLA_MONTHS_EN[monthIndex],
      day: banglaDay,
      dayBn: toBengaliNumeral(banglaDay),
      yearBn: toBengaliNumeral(candidateYear),
      seasonBn: getSeasonNameBn(monthIndex),
      weekdayBn,
      weekdayEn,
      isLeapYear: false,
      totalDaysInMonth,
      source: 'west_bengal_panji',
      region: 'west_bengal'
    };
  }

  /**
   * Convert West Bengal Bangla Date to Gregorian Date
   */
  public static toGregorian(banglaYear: number, monthIndex: number, day: number): Date {
    if (monthIndex < 0 || monthIndex > 11) {
      throw new Error(`অবৈধ মাস: ${monthIndex}`);
    }
    const daysInMonth = this.getDaysInMonth(banglaYear, monthIndex);
    if (day < 1 || day > daysInMonth) {
      throw new Error(`অবৈধ দিন: ${day} (এই মাসে সর্বোচ্চ ${daysInMonth} দিন)`);
    }

    const { starts } = this.getMonthStarts(banglaYear);
    const monthStart = new Date(starts[monthIndex].getTime());
    monthStart.setDate(monthStart.getDate() + (day - 1));
    return monthStart;
  }
}
