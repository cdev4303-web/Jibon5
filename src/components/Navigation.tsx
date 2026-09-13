import React from 'react';
import { Home, Calendar, ArrowLeftRight, PartyPopper, Settings, FileText, X, ShieldCheck, Compass } from 'lucide-react';
import { ActiveTab, Region } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
  onOpenTestingDashboard: () => void;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
  region: Region;
  onRegionChange: (r: Region) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
  onOpenTestingDashboard,
  isSidebarOpen,
  onCloseSidebar,
}) => {
  return (
    <>
      {/* Mobile & Tablet Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 sm:h-20 bg-white dark:bg-stone-900 border-t border-[#E0E4D9] dark:border-stone-800 px-2 sm:px-6 flex items-center justify-between transition-colors shadow-sm no-print print:hidden">
        <div className="flex items-center justify-around w-full max-w-lg mx-auto">
          {/* Home */}
          <button
            id="nav-btn-home"
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all touch-manipulation min-w-[48px] ${
              activeTab === 'home'
                ? 'text-[#056608] dark:text-emerald-400'
                : 'text-[#1A2F1C] dark:text-stone-300 opacity-40 hover:opacity-80'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              হোম
            </span>
          </button>

          {/* Calendar Grid */}
          <button
            id="nav-btn-calendar"
            onClick={() => onTabChange('calendar')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all touch-manipulation min-w-[48px] ${
              activeTab === 'calendar'
                ? 'text-[#056608] dark:text-emerald-400'
                : 'text-[#1A2F1C] dark:text-stone-300 opacity-40 hover:opacity-80'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              ক্যালেন্ডার
            </span>
          </button>

          {/* Indian / Vedic Panjika */}
          <button
            id="nav-btn-panjika"
            onClick={() => onTabChange('panjika')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all touch-manipulation min-w-[48px] ${
              activeTab === 'panjika'
                ? 'text-[#056608] dark:text-emerald-400 font-bold'
                : 'text-[#1A2F1C] dark:text-stone-300 opacity-40 hover:opacity-80'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              পঞ্জিকা
            </span>
          </button>

          {/* Converter */}
          <button
            id="nav-btn-converter"
            onClick={() => onTabChange('converter')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all touch-manipulation min-w-[48px] ${
              activeTab === 'converter'
                ? 'text-[#056608] dark:text-emerald-400'
                : 'text-[#1A2F1C] dark:text-stone-300 opacity-40 hover:opacity-80'
            }`}
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              কনভার্টার
            </span>
          </button>

          {/* Events */}
          <button
            id="nav-btn-events"
            onClick={() => onTabChange('events')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all touch-manipulation min-w-[48px] ${
              activeTab === 'events'
                ? 'text-[#056608] dark:text-emerald-400'
                : 'text-[#1A2F1C] dark:text-stone-300 opacity-40 hover:opacity-80'
            }`}
          >
            <PartyPopper className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              ছুটি
            </span>
          </button>

          {/* Settings */}
          <button
            id="nav-btn-settings"
            onClick={onOpenSettings}
            className="flex flex-col items-center gap-1 cursor-pointer transition-all touch-manipulation min-w-[48px] text-[#1A2F1C] dark:text-stone-300 opacity-40 hover:opacity-80"
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              সেটিংস
            </span>
          </button>
        </div>
      </nav>

      {/* Slide-over Drawer / Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex no-print print:hidden">
          {/* Backdrop */}
          <div
            onClick={onCloseSidebar}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer panel */}
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col z-10 animate-slideIn border-r border-[#E0E4D9] dark:border-stone-800">
            {/* Drawer Header in Editorial Forest Green */}
            <div className="p-6 bg-[#056608] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">বাংলা ক্যালেন্ডার</h3>
                  <p className="text-[11px] text-emerald-100">সার্বজনীন পঞ্জিকা ও রূপান্তরক</p>
                </div>
              </div>
              <button
                onClick={onCloseSidebar}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
              <button
                onClick={() => {
                  onTabChange('home');
                  onCloseSidebar();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'home'
                    ? 'bg-[#EBF0E4] dark:bg-stone-800 text-[#056608] dark:text-emerald-400'
                    : 'text-[#1A2F1C] dark:text-stone-300 hover:bg-[#F9FAF7] dark:hover:bg-stone-800'
                }`}
              >
                <Home className="w-5 h-5 text-[#056608] dark:text-emerald-400" />
                <span>হোম স্ক্রিন</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('calendar');
                  onCloseSidebar();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-[#EBF0E4] dark:bg-stone-800 text-[#056608] dark:text-emerald-400'
                    : 'text-[#1A2F1C] dark:text-stone-300 hover:bg-[#F9FAF7] dark:hover:bg-stone-800'
                }`}
              >
                <Calendar className="w-5 h-5 text-[#056608] dark:text-emerald-400" />
                <span>মাসের ক্যালেন্ডার গ্রিড</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('panjika');
                  onCloseSidebar();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'panjika'
                    ? 'bg-[#EBF0E4] dark:bg-stone-800 text-[#056608] dark:text-emerald-400 font-bold'
                    : 'text-[#1A2F1C] dark:text-stone-300 hover:bg-[#F9FAF7] dark:hover:bg-stone-800'
                }`}
              >
                <Compass className="w-5 h-5 text-[#056608] dark:text-emerald-400" />
                <span>ভারতীয় পঞ্জিকা ও মুহূর্ত</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('converter');
                  onCloseSidebar();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'converter'
                    ? 'bg-[#EBF0E4] dark:bg-stone-800 text-[#056608] dark:text-emerald-400'
                    : 'text-[#1A2F1C] dark:text-stone-300 hover:bg-[#F9FAF7] dark:hover:bg-stone-800'
                }`}
              >
                <ArrowLeftRight className="w-5 h-5 text-[#056608] dark:text-emerald-400" />
                <span>তারিখ রূপান্তরক (Converter)</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('events');
                  onCloseSidebar();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'events'
                    ? 'bg-[#EBF0E4] dark:bg-stone-800 text-[#056608] dark:text-emerald-400'
                    : 'text-[#1A2F1C] dark:text-stone-300 hover:bg-[#F9FAF7] dark:hover:bg-stone-800'
                }`}
              >
                <PartyPopper className="w-5 h-5 text-[#D2122E]" />
                <span>ছুটি ও দিবস (Events)</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('notes');
                  onCloseSidebar();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'notes'
                    ? 'bg-[#EBF0E4] dark:bg-stone-800 text-[#056608] dark:text-emerald-400'
                    : 'text-[#1A2F1C] dark:text-stone-300 hover:bg-[#F9FAF7] dark:hover:bg-stone-800'
                }`}
              >
                <FileText className="w-5 h-5 text-[#056608] dark:text-emerald-400" />
                <span>নোট ও রিমাইন্ডার</span>
              </button>

              <div className="pt-3 border-t border-[#E0E4D9] dark:border-stone-800 my-2">
                <button
                  onClick={() => {
                    onCloseSidebar();
                    onOpenTestingDashboard();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#056608] dark:text-emerald-400 hover:bg-[#EBF0E4] dark:hover:bg-stone-800"
                >
                  <ShieldCheck className="w-4 h-4 text-[#056608]" />
                  <span>ক্যালেন্ডার টেস্টিং ড্যাশবোর্ড</span>
                </button>

                <button
                  onClick={() => {
                    onCloseSidebar();
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#4A5D4C] dark:text-stone-300 hover:bg-[#F9FAF7] dark:hover:bg-stone-800"
                >
                  <Settings className="w-4 h-4 text-[#4A5D4C]" />
                  <span>সেটিংস ও পছন্দসমূহ</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#E0E4D9] dark:border-stone-800 text-[11px] text-[#4A5D4C] text-center">
              বাংলা একাডেমি ও সূর্যসিদ্ধান্ত পঞ্জিকা সমর্থিত
            </div>
          </div>
        </div>
      )}
    </>
  );
};
