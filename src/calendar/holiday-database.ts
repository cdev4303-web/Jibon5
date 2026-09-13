import { EventCategory, HolidayEvent, Region } from '../types';

/**
 * Structured, verifiable Holiday and Observances Database
 * Categories:
 * - bd_govt: বাংলাদেশ সরকারি ছুটি (জনপ্রশাসন মন্ত্রণালয়)
 * - wb_govt: পশ্চিমবঙ্গ সরকারি ছুটি (West Bengal Finance Dept Notification)
 * - islamic: ইসলামিক ধর্মীয় উৎসব
 * - hindu: হিন্দু ধর্মীয় উৎসব
 * - christian: খ্রিস্টান ধর্মীয় উৎসব
 * - buddhist: বৌদ্ধ ধর্মীয় উৎসব
 * - national_bd: বাংলাদেশের জাতীয় দিবস
 * - national_wb: পশ্চিমবঙ্গের জাতীয় ও স্মরণীয় দিবস
 * - cultural: ঐতিহ্যবাহী সাংস্কৃতিক উৎসব
 * - international: জাতিসংঘ ও আন্তর্জাতিক দিবস
 * - observance: সাধারণ পালনীয় দিবস
 */

const BD_GOVT_SOURCE = 'জনপ্রশাসন মন্ত্রণালয়, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার';
const WB_GOVT_SOURCE = 'Finance Department (Audit Branch), Government of West Bengal';
const ISLAMIC_SOURCE = 'ইসলামিক ফাউন্ডেশন ও চাঁদ দেখা কমিটি';
const HINDU_SOURCE = 'বিশুদ্ধ সিদ্ধান্ত ও গুপ্তপ্রেস পঞ্জিকা';
const INTL_SOURCE = 'জাতিসংঘ (United Nations) ও আন্তর্জাতিক সংস্থা';

