/**
 * @license
 * Sanatan Vedic Astrology Engine for Auspicious Marriage Lagnas (শুভ বিবাহ লগ্ন)
 * and Travel Timing Judgments (যাত্রা শুভ-অশুভ সময়ক্ষণ ও দিকশূল)
 * 
 * Compliant with classical Jyotish Shastra:
 * - Brihat Parashara Hora Shastra (বৃহৎ পরাশর হোরাশাস্ত্ৰ)
 * - Muhurtha Chintamani (মুহূর্ত চিন্তামণি)
 * - Standard Bengali Panjikas: Bisuddha Siddhanta & Benimadhab Sil Panjika (বিশুদ্ধ সিদ্ধান্ত ও বেণীমাধব শীল পঞ্জিকা)
 */

import { toBengaliNumeral } from './bangla-digits';
import { AstronomicalEngine } from './astronomical-engine';
import { BangladeshCalendarEngine } from './bangladesh-calendar';
import { WestBengalCalendarEngine } from './west-bengal-calendar';

export interface VivahaLagnaTime {
  lagnaName: string; // যেমন: 'গোধূলি লগ্ন', 'বৃষ লগ্ন', 'মিথুন লগ্ন', 'সিংহ লগ্ন', 'ধনু লগ্ন', 'কুম্ভ লগ্ন'
  timeRange: string; // যেমন: 'সন্ধ্যা ৫:৪৮ - সন্ধ্যা ৬:১২'
  period: 'গোধূলি' | 'রাত্রি' | 'দিবা';
  quality: 'পরম শুভ' | 'অতি শুভ' | 'শুভ';
  description?: string;
}

export interface VivahaDateItem {
  id: string;
  gregorianDateStr: string; // YYYY-MM-DD
  banglaYear: number;       // যেমন ১৪৩১, ১৪৩২, ১৪৩৩
  banglaMonthIndex: number; // 0 = বৈশাখ, ..., 11 = চৈত্র
  banglaMonthNameBn: string;
  banglaDayBn: string;
  gregorianDateDisplayBn: string;
  weekdayBn: string;
  tithiBn: string;
  nakshatraBn: string;
  isShuklaPaksha: boolean;
  lagnas: VivahaLagnaTime[];
  shastraNotesBn: string;
  source: string;
}

export interface DishaShoolInfo {
  weekdayBn: string;
  forbiddenDirection: string;       // যেমন 'পশ্চিম দিক'
  forbiddenDirectionEn: string;     // 'West'
  remedyBn: string;                 // শাস্ত্রীয় প্রতিকার
  favorableDirections: string[];    // যেমন ['পূর্ব', 'উত্তর', 'দক্ষিণ']
  shastraReference: string;
}

export interface ChoghadiyaItem {
  name: string;                     // 'অমৃত', 'শুভ', 'লাভ', 'চল', 'রোগ', 'উদ্বেগ', 'কাল'
  type: 'auspicious' | 'inauspicious' | 'neutral';
  start: string;
  end: string;
  period: 'দিন' | 'রাত';
  significanceBn: string;           // যাত্রার ক্ষেত্রে তাৎপর্য
}

export interface BaraKalaBelaInfo {
  kalaBela: { start: string; end: string; text: string; partNumber: number };
  baraBela: { start: string; end: string; text: string; partNumber: number };
  kalaRatri: { start: string; end: string; text: string; partNumber: number };
  significanceBn: string;
}

export interface YatraJudgmentResult {
  date: Date;
  weekdayBn: string;
  dishaShool: DishaShoolInfo;
  baraKalaBela: BaraKalaBelaInfo;
  abhijitMuhurtha?: { start: string; end: string; text: string; isApplicable: boolean; note?: string };
  rahuKalam: { start: string; end: string; text: string };
  yamagandam: { start: string; end: string; text: string };
  gulikaKalam: { start: string; end: string; text: string };
  dayChoghadiyas: ChoghadiyaItem[];
  nightChoghadiyas: ChoghadiyaItem[];
  bestTravelWindows: string[];
  forbiddenTravelWindows: string[];
  summaryBn: string;
  travelGuidanceBn: string;
}

// =============================================================================
// ১. দিকশূল ও প্রতিকার সারসংক্ষেপ (Classical Disha Shool Catalog)
// =============================================================================
export const DISHA_SHOOL_RULES: Record<number, DishaShoolInfo> = {
  0: {
    // রবি (Sunday)
    weekdayBn: 'রবিবার',
    forbiddenDirection: 'পশ্চিম দিক (West)',
    forbiddenDirectionEn: 'West',
    remedyBn: 'জরুরি প্রয়োজনে ঘৃত (ঘি) অথবা পান ভক্ষণ করে পশ্চিম মুখে যাত্রা করা বিধেয়।',
    favorableDirections: ['পূর্ব', 'উত্তর', 'দক্ষিণ', 'ঈশান', 'বায়ু'],
    shastraReference: 'মুহূর্তচিন্তামণি ও নারদ সংহিতা: "পশ্চিমে রবি-শুক্রৌ চ..."'
  },
  1: {
    // সোম (Monday)
    weekdayBn: 'সোমবার',
    forbiddenDirection: 'পূর্ব দিক (East)',
    forbiddenDirectionEn: 'East',
    remedyBn: 'দর্পণ (আয়না) দর্শন করে অথবা ক্ষীর/দুগ্ধ বা ঘৃত ভক্ষণ করে যাত্রা শুরু করুন।',
    favorableDirections: ['পশ্চিম', 'উত্তর', 'দক্ষিণ'],
    shastraReference: 'বৃহৎপরাশর সংহিতা: "সোম-শনৌ পূর্বাং দিশং ত্যজেৎ..."'
  },
  2: {
    // মঙ্গল (Tuesday)
    weekdayBn: 'মঙ্গলবার',
    forbiddenDirection: 'উত্তর দিক (North)',
    forbiddenDirectionEn: 'North',
    remedyBn: 'গুড় অথবা রক্তবর্ণ মিষ্টান্ন ভক্ষণ করে শ্রীশ্রী হনুমান স্মরণপূর্বক যাত্রা করুন।',
    favorableDirections: ['দক্ষিণ', 'পূর্ব', 'পশ্চিম'],
    shastraReference: 'মুহূর্তচিন্তামণি: "কুজে বুধে তথোদীচী..."'
  },
  3: {
    // বুধ (Wednesday)
    weekdayBn: 'বুধবার',
    forbiddenDirection: 'উত্তর দিক (North)',
    forbiddenDirectionEn: 'North',
    remedyBn: 'তিল অথবা ধনে মুখে দিয়ে ইষ্টদেব স্মরণ করে উত্তর মুখে যাত্রা করুন।',
    favorableDirections: ['দক্ষিণ', 'পূর্ব', 'পশ্চিম'],
    shastraReference: 'কালপ্রকাশিকা ও সিদ্ধান্তরত্নমালা'
  },
  4: {
    // বৃহস্পতি (Thursday)
    weekdayBn: 'বৃহস্পতিবার',
    forbiddenDirection: 'দক্ষিণ দিক (South)',
    forbiddenDirectionEn: 'South',
    remedyBn: 'দধি (দই) অথবা রাই সরিষা মুখে দিয়ে গুরু স্মরণপূর্বক দক্ষিণ মুখে যাত্রা করুন।',
    favorableDirections: ['উত্তর', 'পূর্ব', 'পশ্চিম'],
    shastraReference: 'মুহূর্তচিন্তামণি: "যম্যাং সুরগুরোর্দিনে..."'
  },
  5: {
    // শুক্র (Friday)
    weekdayBn: 'শুক্রবার',
    forbiddenDirection: 'পশ্চিম দিক (West)',
    forbiddenDirectionEn: 'West',
    remedyBn: 'যব, গম, বার্লি অথবা পায়েস/দুগ্ধজাত খাদ্য গ্রহণ করে যাত্রা প্রশস্ত।',
    favorableDirections: ['পূর্ব', 'উত্তর', 'দক্ষিণ'],
    shastraReference: 'মুহূর্তচিন্তামণি: "পশ্চিমে রবি-শুক্রয়োঃ..."'
  },
  6: {
    // শনি (Saturday)
    weekdayBn: 'শনিবার',
    forbiddenDirection: 'পূর্ব দিক (East)',
    forbiddenDirectionEn: 'East',
    remedyBn: 'আদা, কৃষ্ণতিল অথবা ঘৃত মুখে দিয়ে যাত্রা শুরু করা বিধেয়।',
    favorableDirections: ['পশ্চিম', 'উত্তর', 'দক্ষিণ'],
    shastraReference: 'বৃহৎপরাশর সংহিতা ও জাতকপারিজাত'
  }
};

