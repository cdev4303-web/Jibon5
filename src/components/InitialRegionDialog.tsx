import React from 'react';
import { Calendar, Check } from 'lucide-react';
import { Region } from '../types';

interface InitialRegionDialogProps {
  isOpen: boolean;
  onSelect: (r: Region) => void;
}

export const InitialRegionDialog: React.FC<InitialRegionDialogProps> = ({
  isOpen,
  onSelect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 rounded-[32px] max-w-md w-full p-6 sm:p-8 border border-[#E0E4D9] dark:border-stone-800 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#056608] text-white flex items-center justify-center mx-auto shadow-md">
          <Calendar className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#056608] dark:text-emerald-400 block mb-1">
            পঞ্জিকা সংস্করণ নির্বাচন
          </span>
          <h2 className="text-2xl font-bold text-[#1A2F1C] dark:text-stone-100">
            বাংলা ক্যালেন্ডারে স্বাগতম
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5D4C] dark:text-stone-400 mt-2 leading-relaxed">
            শুরুতেই আপনার পছন্দের অঞ্চল বা ক্যালেন্ডার পদ্ধতি বেছে নিন। পরবর্তীতে যেকোনো সময় এটি পরিবর্তন করতে পারবেন।
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelect('bangladesh')}
            className="w-full p-4 rounded-2xl border border-[#D1D8C5] hover:border-[#056608] bg-[#EBF0E4] dark:bg-stone-800 text-left flex items-center justify-between group transition-all"
          >
            <div>
              <div className="font-bold text-sm text-[#056608] dark:text-emerald-400 flex items-center gap-2">
                <span>🇧🇩</span>
                <span>বাংলাদেশ ক্যালেন্ডার</span>
              </div>
              <p className="text-[11px] text-[#4A5D4C] dark:text-stone-400 mt-0.5">
                বাংলা একাডেমি ও সরকারি সংস্কার (পহেলা বৈশাখ ১৪ এপ্রিল)
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#056608] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Check className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onSelect('west_bengal')}
            className="w-full p-4 rounded-2xl border border-red-200 hover:border-[#D2122E] bg-[#FFF1F1] dark:bg-stone-800 text-left flex items-center justify-between group transition-all"
          >
            <div>
              <div className="font-bold text-sm text-[#D2122E] dark:text-red-400 flex items-center gap-2">
                <span>🇮🇳</span>
                <span>পশ্চিমবঙ্গ পঞ্জিকা</span>
              </div>
              <p className="text-[11px] text-[#4A5D4C] dark:text-stone-400 mt-0.5">
                ঐতিহ্যবাহী সূর্যসিদ্ধান্ত ও সংক্রান্তি ভিত্তিক পঞ্জিকা
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#D2122E] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Check className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onSelect('both')}
            className="w-full p-4 rounded-2xl border border-[#D1D8C5] dark:border-stone-700 hover:border-[#056608] bg-[#F0F2EB] dark:bg-stone-800 text-left flex items-center justify-between group transition-all"
          >
            <div>
              <div className="font-bold text-sm text-[#1A2F1C] dark:text-stone-100 flex items-center gap-2">
                <span>🔄</span>
                <span>উভয় অঞ্চল (Both Regions)</span>
              </div>
              <p className="text-[11px] text-[#4A5D4C] dark:text-stone-400 mt-0.5">
                একসাথে বাংলাদেশ ও পশ্চিমবঙ্গের তারিখ তুলনা
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#056608] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Check className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