export const RECURRING_ANNUAL_EVENTS: HolidayEvent[] = [
  // --- National & Government Fixed BD ---
  {
    id: 'bd-feb-21',
    titleBn: 'শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস',
    titleEn: 'Shaheed Day & International Mother Language Day',
    dateStr: '02-21',
    region: 'both',
    category: 'bd_govt',
    isHoliday: true,
    descriptionBn: '১৯৫২ সালের মহান ভাষা আন্দোলনের শহীদদের স্মরণে জাতীয় সাধারণ ছুটি ও ইউনেস্কো স্বীকৃত আন্তর্জাতিক মাতৃভাষা দিবস।',
    source: BD_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'bd-mar-17',
    titleBn: 'জাতীয় শিশু দিবস',
    titleEn: "National Children's Day",
    dateStr: '03-17',
    region: 'bd',
    category: 'national_bd',
    isHoliday: false,
    descriptionBn: 'জাতির পিতা বঙ্গবন্ধু শেখ মুজিবুর রহমানের জন্মবার্ষিকী ও জাতীয় শিশু দিবস।',
    source: BD_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'bd-mar-25',
    titleBn: 'জাতীয় গণহত্যা দিবস',
    titleEn: 'National Genocide Day',
    dateStr: '03-25',
    region: 'bd',
    category: 'national_bd',
    isHoliday: false,
    descriptionBn: '১৯৭১ সালের ২৫শে মার্চ কালরাতে পাকিস্তানি হানাদার বাহিনীর নৃশংস গণহত্যার স্মরণে।',
    source: BD_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'bd-mar-26',
    titleBn: 'স্বাধীনতা ও জাতীয় দিবস',
    titleEn: 'Independence and National Day',
    dateStr: '03-26',
    region: 'bd',
    category: 'bd_govt',
    isHoliday: true,
    descriptionBn: '১৯৭১ সালের মহান স্বাধীনতা ঘোষণার স্মারক জাতীয় দিবস ও সাধারণ ছুটি।',
    source: BD_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'bd-apr-14',
    titleBn: 'পহেলা বৈশাখ (বাংলা নববর্ষ - বাংলাদেশ)',
    titleEn: 'Pohela Boishakh (Bengali New Year)',
    dateStr: '04-14',
    region: 'bd',
    category: 'bd_govt',
    isHoliday: true,
    descriptionBn: 'বাংলা সনের প্রথম দিন, বাঙালির সার্বজনীন প্রাণের উৎসব ও সরকারি সাধারণ ছুটি।',
    source: BD_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'global-may-01',
    titleBn: 'মে দিবস (আন্তর্জাতিক শ্রমিক দিবস)',
    titleEn: 'May Day (International Workers\' Day)',
    dateStr: '05-01',
    region: 'both',
    category: 'bd_govt',
    isHoliday: true,
    descriptionBn: 'বিশ্বজুড়ে শ্রমিক অধিকার প্রতিষ্ঠার ঐতিহাসিক স্মারক ও সরকারি সাধারণ ছুটি।',
    source: INTL_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'bd-dec-14',
    titleBn: 'শহীদ বুদ্ধিজীবী দিবস',
    titleEn: 'Martyred Intellectuals Day',
    dateStr: '12-14',
    region: 'bd',
    category: 'national_bd',
    isHoliday: false,
    descriptionBn: '১৯৭১ সালে মহান মুক্তিযুদ্ধে বিজয়ের প্রাক্কালে শহীদ বুদ্ধিজীবীদের স্মরণে বিনম্র শ্রদ্ধা।',
    source: BD_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'bd-dec-16',
    titleBn: 'বিজয় দিবস',
    titleEn: 'Victory Day',
    dateStr: '12-16',
    region: 'bd',
    category: 'bd_govt',
    isHoliday: true,
    descriptionBn: '১৯৭১ সালের ১৬ই ডিসেম্বর অর্জিত ঐতিহাসিক চূড়ান্ত বিজয়ের স্মারক জাতীয় দিবস ও সাধারণ ছুটি।',
    source: BD_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },

  // --- National & Government Fixed West Bengal / India ---
  {
    id: 'wb-jan-12',
    titleBn: 'স্বামী বিবেকানন্দ জন্মজয়ন্তী (জাতীয় যুব দিবস)',
    titleEn: 'Swami Vivekananda Jayanti (National Youth Day)',
    dateStr: '01-12',
    region: 'wb',
    category: 'wb_govt',
    isHoliday: true,
    descriptionBn: 'স্বামী বিবেকানন্দের জন্মবার্ষিকী উপলক্ষে পশ্চিমবঙ্গ রাজ্য সরকারি ছুটির দিন।',
    source: WB_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'wb-jan-23',
    titleBn: 'নেতাজি সুভাষচন্দ্র বসু জয়ন্তী (পরাক্রম দিবস)',
    titleEn: 'Netaji Subhas Chandra Bose Jayanti',
    dateStr: '01-23',
    region: 'wb',
    category: 'wb_govt',
    isHoliday: true,
    descriptionBn: 'মহান দেশনায়ক নেতাজি সুভাষচন্দ্র বসুর জন্মদিন উপলক্ষে সরকারি ছুটি।',
    source: WB_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'wb-jan-26',
    titleBn: 'প্রজাতন্ত্র দিবস (Republic Day)',
    titleEn: 'Republic Day of India',
    dateStr: '01-26',
    region: 'wb',
    category: 'wb_govt',
    isHoliday: true,
    descriptionBn: '১৯৫০ সালে ভারতের সংবিধান কার্যকর হওয়ার স্মারক জাতীয় সাধারণ ছুটি।',
    source: WB_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'wb-apr-15',
    titleBn: 'পহেলা বৈশাখ (পশ্চিমবঙ্গ নববর্ষ ও পশ্চিমবঙ্গ দিবস)',
    titleEn: 'Pohela Boishakh (West Bengal)',
    dateStr: '04-15',
    region: 'wb',
    category: 'wb_govt',
    isHoliday: true,
    descriptionBn: 'পশ্চিমবঙ্গের ঐতিহ্যবাহী পঞ্জিকা অনুসারে বৈশাখ মাসের প্রথম দিন ও রাজ্য ছুটি।',
    source: WB_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'wb-may-09',
    titleBn: 'রবীন্দ্র জয়ন্তী (২৫শে বৈশাখ)',
    titleEn: 'Rabindra Jayanti',
    dateStr: '05-09',
    region: 'wb',
    category: 'wb_govt',
    isHoliday: true,
    descriptionBn: 'বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের জন্মবার্ষিকী উপলক্ষে পশ্চিমবঙ্গ সরকার ঘোষিত ছুটি।',
    source: WB_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'wb-aug-15',
    titleBn: 'ভারতের স্বাধীনতা দিবস',
    titleEn: 'Independence Day of India',
    dateStr: '08-15',
    region: 'wb',
    category: 'wb_govt',
    isHoliday: true,
    descriptionBn: '১৯৪৭ সালের ১৫ই আগস্ট ব্রিটিশ শাসন থেকে ভারতের স্বাধীনতা অর্জনের স্মারক জাতীয় ছুটি।',
    source: WB_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'wb-oct-02',
    titleBn: 'গান্ধী জয়ন্তী ও আন্তর্জাতিক অহিংসা দিবস',
    titleEn: 'Gandhi Jayanti',
    dateStr: '10-02',
    region: 'wb',
    category: 'wb_govt',
    isHoliday: true,
    descriptionBn: 'মহাত্মা গান্ধীর জন্মদিন উপলক্ষে ভারতের জাতীয় ছুটি ও জাতিসংঘের আন্তর্জাতিক অহিংসা দিবস।',
    source: WB_GOVT_SOURCE,
    lastUpdated: '2026-01-01'
  },

  // --- Fixed Religious & International ---
  {
    id: 'global-dec-25',
    titleBn: 'বড়দিন (যিশু খ্রিস্টের জন্মদিন)',
    titleEn: 'Christmas Day',
    dateStr: '12-25',
    region: 'both',
    category: 'christian',
    isHoliday: true,
    descriptionBn: 'খ্রিস্টধর্মাবলম্বীদের সর্বপ্রধান ধর্মীয় উৎসব ও সাধারণ ছুটি।',
    source: INTL_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'intl-mar-08',
    titleBn: 'আন্তর্জাতিক নারী দিবস',
    titleEn: 'International Women\'s Day',
    dateStr: '03-08',
    region: 'both',
    category: 'international',
    isHoliday: false,
    descriptionBn: 'নারী অধিকার, সমতা ও অগ্রযাত্রার বৈশ্বিক দিবস।',
    source: INTL_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'intl-jun-05',
    titleBn: 'বিশ্ব পরিবেশ দিবস',
    titleEn: 'World Environment Day',
    dateStr: '06-05',
    region: 'both',
    category: 'international',
    isHoliday: false,
    descriptionBn: 'পরিবেশ সচেতনতা ও প্রকৃতি রক্ষার বৈশ্বিক দিবস।',
    source: INTL_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'intl-sep-08',
    titleBn: 'আন্তর্জাতিক সাক্ষরতা দিবস',
    titleEn: 'International Literacy Day',
    dateStr: '09-08',
    region: 'both',
    category: 'international',
    isHoliday: false,
    descriptionBn: 'ইউনেস্কো ঘোষিত সাক্ষরতা প্রসার ও শিক্ষার আন্তর্জাতিক দিবস।',
    source: INTL_SOURCE,
    lastUpdated: '2026-01-01'
  },
  {
    id: 'intl-dec-10',
    titleBn: 'আন্তর্জাতিক মানবাধিকার দিবস',
    titleEn: 'Human Rights Day',
    dateStr: '12-10',
    region: 'both',
    category: 'international',
    isHoliday: false,
    descriptionBn: 'জাতিসংঘের মানবাধিকারের সর্বজনীন ঘোষণার স্মারক দিবস।',
    source: INTL_SOURCE,
    lastUpdated: '2026-01-01'
  }
];

