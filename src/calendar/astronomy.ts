import { LocationCity, SunMoonInfo } from '../types';
import { ALL_CITIES_PANJIKA, AstronomicalEngine } from './astronomical-engine';

export const CITIES_LIST: LocationCity[] = ALL_CITIES_PANJIKA;

export const BANGLADESH_DISTRICTS = CITIES_LIST.filter((c) => c.country === 'bd');
export const WEST_BENGAL_DISTRICTS = CITIES_LIST.filter((c) => c.country === 'wb');
export const ALL_INDIA_CITIES = CITIES_LIST.filter((c) => c.country === 'wb' || c.country === 'in');

export class AstronomyEngine {
  /**
   * Resolve location coordinates based on cityId or custom coordinates with exact timezone
   */
  public static getCoordinates(
    cityId: string = 'dhaka',
    customCoords?: { lat: number; lng: number; label: string; tzOffset?: number }
  ): { lat: number; lng: number; tzOffset: number; timezoneName: string } {
    if (customCoords) {
      const tzOffset = customCoords.tzOffset !== undefined
        ? customCoords.tzOffset
        : (customCoords.lng > 89 ? 6.0 : 5.5);
      const timezoneName = tzOffset === 6.0 ? 'Asia/Dhaka' : 'Asia/Kolkata';
      return { lat: customCoords.lat, lng: customCoords.lng, tzOffset, timezoneName };
    }
    const found = CITIES_LIST.find((c) => c.id === cityId);
    if (found) {
      return {
        lat: found.lat,
        lng: found.lng,
        tzOffset: found.tzOffset,
        timezoneName: found.timezoneName || (found.country === 'bd' ? 'Asia/Dhaka' : 'Asia/Kolkata')
      };
    }
    return { lat: 23.8103, lng: 90.4125, tzOffset: 6.0, timezoneName: 'Asia/Dhaka' };
  }

  /**
   * Accurate sunrise and sunset times based on Jean Meeus algorithm with atmospheric refraction
   */
  public static getSunTimes(
    date: Date,
    cityId: string = 'dhaka',
    customCoords?: { lat: number; lng: number; label: string; tzOffset?: number }
  ): { sunrise: string; sunset: string } {
    const loc = this.getCoordinates(cityId, customCoords);
    const sunTimes = AstronomicalEngine.getSunRiseSet(date, loc.lat, loc.lng, loc.tzOffset);
    return {
      sunrise: AstronomicalEngine.formatTime(sunTimes.sunriseMinutes / 60, sunTimes.sunriseMinutes % 60),
      sunset: AstronomicalEngine.formatTime(sunTimes.sunsetMinutes / 60, sunTimes.sunsetMinutes % 60)
    };
  }

  /**
   * Moon phase with illumination percentage and Bengali labels
   */
  public static getMoonPhase(date: Date) {
    const info = AstronomicalEngine.getSunMoonInfo(date);
    return {
      phaseBn: info.moonPhaseBn,
      icon: info.moonPhaseIcon,
      percentage: info.moonPhasePct,
      illuminationPctBn: info.moonIlluminationPctBn
    };
  }

  /**
   * Combined Sun and Moon information including full Vedic and Bengali Panjika integration
   */
  public static getSunMoonInfo(
    date: Date,
    cityId: string = 'dhaka',
    customCoords?: { lat: number; lng: number; label: string; tzOffset?: number },
    banglaMonthIndex?: number,
    banglaDay?: number,
    totalDaysInMonth?: number
  ): SunMoonInfo {
    return AstronomicalEngine.getSunMoonInfo(date, cityId, customCoords);
  }
}
