export type Region = 'bangladesh' | 'west_bengal' | 'both' | 'vedic_india';

export type ActiveTab = 'home' | 'calendar' | 'converter' | 'events' | 'panjika' | 'notes';

export type CalendarSystemSource = 'bangladesh_standard' | 'west_bengal_panji' | 'astronomical';

export interface BanglaDateResult {
  year: number;
  monthIndex: number; // 0-based: 0 = Boishakh, 11 = Chaitra
  monthNameBn: string;
  monthNameEn: string;
  day: number;
  dayBn: string;
  yearBn: string;
  seasonBn: string;
  weekdayBn: string;
  weekdayEn: string;
  isLeapYear: boolean;
  totalDaysInMonth: number;
  source: CalendarSystemSource;
  region: 'bangladesh' | 'west_bengal';
}

export interface HijriDateResult {
  year: number;
  monthIndex: number; // 0-based: 0 = Muharram, 11 = Dhu al-Hijjah
  monthNameBn: string;
  monthNameEn: string;
  day: number;
  dayBn: string;
  yearBn: string;
  isCalculated: boolean;
  calculationNote?: string;
}

export type EventCategory =
  | 'bd_govt'
  | 'wb_govt'
  | 'islamic'
  | 'hindu'
  | 'christian'
  | 'buddhist'
  | 'national_bd'
  | 'national_wb'
  | 'cultural'
  | 'international'
  | 'observance';

export interface HolidayEvent {
  id: string;
  titleBn: string;
  titleEn: string;
  dateStr?: string; // YYYY-MM-DD or MM-DD (recurring)
  banglaDate?: { monthIndex: number; day: number };
  tithiRequirement?: string;
  startTime?: string;
  endTime?: string;
  region: 'bd' | 'wb' | 'both' | 'all_india';
  category: EventCategory;
  isHoliday: boolean;
  descriptionBn?: string;
  source?: string;
  year?: number;
  lastUpdated?: string;
}

export interface MuhurthaTime {
  start: string;
  end: string;
  text: string;
}

export interface PanjikaData {
  tithi: string;
  tithiEndTime?: string;
  nextTithi?: string;
  paksha: string;
  nakshatra: string;
  nakshatraEndTime?: string;
  nextNakshatra?: string;
  yoga: string;
  yogaEndTime?: string;
  nextYoga?: string;
  karana: string;
  karanaEndTime?: string;
  nextKarana?: string;
  chandraRashi?: string;
  suryaRashi?: string;
  moonrise?: string;
  moonset?: string;
  rahuKalam?: MuhurthaTime;
  yamagandam?: MuhurthaTime;
  gulikaKalam?: MuhurthaTime;
  abhijitMuhurtha?: MuhurthaTime;
  brahmaMuhurtha?: MuhurthaTime;
  sankranti?: string;
  sankrantiMoment?: string;
  isSankranti: boolean;
  isPurnima: boolean;
  isAmavasya: boolean;
  vratas?: string[];
  isAvailable: boolean;
}

export interface PersonalNote {
  id: string;
  dateStr: string; // YYYY-MM-DD
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export type ReminderRepeat = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ReminderItem {
  id: string;
  dateStr: string; // YYYY-MM-DD
  time: string; // HH:mm
  title: string;
  note?: string;
  completed: boolean;
  repeat: ReminderRepeat;
  createdAt: string;
}

export interface SunMoonInfo {
  sunrise: string;
  sunset: string;
  solarNoon?: string;
  dayLength?: string;
  moonrise?: string;
  moonset?: string;
  moonPhaseBn: string;
  moonPhaseIcon: string;
  moonPhasePct: number;
  moonIlluminationPctBn: string;
  panjika?: PanjikaData;
}

export interface LocationCity {
  id: string;
  nameBn: string;
  nameEn: string;
  country: 'bd' | 'wb' | 'in';
  lat: number;
  lng: number;
  tzOffset: number;
  timezoneName?: string;
}

export type CityLocationId = string;

export interface HomeWidgetsConfig {
  banglaDate?: boolean;
  gregorianDate?: boolean;
  hijriDate?: boolean;
  sunrise?: boolean;
  sunset?: boolean;
  moonPhase?: boolean;
  todayEvent?: boolean;
  showSunriseSunset?: boolean;
  showMoonPhase?: boolean;
  showPanjika?: boolean;
  showHijriDate?: boolean;
  showSeason?: boolean;
}

export interface UserSettings {
  region: Region;
  theme: 'light' | 'dark';
  systemTheme: boolean;
  themeColorPalette: 'editorial_green' | 'royal_crimson' | 'night_sky';
  language: 'bn' | 'en';
  useBengaliDigits: boolean;
  hijriAdjustment: number; // -1, 0, 1
  cityId: string;
  city?: string;
  customCoordinates?: { lat: number; lng: number; label: string; tzOffset?: number };
  customCoords?: { lat: number; lng: number; label: string; tzOffset?: number };
  dailyNotification: boolean;
  enableDailyNotification?: boolean;
  hasSelectedInitialRegion: boolean;
  homeWidgets: HomeWidgetsConfig;
  calendarViewMode: 'month' | 'year';
}

export interface TestResultItem {
  id: string;
  title: string;
  category: 'bangladesh' | 'west_bengal' | 'hijri' | 'conversion' | 'panjika' | 'astronomy' | 'persistence';
  status: 'passed' | 'failed' | 'running';
  expected: string;
  actual: string;
  explanation: string;
}