// Year-wise variable holidays database for 2025, 2026, 2027, 2028, 2029
export const YEAR_SPECIFIC_EVENTS: Record<number, HolidayEvent[]> = {
  // 2025
  2025: [
    { id: '2025-01-28', titleBn: 'পবিত্র শবে মেরাজ', titleEn: 'Shab-e-Miraj', dateStr: '2025-01-28', region: 'bd', category: 'islamic', isHoliday: false, source: ISLAMIC_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-02-03', titleBn: 'সরস্বতী পূজা (শ্রীপঞ্চমী)', titleEn: 'Saraswati Puja', dateStr: '2025-02-03', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-02-14', titleBn: 'পবিত্র শবে বরাত', titleEn: 'Shab-e-Barat', dateStr: '2025-02-14', region: 'bd', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-03-02', titleBn: 'পবিত্র রমজান মাস শুরু', titleEn: 'Start of Ramadan', dateStr: '2025-03-02', region: 'both', category: 'islamic', isHoliday: false, source: ISLAMIC_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-03-14', titleBn: 'দোলযাত্রা (হোলি)', titleEn: 'Doljatra / Holi', dateStr: '2025-03-14', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-03-31', titleBn: 'পবিত্র ঈদুল ফিতর', titleEn: 'Eid-ul-Fitr', dateStr: '2025-03-31', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-04-18', titleBn: 'গুড ফ্রাইডে (পুণ্য শুক্রবার)', titleEn: 'Good Friday', dateStr: '2025-04-18', region: 'both', category: 'christian', isHoliday: true, source: INTL_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-05-12', titleBn: 'বুদ্ধ পূর্ণিমা (বৈশাখী পূর্ণিমা)', titleEn: 'Buddha Purnima', dateStr: '2025-05-12', region: 'both', category: 'buddhist', isHoliday: true, source: BD_GOVT_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-06-07', titleBn: 'পবিত্র ঈদুল আজহা (কোরবানি ঈদ)', titleEn: 'Eid-ul-Adha', dateStr: '2025-06-07', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-07-06', titleBn: 'পবিত্র আশুরা (১০ মহররম)', titleEn: 'Ashura', dateStr: '2025-07-06', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-08-16', titleBn: 'শ্রীকৃষ্ণের শুভ জন্মাষ্টমী', titleEn: 'Janmashtami', dateStr: '2025-08-16', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-09-05', titleBn: 'পবিত্র ঈদে মিলাদুন্নবী (সা.)', titleEn: 'Eid-e-Miladunnabi', dateStr: '2025-09-05', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-09-21', titleBn: 'মহালয়া', titleEn: 'Mahalaya', dateStr: '2025-09-21', region: 'wb', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-10-01', titleBn: 'শ্রীশ্রী দুর্গাপূজা (মহাষ্টমী)', titleEn: 'Maha Ashtami', dateStr: '2025-10-01', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-10-02', titleBn: 'শ্রীশ্রী দুর্গাপূজা (বিজয়া দশমী)', titleEn: 'Vijaya Dashami', dateStr: '2025-10-02', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2025, lastUpdated: '2025-01-01' },
    { id: '2025-10-20', titleBn: 'শ্যামাপূজা (কালীপূজা) ও দীপাবলি', titleEn: 'Kali Puja & Diwali', dateStr: '2025-10-20', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2025, lastUpdated: '2025-01-01' }
  ],

  // 2026 (Active Reference Year)
  2026: [
    { id: '2026-01-23', titleBn: 'সরস্বতী পূজা (শ্রীপঞ্চমী)', titleEn: 'Saraswati Puja', dateStr: '2026-01-23', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-02-03', titleBn: 'পবিত্র শবে বরাত', titleEn: 'Shab-e-Barat', dateStr: '2026-02-03', region: 'bd', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-02-15', titleBn: 'মহা শিবরাত্রি', titleEn: 'Maha Shivaratri', dateStr: '2026-02-15', region: 'both', category: 'hindu', isHoliday: false, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-02-18', titleBn: 'পবিত্র মাহে রমজানুল মোবারক শুরু', titleEn: 'Ramadan Begins', dateStr: '2026-02-18', region: 'both', category: 'islamic', isHoliday: false, source: ISLAMIC_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-03-04', titleBn: 'দোলযাত্রা ও হোলি উৎসব', titleEn: 'Doljatra / Holi', dateStr: '2026-03-04', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-03-16', titleBn: 'পবিত্র শবে কদর', titleEn: 'Shab-e-Qadr', dateStr: '2026-03-16', region: 'bd', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-03-20', titleBn: 'পবিত্র ঈদুল ফিতর (১ম দিন)', titleEn: 'Eid-ul-Fitr Day 1', dateStr: '2026-03-20', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-03-21', titleBn: 'পবিত্র ঈদুল ফিতর (২য় দিন)', titleEn: 'Eid-ul-Fitr Day 2', dateStr: '2026-03-21', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-03-22', titleBn: 'পবিত্র ঈদুল ফিতর (৩য় দিন)', titleEn: 'Eid-ul-Fitr Day 3', dateStr: '2026-03-22', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-03-27', titleBn: 'শ্রী শ্রী রামনবমী', titleEn: 'Rama Navami', dateStr: '2026-03-27', region: 'all_india', category: 'hindu', isHoliday: false, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-04-02', titleBn: 'শ্রী শ্রী হনুমান জয়ন্তী', titleEn: 'Hanuman Jayanti', dateStr: '2026-04-02', region: 'all_india', category: 'hindu', isHoliday: false, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-04-03', titleBn: 'গুড ফ্রাইডে (পুণ্য শুক্রবার)', titleEn: 'Good Friday', dateStr: '2026-04-03', region: 'both', category: 'christian', isHoliday: true, source: INTL_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-04-05', titleBn: 'ইস্টার সানডে (পুনরুত্থান রবিবার)', titleEn: 'Easter Sunday', dateStr: '2026-04-05', region: 'both', category: 'christian', isHoliday: true, source: INTL_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-04-20', titleBn: 'অক্ষয় তৃতীয়া', titleEn: 'Akshaya Tritiya', dateStr: '2026-04-20', region: 'both', category: 'hindu', isHoliday: false, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-05-01', titleBn: 'বুদ্ধ পূর্ণিমা (বৈশাখী পূর্ণিমা)', titleEn: 'Buddha Purnima', dateStr: '2026-05-01', region: 'both', category: 'buddhist', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-05-27', titleBn: 'পবিত্র ঈদুল আজহা (১ম দিন - কোরবানি ঈদ)', titleEn: 'Eid-ul-Adha Day 1', dateStr: '2026-05-27', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-05-28', titleBn: 'পবিত্র ঈদুল আজহা (২য় দিন)', titleEn: 'Eid-ul-Adha Day 2', dateStr: '2026-05-28', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-05-29', titleBn: 'পবিত্র ঈদুল আজহা (৩য় দিন)', titleEn: 'Eid-ul-Adha Day 3', dateStr: '2026-05-29', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-06-26', titleBn: 'পবিত্র আশুরা (১০ই মহররম)', titleEn: 'Ashura', dateStr: '2026-06-26', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-07-16', titleBn: 'জগন্নাথদেবের রথযাত্রা', titleEn: 'Ratha Yatra', dateStr: '2026-07-16', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-08-26', titleBn: 'পবিত্র ঈদে মিলাদুন্নবী (সা.)', titleEn: 'Eid-e-Miladunnabi', dateStr: '2026-08-26', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-08-28', titleBn: 'রাখীবন্ধন (ঝুলন পূর্ণিমা)', titleEn: 'Raksha Bandhan', dateStr: '2026-08-28', region: 'both', category: 'hindu', isHoliday: false, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-09-04', titleBn: 'শ্রীকৃষ্ণের শুভ জন্মাষ্টমী', titleEn: 'Janmashtami', dateStr: '2026-09-04', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-10-10', titleBn: 'মহালয়া', titleEn: 'Mahalaya', dateStr: '2026-10-10', region: 'wb', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-10-17', titleBn: 'শ্রীশ্রী দুর্গাপূজা (মহাসপ্তমী)', titleEn: 'Durga Maha Saptami', dateStr: '2026-10-17', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-10-19', titleBn: 'শ্রীশ্রী দুর্গাপূজা (মহাষ্টমী)', titleEn: 'Durga Maha Ashtami', dateStr: '2026-10-19', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-10-20', titleBn: 'শ্রীশ্রী দুর্গাপূজা (মহানবমী)', titleEn: 'Durga Maha Navami', dateStr: '2026-10-20', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-10-21', titleBn: 'শ্রীশ্রী দুর্গাপূজা (বিজয়া দশমী)', titleEn: 'Vijaya Dashami', dateStr: '2026-10-21', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-10-25', titleBn: 'কোজাগরী লক্ষ্মীপূজা', titleEn: 'Lakshmi Puja', dateStr: '2026-10-25', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-11-08', titleBn: 'শ্যামাপূজা (কালীপূজা) ও দীপাবলি', titleEn: 'Kali Puja & Diwali', dateStr: '2026-11-08', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-11-10', titleBn: 'ভাইফোঁটা (ভ্রাতৃদ্বিতীয়া)', titleEn: 'Bhai Phota / Bhai Dooj', dateStr: '2026-11-10', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-11-15', titleBn: 'ছটপূজা', titleEn: 'Chhath Puja', dateStr: '2026-11-15', region: 'wb', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' },
    { id: '2026-11-18', titleBn: 'শ্রীশ্রী জগদ্ধাত্রী পূজা', titleEn: 'Jagaddhatri Puja', dateStr: '2026-11-18', region: 'wb', category: 'hindu', isHoliday: false, source: HINDU_SOURCE, year: 2026, lastUpdated: '2026-01-01' }
  ],

  // 2027
  2027: [
    { id: '2027-02-12', titleBn: 'সরস্বতী পূজা', titleEn: 'Saraswati Puja', dateStr: '2027-02-12', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2027, lastUpdated: '2026-01-01' },
    { id: '2027-03-10', titleBn: 'পবিত্র ঈদুল ফিতর', titleEn: 'Eid-ul-Fitr', dateStr: '2027-03-10', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2027, lastUpdated: '2026-01-01' },
    { id: '2027-03-22', titleBn: 'দোলযাত্রা ও হোলি', titleEn: 'Doljatra / Holi', dateStr: '2027-03-22', region: 'both', category: 'hindu', isHoliday: true, source: HINDU_SOURCE, year: 2027, lastUpdated: '2026-01-01' },
    { id: '2027-03-26', titleBn: 'গুড ফ্রাইডে', titleEn: 'Good Friday', dateStr: '2027-03-26', region: 'both', category: 'christian', isHoliday: true, source: INTL_SOURCE, year: 2027, lastUpdated: '2026-01-01' },
    { id: '2027-05-17', titleBn: 'পবিত্র ঈদুল আজহা', titleEn: 'Eid-ul-Adha', dateStr: '2027-05-17', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2027, lastUpdated: '2026-01-01' },
    { id: '2027-05-20', titleBn: 'বুদ্ধ পূর্ণিমা', titleEn: 'Buddha Purnima', dateStr: '2027-05-20', region: 'both', category: 'buddhist', isHoliday: true, source: BD_GOVT_SOURCE, year: 2027, lastUpdated: '2026-01-01' },
    { id: '2027-06-16', titleBn: 'পবিত্র আশুরা', titleEn: 'Ashura', dateStr: '2027-06-16', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2027, lastUpdated: '2026-01-01' },
    { id: '2027-08-16', titleBn: 'ঈদে মিলাদুন্নবী (সা.)', titleEn: 'Eid-e-Miladunnabi', dateStr: '2027-08-16', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2027, lastUpdated: '2026-01-01' },
    { id: '2027-10-10', titleBn: 'দুর্গাপূজা (বিজয়া দশমী)', titleEn: 'Vijaya Dashami', dateStr: '2027-10-10', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2027, lastUpdated: '2026-01-01' }
  ],

  // 2028
  2028: [
    { id: '2028-02-27', titleBn: 'পবিত্র ঈদুল ফিতর', titleEn: 'Eid-ul-Fitr', dateStr: '2028-02-27', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2028, lastUpdated: '2026-01-01' },
    { id: '2028-05-05', titleBn: 'পবিত্র ঈদুল আজহা', titleEn: 'Eid-ul-Adha', dateStr: '2028-05-05', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2028, lastUpdated: '2026-01-01' },
    { id: '2028-09-29', titleBn: 'দুর্গাপূজা (বিজয়া দশমী)', titleEn: 'Vijaya Dashami', dateStr: '2028-09-29', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2028, lastUpdated: '2026-01-01' }
  ],

  // 2029
  2029: [
    { id: '2029-02-15', titleBn: 'পবিত্র ঈদুল ফিতর', titleEn: 'Eid-ul-Fitr', dateStr: '2029-02-15', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2029, lastUpdated: '2026-01-01' },
    { id: '2029-04-24', titleBn: 'পবিত্র ঈদুল আজহা', titleEn: 'Eid-ul-Adha', dateStr: '2029-04-24', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2029, lastUpdated: '2026-01-01' },
    { id: '2029-10-18', titleBn: 'দুর্গাপূজা (বিজয়া দশমী)', titleEn: 'Vijaya Dashami', dateStr: '2029-10-18', region: 'both', category: 'bd_govt', isHoliday: true, source: BD_GOVT_SOURCE, year: 2029, lastUpdated: '2026-01-01' }
  ]
};

