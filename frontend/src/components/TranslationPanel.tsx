import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Trash2,
  Volume2,
  Bookmark,
  Sparkles,
  Layers,
  HelpCircle,
  RefreshCw,
  Info,
  Clock,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { TranslationResponse } from '../types';

interface TranslationPanelProps {
  sourceText: string;
  setSourceText: (val: string) => void;
  translatedData: TranslationResponse | null;
  isLoading: boolean;
  onTranslate: (styleOverride?: string) => void;
  onClear: () => void;
  onSaveFavorite: () => void;
  isFavorite: boolean;
  context: string;
  setContext: (val: string) => void;
  sourceLang: string;
  targetLang: string;
  charLimit?: number;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({
  sourceText,
  setSourceText,
  translatedData,
  isLoading,
  onTranslate,
  onClear,
  onSaveFavorite,
  isFavorite,
  context,
  setContext,
  sourceLang,
  targetLang,
  charLimit = 10000,
}) => {
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [showSideBySide, setShowSideBySide] = useState(false);
  const [showContextField, setShowContextField] = useState(false);

  const charCount = sourceText.length;
  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;

  const handleCopySource = () => {
    navigator.clipboard.writeText(sourceText);
    setCopiedSource(true);
    setTimeout(() => setCopiedSource(false), 2000);
  };

  const handleCopyOutput = () => {
    if (translatedData?.translated_text) {
      navigator.clipboard.writeText(translatedData.translated_text);
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    }
  };

  const handlePasteSource = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSourceText(text);
    } catch (e) {
      console.warn('Clipboard paste blocked by browser permissions', e);
    }
  };

  const handleDownload = () => {
    if (!translatedData?.translated_text) return;
    const content = `--- LinguaAI Translation Export ---\n\nSource (${sourceLang}):\n${sourceText}\n\nTranslation (${targetLang}):\n${translatedData.translated_text}\n\nEngine: ${translatedData.engine_used || 'Open-Source AI'}\nTimestamp: ${new Date().toISOString()}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lingua-ai-translation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Context Drawer Toggle */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <button
          onClick={() => setShowContextField(!showContextField)}
          className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {showContextField ? 'Hide Audience / Context' : '+ Add Audience or Situation Context (e.g. Business response, Academic essay)'}
        </button>

        {/* Side-by-side comparison toggle */}
        {translatedData?.translated_text && (
          <button
            onClick={() => setShowSideBySide(!showSideBySide)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
              showSideBySide
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showSideBySide ? 'Standard Panels' : 'Side-by-Side Comparison'}</span>
          </button>
        )}
      </div>

      {/* Optional Context Field */}
      {showContextField && (
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-3 animate-in fade-in transition-all">
          <label className="block text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">
            Translation Context & Tone Guidance
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. 'Formal response to senior client asking for timeline', 'Travel inquiry at train ticket counter'"
            className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      )}

      {/* Side-by-side mode view */}
      {showSideBySide && translatedData?.translated_text ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Parallel Side-by-Side Inspection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Original Text ({sourceLang})
              </span>
              <p className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {sourceText}
              </p>
            </div>
            <div className="p-4 bg-blue-50/40 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-2">
                Translated Text ({targetLang})
              </span>
              <p className="whitespace-pre-wrap text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-sans font-medium">
                {translatedData.translated_text}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Dual Panels (Stacked on Mobile, Side-by-side on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Source Text Input Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-colors focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-3 text-xs font-medium text-slate-400">
              <span>SOURCE INPUT</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePasteSource}
                  className="px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px]"
                >
                  Paste
                </button>
                {sourceText && (
                  <button
                    onClick={onClear}
                    className="px-2 py-0.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Type or paste text to translate... (e.g. 'I'll get back to you' or 'Where is the nearest railway station?')"
              className="w-full h-56 sm:h-64 resize-none bg-transparent border-0 text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-relaxed placeholder:text-slate-400 focus:outline-none"
              maxLength={charLimit}
            />
          </div>

          {/* Source Footer Stats & Action */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span>{wordCount} words</span>
              <span>•</span>
              <span className={charCount > charLimit * 0.9 ? 'text-amber-500 font-semibold' : ''}>
                {charCount} / {charLimit} chars
              </span>
            </div>

            <div className="flex items-center gap-2">
              {sourceText && (
                <button
                  onClick={handleCopySource}
                  title="Copy source text"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {copiedSource ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={() => onTranslate()}
                disabled={isLoading || !sourceText.trim()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isLoading || !sourceText.trim()
                    ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Translate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Translated Output Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-3 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                TRANSLATION OUTPUT
              </span>

              {translatedData && (
                <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {translatedData.engine_used || 'Open AI Engine'}
                </span>
              )}
            </div>

            {/* Translation Output or Loading state */}
            {isLoading ? (
              <div className="h-56 sm:h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-sm font-medium animate-pulse">Running Neural Translation Model...</p>
                <p className="text-xs text-slate-400">Preserving cultural context, script, and tone</p>
              </div>
            ) : translatedData?.translated_text ? (
              <div className="space-y-4">
                <div className="h-56 sm:h-64 overflow-y-auto pr-1">
                  <p className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-relaxed font-sans font-medium">
                    {translatedData.translated_text}
                  </p>

                  {/* Cultural note or linguistic explanation */}
                  {translatedData.explanation && (
                    <div className="mt-4 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block mb-0.5">Linguistic & Cultural Context:</span>
                        <span>{translatedData.explanation}</span>
                      </div>
                    </div>
                  )}

                  {/* Alternative rephrasing */}
                  {translatedData.alternative && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block mb-0.5">Alternative Phrasing / Transliteration:</span>
                        <span>{translatedData.alternative}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-56 sm:h-64 flex flex-col items-center justify-center text-slate-400 text-center p-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-300 dark:text-slate-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Translation will appear here
                </p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Type your text and click Translate. Select context and styles for tailored outputs.
                </p>
              </div>
            )}
          </div>

          {/* Output Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              {translatedData?.translated_text && (
                <>
                  <button
                    onClick={handleCopyOutput}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {copiedOutput ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedOutput ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={onSaveFavorite}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
                      isFavorite
                        ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    title="Export as Text File"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </>
              )}
            </div>

            {translatedData?.translated_text && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onTranslate('simple')}
                  title="Rephrase simpler"
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-medium transition-colors"
                >
                  Make Simpler
                </button>
                <button
                  onClick={() => onTranslate('formal')}
                  title="Rephrase formally"
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-medium transition-colors"
                >
                  Make Formal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
