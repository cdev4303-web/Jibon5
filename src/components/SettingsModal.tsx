import React, { useRef, useState } from 'react';
import {
  X,
  Moon,
  Sun,
  Download,
  Upload,
  CheckCircle2,
  Info,
  ShieldCheck,
  Compass,
  FileText,
  MapPin,
  Bell,
  Smartphone,
  Share2,
  Check
} from 'lucide-react';
import { Region, UserSettings, CityLocationId } from '../types';
import { StorageService } from '../utils/storage';
import { BANGLADESH_DISTRICTS, WEST_BENGAL_DISTRICTS } from '../calendar/astronomy';
import { NotificationService } from '../utils/notification-service';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (s: UserSettings) => void;
  onOpenTestingDashboard: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onOpenTestingDashboard
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'general' | 'location' | 'widgets' | 'backup' | 'about'>('general');
  const [importMessage, setImportMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...settings, [key]: value };
    onSaveSettings(updated);
  };

  const updateWidgetSetting = (key: keyof UserSettings['homeWidgets'], val: boolean) => {
    const updatedWidgets = { ...settings.homeWidgets, [key]: val };
    updateSetting('homeWidgets', updatedWidgets);
  };

  const handleExportBackup = () => {
    const json = StorageService.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bangla_calendar_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const res = StorageService.importBackup(content);
      setImportMessage({ success: res.success, text: res.message });
      if (res.success) {
        onSaveSettings(StorageService.getSettings());
      }
    };
    reader.readAsText(file);
  };

  const handleGpsDetect = () => {
    if (!navigator.geolocation) {
      alert('আপনার ব্রাউজার বা ডিভাইসে জিপিএস সাপোর্ট নেই।');
      return;
    }
    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocatingGps(false);
        const { latitude, longitude } = pos.coords;
        // Check if closer to Dhaka (lat 23.8, lng 90.4) or Kolkata (lat 22.5, lng 88.3)
        const distDhaka = Math.hypot(latitude - 23.8103, longitude - 90.4125);
        const distKolkata = Math.hypot(latitude - 22.5726, longitude - 88.3639);
        const matchedCity: CityLocationId = distKolkata < distDhaka ? 'kolkata' : 'dhaka';
        updateSetting('cityId', matchedCity);
        alert(`জিপিএস লোকেশন সনাক্ত হয়েছে (${matchedCity === 'kolkata' ? 'কলকাতা' : 'ঢাকা'})`);
      },
      () => {
        setLocatingGps(false);
        alert('জিপিএস লোকেশন পেতে অনুমতি পাওয়া যায়নি। ড্রপডাউন থেকে নির্বাচন করুন।');
      }
    );
  };

  const handleToggleNotification = async () => {
    // If currently enabled, toggling turns it off cleanly
    if (settings.enableDailyNotification) {
      updateSetting('enableDailyNotification', false);
      return;
    }

    if (!NotificationService.isSupported()) {
      alert('আপনার ডিভাইসের ব্রাউজারে নোটিফিকেশন সুবিধা সমর্থিত নয়।');
      return;
    }

    try {
      const currentPerm = NotificationService.getPermission();
      if (currentPerm === 'granted') {
        updateSetting('enableDailyNotification', true);
        await NotificationService.sendNotification('বাংলা ক্যালেন্ডার ও পঞ্জিকা', {
          body: 'প্রতিদিন সকালবেলা বাংলা তারিখ ও বিশেষ দিবসের নোটিফিকেশন প্রদান করা হবে।',
          icon: '/favicon.ico'
        });
      } else if (currentPerm !== 'denied') {
        const requested = await NotificationService.requestPermission();
        if (requested === 'granted') {
          updateSetting('enableDailyNotification', true);
          await NotificationService.sendNotification('বাংলা ক্যালেন্ডার ও পঞ্জিকা', {
            body: 'প্রতিদিন সকালবেলা বাংলা তারিখ ও বিশেষ দিবসের নোটিফিকেশন প্রদান করা হবে।',
            icon: '/favicon.ico'
          });
        } else {
          alert('নোটিফিকেশনের অনুমতি প্রদান করা হয়নি। ব্রাউজারের অনুমতি পেলে নোটিফিকেশন পাঠানো সম্ভব হবে।');
        }
      } else {
        alert('ব্রাউজার সেটিংসে নোটিফিকেশনের অনুমতি ব্লক করা রয়েছে। অনুগ্রহ করে ব্রাউজার সেটিংস থেকে অনুমতি প্রদান করুন।');
      }
    } catch (err) {
      console.warn('Error during notification toggle:', err);
      updateSetting('enableDailyNotification', true);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 rounded-[32px] max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#E0E4D9] dark:border-stone-800 shadow-2xl relative my-auto transition-colors">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs p-5 sm:p-6 border-b border-[#E0E4D9] dark:border-stone-800 flex items-center justify-between z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#056608] dark:text-emerald-400 block mb-0.5">
              পছন্দসমূহ ও নিয়মাবলী
            </span>
            <h3 className="text-xl font-bold text-[#1A2F1C] dark:text-stone-100">সেটিংস</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-9 h-9 rounded-full border border-[#E0E4D9] dark:border-stone-700 hover:bg-[#F9FAF7] dark:hover:bg-stone-800 flex items-center justify-center text-[#1A2F1C] dark:text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E0E4D9] dark:border-stone-800 px-4 sm:px-6 pt-2 overflow-x-auto no-scrollbar gap-1 sm:gap-2">
          {[
            { id: 'general', label: 'সাধারণ' },
            { id: 'location', label: 'অবস্থান ও সূর্য' },
            { id: 'widgets', label: 'উইজেট' },
            { id: 'backup', label: 'ব্যাকআপ' },
            { id: 'about', label: 'নিয়ম ও পরিচিতি' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'border-[#056608] text-[#056608] dark:text-emerald-400'
                  : 'border-transparent text-[#4A5D4C] dark:text-stone-400 hover:text-[#1A2F1C]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6">
          {/* 1. General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              {/* Region Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A5D4C] dark:text-stone-400 block mb-2">
                  ডিফল্ট অঞ্চল (Region)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bangladesh', label: '🇧🇩 বাংলাদেশ' },
                    { id: 'west_bengal', label: '🇮🇳 পশ্চিমবঙ্গ' },
                    { id: 'both', label: '🔄 উভয়' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => updateSetting('region', item.id as Region)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                        settings.region === item.id
                          ? 'bg-[#056608] text-white border-[#056608] shadow-xs'
                          : 'bg-[#F9FAF7] dark:bg-stone-800 border-[#E0E4D9] dark:border-stone-700 text-[#1A2F1C] dark:text-stone-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme (Light / Dark) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A5D4C] dark:text-stone-400 block mb-2">
                  থিম (Theme)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSetting('theme', 'light')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                      settings.theme === 'light'
                        ? 'bg-[#056608] text-white border-[#056608]'
                        : 'bg-[#F9FAF7] dark:bg-stone-800 border-[#E0E4D9] dark:border-stone-700 text-[#1A2F1C] dark:text-stone-300'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>লাইট থিম (Editorial)</span>
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                      settings.theme === 'dark'
                        ? 'bg-[#056608] text-white border-[#056608]'
                        : 'bg-[#F9FAF7] dark:bg-stone-800 border-[#E0E4D9] dark:border-stone-700 text-[#1A2F1C] dark:text-stone-300'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>ডার্ক থিম (Dark Mode)</span>
                  </button>
                </div>
              </div>

              {/* Bengali vs English Digits */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A5D4C] dark:text-stone-400 block mb-2">
                  সংখ্যার ধরণ (Digits)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSetting('useBengaliDigits', true)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                      settings.useBengaliDigits
                        ? 'bg-[#056608] text-white border-[#056608]'
                        : 'bg-[#F9FAF7] dark:bg-stone-800 border-[#E0E4D9] dark:border-stone-700 text-[#1A2F1C] dark:text-stone-300'
                    }`}
                  >
                    বাংলা সংখ্যা (০, ১, ২, ৩...)
                  </button>
                  <button
                    onClick={() => updateSetting('useBengaliDigits', false)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                      !settings.useBengaliDigits
                        ? 'bg-[#056608] text-white border-[#056608]'
                        : 'bg-[#F9FAF7] dark:bg-stone-800 border-[#E0E4D9] dark:border-stone-700 text-[#1A2F1C] dark:text-stone-300'
                    }`}
                  >
                    ইংরেজি সংখ্যা (0, 1, 2, 3...)
                  </button>
                </div>
              </div>

              {/* Hijri Adjustment Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A5D4C] dark:text-stone-400">
                    হিজরি তারিখ সমন্বয় (চাঁদ দেখা সাপেক্ষে)
                  </label>
                  <span className="text-xs font-bold text-[#056608] dark:text-emerald-400">
                    {settings.hijriAdjustment > 0
                      ? `+${settings.hijriAdjustment} দিন`
                      : `${settings.hijriAdjustment} দিন`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="1"
                  value={settings.hijriAdjustment}
                  onChange={(e) => updateSetting('hijriAdjustment', Number(e.target.value))}
                  className="w-full accent-[#056608]"
                />
                <div className="flex justify-between text-[10px] text-[#8A967E] mt-1">
                  <span>-২ দিন</span>
                  <span>-১ দিন</span>
                  <span>স্বাভাবিক (০)</span>
                  <span>+১ দিন</span>
                  <span>+২ দিন</span>
                </div>
              </div>

              {/* Daily Notification */}
              <div className="p-4 rounded-2xl bg-[#F9FAF7] dark:bg-stone-800 border border-[#E0E4D9] dark:border-stone-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1A2F1C] dark:text-stone-100 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#056608] dark:text-emerald-400" />
                    <span>দৈনিক বাংলা তারিখ নোটিফিকেশন</span>
                  </div>
                  <p className="text-[11px] text-[#8A967E] dark:text-stone-400 mt-0.5">
                    প্রতিদিন সকালে আজকের বাংলা ও হিজরি তারিখের বিজ্ঞপ্তি
                  </p>
                </div>
                <button
                  onClick={handleToggleNotification}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.enableDailyNotification ? 'bg-[#056608]' : 'bg-stone-300 dark:bg-stone-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                      settings.enableDailyNotification ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Testing Dashboard launcher button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenTestingDashboard();
                  }}
                  className="w-full p-3.5 rounded-2xl bg-[#EBF0E4] dark:bg-stone-800 border border-[#D1D8C5] dark:border-stone-700 text-[#056608] dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#E0E4D9] transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>ক্যালেন্ডার নির্ভুলতা টেস্টিং ড্যাশবোর্ড চালান</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Location & Astronomy Settings */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F0F2EB] dark:bg-stone-800 border border-[#E0E4D9] dark:border-stone-700">
                <h4 className="text-xs font-bold text-[#1A2F1C] dark:text-stone-100 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#056608]" />
                  <span>সূর্যোদয় ও সূর্যাস্ত স্থান নির্বাচন</span>
                </h4>
                <p className="text-xs text-[#4A5D4C] dark:text-stone-400 leading-relaxed">
                  সূর্যোদয় এবং সূর্যাস্তের নিখুঁত সময় আপনার নির্বাচিত জেলা বা শহরের সঠিক অক্ষাংশ-দ্রাঘিমাংশের ওপর ভিত্তি করে নির্ণয় করা হয়।
                </p>
              </div>

              {/* GPS Button */}
              <button
                onClick={handleGpsDetect}
                disabled={locatingGps}
                className="w-full py-2.5 px-4 rounded-xl border border-[#056608] text-[#056608] dark:text-emerald-400 hover:bg-[#EBF0E4] dark:hover:bg-stone-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Compass className={`w-4 h-4 ${locatingGps ? 'animate-spin' : ''}`} />
                <span>{locatingGps ? 'লোকেশন খোজা হচ্ছে...' : '📍 বর্তমান জিপিএস লোকেশন সনাক্ত করুন'}</span>
              </button>

              {/* District / City Dropdown */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A5D4C] dark:text-stone-400 block mb-2">
                  বাংলাদেশ বা পশ্চিমবঙ্গের শহর/বিভাগ
                </label>
                <select
                  value={settings.cityId}
                  onChange={(e) => updateSetting('cityId', e.target.value as CityLocationId)}
                  className="w-full p-3 rounded-2xl border border-[#D1D8C5] dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold text-[#1A2F1C] dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#056608]"
                >
                  <optgroup label="🇧🇩 বাংলাদেশ">
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameBn} ({d.nameEn})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🇮🇳 পশ্চিমবঙ্গ">
                    {WEST_BENGAL_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameBn} ({d.nameEn})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          )}

          {/* 3. Widgets Settings */}
          {activeTab === 'widgets' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F0F2EB] dark:bg-stone-800 border border-[#E0E4D9] dark:border-stone-700">
                <h4 className="text-xs font-bold text-[#1A2F1C] dark:text-stone-100 mb-1">
                  হোমস্ক্রিন কার্ড কাস্টমাইজেশন
                </h4>
                <p className="text-[11px] text-[#4A5D4C] dark:text-stone-400">
                  হোম পেজে কোন কোন তথ্য কার্ড দেখতে চান তা নির্বাচন করুন:
                </p>
              </div>

              {[
                { key: 'showSunriseSunset', label: '🌅 সূর্যোদয় ও সূর্যাস্তের সময়', desc: 'স্থানীয় সময় অনুযায়ী' },
                { key: 'showMoonPhase', label: '🌙 চাঁদের দশা ও দৃশ্যমানতা শতাংশ', desc: 'চন্দ্রকলার ৮টি রূপ' },
                { key: 'showPanjika', label: '🕉️ সনাতন পঞ্জিকা (তিথি, নক্ষত্র, যোগ, করণ)', desc: 'ঐতিহ্যবাহী পঞ্চাঙ্গ' },
                { key: 'showHijriDate', label: '🕋 হিজরি তারিখ প্রদর্শন', desc: 'ইসলামিক চান্দ্র মাস' },
                { key: 'showSeason', label: '🌿 বাংলা ঋতু নির্দেশক', desc: 'গ্রীষ্ম, বর্ষা, শরৎ, হেমন্ত, শীত, বসন্ত' }
              ].map((w) => (
                <div
                  key={w.key}
                  className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-[#E0E4D9] dark:border-stone-700 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-[#1A2F1C] dark:text-stone-100">{w.label}</div>
                    <div className="text-[10px] text-[#8A967E] dark:text-stone-400">{w.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.homeWidgets[w.key as keyof UserSettings['homeWidgets']]}
                    onChange={(e) =>
                      updateWidgetSetting(w.key as keyof UserSettings['homeWidgets'], e.target.checked)
                    }
                    className="w-5 h-5 accent-[#056608] rounded-md cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 4. Backup & Restore */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F0F2EB] dark:bg-stone-800 border border-[#E0E4D9] dark:border-stone-700">
                <h4 className="text-xs font-bold text-[#1A2F1C] dark:text-stone-100 mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#056608]" />
                  <span>ডেটা ব্যাকআপ ও স্থানান্তর</span>
                </h4>
                <p className="text-xs text-[#4A5D4C] dark:text-stone-400 leading-relaxed">
                  আপনার সংরক্ষিত সকল নোট, রিমাইন্ডার এবং ব্যক্তিগত সেটিংস ফাইল আকারে ব্যাকআপ রাখুন অথবা অন্য ডিভাইসে ইমপোর্ট করুন।
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleExportBackup}
                  className="p-4 rounded-2xl border border-[#D1D8C5] dark:border-stone-700 hover:bg-[#F9FAF7] dark:hover:bg-stone-800 text-left transition-all"
                >
                  <Download className="w-5 h-5 text-[#056608] mb-2" />
                  <div className="text-xs font-bold text-[#1A2F1C] dark:text-stone-100">ব্যাকআপ ডাউনলোড</div>
                  <div className="text-[10px] text-[#4A5D4C] dark:text-stone-400 mt-0.5">
                    JSON ফরম্যাটে এক্সপোর্ট
                  </div>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl border border-[#D1D8C5] dark:border-stone-700 hover:bg-[#F9FAF7] dark:hover:bg-stone-800 text-left transition-all"
                >
                  <Upload className="w-5 h-5 text-[#D2122E] mb-2" />
                  <div className="text-xs font-bold text-[#1A2F1C] dark:text-stone-100">ব্যাকআপ রিস্টোর</div>
                  <div className="text-[10px] text-[#4A5D4C] dark:text-stone-400 mt-0.5">
                    JSON ফাইল ইমপোর্ট করুন
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </button>
              </div>

              {importMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    importMessage.success
                      ? 'bg-[#EBF0E4] text-[#056608] border border-[#D1D8C5]'
                      : 'bg-[#FFF1F1] text-[#D2122E] border border-red-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{importMessage.text}</span>
                </div>
              )}
            </div>
          )}

          {/* 5. About & Official Disclaimers */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs leading-relaxed text-[#4A5D4C] dark:text-stone-300">
              {/* MANDATORY OFFICIAL DISCLAIMER */}
              <div className="p-4 rounded-2xl bg-[#FFF8E7] dark:bg-stone-800 border-2 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200">
                <h5 className="font-bold flex items-center gap-1.5 mb-1.5 text-sm">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>গুরুত্বপূর্ণ আইনি ও নিরপেক্ষতা ঘোষণা</span>
                </h5>
                <p className="text-xs leading-relaxed font-semibold">
                  “এই অ্যাপটি স্বাধীনভাবে তৈরি করা হয়েছে। এটি বাংলাদেশ সরকার, ভারত সরকার বা পশ্চিমবঙ্গ সরকারের কোনো official application নয়।”
                </p>
                <p className="text-[11px] mt-2 opacity-90">
                  জাতীয় ছুটির দিন ও ধর্মীয় উৎসবসমূহ বাংলাদেশ ও পশ্চিমবঙ্গ সরকারের প্রকাশিত গেজেট এবং প্রচলিত পঞ্জিকা তথ্যের সাথে মিল রেখে প্রস্তুতকৃত।
                </p>
              </div>

              {/* Differences in Calculation */}
              <div className="p-4 rounded-2xl bg-[#F0F2EB] dark:bg-stone-800 border border-[#E0E4D9] dark:border-stone-700">
                <h4 className="font-bold text-[#1A2F1C] dark:text-stone-100 mb-1 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#056608]" />
                  <span>বাংলাদেশ ও পশ্চিমবঙ্গের গণনা পদ্ধতির পার্থক্য</span>
                </h4>
                <p className="mt-2">
                  <strong>🇧🇩 বাংলাদেশ (বাংলা একাডেমি ২০১৯ সংস্কার):</strong> বৈশাখ থেকে আশ্বিন (প্রথম ৬ মাস) ৩১ দিন এবং কার্তিক থেকে চৈত্র (পরের ৫ মাস) ৩০ দিন। ফাল্গুন মাস ২৯ দিন, অধিবর্ষে ৩০ দিন। পহেলা বৈশাখ সবসময় ১৪ এপ্রিলে অনুষ্ঠিত হয়।
                </p>
                <p className="mt-2">
                  <strong>🇮🇳 পশ্চিমবঙ্গ (সূর্যসিদ্ধান্ত ও নিরয়ন পঞ্জিকা):</strong> সূর্যোদয়ের সময় সূর্যের রাশি পরিবর্তনের (মেষ সংক্রান্তির) মুহূর্তের ওপর ভিত্তি করে পয়লা বৈশাখ ১৪ বা ১৫ এপ্রিলে নির্ধারিত হয়। মাসের দৈর্ঘ্য ২৯ থেকে ৩২ দিন পর্যন্ত হতে পারে।
                </p>
              </div>

              {/* PWA / Mobile Installation */}
              <div className="p-4 rounded-2xl bg-[#EBF0E4] dark:bg-stone-800 border border-[#D1D8C5] dark:border-stone-700 text-[#1A2F1C] dark:text-stone-100">
                <h5 className="font-bold flex items-center gap-1.5 mb-1 text-[#056608] dark:text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                  <span>মোবাইলে ইন্সটল ও APK তৈরি</span>
                </h5>
                <p className="text-[11px] leading-relaxed text-[#4A5D4C] dark:text-stone-300">
                  এই অ্যাপটি একটি পূর্ণাঙ্গ প্রগ্রেসিভ ওয়েব অ্যাপ (PWA)। ক্রোম বা সাফারি ব্রাউজার থেকে <strong>Add to Home Screen</strong> চাপলে এটি নেটিভ অ্যাপের মতো কাজ করবে। এছাড়াও <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="underline font-bold text-[#056608] dark:text-emerald-400">PWABuilder.com</a>-এ অ্যাপের লিঙ্ক দিয়ে সরাসরি গুগল প্লে স্টোর বা অ্যান্ড্রয়েড APK জেনারেট করা সম্ভব।
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleCopyShareLink}
                    className="px-3.5 py-1.5 rounded-xl bg-[#056608] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedLink ? 'লিঙ্ক কপি হয়েছে' : 'অ্যাপ লিঙ্ক কপি করুন'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