export class HolidayDatabaseService {
  /**
   * Get all events for a specific Gregorian Date (YYYY-MM-DD)
   */
  public static getEventsForDate(date: Date, region: Region = 'both'): HolidayEvent[] {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const fullDateStr = `${y}-${m}-${d}`;
    const recurringDateStr = `${m}-${d}`;

    const events: HolidayEvent[] = [];

    // 1. Check recurring fixed annual events
    for (const ev of RECURRING_ANNUAL_EVENTS) {
      if (ev.dateStr === recurringDateStr) {
        if (this.matchesRegion(ev.region, region)) {
          events.push({ ...ev, dateStr: fullDateStr });
        }
      }
    }

    // 2. Check year-specific variable catalog
    const yearEvents = YEAR_SPECIFIC_EVENTS[y];
    if (yearEvents) {
      for (const ev of yearEvents) {
        if (ev.dateStr === fullDateStr) {
          if (this.matchesRegion(ev.region, region)) {
            events.push(ev);
          }
        }
      }
    }

    return events;
  }

  /**
   * Filter check for regional match
   */
  public static matchesRegion(eventRegion: 'bd' | 'wb' | 'both' | 'all_india', userRegion: Region): boolean {
    if (userRegion === 'both') return true;
    if (eventRegion === 'both') return true;
    if (userRegion === 'bangladesh' && eventRegion === 'bd') return true;
    if (userRegion === 'west_bengal' && (eventRegion === 'wb' || eventRegion === 'all_india')) return true;
    if (userRegion === 'vedic_india' && (eventRegion === 'wb' || eventRegion === 'all_india')) return true;
    return false;
  }

  /**
   * Get all events for a given year grouped/sorted for the Events View
   */
  public static getEventsForYear(year: number, region: Region = 'both'): HolidayEvent[] {
    const list: HolidayEvent[] = [];

    // Add recurring for this year
    for (const ev of RECURRING_ANNUAL_EVENTS) {
      if (this.matchesRegion(ev.region, region)) {
        list.push({
          ...ev,
          dateStr: `${year}-${ev.dateStr}`,
          year
        });
      }
    }

    // Add year-specific
    const specific = YEAR_SPECIFIC_EVENTS[year];
    if (specific) {
      for (const ev of specific) {
        if (this.matchesRegion(ev.region, region)) {
          list.push(ev);
        }
      }
    }

    // Sort chronologically
    list.sort((a, b) => (a.dateStr || '').localeCompare(b.dateStr || ''));
    return list;
  }
}