// =============================================================================
// ২. বারবেলা, কালবেলা ও কালরাত্রির অংশ বিন্যাস (৮ ভাগের অংশ ক্রম)
// =============================================================================
// দিনমান ও রাত্রিমানের ৮ ভাগের কোন অংশে কোনটি পড়ে (১-ভিত্তিক সূচক)
const KALA_BELA_PARTS: Record<number, { kalaBelaPart: number; baraBelaPart: number; kalaRatriPart: number }> = {
  0: { kalaBelaPart: 4, baraBelaPart: 5, kalaRatriPart: 7 }, // রবি
  1: { kalaBelaPart: 2, baraBelaPart: 8, kalaRatriPart: 1 }, // সোম
  2: { kalaBelaPart: 7, baraBelaPart: 2, kalaRatriPart: 4 }, // মঙ্গল
  3: { kalaBelaPart: 5, baraBelaPart: 3, kalaRatriPart: 5 }, // বুধ
  4: { kalaBelaPart: 6, baraBelaPart: 7, kalaRatriPart: 6 }, // বৃহস্পতি
  5: { kalaBelaPart: 3, baraBelaPart: 4, kalaRatriPart: 2 }, // শুক্র
  6: { kalaBelaPart: 1, baraBelaPart: 6, kalaRatriPart: 3 }  // শনি
};

// =============================================================================
// ৩. চৌঘড়িয়ার ক্রমবিন্যাস (Day & Night Choghadiya Sequences)
// =============================================================================
type ChoghadiyaName = 'অমৃত' | 'শুভ' | 'লাভ' | 'চল' | 'রোগ' | 'উদ্বেগ' | 'কাল';

const DAY_CHOGHADIYA_ORDER: Record<number, ChoghadiyaName[]> = {
  0: ['উদ্বেগ', 'চল', 'লাভ', 'অমৃত', 'কাল', 'শুভ', 'রোগ', 'উদ্বেগ'], // রবি
  1: ['অমৃত', 'কাল', 'শুভ', 'রোগ', 'উদ্বেগ', 'চল', 'লাভ', 'অমৃত'], // সোম
  2: ['রোগ', 'উদ্বেগ', 'চল', 'লাভ', 'অমৃত', 'কাল', 'শুভ', 'রোগ'], // মঙ্গল
  3: ['উদ্বেগ', 'লাভ', 'অমৃত', 'কাল', 'শুভ', 'রোগ', 'উদ্বেগ', 'চল'], // বুধ
  4: ['শুভ', 'রোগ', 'উদ্বেগ', 'চল', 'লাভ', 'অমৃত', 'কাল', 'শুভ'], // বৃহস্পতি
  5: ['চল', 'লাভ', 'অমৃত', 'কাল', 'শুভ', 'রোগ', 'উদ্বেগ', 'চল'], // শুক্র
  6: ['কাল', 'শুভ', 'রোগ', 'উদ্বেগ', 'চল', 'লাভ', 'অমৃত', 'কাল']  // শনি
};

const NIGHT_CHOGHADIYA_ORDER: Record<number, ChoghadiyaName[]> = {
  0: ['শুভ', 'অমৃত', 'চল', 'রোগ', 'কাল', 'লাভ', 'উদ্বেগ', 'শুভ'], // রবি
  1: ['চল', 'রোগ', 'কাল', 'লাভ', 'উদ্বেগ', 'শুভ', 'অমৃত', 'চল'], // সোম
  2: ['কাল', 'লাভ', 'উদ্বেগ', 'শুভ', 'অমৃত', 'চল', 'রোগ', 'কাল'], // মঙ্গল
  3: ['লাভ', 'উদ্বেগ', 'শুভ', 'অমৃত', 'চল', 'রোগ', 'কাল', 'লাভ'], // বুধ
  4: ['উদ্বেগ', 'শুভ', 'অমৃত', 'চল', 'রোগ', 'কাল', 'লাভ', 'উদ্বেগ'], // বৃহস্পতি
  5: ['রোগ', 'কাল', 'লাভ', 'উদ্বেগ', 'শুভ', 'অমৃত', 'চল', 'রোগ'], // শুক্র
  6: ['লাভ', 'চল', 'রোগ', 'কাল', 'লাভ', 'উদ্বেগ', 'শুভ', 'অমৃত']  // শনি
};

const CHOGHADIYA_METADATA: Record<ChoghadiyaName, { type: 'auspicious' | 'inauspicious' | 'neutral'; noteBn: string }> = {
  অমৃত: { type: 'auspicious', noteBn: 'সর্বশ্রেষ্ঠ মুহূর্ত: যে কোনো দিকের দূরপাল্লার যাত্রা, মাঙ্গলিক ভ্রমণ ও চুক্তির জন্য পরম শুভ।' },
  শুভ: { type: 'auspicious', noteBn: 'অতি শুভ মুহূর্ত: শুভ যাত্রা, ধর্মীয় দর্শন ও মঙ্গলময় কার্যে শুভ ফল প্রদানকারী।' },
  লাভ: { type: 'auspicious', noteBn: 'লাভদায়ক মুহূর্ত: ব্যবসায়িক ও অর্থনৈতিক উদ্দেশ্যের যাত্রায় বিশেষ ফলদায়ক।' },
  চল: { type: 'neutral', noteBn: 'গতিশীল মুহূর্ত: দ্রুত গমনাগমন, যানবাহন চালনা ও ভ্রমণে নিরাপদ ও প্রশস্ত।' },
  রোগ: { type: 'inauspicious', noteBn: 'অশুভ মুহূর্ত: যাত্রা বর্জনীয়, স্বাস্থ্যহানি বা পথের কষ্ট হতে পারে।' },
  উদ্বেগ: { type: 'inauspicious', noteBn: 'অশুভ মুহূর্ত: মানসিক অশান্তি বা অনিশ্চয়তা সৃষ্টিকারী, যাত্রা পরিহার্য।' },
  কাল: { type: 'inauspicious', noteBn: 'মারাত্মক অশুভ মুহূর্ত: শনি/যম প্রভাবকাল, দূরযাত্রা সর্বতোভাবে বর্জনীয়।' }
};

