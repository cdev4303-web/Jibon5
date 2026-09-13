import { PanjikaData } from '../types';
import { AstronomicalEngine } from './astronomical-engine';

/**
 * Panjika Astronomical Engine
 * High-precision calculation of traditional Bengali & Vedic Panjika:
 * - Tithi with exact transition & end time
 * - Paksha (Shukla / Krishna)
 * - Nakshatra with exact transition & end time
 * - Yoga with exact transition & end time
 * - Karana with exact transition & end time
 * - Chandra Rashi (Moon Sign) & Surya Rashi (Sun Sign)
 * - True Astronomical Sankranti (Solar Ingress into new Rashi)
 * - Moonrise & Moonset
 * - Rahu Kalam, Yamagandam, Gulikakalam
 * - Abhijit Muhurtha & Brahma Muhurtha
 * - Ekadashi, Pradosha, Shivaratri, Purnima, Amavasya Vratas
 */

export class PanjikaEngine {
  /**
   * Calculate Panjika data for a date with location-aware precision
   */
  public static getPanjika(
    date: Date,
    banglaMonthIndex?: number,
    banglaDay?: number,
    totalDaysInMonth?: number,
    cityId: string = 'dhaka',
    customCoords?: { lat: number; lng: number; label: string; tzOffset?: number }
  ): PanjikaData {
    return AstronomicalEngine.getFullPanjika(date, cityId, customCoords);
  }
}
