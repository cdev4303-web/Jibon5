/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BigDateCard } from './components/BigDateCard';
import { MonthGrid } from './components/MonthGrid';
import { TodayEvents } from './components/TodayEvents';
import { DateDetailsModal } from './components/DateDetailsModal';
import { DateConverter } from './components/DateConverter';
import { EventsView } from './components/EventsView';
import { NotesAndRemindersView } from './components/NotesAndRemindersView';
import { SettingsModal } from './components/SettingsModal';
import { TestingDashboardModal } from './components/TestingDashboardModal';
import { InitialRegionDialog } from './components/InitialRegionDialog';
import { Navigation } from './components/Navigation';
import { VedicPanjikaView } from './components/VedicPanjikaView';

import { ActiveTab, BanglaDateResult, PersonalNote, Region, ReminderItem, UserSettings } from './types';
import { BangladeshCalendarEngine } from './calendar/bangladesh-calendar';
import { WestBengalCalendarEngine } from './calendar/west-bengal-calendar';
import { HijriCalendarEngine } from './calendar/hijri-calendar';
import { AstronomyEngine } from './calendar/astronomy';
import { CalendarDataService } from './calendar/calendar-data';
import { StorageService } from './utils/storage';
import { generateDateCardImage, downloadDataUrl } from './utils/image-export';
import { GREGORIAN_MONTHS_BN, toBengaliNumeral } from './calendar/bangla-digits';
import { NotificationService } from './utils/notification-service';
import { VivahaYatraEngine } from './calendar/vivaha-yatra-engine';

