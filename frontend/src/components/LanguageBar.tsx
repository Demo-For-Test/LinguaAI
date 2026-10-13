import React from 'react';
import { ArrowLeftRight, Check, ChevronDown, Sparkles } from 'lucide-react';
import { Language, TranslationStyle } from '../types';

interface LanguageBarProps {
  languages: Language[];
  styles: TranslationStyle[];
  sourceLang: string;
  setSourceLang: (val: string) => void;
  targetLang: string;
  setTargetLang: (val: string) => void;
  selectedStyle: string;
  setSelectedStyle: (val: string) => void;
  onSwap: () => void;
  detectedLang?: { language: string; confidence: number; script: string } | null;
}

export const LanguageBar: React.FC<LanguageBarProps> = ({
  languages,
  styles,
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
  selectedStyle,
  setSelectedStyle,
  onSwap,
  detectedLang,
}) => {
  // Frequently used quick buttons (English, Hindi, Marathi, Spanish)
  const quickPicks = ['en', 'hi', 'mr', 'es'];

  const getLangName = (code: string) => {
    if (code === 'auto') {
      if (detectedLang) {
        const found = languages.find((l) => l.code === detectedLang.language);
        return `Auto Detect (${found ? found.name : detectedLang.language})`;
      }
      return 'Auto Detect';
    }
    const found = languages.find((l) => l.code === code);
    return found ? `${found.name} (${found.native})` : code;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Language Selection Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
          {/* Source Lang dropdown */}
          <div className="relative flex-1 min-w-[160px]">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              From
            </label>
            <div className="relative">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                aria-label="Source Language"
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                <option value="auto">
                  🌐 Auto Detect {detectedLang ? `(${detectedLang.language})` : ''}
                </option>
                {languages.map((l) => (
                  <option key={`src-${l.code}`} value={l.code}>
                    {l.name} — {l.native} {l.priority ? '★' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Swap Button */}
          <div className="pt-5">
            <button
              onClick={onSwap}
              disabled={sourceLang === 'auto'}
              title={sourceLang === 'auto' ? 'Select a specific source language to swap' : 'Swap languages'}
              aria-label="Swap Languages"
              className={`p-2.5 rounded-xl border transition-all ${
                sourceLang === 'auto'
                  ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:scale-105 active:scale-95 shadow-sm'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Target Lang dropdown */}
          <div className="relative flex-1 min-w-[160px]">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              To
            </label>
            <div className="relative">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                aria-label="Target Language"
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                {languages.map((l) => (
                  <option key={`tgt-${l.code}`} value={l.code}>
                    {l.name} — {l.native} {l.priority ? '★ (Regional Priority)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Translation Style Selector */}
        <div className="w-full lg:w-72">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-violet-500" />
            Translation Style
          </label>
          <div className="relative">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              aria-label="Translation Style"
              className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
            >
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.description.slice(0, 32)}...
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Quick Regional Language Pills for quick access */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-slate-400">Quick Regional Pairs:</span>
          <button
            onClick={() => { setSourceLang('en'); setTargetLang('hi'); }}
            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-medium transition-colors"
          >
            English → Hindi
          </button>
          <button
            onClick={() => { setSourceLang('en'); setTargetLang('mr'); }}
            className="px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 font-medium transition-colors"
          >
            English → Marathi
          </button>
          <button
            onClick={() => { setSourceLang('hi'); setTargetLang('en'); }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium transition-colors"
          >
            Hindi → English
          </button>
          <button
            onClick={() => { setSourceLang('mr'); setTargetLang('hi'); }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium transition-colors"
          >
            Marathi → Hindi
          </button>
        </div>

        <div className="text-[11px] text-slate-400 italic">
          Preserves Devanagari script & honorifics
        </div>
      </div>
    </div>
  );
};
