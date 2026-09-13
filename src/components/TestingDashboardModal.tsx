import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, RefreshCw, ShieldCheck, Award } from 'lucide-react';
import { TestResultItem } from '../types';
import { CalendarValidator } from '../calendar/calendar-validator';

interface TestingDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestingDashboardModal: React.FC<TestingDashboardModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [results, setResults] = useState<TestResultItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = CalendarValidator.runAllTests();
      setResults(res);
      setIsRunning(false);
    }, 150);
  };

  useEffect(() => {
    runTests();
  }, []);

  const total = results.length;
  const passed = results.filter((r) => r.status === 'passed').length;
  const allPassed = total > 0 && passed === total;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E0E4D9] dark:border-stone-800 shadow-2xl relative my-auto transition-colors">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs p-5 sm:p-6 border-b border-[#E0E4D9] dark:border-stone-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#056608] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#056608] dark:text-emerald-400 block mb-0.5">
                অ্যালগরিদম অডিট
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A2F1C] dark:text-stone-100">
                ক্যালেন্ডার যাচাইকরণ ড্যাশবোর্ড
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-9 h-9 rounded-full border border-[#E0E4D9] dark:border-stone-700 hover:bg-[#F9FAF7] dark:hover:bg-stone-800 flex items-center justify-center text-[#1A2F1C] dark:text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Card */}
        <div className="p-6">
          <div
            className={`p-5 rounded-[24px] border flex items-center justify-between gap-4 ${
              allPassed
                ? 'bg-[#EBF0E4] dark:bg-stone-800 border-[#D1D8C5] dark:border-stone-700 text-[#056608] dark:text-emerald-300'
                : 'bg-[#FFF1F1] border-red-200 text-[#D2122E]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                  allPassed ? 'bg-[#056608]' : 'bg-[#D2122E]'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">
                  {passed} / {total} টি টেস্ট সফল (Passed)
                </div>
                <div className="text-xs font-semibold text-[#056608] dark:text-emerald-400 mt-0.5">
                  {allPassed
                    ? '✓ সমস্ত গাণিতিক নিয়ম শতভাগ নির্ভুলভাবে উত্তীর্ণ হয়েছে!'
                    : 'কিছু টেস্ট অসম্পূর্ণ রয়েছে'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const md = `# বাংলা ক্যালেন্ডার ভ্যালিডেশন টেস্ট রিপোর্ট
তারিখ: ${new Date().toLocaleString()}
মোট টেস্ট: ${total} | উত্তীর্ণ: ${passed} | ব্যর্থ: ${total - passed}

| টেস্টের নাম | ক্যাটাগরি | প্রত্যাশিত | ফলাফল | স্ট্যাটাস |
| :--- | :--- | :--- | :--- | :--- |
${results.map((r) => `| ${r.title} | ${r.category} | ${r.expected} | ${r.actual} | ${r.status.toUpperCase()} |`).join('\n')}
`;
                  navigator.clipboard.writeText(md);
                  alert('টেস্ট রিপোর্ট ক্লিপবোর্ডে কপি হয়েছে!');
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-[#056608] dark:text-emerald-400 border border-[#D1D8C5] dark:border-stone-700 text-xs font-semibold hover:bg-[#F9FAF7] transition-colors"
                title="টেস্ট রিপোর্ট কপি করুন"
              >
                রিপোর্ট কপি
              </button>
              <button
                onClick={runTests}
                disabled={isRunning}
                className="p-2.5 rounded-full bg-white dark:bg-stone-800 text-[#1A2F1C] dark:text-stone-200 border border-[#D1D8C5] dark:border-stone-700 hover:bg-[#F9FAF7] transition-colors shrink-0"
                title="পুনরায় টেস্ট চালান"
              >
                <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin text-[#056608]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Detailed Test Items List */}
          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5D4C] dark:text-stone-400">
              টেস্টের বিস্তারিত ফলাফল
            </h4>

            {results.map((test) => (
              <div
                key={test.id}
                className="p-4 rounded-[20px] border border-[#E0E4D9] dark:border-stone-800 bg-[#F9FAF7] dark:bg-stone-800/40 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {test.status === 'passed' ? (
                      <CheckCircle className="w-4 h-4 text-[#056608] shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#D2122E] shrink-0" />
                    )}
                    <span className="font-bold text-[#1A2F1C] dark:text-stone-100 text-sm">
                      {test.title}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] shrink-0 ${
                      test.status === 'passed'
                        ? 'bg-[#EBF0E4] text-[#056608] border border-[#D1D8C5]'
                        : 'bg-[#FFF1F1] text-[#D2122E] border border-red-200'
                    }`}
                  >
                    {test.status === 'passed' ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#4A5D4C] dark:text-stone-400 pt-1">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-[#E0E4D9] dark:border-stone-700">
                    <span className="font-semibold text-[#8A967E] block text-[10px]">প্রত্যাশিত (Expected):</span>
                    <span className="font-medium text-[#1A2F1C] dark:text-stone-200">{test.expected}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-[#E0E4D9] dark:border-stone-700">
                    <span className="font-semibold text-[#8A967E] block text-[10px]">ফলাফল (Actual):</span>
                    <span className="font-medium text-[#056608] dark:text-emerald-300">{test.actual}</span>
                  </div>
                </div>

                {test.explanation && (
                  <p className="text-[11px] text-[#8A967E] dark:text-stone-400 italic pt-0.5">
                    ব্যাখ্যা: {test.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
