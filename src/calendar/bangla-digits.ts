// Utility for Bengali digits and naming

export const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toBengaliNumeral(num: number | string): string {
  const str = String(num);
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)]);
}

export function toEnglishNumeral(str: string): string {
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replaceAll(BENGALI_DIGITS[i], ENGLISH_DIGITS[i]);
  }
  return result;
}

export const fromBengaliNumeral = toEnglishNumeral;

export function formatDigits(num: number | string, useBengaliDigits: boolean = true): string {
  if (useBengaliDigits) {
    return toBengaliNumeral(num);
  }
  return toEnglishNumeral(String(num));
}

export const BANGLA_MONTHS_BN = [
  'বৈশাখ',
  'জ্যৈষ্ঠ',
  'আষাঢ়',
  'শ্রাবণ',
  'ভাদ্র',
  'আশ্বিন',
  'কার্তিক',
  'অগ্রহায়ণ',
  'পৌষ',
  'মাঘ',
  'ফাল্গুন',
  'চৈত্র'
];

export const BANGLA_MONTHS_EN = [
  'Boishakh',
  'Joishtho',
  'Ashar',
  'Srabon',
  'Bhadro',
  'Ashwin',
  'Kartik',
  'Ogrohayon',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra'
];

export const BANGLA_SEASONS_BN = [
  'গ্রীষ্ম', // Boishakh, Joishtho
  'বর্ষা',  // Ashar, Srabon
  'শরৎ',   // Bhadro, Ashwin
  'হেমন্ত', // Kartik, Ogrohayon
  'শীত',   // Poush, Magh
  'বসন্ত'  // Falgun, Chaitra
];

export function getSeasonNameBn(monthIndex: number): string {
  const seasonIdx = Math.floor((monthIndex % 12) / 2);
  return BANGLA_SEASONS_BN[seasonIdx];
}

export const WEEKDAYS_BN = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার'
];

export const WEEKDAYS_SHORT_BN = [
  'রবি',
  'সোম',
  'মঙ্গল',
  'বুধ',
  'বৃহঃ',
  'শুক্র',
  'শনি'
];

export const GREGORIAN_MONTHS_BN = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

export const HIJRI_MONTHS_BN = [
  'মুহররম',
  'সফর',
  'রবিউল আউয়াল',
  'রবিউস সানি',
  'জমাদিউল আউয়াল',
  'জমাদিউস সানি',
  'রজব',
  'শাবান',
  'রমজান',
  'শাওয়াল',
  'জিলকদ',
  'জিলহজ্জ'
];

export const HIJRI_MONTHS_EN = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  'Sha\'ban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qi\'dah',
  'Dhu al-Hijjah'
];
