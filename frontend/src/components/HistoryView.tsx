import React, { useState } from 'react';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Bookmark,
  Copy,
  Check,
  Download,
  Share2,
  FileJson,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { TranslationHistoryItem } from '../types';

interface HistoryModalProps {
  history: TranslationHistoryItem[];
  onSelect: (item: TranslationHistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onToggleFavorite: (id: string) => void;
}

export const HistoryView: React.FC<HistoryModalProps> = ({
  history,
  onSelect,
  onDelete,
  onClearAll,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.sourceText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFav = filterFavorites ? item.isFavorite : true;
    return matchesSearch && matchesFav;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lingua-ai-history-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-indigo-600" />
            Translation History & Saved Phrases
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stored locally on your device (IndexedDB). Zero external telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              filterFavorites
                ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${filterFavorites ? 'fill-current' : ''}`} />
            <span>Favorites ({history.filter((h) => h.isFavorite).length})</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors disabled:opacity-40"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-4 mb-4 relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search through past translations or keywords..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>

      {/* History Items List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <HistoryIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-medium">No translations found</p>
          <p className="text-xs">Your completed translations will automatically appear here.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
            >
              <div className="flex-1 cursor-pointer" onClick={() => onSelect(item)}>
                <div className="flex items-center gap-2 mb-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span className="uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {item.sourceLang} → {item.targetLang}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{item.style} style</span>
                  <span>•</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-1">
                  {item.sourceText}
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                  {item.translatedText}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 self-end sm:self-center">
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  title={item.isFavorite ? 'Remove Favorite' : 'Save Favorite'}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    item.isFavorite
                      ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => handleCopy(item.translatedText, item.id)}
                  title="Copy translated text"
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => onDelete(item.id)}
                  title="Delete translation"
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
