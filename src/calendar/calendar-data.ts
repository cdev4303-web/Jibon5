import { HolidayEvent, Region } from '../types';
import { HolidayDatabaseService, RECURRING_ANNUAL_EVENTS, YEAR_SPECIFIC_EVENTS } from './holiday-database';

export const RECURRING_FIXED_EVENTS = RECURRING_ANNUAL_EVENTS;
export const VARIABLE_EVENTS_CATALOG = Object.values(YEAR_SPECIFIC_EVENTS).flat();

export class CalendarDataService {
  /**
   * Get all events for a specific Gregorian Date
   */
  public static getEventsForDate(date: Date, region: Region = 'both'): HolidayEvent[] {
    return HolidayDatabaseService.getEventsForDate(date, region);
  }

  /**
   * Check if an event's region matches user's region filter
   */
  public static matchesRegion(eventRegion: 'bd' | 'wb' | 'both', userRegion: Region): boolean {
    return HolidayDatabaseService.matchesRegion(eventRegion, userRegion);
  }

  /**
   * Get all events for a whole Gregorian month
   */
  public static getEventsForMonth(
    year: number,
    monthZeroIndexed: number,
    region: Region = 'both'
  ): Record<string, HolidayEvent[]> {
    const map: Record<string, HolidayEvent[]> = {};
    const daysInMonth = new Date(year, monthZeroIndexed + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dt = new Date(year, monthZeroIndexed, day);
      const evs = this.getEventsForDate(dt, region);
      if (evs.length > 0) {
        const fullDateStr = `${year}-${String(monthZeroIndexed + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        map[fullDateStr] = evs;
      }
    }

    return map;
  }

  /**
   * Get list of all upcoming holidays in a year for the Events page
   */
  public static getAllUpcomingEvents(currentDate: Date, region: Region = 'both', targetYear?: number): HolidayEvent[] {
    const yr = targetYear || currentDate.getFullYear();
    return HolidayDatabaseService.getEventsForYear(yr, region);
  }
}
