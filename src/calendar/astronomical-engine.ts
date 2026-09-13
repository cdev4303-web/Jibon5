/**
 * @license
 * High-Precision Astronomical & Vedic Panjika Engine
 * 
 * Based on Jean Meeus Astronomical Algorithms and standard Indian Astronomical Ephemeris / Drik Panchanga.
 * Uses Lahiri (Chitrapaksha) Ayanamsa for Nirayana (sidereal) planetary positions.
 * Calculates exact Tithi, Nakshatra, Yoga, Karana transition times,
 * true Sankranti ingress moments, Moonrise, Moonset, and Vedic Muhurthas.
 */

import { PanjikaData, SunMoonInfo, LocationCity } from '../types';
import { toBengaliNumeral } from './bangla-digits';

export const ZODIAC_SIGNS_BN = [
  'মেষ (Aries)',
  'বৃষ (Taurus)',
  'মিথুন (Gemini)',
  'কর্কট (Cancer)',
  'সিংহ (Leo)',
  'কন্যা (Virgo)',
  'তুলা (Libra)',
  'বৃশ্চিক (Scorpio)',
  'ধনু (Sagittarius)',
  'মকর (Capricorn)',
  'কুম্ভ (Aquarius)',
  'মীন (Pisces)'
];

export const TITHI_NAMES_FULL_BN = [
  'শুক্লা প্রতিপদ', 'শুক্লা দ্বিতীয়া', 'শুক্লা তৃতীয়া', 'শুক্লা চতুর্থী', 'শুক্লা পঞ্চমী',
  'শুক্লা ষষ্ঠী', 'শুক্লা সপ্তমী', 'শুক্লা মহাষ্টমী', 'শুক্লা মহানবমী', 'শুক্লা দশমী',
  'শুক্লা একাদশী', 'শুক্লা দ্বাদশী', 'শুক্লা ত্রয়োদশী', 'শুক্লা চতুর্দশী', 'পূর্ণিমা',
  'কৃষ্ণা প্রতিপদ', 'কৃষ্ণা দ্বিতীয়া', 'কৃষ্ণা তৃতীয়া', 'কৃষ্ণা চতুর্থী', 'কৃষ্ণা পঞ্চমী',
  'কৃষ্ণা ষষ্ঠী', 'কৃষ্ণা সপ্তমী', 'কৃষ্ণা অষ্টমী', 'কৃষ্ণা নবমী', 'কৃষ্ণা দশমী',
  'কৃষ্ণা একাদশী', 'কৃষ্ণা দ্বাদশী', 'কৃষ্ণা ত্রয়োদশী', 'কৃষ্ণা চতুর্দশী', 'অমাবস্যা'
];

export const NAKSHATRA_NAMES_FULL_BN = [
  'অশ্বিনী (Ashwini)', 'ভরণী (Bharani)', 'কৃত্তিকা (Krittika)', 'রোহিণী (Rohini)',
  'মৃগশিরা (Mrigashira)', 'আর্দ্রা (Ardra)', 'পুনর্বসু (Punarvasu)', 'পুষ্যা (Pushya)',
  'অশ্লেষা (Ashlesha)', 'মঘা (Magha)', 'পূর্বফল্গুনী (Purva Phalguni)', 'উত্তরফল্গুনী (Uttara Phalguni)',
  'হস্তা (Hasta)', 'চিত্রা (Chitra)', 'স্বাতী (Swati)', 'বিশাখা (Vishakha)',
  'অনুরাধা (Anuradha)', 'জ্যেষ্ঠা (Jyeshtha)', 'মূলা (Mula)', 'পূর্বাষাঢ়া (Purva Ashadha)',
  'উত্তরাষাঢ়া (Uttara Ashadha)', 'শ্রবণা (Shravana)', 'ধনিষ্ঠা (Dhanishta)', 'শতভিষা (Shatabhisha)',
  'পূর্বভাদ্রপদ (Purva Bhadrapada)', 'উত্তরভাদ্রপদ (Uttara Bhadrapada)', 'রেবতী (Revati)'
];

export const YOGA_NAMES_FULL_BN = [
  'বিষকুম্ভ', 'প্রীতি', 'আয়ুষ্মান', 'সৌভাগ্য', 'শোভন', 'অতিগণ্ড', 'সুকর্মা',
  'ধৃতি', 'শূল', 'গণ্ড', 'বৃদ্ধি', 'ধ্রুব', 'ব্যাঘাত', 'হর্ষণ',
  'বজ্র', 'সিদ্ধি', 'ব্যতিপাত', 'বরীয়ান', 'পরিঘ', 'শিব', 'সিদ্ধ',
  'সাধ্য', 'শুভ', 'শুক্ল', 'ব্রহ্ম', 'ঐন্দ্র', 'বৈধৃতি'
];

export const KARANA_NAMES_FULL_BN = [
  'বব (Bava)', 'বালব (Balava)', 'কৌলব (Kaulava)', 'তৈতিল (Taitila)',
  'গর (Gara)', 'বণিজ (Vanija)', 'বিষ্টি/ভদ্রা (Vishti/Bhadra)',
  'শকুনি (Shakuni)', 'চতুষ্পাদ (Chatushpada)', 'নাগ (Naga)', 'কিংস্তুঘ্ন (Kimstughna)'
];

