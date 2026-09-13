import { BanglaDateResult } from '../types';
import {
  BANGLA_MONTHS_BN,
  BANGLA_MONTHS_EN,
  getSeasonNameBn,
  toBengaliNumeral,
  WEEKDAYS_BN
} from './bangla-digits';

/**
 * Bangladesh Calendar Engine
 * Based on Bangla Academy & Bangladesh Government reform (2019 revision):
 * - Boishakh to Ashwin (first 6 months): 31 days each
 * - Kartik to Magh (next 4 months): 30 days each
 * - Falgun (11th month): 29 days (30 days in Gregorian leap year)
 * - Chaitra (12th month): 30 days
 * - Pohela Boishakh (1st Boishakh) is fixed to April 14 in Gregorian calendar.
 */

export class BangladeshCalendarEngine {
  /**
   * Check if a Gregorian year is a leap year
   */
  public static isGregorianLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * Check if a Bangla year has leap year (Falgun has 30 days).
   * Falgun falls in the Gregorian year (banglaYear + 594), specifically in February-March.
   * If that Gregorian year is leap year, Falgun has 30 days.
   */
  public static isBanglaLeapYear(banglaYear: number): boolean {
    const gregorianYearOfFalgun = banglaYear + 594;
    return this.isGregorianLeapYear(gregorianYearOfFalgun);
  }

  /**
   * Get total days in a given Bangladesh Bangla month
   * @param banglaYear Bangla year
   * @param monthIndex 0-based month (0 = Boishakh, 11 = Chaitra)
   */
  public static getDaysInMonth(banglaYear: number, monthIndex: number): number {
    if (monthIndex < 0 || monthIndex > 11) {
      throw new Error(`Invalid month index: ${monthIndex}. Must be 0 to 11.`);
    }

    // First 6 months (Boishakh to Ashwin) = 31 days
    if (monthIndex < 6) {
      return 31;
    }
    // Next 4 months (Kartik to Magh) = 30 days
    if (monthIndex < 10) {
      return 30;
    }
    // 11th month: Falgun (index 10) = 29 days or 30 days in leap year
    if (monthIndex === 10) {
      return this.isBanglaLeapYear(banglaYear) ? 30 : 29;
    }
    // 12th month: Chaitra (index 11) = 30 days
    return 30;
  }

  /**
   * Convert a Gregorian Date to Bangladesh Bangla Date
   */
  public static fromGregorian(dateInput: Date | string): BanglaDateResult {
    const date = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : new Date(dateInput.getTime());
    const gYear = date.getFullYear();
    const gMonth = date.getMonth(); // 0-11
    const gDay = date.getDate();

    // Determine Bangla Year and Pohela Boishakh start date
    // April 14 of gYear is Pohela Boishakh of (gYear - 593)
    let banglaYear: number;
    let startOfBoishakh: Date;

    const pohelaBoishakhThisYear = new Date(gYear, 3, 14); // April 14

    if (date >= pohelaBoishakhThisYear) {
      banglaYear = gYear - 593;
      startOfBoishakh = pohelaBoishakhThisYear;
    } else {
      banglaYear = gYear - 594;
      startOfBoishakh = new Date(gYear - 1, 3, 14);
    }

    // Calculate days elapsed since Pohela Boishakh (April 14 is day 1, diff = 0)
    const diffTime = date.getTime() - startOfBoishakh.getTime();
    // Using UTC day difference to avoid DST shifts
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let remainingDays = diffDays;
    let monthIndex = 0;
    let monthDays = this.getDaysInMonth(banglaYear, 0);

    while (remainingDays >= monthDays && monthIndex < 11) {
      remainingDays -= monthDays;
      monthIndex++;
      monthDays = this.getDaysInMonth(banglaYear, monthIndex);
    }

    const banglaDay = remainingDays + 1; // 1-based day
    const weekdayIdx = date.getDay(); // 0 = Sunday
    const weekdayBn = WEEKDAYS_BN[weekdayIdx];
    const weekdayEn = date.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      year: banglaYear,
      monthIndex,
      monthNameBn: BANGLA_MONTHS_BN[monthIndex],
      monthNameEn: BANGLA_MONTHS_EN[monthIndex],
      day: banglaDay,
      dayBn: toBengaliNumeral(banglaDay),
      yearBn: toBengaliNumeral(banglaYear),
      seasonBn: getSeasonNameBn(monthIndex),
      weekdayBn,
      weekdayEn,
      isLeapYear: this.isBanglaLeapYear(banglaYear),
      totalDaysInMonth: monthDays,
      source: 'bangladesh_standard',
      region: 'bangladesh'
    };
  }

  /**
   * Convert a Bangladesh Bangla Date back to Gregorian Date
   */
  public static toGregorian(banglaYear: number, monthIndex: number, banglaDay: number): Date {
    const maxDays = this.getDaysInMonth(banglaYear, monthIndex);
    if (banglaDay < 1 || banglaDay > maxDays) {
      throw new Error(`Invalid day ${banglaDay} for month ${BANGLA_MONTHS_BN[monthIndex]} in year ${banglaYear} (max ${maxDays})`);
    }

    const startGYear = banglaYear + 593;
    const pohelaBoishakh = new Date(startGYear, 3, 14); // April 14

    // Count days from Boishakh 1 up to (monthIndex, banglaDay)
    let dayOffset = 0;
    for (let m = 0; m < monthIndex; m++) {
      dayOffset += this.getDaysInMonth(banglaYear, m);
    }
    dayOffset += (banglaDay - 1);

    const targetDate = new Date(pohelaBoishakh.getTime());
    targetDate.setDate(targetDate.getDate() + dayOffset);
    return targetDate;
  }

  /**
   * Get all days of a Bangla month for calendar display
   */
  public static getMonthCalendarDays(banglaYear: number, monthIndex: number) {
    const totalDays = this.getDaysInMonth(banglaYear, monthIndex);
    const days = [];

    for (let d = 1; d <= totalDays; d++) {
      const gDate = this.toGregorian(banglaYear, monthIndex, d);
      days.push({
        banglaYear,
        monthIndex,
        banglaDay: d,
        banglaDayBn: toBengaliNumeral(d),
        gregorianDate: gDate,
        gregorianDay: gDate.getDate(),
        gregorianMonth: gDate.getMonth(),
        gregorianYear: gDate.getFullYear(),
        weekdayIndex: gDate.getDay()
      });
    }

    return days;
  }
}
