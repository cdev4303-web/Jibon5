import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'অপ্রত্যাশিত কোনো ত্রুটি ঘটেছে',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    // If notification or settings crashed it, disable notification before reload
    try {
      const settingsStr = localStorage.getItem('app_settings');
      if (settingsStr) {
        const parsed = JSON.parse(settingsStr);
        parsed.enableDailyNotification = false;
        parsed.dailyNotification = false;
        localStorage.setItem('app_settings', JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  private handleFullReset = () => {
    try {
      localStorage.removeItem('app_settings');
      localStorage.removeItem('last_daily_notification_date');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-stone-800 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-700 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                অ্যাপ লোড হতে সমস্যা হয়েছে
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                ব্রাউজারের নোটিফিকেশন বা সিস্টেমে সাময়িক সমস্যা হয়েছিল। সাদা পর্দা এড়াতে স্বয়ংক্রিয় নিরাপত্তা ব্যবস্থা সক্রিয় হয়েছে।
              </p>
              {this.state.errorMessage && (
                <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 text-xs text-stone-500 font-mono break-all text-left max-h-24 overflow-y-auto">
                  {this.state.errorMessage}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-[#056608] hover:bg-[#045206] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>অ্যাপটি পুনরায় চালু করুন</span>
              </button>

              <button
                onClick={this.handleFullReset}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-medium transition-all"
              >
                নোটিফিকেশন ও সেটিংস রিসেট করে লোড করুন
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