// =============================================================================
// ৪. শাস্ত্রীয় শুভ বিবাহ লগ্ন ও দিনপঞ্জির তালিকা (Authentic Vivaha Muhurtha Directory)
// ভিত্তিক: বিশুদ্ধ সিদ্ধান্ত ও বেণীমাধব শীল পঞ্জিকা (১৪৩১, ১৪৩২ ও ১৪৩৩ বঙ্গাব্দ)
// =============================================================================
export const AUTHENTIC_VIVAHA_DATES: VivahaDateItem[] = [
  // --- ১৪৩১ বঙ্গাব্দ (2024-2025) ---
  {
    id: 'vivah-1431-01',
    gregorianDateStr: '2024-04-21',
    banglaYear: 1431,
    banglaMonthIndex: 0,
    banglaMonthNameBn: 'বৈশাখ',
    banglaDayBn: '৮',
    gregorianDateDisplayBn: '৮ বৈশাখ ১৪৩১ • ২১ এপ্রিল ২০২৪',
    weekdayBn: 'রবিবার',
    tithiBn: 'শুক্লা ত্রয়োদশী',
    nakshatraBn: 'হস্তা নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:৫৬ - ৬:২০', period: 'গোধূলি', quality: 'পরম শুভ', description: 'সর্বদোষনিবারক গোধূলি শুভক্ষণ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৮:১২ - ১০:০৮', period: 'রাত্রি', quality: 'অতি শুভ', description: 'স্থির লগ্ন, দাম্পত্য সুখদ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ১০:০৯ - ১২:২০', period: 'রাত্রি', quality: 'শুভ', description: 'উভচর লগ্ন, বংশবৃদ্ধিপ্রদ' },
      { lagnaName: 'সিংহ লগ্ন', timeRange: 'রাত ১২:৩৮ - ২:৫২', period: 'রাত্রি', quality: 'অতি শুভ', description: 'রাজযোগ লগ্ন' }
    ],
    shastraNotesBn: 'হস্তা নক্ষত্রে শুক্লা ত্রয়োদশী তিথিযুক্ত প্রশস্ত বিবাহ লগ্ন।',
    source: 'বিশুদ্ধ সিদ্ধান্ত ও বেণীমাধব শীল পঞ্জিকা'
  },
  {
    id: 'vivah-1431-02',
    gregorianDateStr: '2024-04-26',
    banglaYear: 1431,
    banglaMonthIndex: 0,
    banglaMonthNameBn: 'বৈশাখ',
    banglaDayBn: '১৩',
    gregorianDateDisplayBn: '১৩ বৈশাখ ১৪৩১ • ২৬ এপ্রিল ২০২৪',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'কৃষ্ণা তৃতীয়া',
    nakshatraBn: 'অনুরাধা নক্ষত্র',
    isShuklaPaksha: false,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:৫৮ - ৬:২২', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ৯:৪৮ - ১১:৫৯', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'সিংহ লগ্ন', timeRange: 'রাত ১২:১৭ - ২:৩২', period: 'রাত্রি', quality: 'শুভ' }
    ],
    shastraNotesBn: 'অনুরাধা নক্ষত্র মিত্র নক্ষত্র বিধায় বিবাহে দীর্ঘ দাম্পত্য সৌভাগ্যদায়ক।',
    source: 'গুপ্তপ্রেস ও বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },
  {
    id: 'vivah-1431-03',
    gregorianDateStr: '2024-05-19',
    banglaYear: 1431,
    banglaMonthIndex: 1,
    banglaMonthNameBn: 'জ্যৈষ্ঠ',
    banglaDayBn: '৫',
    gregorianDateDisplayBn: '৫ জ্যৈষ্ঠ ১৪৩১ • ১৯ মে ২০২৪',
    weekdayBn: 'রবিবার',
    tithiBn: 'শুক্লা একাদশী',
    nakshatraBn: 'হস্তা নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৬:১০ - ৬:৩৪', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৭:২৩ - ৯:১৯', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'কন্যা লগ্ন', timeRange: 'রাত ১:৪০ - ৩:৫৪', period: 'রাত্রি', quality: 'শুভ' }
    ],
    shastraNotesBn: 'শুক্লা একাদশীতে হস্তা নক্ষত্রযোগে মহালগ্ন বিবাহ।',
    source: 'বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },
  {
    id: 'vivah-1431-04',
    gregorianDateStr: '2024-06-23',
    banglaYear: 1431,
    banglaMonthIndex: 2,
    banglaMonthNameBn: 'আষাঢ়',
    banglaDayBn: '৯',
    gregorianDateDisplayBn: '৯ আষাঢ় ১৪৩১ • ২৩ জুন ২০২৪',
    weekdayBn: 'রবিবার',
    tithiBn: 'কৃষ্ণা দ্বিতীয়া',
    nakshatraBn: 'উত্তরাষাঢ়া নক্ষত্র',
    isShuklaPaksha: false,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৬:২৪ - ৬:৪৮', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'সিংহ লগ্ন', timeRange: 'রাত ১০:২৯ - ১২:৪৬', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'ধনু লগ্ন', timeRange: 'রাত ৫:০২ - ৭:০৫', period: 'রাত্রি', quality: 'শুভ' }
    ],
    shastraNotesBn: 'হরিশয়নের পূর্ববর্তী আষাঢ় মাসের শুভ বিবাহ লগ্ন।',
    source: 'বেণীমাধব শীল পঞ্জিকা'
  },
  {
    id: 'vivah-1431-05',
    gregorianDateStr: '2024-11-22',
    banglaYear: 1431,
    banglaMonthIndex: 7,
    banglaMonthNameBn: 'অগ্রহায়ণ',
    banglaDayBn: '৭',
    gregorianDateDisplayBn: '৭ অগ্রহায়ণ ১৪৩১ • ২২ নভেম্বর ২০২৪',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'কৃষ্ণা সপ্তমী',
    nakshatraBn: 'মঘা নক্ষত্র',
    isShuklaPaksha: false,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:০২ - ৫:২৬', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'কুম্ভ লগ্ন', timeRange: 'সন্ধ্যা ৫:২৭ - ৭:০২', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ১০:৪৮ - ১২:৪৫', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: 'দেবউত্থানের পর অগ্রহায়ণ মাসের অতি পবিত্র বিবাহ লগ্ন।',
    source: 'বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },
  {
    id: 'vivah-1431-06',
    gregorianDateStr: '2024-11-28',
    banglaYear: 1431,
    banglaMonthIndex: 7,
    banglaMonthNameBn: 'অগ্রহায়ণ',
    banglaDayBn: '১৩',
    gregorianDateDisplayBn: '১৩ অগ্রহায়ণ ১৪৩১ • ২৮ নভেম্বর ২০২৪',
    weekdayBn: 'বৃহস্পতিবার',
    tithiBn: 'কৃষ্ণা ত্রয়োদশী',
    nakshatraBn: 'স্বাতী নক্ষত্র',
    isShuklaPaksha: false,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:০২ - ৫:২৬', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'মীন লগ্ন', timeRange: 'সন্ধ্যা ৭:০১ - ৮:৩২', period: 'রাত্রি', quality: 'শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ১০:২৪ - ১২:২১', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ১২:২২ - ২:৩৩', period: 'রাত্রি', quality: 'শুভ' }
    ],
    shastraNotesBn: 'স্বাতী নক্ষত্রে সর্বদোষমুক্ত বিবাহ লগ্ন।',
    source: 'বেণীমাধব শীল পঞ্জিকা'
  },
  {
    id: 'vivah-1431-07',
    gregorianDateStr: '2025-01-23',
    banglaYear: 1431,
    banglaMonthIndex: 9,
    banglaMonthNameBn: 'মাঘ',
    banglaDayBn: '৯',
    gregorianDateDisplayBn: '৯ মাঘ ১৪৩১ • ২৩ জানুয়ারি ২০২৫',
    weekdayBn: 'বৃহস্পতিবার',
    tithiBn: 'কৃষ্ণা দশমী',
    nakshatraBn: 'অনুরাধা নক্ষত্র',
    isShuklaPaksha: false,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:২৪ - ৫:৪৮', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'মেষ লগ্ন', timeRange: 'সন্ধ্যা ৭:১৮ - ৮:৫৭', period: 'রাত্রি', quality: 'শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৮:৫৮ - ১০:৫৫', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ১০:৫৬ - ১:০৭', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: 'মাঘ মাসের পবিত্র অনুরাধা নক্ষত্রে মহালগ্ন।',
    source: 'বিশুদ্ধ সিদ্ধান্ত ও গুপ্তপ্রেস পঞ্জিকা'
  },
  {
    id: 'vivah-1431-08',
    gregorianDateStr: '2025-02-14',
    banglaYear: 1431,
    banglaMonthIndex: 10,
    banglaMonthNameBn: 'ফাল্গুন',
    banglaDayBn: '২',
    gregorianDateDisplayBn: '২ ফাল্গুন ১৪৩১ • ১৪ ফেব্রুয়ারি ২০২৫',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'কৃষ্ণা দ্বিতীয়া',
    nakshatraBn: 'মঘানক্ষত্র',
    isShuklaPaksha: false,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:৩৮ - ৬:০২', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৭:৩১ - ৯:২৮', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ৯:২৯ - ১১:৪০', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'কর্কট লগ্ন', timeRange: 'রাত ১১:৪১ - ১:৫৬', period: 'রাত্রি', quality: 'শুভ' }
    ],
    shastraNotesBn: 'বসন্তের ফাল্গুন মাসে সৌভাগ্যদায়ক বিবাহ লগ্ন।',
    source: 'বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },

  // --- ১৪৩২ বঙ্গাব্দ (2025-2026) ---
  {
    id: 'vivah-1432-01',
    gregorianDateStr: '2025-04-20',
    banglaYear: 1432,
    banglaMonthIndex: 0,
    banglaMonthNameBn: 'বৈশাখ',
    banglaDayBn: '৭',
    gregorianDateDisplayBn: '৭ বৈশাখ ১৪৩২ • ২০ এপ্রিল ২০২৫',
    weekdayBn: 'রবিবার',
    tithiBn: 'কৃষ্ণা অষ্টমী অন্তে নবমী বর্জনীয়, পূর্বাহ্নে সপ্তমীযুক্ত লগ্ন',
    nakshatraBn: 'উত্তরাষাঢ়া নক্ষত্র',
    isShuklaPaksha: false,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:৫৫ - ৬:১৯', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৮:০৫ - ১০:০২', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'সিংহ লগ্ন', timeRange: 'রাত ১২:৩২ - ২:৪৭', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: '১৪৩২ বঙ্গাব্দের বৈশাখ মাসের প্রথম শুভ বিবাহ লগ্ন।',
    source: 'বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },
  {
    id: 'vivah-1432-02',
    gregorianDateStr: '2025-05-09',
    banglaYear: 1432,
    banglaMonthIndex: 0,
    banglaMonthNameBn: 'বৈশাখ',
    banglaDayBn: '২৫',
    gregorianDateDisplayBn: '২৫ বৈশাখ ১৪৩২ • ৯ মে ২০২৫',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'শুক্লা দ্বাদশী',
    nakshatraBn: 'হস্তা নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৬:০৩ - ৬:২৭', period: 'গোধূলি', quality: 'পরম শুভ', description: 'সর্বদোষহর মুহূর্ত' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ৮:৫২ - ১১:০৪', period: 'রাত্রি', quality: 'অতি শুভ', description: 'দামোদর যোগ' },
      { lagnaName: 'সিংহ লগ্ন', timeRange: 'রাত ১:১৯ - ৩:৩৩', period: 'রাত্রি', quality: 'অতি শুভ', description: 'স্থির ও রাজলক্ষণযুক্ত' }
    ],
    shastraNotesBn: 'শুক্লপক্ষের দ্বাদশী তিথিতে হস্তা নক্ষত্রে বিবাহ পরম সৌভাগ্য এনে দেয়।',
    source: 'বেণীমাধব শীল পঞ্জিকা'
  },
  {
    id: 'vivah-1432-03',
    gregorianDateStr: '2025-05-18',
    banglaYear: 1432,
    banglaMonthIndex: 1,
    banglaMonthNameBn: 'জ্যৈষ্ঠ',
    banglaDayBn: '৪',
    gregorianDateDisplayBn: '৪ জ্যৈষ্ঠ ১৪৩২ • ১৮ মে ২০২৫',
    weekdayBn: 'রবিবার',
    tithiBn: 'কৃষ্ণা ষষ্ঠী',
    nakshatraBn: 'শ্রবণা নক্ষত্র',
    isShuklaPaksha: false,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৬:০৯ - ৬:৩৩', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৭:২৭ - ৯:২৪', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'কন্যা লগ্ন', timeRange: 'রাত ১:৪৪ - ৩:৫৮', period: 'রাত্রি', quality: 'শুভ' }
    ],
    shastraNotesBn: 'শ্রবণা নক্ষত্রে জ্যৈষ্ঠ মাসের শুভ বিবাহ দিন।',
    source: 'বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },
  {
    id: 'vivah-1432-04',
    gregorianDateStr: '2025-06-06',
    banglaYear: 1432,
    banglaMonthIndex: 1,
    banglaMonthNameBn: 'জ্যৈষ্ঠ',
    banglaDayBn: '২৩',
    gregorianDateDisplayBn: '২৩ জ্যৈষ্ঠ ১৪৩২ • ৬ জুন ২০২৫',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'শুক্লা একাদশী',
    nakshatraBn: 'চিত্রা নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৬:১৮ - ৬:৪২', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'সিংহ লগ্ন', timeRange: 'রাত ১১:৩৫ - ১:৪৯', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'তুলা লগ্ন', timeRange: 'রাত ৩:৫৭ - ৬:১০', period: 'রাত্রি', quality: 'শুভ' }
    ],
    shastraNotesBn: 'শুক্লা নির্জলা একাদশী সংলগ্ন পবিত্র চিত্রা নক্ষত্রে বিবাহ।',
    source: 'গুপ্তপ্রেস ও বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },
  {
    id: 'vivah-1432-05',
    gregorianDateStr: '2025-06-25',
    banglaYear: 1432,
    banglaMonthIndex: 2,
    banglaMonthNameBn: 'আষাঢ়',
    banglaDayBn: '১০',
    gregorianDateDisplayBn: '১০ আষাঢ় ১৪৩২ • ২৫ জুন ২০২৫',
    weekdayBn: 'বুধবার',
    tithiBn: 'শুক্লা অমাবস্যা বর্জিত, শুক্লা দ্বিতীয়া',
    nakshatraBn: 'পুনর্বসু নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৬:২৪ - ৬:৪৮', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'কন্যা লগ্ন', timeRange: 'রাত ১২:৫২ - ৩:০৬', period: 'রাত্রি', quality: 'শুভ' },
      { lagnaName: 'ধনু লগ্ন', timeRange: 'রাত ৫:০৫ - ৭:০৯', period: 'রাত্রি', quality: 'শুভ' }
    ],
    shastraNotesBn: 'চাতুর্মাস্য হরিশয়নের পূর্বে আষাঢ় মাসের সর্বশেষ বিবাহ লগ্ন। এর পর শ্রাবণ-ভাদ্র-আশ্বিনে বিবাহ বন্ধ থাকে।',
    source: 'বেণীমাধব শীল পঞ্জিকা'
  },
  {
    id: 'vivah-1432-06',
    gregorianDateStr: '2025-11-21',
    banglaYear: 1432,
    banglaMonthIndex: 7,
    banglaMonthNameBn: 'অগ্রহায়ণ',
    banglaDayBn: '৫',
    gregorianDateDisplayBn: '৫ অগ্রহায়ণ ১৪৩২ • ২১ নভেম্বর ২০২৫',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'শুক্লা প্রতিপদ অন্তে দ্বিতীয়া',
    nakshatraBn: 'অনুরাধা নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:০১ - ৫:২৫', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'কুম্ভ লগ্ন', timeRange: 'সন্ধ্যা ৫:২৬ - ৭:০১', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ১০:৪৭ - ১২:৪৪', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: 'দেবউত্থানী একাদশীর পর অগ্রহায়ণ মাসের প্রথম শুভ বিবাহ লগ্ন।',
    source: 'বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },
  {
    id: 'vivah-1432-07',
    gregorianDateStr: '2025-12-05',
    banglaYear: 1432,
    banglaMonthIndex: 7,
    banglaMonthNameBn: 'অগ্রহায়ণ',
    banglaDayBn: '১৯',
    gregorianDateDisplayBn: '১৯ অগ্রহায়ণ ১৪৩২ • ৫ ডিসেম্বর ২০২৫',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'কৃষ্ণা প্রতিপদ অন্তে দ্বিতীয়া',
    nakshatraBn: 'রোহিণী নক্ষত্র',
    isShuklaPaksha: false,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:০৩ - ৫:২৭', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'মীন লগ্ন', timeRange: 'সন্ধ্যা ৬:৩৪ - ৮:০৫', period: 'রাত্রি', quality: 'শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৯:৫২ - ১১:৪৯', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ১১:৫০ - ২:০১', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: 'রোহিণী নক্ষত্র চন্দ্রের পরম প্রিয় নক্ষত্র, দাম্পত্যে অমৃতসম প্রেম ও শান্তি প্রদায়ক।',
    source: 'বেণীমাধব শীল পঞ্জিকা'
  },
  {
    id: 'vivah-1432-08',
    gregorianDateStr: '2026-01-28',
    banglaYear: 1432,
    banglaMonthIndex: 9,
    banglaMonthNameBn: 'মাঘ',
    banglaDayBn: '১৪',
    gregorianDateDisplayBn: '১৪ মাঘ ১৪৩২ • ২৮ জানুয়ারি ২০২৬',
    weekdayBn: 'বুধবার',
    tithiBn: 'শুক্লা দশমী',
    nakshatraBn: 'রোহিণী নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:২৭ - ৫:৫১', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'মেষ লগ্ন', timeRange: 'সন্ধ্যা ৬:৫৯ - ৮:৩৮', period: 'রাত্রি', quality: 'শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৮:৩৯ - ১০:৩৬', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ১০:৩৭ - ১২:৪৮', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: 'মাঘ মাসের শুক্লা দশমীতে রোহিণী নক্ষত্রের পরম পবিত্র মহালগ্ন।',
    source: 'বিশুদ্ধ সিদ্ধান্ত ও গুপ্তপ্রেস পঞ্জিকা'
  },
  {
    id: 'vivah-1432-09',
    gregorianDateStr: '2026-02-18',
    banglaYear: 1432,
    banglaMonthIndex: 10,
    banglaMonthNameBn: 'ফাল্গুন',
    banglaDayBn: '৬',
    gregorianDateDisplayBn: '৬ ফাল্গুন ১৪৩২ • ১৮ ফেব্রুয়ারি ২০২৬',
    weekdayBn: 'বুধবার',
    tithiBn: 'শুক্লা তৃতীয়া',
    nakshatraBn: 'উত্তরাভাদ্রপদ নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:৪০ - ৬:০৪', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৭:১৬ - ৯:১৩', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ৯:১৪ - ১১:২৫', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'সিংহ লগ্ন', timeRange: 'রাত ১:৪২ - ৩:৫৬', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: 'বসন্তের ফাল্গুন মাসের শুভ শুক্লা তৃতীয়া তিথিতে বিবাহ লগ্ন।',
    source: 'বেণীমাধব শীল পঞ্জিকা'
  },

  // --- ১৪৩৩ বঙ্গাব্দ (2026-2027) ---
  {
    id: 'vivah-1433-01',
    gregorianDateStr: '2026-04-26',
    banglaYear: 1433,
    banglaMonthIndex: 0,
    banglaMonthNameBn: 'বৈশাখ',
    banglaDayBn: '১৩',
    gregorianDateDisplayBn: '১৩ বৈশাখ ১৪৩৩ • ২৬ এপ্রিল ২০২৬',
    weekdayBn: 'রবিবার',
    tithiBn: 'শুক্লা দশমী',
    nakshatraBn: 'মঘা নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:৫৮ - ৬:২২', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৭:৫২ - ৯:৪৯', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ৯:৫০ - ১২:০১', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'সিংহ লগ্ন', timeRange: 'রাত ১২:১৯ - ২:৩৪', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: '১৪৩৩ বঙ্গাব্দের বৈশাখ মাসের প্রধান মহালগ্ন।',
    source: 'বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },
  {
    id: 'vivah-1433-02',
    gregorianDateStr: '2026-05-08',
    banglaYear: 1433,
    banglaMonthIndex: 0,
    banglaMonthNameBn: 'বৈশাখ',
    banglaDayBn: '২৫',
    gregorianDateDisplayBn: '২৫ বৈশাখ ১৪৩৩ • ৮ মে ২০২৬',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'কৃষ্ণা সপ্তমী',
    nakshatraBn: 'শ্রবণা নক্ষত্র',
    isShuklaPaksha: false,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৬:০৩ - ৬:২৭', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ৯:০৫ - ১১:১৬', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'সিংহ লগ্ন', timeRange: 'রাত ১:৩৪ - ৩:৪৮', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: 'শ্রবণা নক্ষত্রে বিবাহে দাম্পত্য জীবনে পারস্পরিক শ্রদ্ধা ও দীর্ঘায়ু লাভ হয়।',
    source: 'গুপ্তপ্রেস ও বেণীমাধব শীল পঞ্জিকা'
  },
  {
    id: 'vivah-1433-03',
    gregorianDateStr: '2026-05-24',
    banglaYear: 1433,
    banglaMonthIndex: 1,
    banglaMonthNameBn: 'জ্যৈষ্ঠ',
    banglaDayBn: '১০',
    gregorianDateDisplayBn: '১০ জ্যৈষ্ঠ ১৪৩৩ • ২৪ মে ২০২৬',
    weekdayBn: 'রবিবার',
    tithiBn: 'শুক্লা নবমী বর্জনীয়, দশমী যুক্ত লগ্ন',
    nakshatraBn: 'উত্তরফল্গুনী নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৬:১২ - ৬:৩৬', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৭:০৫ - ৯:০২', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'সিংহ লগ্ন', timeRange: 'রাত ১২:৩২ - ২:৪৬', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: 'উত্তরফল্গুনী নক্ষত্র সূর্যের স্বক্ষেত্র, বিবাহে প্রতিষ্ঠা ও ধনধান্য বৃদ্ধি করে।',
    source: 'বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },
  {
    id: 'vivah-1433-04',
    gregorianDateStr: '2026-06-19',
    banglaYear: 1433,
    banglaMonthIndex: 2,
    banglaMonthNameBn: 'আষাঢ়',
    banglaDayBn: '৫',
    gregorianDateDisplayBn: '৫ আষাঢ় ১৪৩৩ • ১৯ জুন ২০২৬',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'শুক্লা পঞ্চমী',
    nakshatraBn: 'মঘানক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৬:২৩ - ৬:৪৭', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'সিংহ লগ্ন', timeRange: 'রাত ১০:৪৮ - ১:০২', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'ধনু লগ্ন', timeRange: 'রাত ৫:২২ - ৭:২৫', period: 'রাত্রি', quality: 'শুভ' }
    ],
    shastraNotesBn: 'আষাঢ় মাসের শুক্লা পঞ্চমীতে হরিশয়নের পূর্ববর্তী বিবাহ লগ্ন।',
    source: 'বেণীমাধব শীল পঞ্জিকা'
  },
  {
    id: 'vivah-1433-05',
    gregorianDateStr: '2026-11-20',
    banglaYear: 1433,
    banglaMonthIndex: 7,
    banglaMonthNameBn: 'অগ্রহায়ণ',
    banglaDayBn: '৪',
    gregorianDateDisplayBn: '৪ অগ্রহায়ণ ১৪৩৩ • ২০ নভেম্বর ২০২৬',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'শুক্লা দ্বাদশী',
    nakshatraBn: 'রেবতী নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:০১ - ৫:২৫', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'কুম্ভ লগ্ন', timeRange: 'সন্ধ্যা ৫:২৬ - ৭:০১', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ১০:৫৩ - ১২:৫০', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: 'চাতুর্মাস্যের সমাপ্তি ও অগ্রহায়ণ মাসের সূচনায় রেবতী নক্ষত্রে মহা শুভযোগ।',
    source: 'বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },
  {
    id: 'vivah-1433-06',
    gregorianDateStr: '2026-11-27',
    banglaYear: 1433,
    banglaMonthIndex: 7,
    banglaMonthNameBn: 'অগ্রহায়ণ',
    banglaDayBn: '১১',
    gregorianDateDisplayBn: '১১ অগ্রহায়ণ ১৪৩৩ • ২৭ নভেম্বর ২০২৬',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'কৃষ্ণা তৃতীয়া',
    nakshatraBn: 'পুনর্বসু নক্ষত্র',
    isShuklaPaksha: false,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:০২ - ৫:২৬', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'মীন লগ্ন', timeRange: 'সন্ধ্যা ৭:০২ - ৮:৩৩', period: 'রাত্রি', quality: 'শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ১০:২৬ - ১২:২৩', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: 'অগ্রহায়ণ মাসের পুনর্মিলনপ্রদ পুনর্বসু নক্ষত্রে বিবাহ।',
    source: 'বেণীমাধব শীল পঞ্জিকা'
  },
  {
    id: 'vivah-1433-07',
    gregorianDateStr: '2027-01-22',
    banglaYear: 1433,
    banglaMonthIndex: 9,
    banglaMonthNameBn: 'মাঘ',
    banglaDayBn: '৮',
    gregorianDateDisplayBn: '৮ মাঘ ১৪৩৩ • ২২ জানুয়ারি ২০২৭',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'শুক্লা পূর্ণিমা পূর্বাহ্নে, ত্রয়োদশী/চতুর্দশী বর্জিত লগ্ন',
    nakshatraBn: 'পুষ্যা অন্তে অশ্লেষা বর্জিত, পুনর্বসু যুক্ত',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:২৩ - ৫:৪৭', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৯:০২ - ১০:৫৯', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ১১:০০ - ১:১১', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: '১৪৩৩ বঙ্গাব্দের মাঘ মাসের বিবাহ লগ্ন।',
    source: 'বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা'
  },
  {
    id: 'vivah-1433-08',
    gregorianDateStr: '2027-02-12',
    banglaYear: 1433,
    banglaMonthIndex: 10,
    banglaMonthNameBn: 'ফাল্গুন',
    banglaDayBn: '২৯',
    gregorianDateDisplayBn: '২৯ মাঘ / ১ ফাল্গুন ১৪৩৩ • ১২ ফেব্রুয়ারি ২০২৭',
    weekdayBn: 'শুক্রবার',
    tithiBn: 'শুক্লা সপ্তমী',
    nakshatraBn: 'রোহিণী নক্ষত্র',
    isShuklaPaksha: true,
    lagnas: [
      { lagnaName: 'গোধূলি লগ্ন', timeRange: 'সন্ধ্যা ৫:৩৬ - ৬:০০', period: 'গোধূলি', quality: 'পরম শুভ' },
      { lagnaName: 'বৃষ লগ্ন', timeRange: 'রাত ৭:৩৯ - ৯:৩৬', period: 'রাত্রি', quality: 'অতি শুভ' },
      { lagnaName: 'মিথুন লগ্ন', timeRange: 'রাত ৯:৩৭ - ১১:৪৮', period: 'রাত্রি', quality: 'অতি শুভ' }
    ],
    shastraNotesBn: 'শুক্লা সপ্তমীতে রোহিণী নক্ষত্রযোগে রাজলক্ষণ বিবাহ।',
    source: 'বেণীমাধব শীল ও গুপ্তপ্রেস পঞ্জিকা'
  }
];

// =============================================================================
// ৫. VivahaYatraEngine ক্লাস (প্রধান জ্যোতিষ শাস্ত্রীয় হিসাব ও লজিক)
// =============================================================================
export class VivahaYatraEngine {
  /**
   * নির্দিষ্ট দিনের বিবাহ লগ্ন বিচার
   * @param date Gregorian Date
   * @param cityId City identifier for local sunset/sunrise
   */
  public static getVivahaMuhurthaForDate(
    date: Date,
    cityId: string = 'dhaka',
    customCoords?: { lat: number; lng: number; label: string; tzOffset?: number }
  ): {
    hasVivahaLagna: boolean;
    vivahaItem?: VivahaDateItem;
    godhuliLagnaRange: string;
    shastraEvaluationBn: string;
    reasonsIfNotBn?: string[];
  } {
    const dateStr = date.toISOString().slice(0, 10);
    const existing = AUTHENTIC_VIVAHA_DATES.find((d) => d.gregorianDateStr === dateStr);

    // Calculate local Godhuli Lagna from true sunset (Sunset -12 min to Sunset +12 min)
    const sunTimes = AstronomicalEngine.getSunRiseSet(
      date,
      customCoords?.lat || (cityId === 'kolkata' ? 22.5726 : 23.8103),
      customCoords?.lng || (cityId === 'kolkata' ? 88.3639 : 90.4125),
      customCoords?.tzOffset !== undefined ? customCoords.tzOffset : (cityId === 'kolkata' ? 5.5 : 6.0)
    );

    const sunsetMin = sunTimes.sunsetMinutes;
    const godhuliStartMin = sunsetMin - 12;
    const godhuliEndMin = sunsetMin + 12;
    const gStartH = Math.floor(godhuliStartMin / 60);
    const gStartM = Math.floor(godhuliStartMin % 60);
    const gEndH = Math.floor(godhuliEndMin / 60);
    const gEndM = Math.floor(godhuliEndMin % 60);

    const formatGodhuliTime = (h: number, m: number) => {
      const p = h >= 12 ? 'সন্ধ্যা' : 'সকাল';
      const dH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return `${p} ${toBengaliNumeral(dH)}:${toBengaliNumeral(m.toString().padStart(2, '0'))}`;
    };

    const godhuliLagnaRange = `${formatGodhuliTime(gStartH, gStartM)} থেকে ${formatGodhuliTime(gEndH, gEndM)}`;

    if (existing) {
      return {
        hasVivahaLagna: true,
        vivahaItem: existing,
        godhuliLagnaRange,
        shastraEvaluationBn: `আজ শাস্ত্রসম্মত শুভ বিবাহ দিন। পঞ্জিকানুযায়ী তিথি: ${existing.tithiBn}, নক্ষত্র: ${existing.nakshatraBn}। উপস্থিত লগ্ন: ${existing.lagnas.map(l => l.lagnaName).join(', ')}।`
      };
    }

    // জ্যোতিষীয় নিষিদ্ধ কাল ও বাধার বিশ্লেষণ (Shastra prohibited conditions)
    const panjika = AstronomicalEngine.getFullPanjika(date, cityId, customCoords);
    const bdDate = BangladeshCalendarEngine.fromGregorian(date);
    const reasons: string[] = [];

    // ১. নিষিদ্ধ মাস (পৌষ ও চৈত্র মাস)
    if (bdDate.monthIndex === 8) {
      reasons.push('পৌষ মাস (মলমাস তুল্য খর মাস হওয়ায় শাস্ত্রে বিবাহ কঠোরভাবে নিষিদ্ধ)');
    } else if (bdDate.monthIndex === 11) {
      reasons.push('চৈত্র মাস (সংক্রান্তি ও মিন রাশিস্থিত সূর্য বিধায় বিবাহ নিষিদ্ধ)');
    } else if (bdDate.monthIndex === 3 || bdDate.monthIndex === 4) {
      // শ্রাবণ ও ভাদ্র চাতুর্মাস্য শয়নকাল
      reasons.push('চাতুর্মাস্য হরিশয়ন কাল (শ্রাবণ ও ভাদ্র মাসে শ্রীবিষ্ণু নিদ্রিত থাকায় বিবাহ বর্জিত)');
    } else if (bdDate.monthIndex === 5) {
      reasons.push('আশ্বিন মাস (পিতৃপক্ষ ও দুর্গাপূজার কাল হওয়ায় সাধারণত বৈদিক বিবাহ লগ্ন হয় না)');
    }

    // ২. রিক্তা তিথি ও অমাবস্যা-পূর্ণিমা
    if (panjika.tithi.includes('চতুর্থী') || panjika.tithi.includes('নবমী') || panjika.tithi.includes('চতুর্দশী')) {
      reasons.push(`রিক্তা তিথি (${panjika.tithi} শাস্ত্রে শুভ বিবাহ ও মাঙ্গলিক কার্যে নিষিদ্ধ)`);
    } else if (panjika.isAmavasya) {
      reasons.push('অমাবস্যা তিথি (পিতৃতর্পণ তিথি, বিবাহ বর্জনীয়)');
    } else if (panjika.isPurnima) {
      reasons.push('পূর্ণিমা তিথি (ব্রত ও দেবকার্য তিথি, স্বতন্ত্র বিবাহ লগ্ন বর্জিত)');
    }

    // ৩. ভদ্রা বা বিষ্টি করণ
    if (panjika.karana.includes('বিষ্টি') || panjika.karana.includes('ভদ্রা')) {
      reasons.push('ভদ্রা/বিষ্টি করণ উপস্থিত (ভদ্রাকালে শুভ মাঙ্গলিক কাজ বর্জনীয়)');
    }

    if (reasons.length === 0) {
      reasons.push('আজকের তিথি, নক্ষত্র ও লগ্নশুদ্ধির সমন্বয়ে বিশুদ্ধ সিদ্ধান্ত বা বেণীমাধব শীল পঞ্জিকায় নির্দিষ্ট সার্বজনীন বিবাহ লগ্ন নির্ধারিত নেই।');
    }

    return {
      hasVivahaLagna: false,
      godhuliLagnaRange,
      shastraEvaluationBn: 'আজ সনাতন পঞ্জিকানুযায়ী সার্বজনীন শুভ বিবাহ লগ্ন নেই।',
      reasonsIfNotBn: reasons
    };
  }

  /**
   * সমস্ত তালিকাভুক্ত শুভ বিবাহ লগ্নের তালিকা আহরণ (ফিল্টারিং সুবিধাসহ)
   */
  public static getAllVivahaDates(filterYear?: number, filterMonthIndex?: number): VivahaDateItem[] {
    return AUTHENTIC_VIVAHA_DATES.filter((item) => {
      if (filterYear !== undefined && item.banglaYear !== filterYear) return false;
      if (filterMonthIndex !== undefined && item.banglaMonthIndex !== filterMonthIndex) return false;
      return true;
    });
  }

  private static vivahaDateSet: Set<string> | null = null;

  /**
   * দ্রুত যাচাই করে দিনটিতে স্বীকৃত বিবাহ লগ্ন আছে কি না
   */
  public static isVivahaDate(dateOrStr: Date | string): boolean {
    if (!this.vivahaDateSet) {
      this.vivahaDateSet = new Set(AUTHENTIC_VIVAHA_DATES.map((d) => d.gregorianDateStr));
    }
    const str = typeof dateOrStr === 'string' ? dateOrStr : dateOrStr.toISOString().slice(0, 10);
    return this.vivahaDateSet.has(str);
  }

  /**
   * সম্পূর্ণ জ্যোতিষীয় যাত্রা বিচার ও দিকশূল নিরূপণ (Comprehensive Yatra Muhurtha)
   * @param date Gregorian Date
   * @param cityId City identifier
   */
  public static getYatraJudgment(
    date: Date,
    cityId: string = 'dhaka',
    customCoords?: { lat: number; lng: number; label: string; tzOffset?: number }
  ): YatraJudgmentResult {
    const weekday = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const dishaShool = DISHA_SHOOL_RULES[weekday];

    // Get true local sunrise and sunset
    const lat = customCoords?.lat || (cityId === 'kolkata' ? 22.5726 : 23.8103);
    const lng = customCoords?.lng || (cityId === 'kolkata' ? 88.3639 : 90.4125);
    const tz = customCoords?.tzOffset !== undefined ? customCoords.tzOffset : (cityId === 'kolkata' ? 5.5 : 6.0);

    const sunTimes = AstronomicalEngine.getSunRiseSet(date, lat, lng, tz);
    const sunriseMin = sunTimes.sunriseMinutes;
    const sunsetMin = sunTimes.sunsetMinutes;

    // Day length & 8-part division
    const dayLengthMin = (sunsetMin - sunriseMin + 1440) % 1440;
    const dayPartMin = dayLengthMin / 8;

    // Night length & 8-part division
    const nightLengthMin = 1440 - dayLengthMin;
    const nightPartMin = nightLengthMin / 8;

    // Time formatting helper
    const formatMin = (mins: number) => {
      const normalized = (mins + 1440) % 1440;
      const h = Math.floor(normalized / 60);
      const m = Math.floor(normalized % 60);
      const p = h >= 12 ? (h >= 17 ? 'সন্ধ্যা' : h >= 14 ? 'বিকাল' : 'দুপুর') : (h >= 6 ? 'সকাল' : 'রাত');
      const dH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return `${p} ${toBengaliNumeral(dH)}:${toBengaliNumeral(m.toString().padStart(2, '0'))}`;
    };

    // ১. কালবেলা, বারবেলা ও কালরাত্রি হিসাব
    const kalaConfig = KALA_BELA_PARTS[weekday];
    const kbStartMin = sunriseMin + (kalaConfig.kalaBelaPart - 1) * dayPartMin;
    const kbEndMin = kbStartMin + dayPartMin;

    const bbStartMin = sunriseMin + (kalaConfig.baraBelaPart - 1) * dayPartMin;
    const bbEndMin = bbStartMin + dayPartMin;

    const krStartMin = sunsetMin + (kalaConfig.kalaRatriPart - 1) * nightPartMin;
    const krEndMin = krStartMin + nightPartMin;

    const baraKalaBela: BaraKalaBelaInfo = {
      kalaBela: {
        start: formatMin(kbStartMin),
        end: formatMin(kbEndMin),
        text: `${formatMin(kbStartMin)} থেকে ${formatMin(kbEndMin)}`,
        partNumber: kalaConfig.kalaBelaPart
      },
      baraBela: {
        start: formatMin(bbStartMin),
        end: formatMin(bbEndMin),
        text: `${formatMin(bbStartMin)} থেকে ${formatMin(bbEndMin)}`,
        partNumber: kalaConfig.baraBelaPart
      },
      kalaRatri: {
        start: formatMin(krStartMin),
        end: formatMin(krEndMin),
        text: `${formatMin(krStartMin)} থেকে ${formatMin(krEndMin)}`,
        partNumber: kalaConfig.kalaRatriPart
      },
      significanceBn: 'কালবেলা ও বারবেলায় যে কোনো প্রকার যাত্রা, যানবাহন চালনার শুভ সূচনা এবং চুক্তিকর্ম বর্জনীয়।'
    };

    // ২. দিবা ও রাত্রি চৌঘড়িয়া মুহূর্ত গণনা (Day & Night Choghadiyas)
    const dayOrder = DAY_CHOGHADIYA_ORDER[weekday];
    const nightOrder = NIGHT_CHOGHADIYA_ORDER[weekday];

    const dayChoghadiyas: ChoghadiyaItem[] = dayOrder.map((name, idx) => {
      const sMin = sunriseMin + idx * dayPartMin;
      const eMin = sMin + dayPartMin;
      const meta = CHOGHADIYA_METADATA[name];
      return {
        name,
        type: meta.type,
        start: formatMin(sMin),
        end: formatMin(eMin),
        period: 'দিন',
        significanceBn: meta.noteBn
      };
    });

    const nightChoghadiyas: ChoghadiyaItem[] = nightOrder.map((name, idx) => {
      const sMin = sunsetMin + idx * nightPartMin;
      const eMin = sMin + nightPartMin;
      const meta = CHOGHADIYA_METADATA[name];
      return {
        name,
        type: meta.type,
        start: formatMin(sMin),
        end: formatMin(eMin),
        period: 'রাত',
        significanceBn: meta.noteBn
      };
    });

    // ৩. অভিজিৎ মুহূর্ত
    const noonMin = sunTimes.solarNoonMinutes;
    const abhijitStart = formatMin(noonMin - 24);
    const abhijitEnd = formatMin(noonMin + 24);
    const isWednesday = weekday === 3;
    const abhijitMuhurtha = {
      start: abhijitStart,
      end: abhijitEnd,
      text: isWednesday ? 'বুধবার বর্জিত' : `${abhijitStart} থেকে ${abhijitEnd}`,
      isApplicable: !isWednesday,
      note: isWednesday
        ? 'বুধবারে অভিজিৎ মুহূর্ত বর্জনীয় বলে শাস্ত্রে বিধান রয়েছে।'
        : 'সৌর মধ্যাহ্নের এই সূক্ষ্ম মুহূর্তে যাত্রা করলে সমস্ত দিকের দিকশূলের দোষ প্রশমিত হয়।'
    };

    // ৪. রাহুকাল, যমগণ্ড ও গুলিককাল
    const panjika = AstronomicalEngine.getFullPanjika(date, cityId, customCoords);
    const rahuKalam = panjika.rahuKalam || { start: '', end: '', text: '' };
    const yamagandam = panjika.yamagandam || { start: '', end: '', text: '' };
    const gulikaKalam = panjika.gulikaKalam || { start: '', end: '', text: '' };

    // ৫. শুভ ও বর্জনীয় ভ্রমণ উইন্ডো সংকলন
    const bestTravelWindows: string[] = [];
    if (!isWednesday) {
      bestTravelWindows.push(`অভিজিৎ মুহূর্ত: ${abhijitMuhurtha.text} (সর্বোত্তম রক্ষা কবচ)`);
    }

    dayChoghadiyas
      .filter((c) => c.type === 'auspicious' || c.name === 'চল')
      .forEach((c) => {
        bestTravelWindows.push(`${c.name} চৌঘড়িয়া: ${c.start} - ${c.end}`);
      });

    const forbiddenTravelWindows: string[] = [
      `রাহুকাল: ${rahuKalam.text} (সর্বতোভাবে বর্জনীয়)`,
      `কালবেলা: ${baraKalaBela.kalaBela.text} (যাত্রা নিষেধ)`,
      `বারবেলা: ${baraKalaBela.baraBela.text} (যাত্রা নিষেধ)`,
      `যমগণ্ড: ${yamagandam.text} (অশুভ বিঘ্নজনক)`
    ];

    // ৬. সংক্ষেপ ও পরামর্শ
    const summaryBn = `আজকের দিনে ${dishaShool.forbiddenDirection}-এ দিকশূল রয়েছে, সুতরাং ${dishaShool.forbiddenDirectionEn === 'West' ? 'পশ্চিম' : dishaShool.forbiddenDirectionEn === 'East' ? 'পূর্ব' : dishaShool.forbiddenDirectionEn === 'North' ? 'উত্তর' : 'দক্ষিণ'} দিকে দূরযাত্রা বর্জনীয়।`;

    const travelGuidanceBn = `আজকের অনুকূল যাত্রার দিক: ${dishaShool.favorableDirections.join(', ')}। বিশেষ প্রয়োজনে দিকশূল অভিমুখে যাত্রা করতে হলে: ${dishaShool.remedyBn} দিনের শুভ চৌঘড়িয়া (অমৃত, শুভ ও চল) সময়ে ভ্রমণ আরম্ভ করুন এবং রাহুকাল (${rahuKalam.text}) ও কালবেলা (${baraKalaBela.kalaBela.text}) পরিহার করুন।`;

    return {
      date,
      weekdayBn: dishaShool.weekdayBn,
      dishaShool,
      baraKalaBela,
      abhijitMuhurtha,
      rahuKalam,
      yamagandam,
      gulikaKalam,
      dayChoghadiyas,
      nightChoghadiyas,
      bestTravelWindows,
      forbiddenTravelWindows,
      summaryBn,
      travelGuidanceBn
    };
  }
}
