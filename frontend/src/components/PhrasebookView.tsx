import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Copy,
  Check,
  Send,
  Compass,
  GraduationCap,
  MessageSquare,
  Briefcase,
  ShieldAlert,
  Laptop
} from 'lucide-react';
import { PhrasebookItem, PhrasebookCategory } from '../types';

interface PhrasebookViewProps {
  categories: PhrasebookCategory[];
  entries: PhrasebookItem[];
  onUsePhrase: (phrase: string, targetLang: 'hi' | 'mr') => void;
}

export const PhrasebookView: React.FC<PhrasebookViewProps> = ({
  categories,
  entries,
  onUsePhrase,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getIcon = (catId: string) => {
    switch (catId) {
      case 'travel':
        return <Compass className="w-4 h-4" />;
      case 'education':
        return <GraduationCap className="w-4 h-4" />;
      case 'daily':
        return <MessageSquare className="w-4 h-4" />;
      case 'professional':
        return <Briefcase className="w-4 h-4" />;
      case 'emergency':
        return <ShieldAlert className="w-4 h-4" />;
      default:
        return <Laptop className="w-4 h-4" />;
    }
  };

  const filtered = entries.filter((e) => {
    const matchesCat = selectedCategory ? e.category === selectedCategory : true;
    const q = searchTerm.toLowerCase();
    const matchesQuery =
      !q ||
      e.english.toLowerCase().includes(q) ||
      e.hindi.toLowerCase().includes(q) ||
      e.marathi.toLowerCase().includes(q) ||
      (e.context && e.context.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Title & Regional Highlights */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-600" />
            Curated Regional Phrasebook & Cultural Nuance Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified everyday expressions in English, Hindi, and Marathi with Devanagari script integrity.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40 font-medium">
          🇮🇳 India-Specific Regional Optimization
        </div>
      </div>

      {/* Categories & Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === ''
              ? 'bg-violet-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          All Categories ({entries.length})
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === c.id
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {getIcon(c.id)}
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="mb-4 relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search phrases in English, Hindi, or Marathi..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        />
      </div>

      {/* Phrasebook Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-violet-200 dark:hover:border-violet-900/60 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Context Header */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-2">
                <span className="uppercase px-2 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                  {item.category}
                </span>
                {item.context && <span className="italic">{item.context}</span>}
              </div>

              {/* English Phrase */}
              <div className="mb-3">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">English</div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {item.english}
                </div>
              </div>

              {/* Hindi & Marathi Translations */}
              <div className="space-y-2 mb-3">
                <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                  <div className="flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold mb-0.5">
                    <span>हिन्दी (Hindi)</span>
                    <button
                      onClick={() => handleCopy(item.hindi, `${item.id}-hi`)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {copiedId === `${item.id}-hi` ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-slate-900 dark:text-slate-100 font-medium font-sans">
                    {item.hindi}
                  </p>
                  {item.transliteration_hi && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">
                      {item.transliteration_hi}
                    </p>
                  )}
                </div>

                <div className="p-2.5 rounded-lg bg-violet-50/60 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40">
                  <div className="flex items-center justify-between text-[11px] text-violet-600 dark:text-violet-400 font-semibold mb-0.5">
                    <span>मराठी (Marathi)</span>
                    <button
                      onClick={() => handleCopy(item.marathi, `${item.id}-mr`)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {copiedId === `${item.id}-mr` ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-slate-900 dark:text-slate-100 font-medium font-sans">
                    {item.marathi}
                  </p>
                  {item.transliteration_mr && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">
                      {item.transliteration_mr}
                    </p>
                  )}
                </div>
              </div>

              {/* Cultural Note */}
              {item.cultural_note && (
                <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-900/40 mb-3">
                  💡 {item.cultural_note}
                </p>
              )}
            </div>

            {/* Quick Actions to Load into Main Translator */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Use in Translator:</span>
              <button
                onClick={() => onUsePhrase(item.english, 'hi')}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 transition-colors"
              >
                Translate to Hindi →
              </button>
              <button
                onClick={() => onUsePhrase(item.english, 'mr')}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-900/40 hover:text-violet-600 transition-colors"
              >
                Translate to Marathi →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