export const ALL_CITIES_PANJIKA: LocationCity[] = [
  // Bangladesh (UTC+6.0)
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka', country: 'bd', lat: 23.8103, lng: 90.4125, tzOffset: 6.0, timezoneName: 'Asia/Dhaka' },
  { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', country: 'bd', lat: 22.3569, lng: 91.7832, tzOffset: 6.0, timezoneName: 'Asia/Dhaka' },
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', country: 'bd', lat: 24.8949, lng: 91.8687, tzOffset: 6.0, timezoneName: 'Asia/Dhaka' },
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', country: 'bd', lat: 24.3745, lng: 88.6042, tzOffset: 6.0, timezoneName: 'Asia/Dhaka' },
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', country: 'bd', lat: 22.8456, lng: 89.5403, tzOffset: 6.0, timezoneName: 'Asia/Dhaka' },
  { id: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal', country: 'bd', lat: 22.7010, lng: 90.3535, tzOffset: 6.0, timezoneName: 'Asia/Dhaka' },
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', country: 'bd', lat: 25.7439, lng: 89.2752, tzOffset: 6.0, timezoneName: 'Asia/Dhaka' },
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', country: 'bd', lat: 24.7471, lng: 90.4203, tzOffset: 6.0, timezoneName: 'Asia/Dhaka' },

  // West Bengal (UTC+5.5)
  { id: 'kolkata', nameBn: 'কলকাতা', nameEn: 'Kolkata', country: 'wb', lat: 22.5726, lng: 88.3639, tzOffset: 5.5, timezoneName: 'Asia/Kolkata' },
  { id: 'howrah', nameBn: 'হাওড়া', nameEn: 'Howrah', country: 'wb', lat: 22.5958, lng: 88.2636, tzOffset: 5.5, timezoneName: 'Asia/Kolkata' },
  { id: 'siliguri', nameBn: 'শিলিগুড়ি', nameEn: 'Siliguri', country: 'wb', lat: 26.7271, lng: 88.3953, tzOffset: 5.5, timezoneName: 'Asia/Kolkata' },
  { id: 'asansol', nameBn: 'আসানসোল', nameEn: 'Asansol', country: 'wb', lat: 23.6739, lng: 86.9524, tzOffset: 5.5, timezoneName: 'Asia/Kolkata' },
  { id: 'durgapur', nameBn: 'দুর্গাপুর', nameEn: 'Durgapur', country: 'wb', lat: 23.5204, lng: 87.3119, tzOffset: 5.5, timezoneName: 'Asia/Kolkata' },
  { id: 'malda', nameBn: 'মালদা', nameEn: 'Malda', country: 'wb', lat: 25.0108, lng: 88.1411, tzOffset: 5.5, timezoneName: 'Asia/Kolkata' },

  // Other Major Indian Cities (UTC+5.5)
  { id: 'delhi', nameBn: 'দিল্লি (New Delhi)', nameEn: 'New Delhi', country: 'in', lat: 28.6139, lng: 77.2090, tzOffset: 5.5, timezoneName: 'Asia/Kolkata' },
  { id: 'mumbai', nameBn: 'মুম্বাই (Mumbai)', nameEn: 'Mumbai', country: 'in', lat: 19.0760, lng: 72.8777, tzOffset: 5.5, timezoneName: 'Asia/Kolkata' },
  { id: 'varanasi', nameBn: 'বারাণসী / কাশী (Varanasi)', nameEn: 'Varanasi', country: 'in', lat: 25.3176, lng: 82.9739, tzOffset: 5.5, timezoneName: 'Asia/Kolkata' },
  { id: 'bengaluru', nameBn: 'বেঙ্গালুরু (Bengaluru)', nameEn: 'Bengaluru', country: 'in', lat: 12.9716, lng: 77.5946, tzOffset: 5.5, timezoneName: 'Asia/Kolkata' },
  { id: 'chennai', nameBn: 'চেন্নাই (Chennai)', nameEn: 'Chennai', country: 'in', lat: 13.0827, lng: 80.2707, tzOffset: 5.5, timezoneName: 'Asia/Kolkata' }
];

export class AstronomicalEngine {
  private static panjikaCache = new Map<string, PanjikaData>();
  private static sunMoonCache = new Map<string, SunMoonInfo>();

  /**
   * Convert Gregorian Date to Julian Date (JD)
   */
  public static toJulianDate(date: Date): number {
    return date.getTime() / 86400000 + 2440587.5;
  }

  /**
   * Julian Centuries from J2000.0
   */
  public static toJulianCenturies(jd: number): number {
    return (jd - 2451545.0) / 36525.0;
  }

  /**
   * Lahiri (Chitrapaksha) Ayanamsa for J2000 epoch forward
   */
  public static getLahiriAyanamsa(t: number): number {
    // Epoch J2000.0 Lahiri ayanamsa is approx 23.85° + precession
    return 23.860417 + 1.396042 * t + 0.000308 * t * t;
  }

  /**
   * High-accuracy Sun celestial position (True Geocentric Ecliptic Longitude)
   */
  public static getSunEclipticPosition(t: number): {
    apparentLong: number;
    trueLong: number;
    meanAnomaly: number;
    distanceAU: number;
  } {
    // Mean Longitude of the Sun
    const L0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
    // Mean Anomaly of the Sun
    const M = (357.52911 + 35999.05029 * t - 0.0001537 * t * t) % 360;
    const mRad = (M * Math.PI) / 180;

    // Sun Equation of Center
    const C =
      (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(mRad) +
      (0.019993 - 0.000101 * t) * Math.sin(2 * mRad) +
      0.000289 * Math.sin(3 * mRad);

    const trueLong = (L0 + C + 360000) % 360;

    // Apparent Longitude corrected for nutation and aberration
    const omega = (125.04 - 1934.136 * t) * (Math.PI / 180);
    const apparentLong = (trueLong - 0.00569 - 0.00478 * Math.sin(omega) + 360) % 360;

    // Earth-Sun distance in AU
    const e = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t;
    const distanceAU = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(mRad + C * (Math.PI / 180)));

    return { apparentLong, trueLong, meanAnomaly: M, distanceAU };
  }

  /**
   * High-accuracy Moon celestial position (Brown's Lunar Theory - Perturbation series)
   */
  public static getMoonEclipticPosition(t: number): {
    apparentLong: number;
    latitude: number;
    distanceKM: number;
  } {
    const toRad = Math.PI / 180;

    // Mean longitude of Moon
    const Lp = (218.3164477 + 481267.88128 * t - 0.0015786 * t * t) % 360;
    // Mean elongation of Moon
    const D = (297.8501921 + 445267.11140 * t - 0.0018819 * t * t) % 360;
    // Sun's mean anomaly
    const M = (357.5291092 + 35999.05029 * t - 0.0001536 * t * t) % 360;
    // Moon's mean anomaly
    const Mp = (134.9633964 + 477198.86750 * t + 0.0087414 * t * t) % 360;
    // Moon's argument of latitude
    const F = (93.2720950 + 483202.01752 * t - 0.0036539 * t * t) % 360;

    // Periodic terms for longitude
    const dL =
      6.288774 * Math.sin(Mp * toRad) +
      1.274027 * Math.sin((2 * D - Mp) * toRad) +
      0.658314 * Math.sin(2 * D * toRad) +
      0.213618 * Math.sin(2 * Mp * toRad) -
      0.185116 * Math.sin(M * toRad) -
      0.114332 * Math.sin(2 * F * toRad) +
      0.058793 * Math.sin((2 * D - 2 * Mp) * toRad) +
      0.057066 * Math.sin((2 * D - M - Mp) * toRad) +
      0.053322 * Math.sin((2 * D + Mp) * toRad) +
      0.045758 * Math.sin((2 * D - M) * toRad) -
      0.040923 * Math.sin((M - Mp) * toRad) -
      0.034720 * Math.sin(D * toRad) -
      0.030383 * Math.sin((M + Mp) * toRad) +
      0.015327 * Math.sin((2 * D - 2 * F) * toRad) -
      0.012528 * Math.sin((2 * D + M - Mp) * toRad) +
      0.010980 * Math.sin((2 * D + 2 * Mp) * toRad);

    const apparentLong = (Lp + dL + 360000) % 360;

    // Periodic terms for latitude
    const dB =
      5.128122 * Math.sin(F * toRad) +
      0.280602 * Math.sin((Mp + F) * toRad) +
      0.277693 * Math.sin((Mp - F) * toRad) +
      0.173237 * Math.sin((2 * D - F) * toRad) +
      0.055413 * Math.sin((2 * D - Mp + F) * toRad) +
      0.046271 * Math.sin((2 * D - Mp - F) * toRad);

    const distanceKM =
      385000.56 -
      20905.355 * Math.cos(Mp * toRad) -
      3699.111 * Math.cos((2 * D - Mp) * toRad) -
      2955.968 * Math.cos(2 * D * toRad) -
      569.925 * Math.cos(2 * Mp * toRad);

    return { apparentLong, latitude: dB, distanceKM };
  }

  /**
   * Get Nirayana (Sidereal) Longitudes of Sun & Moon using Lahiri Ayanamsa
   */
  public static getSiderealPositions(date: Date): {
    sunSidereal: number;
    moonSidereal: number;
    elongation: number;
    ayanamsa: number;
  } {
    const jd = this.toJulianDate(date);
    const t = this.toJulianCenturies(jd);
    const ayanamsa = this.getLahiriAyanamsa(t);

    const sun = this.getSunEclipticPosition(t);
    const moon = this.getMoonEclipticPosition(t);

    const sunSidereal = (sun.apparentLong - ayanamsa + 360) % 360;
    const moonSidereal = (moon.apparentLong - ayanamsa + 360) % 360;
    const elongation = (moon.apparentLong - sun.apparentLong + 360) % 360;

    return { sunSidereal, moonSidereal, elongation, ayanamsa };
  }

  /**
   * Find exact time when elongation crosses a given boundary (degrees)
   */
  private static findElongationCrossing(
    startDate: Date,
    targetAngle: number,
    tzOffset: number
  ): Date | null {
    let t0 = startDate.getTime();
    const maxSearchMs = 30 * 3600 * 1000; // Search within 30 hours

    let left = t0;
    let right = t0 + maxSearchMs;

    // Coarse search in 15-minute steps to find crossing interval
    let prevDiff: number | null = null;
    let crossLeft = left;
    let crossRight = right;
    let foundInterval = false;

    for (let stepTime = left; stepTime <= right; stepTime += 15 * 60 * 1000) {
      const pos = this.getSiderealPositions(new Date(stepTime));
      let currentDiff = (pos.elongation - targetAngle + 360) % 360;
      if (currentDiff > 180) currentDiff -= 360;

      if (prevDiff !== null && ((prevDiff < 0 && currentDiff >= 0) || (prevDiff > 300 && currentDiff < 60))) {
        crossLeft = stepTime - 15 * 60 * 1000;
        crossRight = stepTime;
        foundInterval = true;
        break;
      }
      prevDiff = currentDiff;
    }

    if (!foundInterval) return null;

    // Binary search for exact minute
    for (let i = 0; i < 20; i++) {
      const mid = (crossLeft + crossRight) / 2;
      const pos = this.getSiderealPositions(new Date(mid));
      let currentDiff = (pos.elongation - targetAngle + 360) % 360;
      if (currentDiff > 180) currentDiff -= 360;

      if (Math.abs(currentDiff) < 0.001) {
        return new Date(mid);
      }
      if (currentDiff < 0) {
        crossLeft = mid;
      } else {
        crossRight = mid;
      }
    }

    return new Date((crossLeft + crossRight) / 2);
  }

  /**
   * Find exact time when a degree coordinate crosses a boundary (for Nakshatra, Yoga, Sankranti)
   */
  private static findCoordinateCrossing(
    startDate: Date,
    targetAngle: number,
    coordGetter: (d: Date) => number
  ): Date | null {
    let t0 = startDate.getTime();
    const maxSearchMs = 32 * 3600 * 1000;

    let left = t0;
    let right = t0 + maxSearchMs;
    let crossLeft = left;
    let crossRight = right;
    let foundInterval = false;
    let prevDiff: number | null = null;

    for (let stepTime = left; stepTime <= right; stepTime += 20 * 60 * 1000) {
      const coord = coordGetter(new Date(stepTime));
      let diff = (coord - targetAngle + 360) % 360;
      if (diff > 180) diff -= 360;

      if (prevDiff !== null && prevDiff < 0 && diff >= 0) {
        crossLeft = stepTime - 20 * 60 * 1000;
        crossRight = stepTime;
        foundInterval = true;
        break;
      }
      prevDiff = diff;
    }

    if (!foundInterval) return null;

    for (let i = 0; i < 20; i++) {
      const mid = (crossLeft + crossRight) / 2;
      const coord = coordGetter(new Date(mid));
      let diff = (coord - targetAngle + 360) % 360;
      if (diff > 180) diff -= 360;

      if (Math.abs(diff) < 0.001) {
        return new Date(mid);
      }
      if (diff < 0) crossLeft = mid;
      else crossRight = mid;
    }

    return new Date((crossLeft + crossRight) / 2);
  }

  /**
   * Format transition time to Bengali string (e.g. "রাত ১০:২৪ পর্যন্ত, অতঃপর চতুর্থী")
   */
  private static formatTransitionTime(
    transitionDate: Date | null,
    baseDate: Date,
    nextItemName: string,
    tzOffset: number
  ): string {
    if (!transitionDate) {
      return 'পরবর্তী দিন পর্যন্ত বিস্তার';
    }

    // Convert to local time of the selected timezone
    const utc = transitionDate.getTime() + transitionDate.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + tzOffset * 3600000);

    const hours = localTime.getHours();
    const minutes = localTime.getMinutes();

    let period = 'সকাল';
    let displayHour = hours;
    if (hours >= 12 && hours < 16) {
      period = 'দুপুর';
      if (hours > 12) displayHour = hours - 12;
    } else if (hours >= 16 && hours < 19) {
      period = 'বিকাল';
      displayHour = hours - 12;
    } else if (hours >= 19) {
      period = 'রাত';
      displayHour = hours - 12;
    } else if (hours === 0) {
      period = 'রাত';
      displayHour = 12;
    } else if (hours < 6) {
      period = 'ভোর';
    }

    const timeStr = `${period} ${toBengaliNumeral(displayHour)}:${toBengaliNumeral(
      String(minutes).padStart(2, '0')
    )}`;

    // Check if it crosses into next day
    const baseUtc = baseDate.getTime() + baseDate.getTimezoneOffset() * 60000;
    const baseLocal = new Date(baseUtc + tzOffset * 3600000);
    const isNextDay = localTime.getDate() !== baseLocal.getDate();

    if (isNextDay) {
      return `পরদিন ${timeStr} পর্যন্ত, অতঃপর ${nextItemName}`;
    }

    return `${timeStr} পর্যন্ত, অতঃপর ${nextItemName}`;
  }

  /**
   * Format simple time string from hour/minute
   */
  public static formatTime(hours: number, minutes: number): string {
    const h = Math.floor(hours);
    const m = Math.floor(minutes);
    let period = 'সকাল';
    let displayHour = h;

    if (h >= 12 && h < 16) {
      period = 'দুপুর';
      if (h > 12) displayHour = h - 12;
    } else if (h >= 16 && h < 19) {
      period = 'বিকাল';
      displayHour = h - 12;
    } else if (h >= 19) {
      period = 'সন্ধ্যা/রাত';
      displayHour = h - 12;
    } else if (h === 0) {
      period = 'রাত';
      displayHour = 12;
    } else if (h < 6) {
      period = 'ভোর';
    }

    return `${period} ${toBengaliNumeral(displayHour)}:${toBengaliNumeral(String(m).padStart(2, '0'))}`;
  }

  /**
   * Astronomical Sunrise & Sunset with atmospheric refraction (-0.833° zenith)
   */
  public static getSunRiseSet(
    date: Date,
    lat: number,
    lng: number,
    tzOffset: number
  ): { sunriseMinutes: number; sunsetMinutes: number; solarNoonMinutes: number } {
    const jd = this.toJulianDate(date);
    const t = this.toJulianCenturies(jd);

    const sun = this.getSunEclipticPosition(t);
    const toRad = Math.PI / 180;
    const toDeg = 180 / Math.PI;

    // Obliquity of ecliptic
    const eps0 = 23.439291 - 0.0130042 * t;
    const epsRad = eps0 * toRad;

    // Sun declination
    const lambdaRad = sun.apparentLong * toRad;
    const sinDelta = Math.sin(epsRad) * Math.sin(lambdaRad);
    const deltaRad = Math.asin(sinDelta);

    // Equation of Time in minutes
    const y = Math.tan(epsRad / 2) * Math.tan(epsRad / 2);
    const L0Rad = (280.46646 + 36000.76983 * t) * toRad;
    const mRad = sun.meanAnomaly * toRad;
    const e = 0.016708634 - 0.000042037 * t;
    const Etime =
      y * Math.sin(2 * L0Rad) -
      2 * e * Math.sin(mRad) +
      4 * e * y * Math.sin(mRad) * Math.cos(2 * L0Rad) -
      0.5 * y * y * Math.sin(4 * L0Rad) -
      1.25 * e * e * Math.sin(2 * mRad);
    const eqTimeMinutes = Etime * toDeg * 4;

    // Solar noon in local time minutes
    const solarNoonMinutes = 720 - 4 * lng + tzOffset * 60 - eqTimeMinutes;

    // Zenith angle for sunrise/sunset (accounting for refraction and sun radius: -0.8333 degrees)
    const zenithRad = 90.8333 * toRad;
    const latRad = lat * toRad;

    const cosH0 =
      (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(deltaRad)) /
      (Math.cos(latRad) * Math.cos(deltaRad));

    const clampedCosH0 = Math.max(-1, Math.min(1, cosH0));
    const hourAngleDeg = Math.acos(clampedCosH0) * toDeg;
    const halfDayMinutes = hourAngleDeg * 4;

    const sunriseMinutes = (solarNoonMinutes - halfDayMinutes + 1440) % 1440;
    const sunsetMinutes = (solarNoonMinutes + halfDayMinutes + 1440) % 1440;

    return { sunriseMinutes, sunsetMinutes, solarNoonMinutes };
  }

  /**
   * Astronomical Moonrise & Moonset calculation
   */
  public static getMoonRiseSet(
    date: Date,
    lat: number,
    lng: number,
    tzOffset: number
  ): { moonrise: string; moonset: string } {
    const toRad = Math.PI / 180;
    const toDeg = 180 / Math.PI;

    // Test altitude of moon every 30 minutes across the 24 hours
    const baseMidnight = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    baseMidnight.setTime(baseMidnight.getTime() - tzOffset * 3600000);

    let moonriseMin: number | null = null;
    let moonsetMin: number | null = null;

    let prevAlt: number | null = null;

    for (let m = 0; m <= 1440; m += 20) {
      const curDate = new Date(baseMidnight.getTime() + m * 60000);
      const jd = this.toJulianDate(curDate);
      const t = this.toJulianCenturies(jd);

      const moonPos = this.getMoonEclipticPosition(t);
      const epsRad = (23.439291 - 0.0130042 * t) * toRad;

      // Convert Moon ecliptic to equatorial (RA & Dec)
      const lamRad = moonPos.apparentLong * toRad;
      const betRad = moonPos.latitude * toRad;

      const sinDec =
        Math.sin(betRad) * Math.cos(epsRad) +
        Math.cos(betRad) * Math.sin(epsRad) * Math.sin(lamRad);
      const decRad = Math.asin(sinDec);

      const cosDec = Math.cos(decRad);
      const y = Math.sin(lamRad) * Math.cos(epsRad) - Math.tan(betRad) * Math.sin(epsRad);
      const x = Math.cos(lamRad);
      const raRad = Math.atan2(y, x);

      // Local Sidereal Time
      const gmst = (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360;
      const lmstRad = (gmst + lng) * toRad;

      // Hour Angle
      const haRad = lmstRad - raRad;

      // Altitude above horizon
      const latRad = lat * toRad;
      const sinAlt =
        Math.sin(latRad) * Math.sin(decRad) +
        Math.cos(latRad) * cosDec * Math.cos(haRad);
      const altDeg = Math.asin(sinAlt) * toDeg;

      // Moon standard zenith is 90° 34' = 90.567° (altitude = -0.567°)
      const horizonThreshold = -0.567;

      if (prevAlt !== null) {
        if (prevAlt < horizonThreshold && altDeg >= horizonThreshold && moonriseMin === null) {
          moonriseMin = m - 10;
        } else if (prevAlt >= horizonThreshold && altDeg < horizonThreshold && moonsetMin === null) {
          moonsetMin = m - 10;
        }
      }
      prevAlt = altDeg;
    }

    const formatMin = (mins: number | null): string => {
      if (mins === null) return 'এই দিনে দৃশ্যমান নয়';
      const h = Math.floor(mins / 60);
      const m = Math.floor(mins % 60);
      return this.formatTime(h, m);
    };

    return {
      moonrise: formatMin(moonriseMin),
      moonset: formatMin(moonsetMin)
    };
  }

  /**
   * Check for True Astronomical Sankranti (Solar Ingress into new Rashi)
   */
  public static checkSankranti(
    date: Date,
    tzOffset: number
  ): { isSankranti: boolean; sankrantiName?: string; timeString?: string } {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const posStart = this.getSiderealPositions(dayStart);
    const rashiStart = Math.floor(posStart.sunSidereal / 30);

    const dayEnd = new Date(dayStart.getTime() + 24 * 3600000);
    const posEnd = this.getSiderealPositions(dayEnd);
    const rashiEnd = Math.floor(posEnd.sunSidereal / 30);

    if (rashiStart !== rashiEnd) {
      const targetDeg = rashiEnd * 30;
      const crossTime = this.findCoordinateCrossing(dayStart, targetDeg, (d) => {
        return this.getSiderealPositions(d).sunSidereal;
      });

      const newRashiName = ZODIAC_SIGNS_BN[rashiEnd]?.split(' ')[0] || '';
      const sankrantiName = `${newRashiName} সংক্রান্তি`;

      let timeString: string | undefined = undefined;
      if (crossTime) {
        const utc = crossTime.getTime() + crossTime.getTimezoneOffset() * 60000;
        const local = new Date(utc + tzOffset * 3600000);
        timeString = this.formatTime(local.getHours(), local.getMinutes());
      }

      return {
        isSankranti: true,
        sankrantiName,
        timeString
      };
    }

    return { isSankranti: false };
  }

  /**
   * Determine Vedic Vratas & Observances on a given date
   */
  public static getVedicVratas(
    tithiIndex: number,
    tithiEndHour: number,
    weekday: number,
    isSankranti: boolean
  ): string[] {
    const vratas: string[] = [];

    // Ekadashi (10 = Shukla Ekadashi, 25 = Krishna Ekadashi)
    if (tithiIndex === 10) {
      vratas.push('শুক্লপক্ষীয় একাদশী ব্রত');
    } else if (tithiIndex === 25) {
      vratas.push('কৃষ্ণপক্ষীয় একাদশী ব্রত');
    }

    // Pradosha Vrata (Trayodashi: 12 = Shukla Trayodashi, 27 = Krishna Trayodashi)
    if (tithiIndex === 12 || tithiIndex === 27) {
      const dayNames = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
      vratas.push(`${dayNames[weekday]} প্রদোষ ব্রত`);
    }

    // Masik Shivaratri (Krishna Chaturdashi: 28)
    if (tithiIndex === 28) {
      vratas.push('মাসিক শিবরাত্রি');
    }

    // Purnima (14)
    if (tithiIndex === 14) {
      vratas.push('পূর্ণিমা ব্রত ও স্নান');
    }

    // Amavasya (29)
    if (tithiIndex === 29) {
      vratas.push('অমাবস্যা তর্পণ ও শ্রাদ্ধ');
    }

    // Sankashti / Vinayaka Chaturthi
    if (tithiIndex === 3) {
      vratas.push('বিনায়ক চতুর্থী');
    } else if (tithiIndex === 18) {
      vratas.push('সঙ্কষ্টী চতুর্থী');
    }

    if (isSankranti) {
      vratas.push('পুণ্য পুণ্যস্নান ও সংক্রান্তি ব্রত');
    }

    return vratas;
  }

  /**
   * Main calculation method: returns full Vedic Panjika for any date, location and timezone
   */
  public static getFullPanjika(
    date: Date,
    cityId: string = 'dhaka',
    customCoords?: { lat: number; lng: number; label: string; tzOffset?: number }
  ): PanjikaData {
    const cacheKey = `${date.toISOString().slice(0, 10)}_${cityId}_${customCoords?.lat || 0}`;
    if (this.panjikaCache.has(cacheKey)) {
      return this.panjikaCache.get(cacheKey)!;
    }

    // Resolve location
    let city = ALL_CITIES_PANJIKA.find((c) => c.id === cityId);
    let lat = city?.lat || 23.8103;
    let lng = city?.lng || 90.4125;
    let tzOffset = city?.tzOffset !== undefined ? city.tzOffset : 6.0;

    if (customCoords) {
      lat = customCoords.lat;
      lng = customCoords.lng;
      tzOffset = customCoords.tzOffset !== undefined ? customCoords.tzOffset : (lng > 89 ? 6.0 : 5.5);
    }

    // Sun & Moon Positions at Sunrise/Reference Time
    const sunTimes = this.getSunRiseSet(date, lat, lng, tzOffset);
    const sunriseDate = new Date(date);
    sunriseDate.setHours(
      Math.floor(sunTimes.sunriseMinutes / 60),
      Math.floor(sunTimes.sunriseMinutes % 60),
      0,
      0
    );

    const positions = this.getSiderealPositions(sunriseDate);

    // 1. Tithi (Elongation / 12°)
    const elongation = positions.elongation;
    const tithiIndex = Math.min(29, Math.max(0, Math.floor(elongation / 12)));
    const tithiName = TITHI_NAMES_FULL_BN[tithiIndex] || 'তথ্য উপলব্ধ নয়';
    const paksha = tithiIndex < 15 ? 'শুক্লপক্ষ' : 'কৃষ্ণপক্ষ';

    // Tithi End Time
    const nextTithiDeg = ((tithiIndex + 1) * 12) % 360;
    const nextTithiIdx = (tithiIndex + 1) % 30;
    const nextTithiName = TITHI_NAMES_FULL_BN[nextTithiIdx];
    const tithiCrossing = this.findElongationCrossing(sunriseDate, nextTithiDeg, tzOffset);
    const tithiEndTime = this.formatTransitionTime(tithiCrossing, date, nextTithiName, tzOffset);

    // 2. Nakshatra (Moon Longitude / 13.333333°)
    const nakshatraSpan = 360 / 27;
    const nakshatraIndex = Math.min(26, Math.max(0, Math.floor(positions.moonSidereal / nakshatraSpan)));
    const nakshatraName = NAKSHATRA_NAMES_FULL_BN[nakshatraIndex] || 'তথ্য উপলব্ধ নয়';
    const nextNakshatraDeg = ((nakshatraIndex + 1) * nakshatraSpan) % 360;
    const nextNakshatraName = NAKSHATRA_NAMES_FULL_BN[(nakshatraIndex + 1) % 27];
    const nakshatraCrossing = this.findCoordinateCrossing(sunriseDate, nextNakshatraDeg, (d) => {
      return this.getSiderealPositions(d).moonSidereal;
    });
    const nakshatraEndTime = this.formatTransitionTime(nakshatraCrossing, date, nextNakshatraName, tzOffset);

    // 3. Yoga ((Sun + Moon) / 13.333333°)
    const yogaSum = (positions.sunSidereal + positions.moonSidereal) % 360;
    const yogaIndex = Math.min(26, Math.max(0, Math.floor(yogaSum / nakshatraSpan)));
    const yogaName = YOGA_NAMES_FULL_BN[yogaIndex] || 'তথ্য উপলব্ধ নয়';
    const nextYogaDeg = ((yogaIndex + 1) * nakshatraSpan) % 360;
    const nextYogaName = YOGA_NAMES_FULL_BN[(yogaIndex + 1) % 27];
    const yogaCrossing = this.findCoordinateCrossing(sunriseDate, nextYogaDeg, (d) => {
      const p = this.getSiderealPositions(d);
      return (p.sunSidereal + p.moonSidereal) % 360;
    });
    const yogaEndTime = this.formatTransitionTime(yogaCrossing, date, nextYogaName, tzOffset);

    // 4. Karana (Half-tithi = 6°)
    const halfTithi = Math.floor(elongation / 6);
    let karanaName = '';
    if (halfTithi === 0) {
      karanaName = 'কিংস্তুঘ্ন (Kimstughna)';
    } else if (halfTithi >= 57) {
      if (halfTithi === 57) karanaName = 'শকুনি (Shakuni)';
      else if (halfTithi === 58) karanaName = 'চতুষ্পাদ (Chatushpada)';
      else karanaName = 'নাগ (Naga)';
    } else {
      const cyclicalIdx = (halfTithi - 1) % 7;
      karanaName = KARANA_NAMES_FULL_BN[cyclicalIdx] || 'বব (Bava)';
    }

    const nextKaranaDeg = ((halfTithi + 1) * 6) % 360;
    const karanaCrossing = this.findElongationCrossing(sunriseDate, nextKaranaDeg, tzOffset);
    const karanaEndTime = this.formatTransitionTime(karanaCrossing, date, 'পরবর্তী করণ', tzOffset);

    // 5. Chandra Rashi & Surya Rashi
    const moonRashiIdx = Math.floor(positions.moonSidereal / 30);
    const sunRashiIdx = Math.floor(positions.sunSidereal / 30);
    const chandraRashi = ZODIAC_SIGNS_BN[moonRashiIdx] || '';
    const suryaRashi = ZODIAC_SIGNS_BN[sunRashiIdx] || '';

    // 6. Moonrise & Moonset
    const moonRiseSet = this.getMoonRiseSet(date, lat, lng, tzOffset);

    // 7. Vedic Muhurthas: Rahu Kalam, Yamagandam, Gulikakalam
    const dayLengthMin = (sunTimes.sunsetMinutes - sunTimes.sunriseMinutes + 1440) % 1440;
    const partMin = dayLengthMin / 8;
    const weekday = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    // Rahu Kalam order: Sun(8), Mon(2), Tue(7), Wed(5), Thu(6), Fri(4), Sat(3)
    const rahuOrder = [7, 1, 6, 4, 5, 3, 2];
    const rahuStartMin = sunTimes.sunriseMinutes + rahuOrder[weekday] * partMin;
    const rahuEndMin = rahuStartMin + partMin;

    // Yamagandam order: Sun(5), Mon(4), Tue(3), Wed(2), Thu(1), Fri(7), Sat(6)
    const yamaOrder = [4, 3, 2, 1, 0, 6, 5];
    const yamaStartMin = sunTimes.sunriseMinutes + yamaOrder[weekday] * partMin;
    const yamaEndMin = yamaStartMin + partMin;

    // Gulika Kalam order: Sun(7), Mon(6), Tue(5), Wed(4), Thu(3), Fri(2), Sat(1)
    const gulikaOrder = [6, 5, 4, 3, 2, 1, 0];
    const gulikaStartMin = sunTimes.sunriseMinutes + gulikaOrder[weekday] * partMin;
    const gulikaEndMin = gulikaStartMin + partMin;

    const rahuStartStr = this.formatTime(rahuStartMin / 60, rahuStartMin % 60);
    const rahuEndStr = this.formatTime(rahuEndMin / 60, rahuEndMin % 60);

    const yamaStartStr = this.formatTime(yamaStartMin / 60, yamaStartMin % 60);
    const yamaEndStr = this.formatTime(yamaEndMin / 60, yamaEndMin % 60);

    const gulikaStartStr = this.formatTime(gulikaStartMin / 60, gulikaStartMin % 60);
    const gulikaEndStr = this.formatTime(gulikaEndMin / 60, gulikaEndMin % 60);

    // Abhijit Muhurtha (8th Muhurtha around solar noon: noon ± 24 min)
    const abhijitStartMin = sunTimes.solarNoonMinutes - 24;
    const abhijitEndMin = sunTimes.solarNoonMinutes + 24;
    const abhijitStartStr = this.formatTime(abhijitStartMin / 60, abhijitStartMin % 60);
    const abhijitEndStr = this.formatTime(abhijitEndMin / 60, abhijitEndMin % 60);

    // Brahma Muhurtha (approx 96 min before sunrise to 48 min before sunrise)
    const brahmaStartMin = sunTimes.sunriseMinutes - 96;
    const brahmaEndMin = sunTimes.sunriseMinutes - 48;
    const brahmaStartStr = this.formatTime(brahmaStartMin / 60, brahmaStartMin % 60);
    const brahmaEndStr = this.formatTime(brahmaEndMin / 60, brahmaEndMin % 60);

    // 8. Sankranti Ingress
    const sankrantiCheck = this.checkSankranti(date, tzOffset);

    // 9. Vratas & Observances
    const vratas = this.getVedicVratas(
      tithiIndex,
      sunTimes.sunsetMinutes / 60,
      weekday,
      sankrantiCheck.isSankranti
    );

    const result: PanjikaData = {
      tithi: tithiName,
      tithiEndTime,
      nextTithi: nextTithiName,
      paksha,
      nakshatra: nakshatraName,
      nakshatraEndTime,
      nextNakshatra: nextNakshatraName,
      yoga: yogaName,
      yogaEndTime,
      karana: karanaName,
      karanaEndTime,
      chandraRashi,
      suryaRashi,
      moonrise: moonRiseSet.moonrise,
      moonset: moonRiseSet.moonset,
      rahuKalam: {
        start: rahuStartStr,
        end: rahuEndStr,
        text: `${rahuStartStr} থেকে ${rahuEndStr}`
      },
      yamagandam: {
        start: yamaStartStr,
        end: yamaEndStr,
        text: `${yamaStartStr} থেকে ${yamaEndStr}`
      },
      gulikaKalam: {
        start: gulikaStartStr,
        end: gulikaEndStr,
        text: `${gulikaStartStr} থেকে ${gulikaEndStr}`
      },
      abhijitMuhurtha: {
        start: abhijitStartStr,
        end: abhijitEndStr,
        text: weekday === 3 ? 'বুধবার বর্জিত (শুভ নয়)' : `${abhijitStartStr} থেকে ${abhijitEndStr}`
      },
      brahmaMuhurtha: {
        start: brahmaStartStr,
        end: brahmaEndStr,
        text: `${brahmaStartStr} থেকে ${brahmaEndStr}`
      },
      sankranti: sankrantiCheck.isSankranti ? sankrantiCheck.sankrantiName : undefined,
      sankrantiMoment: sankrantiCheck.timeString,
      isSankranti: sankrantiCheck.isSankranti,
      isPurnima: tithiIndex === 14,
      isAmavasya: tithiIndex === 29,
      vratas,
      isAvailable: true
    };

    this.panjikaCache.set(cacheKey, result);
    return result;
  }

  /**
   * Combined Sun & Moon Information with complete Panjika
   */
  public static getSunMoonInfo(
    date: Date,
    cityId: string = 'dhaka',
    customCoords?: { lat: number; lng: number; label: string; tzOffset?: number }
  ): SunMoonInfo {
    const cacheKey = `${date.toISOString().slice(0, 10)}_${cityId}_sm_${customCoords?.lat || 0}`;
    if (this.sunMoonCache.has(cacheKey)) {
      return this.sunMoonCache.get(cacheKey)!;
    }

    let city = ALL_CITIES_PANJIKA.find((c) => c.id === cityId);
    let lat = city?.lat || 23.8103;
    let lng = city?.lng || 90.4125;
    let tzOffset = city?.tzOffset !== undefined ? city.tzOffset : 6.0;

    if (customCoords) {
      lat = customCoords.lat;
      lng = customCoords.lng;
      tzOffset = customCoords.tzOffset !== undefined ? customCoords.tzOffset : (lng > 89 ? 6.0 : 5.5);
    }

    const sunTimes = this.getSunRiseSet(date, lat, lng, tzOffset);
    const sunriseStr = this.formatTime(sunTimes.sunriseMinutes / 60, sunTimes.sunriseMinutes % 60);
    const sunsetStr = this.formatTime(sunTimes.sunsetMinutes / 60, sunTimes.sunsetMinutes % 60);
    const solarNoonStr = this.formatTime(sunTimes.solarNoonMinutes / 60, sunTimes.solarNoonMinutes % 60);

    const dayLengthMin = (sunTimes.sunsetMinutes - sunTimes.sunriseMinutes + 1440) % 1440;
    const dayLengthHours = Math.floor(dayLengthMin / 60);
    const dayLengthRemMin = Math.floor(dayLengthMin % 60);
    const dayLengthStr = `${toBengaliNumeral(dayLengthHours)} ঘণ্টা ${toBengaliNumeral(dayLengthRemMin)} মিনিট`;

    const panjika = this.getFullPanjika(date, cityId, customCoords);

    // Moon phase and illumination percentage
    const positions = this.getSiderealPositions(date);
    const phaseAngle = (positions.elongation * Math.PI) / 180;
    const illumination = Math.round(0.5 * (1 - Math.cos(phaseAngle)) * 100);

    let phaseBn = '';
    let icon = '🌑';
    const el = positions.elongation;

    if (el < 15 || el >= 345) {
      phaseBn = 'অমাবস্যা (নতুন চাঁদ)';
      icon = '🌑';
    } else if (el < 75) {
      phaseBn = 'শুক্লপক্ষ অর্ধচন্দ্র (Waxing Crescent)';
      icon = '🌒';
    } else if (el < 105) {
      phaseBn = 'প্রথম চতুর্থাংশ (First Quarter)';
      icon = '🌓';
    } else if (el < 165) {
      phaseBn = 'শুক্লপক্ষ স্ফীতচন্দ্র (Waxing Gibbous)';
      icon = '🌔';
    } else if (el < 195) {
      phaseBn = 'পূর্ণিমা (পূর্ণ চাঁদ)';
      icon = '🌕';
    } else if (el < 255) {
      phaseBn = 'কৃষ্ণপক্ষ স্ফীতচন্দ্র (Waning Gibbous)';
      icon = '🌖';
    } else if (el < 285) {
      phaseBn = 'শেষ চতুর্থাংশ (Last Quarter)';
      icon = '🌗';
    } else {
      phaseBn = 'কৃষ্ণপক্ষ অর্ধচন্দ্র (Waning Crescent)';
      icon = '🌘';
    }

    const result: SunMoonInfo = {
      sunrise: sunriseStr,
      sunset: sunsetStr,
      solarNoon: solarNoonStr,
      dayLength: dayLengthStr,
      moonrise: panjika.moonrise,
      moonset: panjika.moonset,
      moonPhaseBn: phaseBn,
      moonPhaseIcon: icon,
      moonPhasePct: illumination,
      moonIlluminationPctBn: `${toBengaliNumeral(illumination)}% আলোকিত`,
      panjika
    };

    this.sunMoonCache.set(cacheKey, result);
    return result;
  }
}