export default function App() {
  // 1. Settings & State
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());
  const [region, setRegion] = useState<Region>(settings.region || 'bangladesh');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Dates: Today & User-selected date
  const [todayDate] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(todayDate);

  // Modals & Navigation Drawers
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTestingDashboardOpen, setIsTestingDashboardOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showInitialRegionDialog, setShowInitialRegionDialog] = useState(
    !settings.hasSelectedInitialRegion
  );

  // Notes & Reminders
  const [notes, setNotes] = useState<PersonalNote[]>(() => StorageService.getNotes());
  const [reminders, setReminders] = useState<ReminderItem[]>(() => StorageService.getReminders());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Apply Theme to <html> tag
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Daily notification check if enabled - Safe for mobile and desktop without white-screen crash
  useEffect(() => {
    if (!settings.enableDailyNotification) return;

    let isMounted = true;
    const sendDailyAlert = async () => {
      try {
        if (!NotificationService.isSupported()) return;
        if (NotificationService.getPermission() !== 'granted') return;

        const lastNotif = localStorage.getItem('last_daily_notification_date');
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);

        if (lastNotif !== todayStr) {
          const todayBn = region === 'west_bengal'
            ? WestBengalCalendarEngine.fromGregorian(today)
            : BangladeshCalendarEngine.fromGregorian(today);

          const vivaha = VivahaYatraEngine.getVivahaMuhurthaForDate(today);
          const vivahaNote = vivaha.hasVivahaLagna ? ' • আজ শুভ বিবাহ লগ্ন আছে 💍' : '';

          const sent = await NotificationService.sendNotification(
            `আজকের বাংলা তারিখ: ${todayBn.dayBn} ${todayBn.monthNameBn} ${todayBn.yearBn}`,
            {
              body: `${todayBn.weekdayBn}${vivahaNote} (${region === 'west_bengal' ? 'পশ্চিমবঙ্গ' : 'বাংলাদেশ'} সংস্করণ)`,
              icon: '/favicon.ico'
            }
          );

          if (sent && isMounted) {
            localStorage.setItem('last_daily_notification_date', todayStr);
          }
        }
      } catch (err) {
        console.warn('Daily notification check failed gracefully:', err);
      }
    };

    sendDailyAlert();

    return () => {
      isMounted = false;
    };
  }, [settings.enableDailyNotification, region]);

  // Sync Region changes to Settings
  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
    const updated = { ...settings, region: newRegion, hasSelectedInitialRegion: true };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  const handleInitialRegionSelect = (selectedRegion: Region) => {
    handleRegionChange(selectedRegion);
    setShowInitialRegionDialog(false);
  };

  const handleSaveSettings = (updated: UserSettings) => {
    setSettings(updated);
    setRegion(updated.region);
    StorageService.saveSettings(updated);
  };

  const refreshNotesAndReminders = () => {
    setNotes(StorageService.getNotes());
    setReminders(StorageService.getReminders());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 2. Calendar Calculations for Today & Selected Date
  const targetDate = selectedDate;
  const bdDate = BangladeshCalendarEngine.fromGregorian(targetDate);
  let wbDate: BanglaDateResult;
  try {
    wbDate = WestBengalCalendarEngine.fromGregorian(targetDate);
  } catch {
    wbDate = bdDate;
  }
  const hijriDate = HijriCalendarEngine.fromGregorian(targetDate, settings.hijriAdjustment);
  const sunMoon = AstronomyEngine.getSunMoonInfo(
    targetDate,
    settings.cityId,
    settings.customCoords,
    bdDate.monthIndex,
    bdDate.day,
    bdDate.totalDaysInMonth
  );
  const todayEvents = CalendarDataService.getEventsForDate(targetDate, region);

  // 3. Share Action
  const handleShare = async () => {
    const gDay = settings.useBengaliDigits
      ? toBengaliNumeral(targetDate.getDate())
      : targetDate.getDate();
    const gMonth = GREGORIAN_MONTHS_BN[targetDate.getMonth()];
    const gYear = settings.useBengaliDigits
      ? toBengaliNumeral(targetDate.getFullYear())
      : targetDate.getFullYear();

    const shareTitle = `বাংলা ক্যালেন্ডার: ${bdDate.weekdayBn}`;
    const shareText = `আজ ${bdDate.weekdayBn}
🇧🇩 বাংলাদেশ: ${bdDate.dayBn} ${bdDate.monthNameBn} ${bdDate.yearBn} বঙ্গাব্দ (${bdDate.seasonBn}কাল)
🇮🇳 পশ্চিমবঙ্গ: ${wbDate.dayBn} ${wbDate.monthNameBn} ${wbDate.yearBn} বঙ্গাব্দ
📅 ইংরেজি: ${gDay} ${gMonth} ${gYear}
🌙 হিজরি: ${hijriDate.dayBn} ${hijriDate.monthNameBn} ${hijriDate.yearBn} হিজরি`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: window.location.href
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      showToast('তারিখ সফলভাবে ক্লিপবোর্ডে কপি হয়েছে!');
    } catch (e) {
      showToast('শেয়ার তথ্য কপি করা সম্ভব হয়নি।');
    }
  };

  // 4. Save Image Action
  const handleSaveImage = async () => {
    showToast('ছবি তৈরি হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...');
    const gDay = settings.useBengaliDigits
      ? toBengaliNumeral(targetDate.getDate())
      : targetDate.getDate();
    const gMonth = GREGORIAN_MONTHS_BN[targetDate.getMonth()];
    const gYear = settings.useBengaliDigits
      ? toBengaliNumeral(targetDate.getFullYear())
      : targetDate.getFullYear();

    const regionTitle =
      region === 'bangladesh'
        ? '🇧🇩 বাংলাদেশ ক্যালেন্ডার (বাংলা একাডেমি নিয়ম)'
        : region === 'west_bengal'
        ? '🇮🇳 পশ্চিমবঙ্গ পঞ্জিকা ক্যালেন্ডার (সূর্যসিদ্ধান্ত নিয়ম)'
        : '🇧🇩 বাংলাদেশ ও 🇮🇳 পশ্চিমবঙ্গ ক্যালেন্ডার';

    const chosenDate = region === 'west_bengal' ? wbDate : bdDate;
    const festival = todayEvents.length > 0 ? todayEvents[0].titleBn : undefined;

    const dataUrl = await generateDateCardImage({
      weekdayBn: chosenDate.weekdayBn,
      banglaDateBn: chosenDate.dayBn,
      banglaYearBn: chosenDate.yearBn,
      banglaMonthBn: chosenDate.monthNameBn,
      gregorianDateStr: `${gDay} ${gMonth} ${gYear} খ্রিস্টাব্দ`,
      hijriDateStr: `${hijriDate.dayBn} ${hijriDate.monthNameBn} ${hijriDate.yearBn}`,
      regionTitleBn: regionTitle,
      festivalName: festival
    });

    if (dataUrl) {
      downloadDataUrl(dataUrl, `bangla_date_${targetDate.toISOString().slice(0, 10)}.png`);
      showToast('ছবি সফলভাবে ডাউনলোড হয়েছে!');
    } else {
      showToast('ছবি সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF7] dark:bg-stone-950 text-[#1A2F1C] dark:text-stone-100 flex flex-col font-sans transition-colors pb-20 md:pb-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1A2F1C] dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Main Top Header */}
      <Header
        region={region}
        cityId={settings.cityId}
        onRegionChange={handleRegionChange}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onSelectSearchedDate={(newD) => {
          setSelectedDate(newD);
          setIsDetailsModalOpen(true);
        }}
      />

      {/* Desktop Navigation Bar (hidden on mobile, visible on md+) */}
      <div className="hidden md:block bg-white dark:bg-stone-900 border-b border-[#E0E4D9] dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'home'
                  ? 'border-[#056608] text-[#056608] dark:text-emerald-400'
                  : 'border-transparent text-[#4A5D4C] dark:text-stone-400 hover:text-[#1A2F1C]'
              }`}
            >
              হোম
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'calendar'
                  ? 'border-[#056608] text-[#056608] dark:text-emerald-400'
                  : 'border-transparent text-[#4A5D4C] dark:text-stone-400 hover:text-[#1A2F1C]'
              }`}
            >
              ক্যালেন্ডার
            </button>
            <button
              id="desktop-tab-panjika"
              onClick={() => setActiveTab('panjika')}
              className={`px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'panjika'
                  ? 'border-[#056608] text-[#056608] dark:text-emerald-400'
                  : 'border-transparent text-[#4A5D4C] dark:text-stone-400 hover:text-[#1A2F1C]'
              }`}
            >
              ভারতীয় পঞ্জিকা
            </button>
            <button
              onClick={() => setActiveTab('converter')}
              className={`px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'converter'
                  ? 'border-[#056608] text-[#056608] dark:text-emerald-400'
                  : 'border-transparent text-[#4A5D4C] dark:text-stone-400 hover:text-[#1A2F1C]'
              }`}
            >
              কনভার্টার
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'events'
                  ? 'border-[#056608] text-[#056608] dark:text-emerald-400'
                  : 'border-transparent text-[#4A5D4C] dark:text-stone-400 hover:text-[#1A2F1C]'
              }`}
            >
              ইভেন্ট ও ছুটি
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'notes'
                  ? 'border-[#056608] text-[#056608] dark:text-emerald-400'
                  : 'border-transparent text-[#4A5D4C] dark:text-stone-400 hover:text-[#1A2F1C]'
              }`}
            >
              নোট ও রিমাইন্ডার ({notes.length})
            </button>
          </div>

          <button
            onClick={() => setIsTestingDashboardOpen(true)}
            className="text-xs font-semibold text-[#056608] dark:text-emerald-400 hover:underline px-2 py-1 flex items-center gap-1.5"
          >
            <span>🛡️ যাচাইকরণ ড্যাশবোর্ড</span>
          </button>
        </div>
      </div>

      {/* Main App Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-5 sm:py-8">
        {activeTab === 'home' && (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start animate-fadeIn home-print-layout">
            {/* Left Column: Big Date Card, Stats, Holiday Card */}
            <div className="w-full lg:w-5/12 flex flex-col gap-6 daily-card-section">
              <BigDateCard
                currentDate={targetDate}
                bdDate={bdDate}
                wbDate={wbDate}
                hijriDate={hijriDate}
                sunMoon={sunMoon}
                region={region}
                useBengaliDigits={settings.useBengaliDigits}
                homeWidgets={settings.homeWidgets}
                onOpenDetails={() => setIsDetailsModalOpen(true)}
                onShare={handleShare}
                onSaveImage={handleSaveImage}
              />

              <TodayEvents
                events={todayEvents}
                region={region}
                seasonBn={region === 'west_bengal' ? wbDate.seasonBn : bdDate.seasonBn}
              />
            </div>

            {/* Right Column: Month Calendar Grid */}
            <div className="w-full lg:w-7/12 month-grid-section">
              <MonthGrid
                currentDate={todayDate}
                selectedDate={selectedDate}
                onSelectDate={(newD) => {
                  setSelectedDate(newD);
                  setIsDetailsModalOpen(true);
                }}
                region={region}
                useBengaliDigits={settings.useBengaliDigits}
                notes={notes}
              />
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-4 animate-fadeIn month-grid-section">
            <MonthGrid
              currentDate={todayDate}
              selectedDate={selectedDate}
              onSelectDate={(newD) => {
                setSelectedDate(newD);
                setIsDetailsModalOpen(true);
              }}
              region={region}
              useBengaliDigits={settings.useBengaliDigits}
              notes={notes}
            />
            <TodayEvents
              events={todayEvents}
              region={region}
              seasonBn={region === 'west_bengal' ? wbDate.seasonBn : bdDate.seasonBn}
            />
          </div>
        )}

        {activeTab === 'panjika' && (
          <div className="animate-fadeIn">
            <VedicPanjikaView
              settings={settings}
              onUpdateSettings={handleSaveSettings}
            />
          </div>
        )}

        {activeTab === 'converter' && (
          <DateConverter
            initialDate={selectedDate}
            region={region}
            useBengaliDigits={settings.useBengaliDigits}
          />
        )}

        {activeTab === 'events' && (
          <EventsView
            currentDate={selectedDate}
            region={region}
            onSelectDateToView={(newD) => {
              setSelectedDate(newD);
              setActiveTab('home');
              setIsDetailsModalOpen(true);
            }}
          />
        )}

        {activeTab === 'notes' && (
          <NotesAndRemindersView
            notes={notes}
            reminders={reminders}
            onDataChanged={refreshNotesAndReminders}
            onSelectDateToView={(newD) => {
              setSelectedDate(newD);
              setActiveTab('home');
              setIsDetailsModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Date Details Modal */}
      <DateDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        date={targetDate}
        bdDate={bdDate}
        wbDate={wbDate}
        hijriDate={hijriDate}
        sunMoon={sunMoon}
        events={todayEvents}
        notes={notes}
        reminders={reminders}
        region={region}
        useBengaliDigits={settings.useBengaliDigits}
        onNotesUpdated={refreshNotesAndReminders}
        onRemindersUpdated={refreshNotesAndReminders}
        onShare={handleShare}
        onSaveImage={handleSaveImage}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onOpenTestingDashboard={() => setIsTestingDashboardOpen(true)}
      />

      {/* Testing Dashboard Modal */}
      <TestingDashboardModal
        isOpen={isTestingDashboardOpen}
        onClose={() => setIsTestingDashboardOpen(false)}
      />

      {/* Initial Welcome / Region Selection Dialog */}
      <InitialRegionDialog
        isOpen={showInitialRegionDialog}
        onSelect={handleInitialRegionSelect}
      />

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenTestingDashboard={() => setIsTestingDashboardOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        region={region}
        onRegionChange={handleRegionChange}
      />
    </div>
  );
}
