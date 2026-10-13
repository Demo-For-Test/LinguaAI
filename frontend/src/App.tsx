import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LanguageBar } from './components/LanguageBar';
import { TranslationPanel } from './components/TranslationPanel';
import { HistoryView } from './components/HistoryView';
import { PhrasebookView } from './components/PhrasebookView';
import { ModelsView } from './components/ModelsView';
import {
  Language,
  TranslationStyle,
  TranslationHistoryItem,
  TranslationResponse,
  PhrasebookItem,
  PhrasebookCategory,
} from './types';
import {
  getAllTranslations,
  saveTranslation,
  deleteTranslation,
  clearAllTranslations,
  toggleFavorite,
} from './services/storage';

export function App() {
  const [activeTab, setActiveTab] = useState<'translate' | 'phrasebook' | 'history' | 'models'>('translate');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Core Translation State
  const [sourceText, setSourceText] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<string>('auto');
  const [targetLang, setTargetLang] = useState<string>('hi');
  const [selectedStyle, setSelectedStyle] = useState<string>('standard');
  const [context, setContext] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [translatedData, setTranslatedData] = useState<TranslationResponse | null>(null);
  const [detectedLang, setDetectedLang] = useState<{ language: string; confidence: number; script: string } | null>(null);

  // Metadata from backend
  const [languages, setLanguages] = useState<Language[]>([]);
  const [styles, setStyles] = useState<TranslationStyle[]>([]);
  const [engineInfo, setEngineInfo] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  // Phrasebook
  const [categories, setCategories] = useState<PhrasebookCategory[]>([]);
  const [phraseEntries, setPhraseEntries] = useState<PhrasebookItem[]>([]);

  // Local History
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [isCurrentFavorite, setIsCurrentFavorite] = useState<boolean>(false);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load Initial Metadata
  useEffect(() => {
    fetchLanguagesAndStyles();
    fetchHealth();
    fetchPhrasebook();
    fetchConfig();
    loadHistory();
  }, []);

  const fetchLanguagesAndStyles = async () => {
    try {
      const res = await fetch('/api/languages');
      if (res.ok) {
        const data = await res.json();
        setLanguages(data.languages);
        setStyles(data.styles);
      }
    } catch (e) {
      console.warn('Failed to fetch languages from backend, using fallback', e);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setEngineInfo(data.engine_info);
      }
    } catch (e) {
      console.warn('Backend health check error', e);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (e) {
      console.warn('Backend config fetch error', e);
    }
  };

  const fetchPhrasebook = async () => {
    try {
      const res = await fetch('/api/phrasebook');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
        setPhraseEntries(data.entries);
      }
    } catch (e) {
      console.warn('Phrasebook fetch error', e);
    }
  };

  const loadHistory = async () => {
    const items = await getAllTranslations();
    setHistory(items);
  };

  // Language Auto-Detection as user types
  useEffect(() => {
    if (sourceLang === 'auto' && sourceText.trim().length > 3) {
      const debounce = setTimeout(async () => {
        try {
          const res = await fetch('/api/detect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: sourceText }),
          });
          if (res.ok) {
            const data = await res.json();
            setDetectedLang(data);
          }
        } catch {
          // silent fallback
        }
      }, 400);
      return () => clearTimeout(debounce);
    }
  }, [sourceText, sourceLang]);

  // One-Click Language Swap
  const handleSwap = () => {
    if (sourceLang === 'auto') return;
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    setSourceLang(prevTgt);
    setTargetLang(prevSrc);

    if (translatedData?.translated_text) {
      const prevSourceText = sourceText;
      setSourceText(translatedData.translated_text);
      setTranslatedData({
        ...translatedData,
        translated_text: prevSourceText,
        actual_source: prevTgt,
        target_lang: prevSrc,
      });
    }
  };

  // Main Translation Trigger
  const handleTranslate = async (styleOverride?: string) => {
    if (!sourceText.trim()) return;

    const activeStyle = styleOverride || selectedStyle;
    setIsLoading(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          source_lang: sourceLang,
          target_lang: targetLang,
          style: activeStyle,
          context: context || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Translation failed');
      }

      const data: TranslationResponse = await res.json();
      setTranslatedData(data);
      if (data.detected_source) {
        setDetectedLang(data.detected_source);
      }

      // Automatically store in IndexedDB
      const newHistoryItem: TranslationHistoryItem = {
        id: `trans_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        sourceText,
        translatedText: data.translated_text,
        sourceLang: data.actual_source,
        targetLang: data.target_lang,
        style: activeStyle,
        context: context || undefined,
        isFavorite: false,
        explanation: data.explanation,
        alternative: data.alternative,
        engineUsed: data.engine_used,
      };

      await saveTranslation(newHistoryItem);
      setCurrentHistoryId(newHistoryItem.id);
      setIsCurrentFavorite(false);
      await loadHistory();
    } catch (err: any) {
      console.error('Translation error:', err);
      setTranslatedData({
        translated_text: '',
        error: err.message || 'Unable to reach translation model. Please check engine settings.',
        engine_used: 'Offline Fallback Active',
        actual_source: sourceLang,
        target_lang: targetLang,
        char_count: sourceText.length,
        word_count: sourceText.split(' ').length,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedData(null);
    setCurrentHistoryId(null);
    setIsCurrentFavorite(false);
  };

  const handleSaveFavorite = async () => {
    if (currentHistoryId) {
      const fav = await toggleFavorite(currentHistoryId);
      setIsCurrentFavorite(fav);
      await loadHistory();
    }
  };

  const handleSelectHistoryItem = (item: TranslationHistoryItem) => {
    setSourceText(item.sourceText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setSelectedStyle(item.style);
    if (item.context) setContext(item.context);
    setTranslatedData({
      translated_text: item.translatedText,
      explanation: item.explanation,
      alternative: item.alternative,
      engine_used: item.engineUsed || 'Local Engine',
      actual_source: item.sourceLang,
      target_lang: item.targetLang,
      char_count: item.sourceText.length,
      word_count: item.sourceText.split(' ').length,
    });
    setCurrentHistoryId(item.id);
    setIsCurrentFavorite(item.isFavorite);
    setActiveTab('translate');
  };

  const handleDeleteHistory = async (id: string) => {
    await deleteTranslation(id);
    await loadHistory();
  };

  const handleClearAllHistory = async () => {
    if (window.confirm('Clear all local translation history? This cannot be undone.')) {
      await clearAllTranslations();
      await loadHistory();
    }
  };

  const handleToggleHistoryFavorite = async (id: string) => {
    await toggleFavorite(id);
    if (currentHistoryId === id) {
      setIsCurrentFavorite(!isCurrentFavorite);
    }
    await loadHistory();
  };

  const handleUsePhrase = (phrase: string, target: 'hi' | 'mr') => {
    setSourceText(phrase);
    setSourceLang('en');
    setTargetLang(target);
    setActiveTab('translate');
  };

  const handleUpdateConfig = async (newCfg: any) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCfg),
      });
      if (res.ok) {
        await fetchConfig();
        await fetchHealth();
      }
    } catch (e) {
      console.warn('Update config error', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        engineStatus={engineInfo?.active_engine}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'translate' && (
          <div className="animate-in fade-in duration-150">
            {/* Top Language Selectors & Style Switcher */}
            <LanguageBar
              languages={languages}
              styles={styles}
              sourceLang={sourceLang}
              setSourceLang={setSourceLang}
              targetLang={targetLang}
              setTargetLang={setTargetLang}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              onSwap={handleSwap}
              detectedLang={detectedLang}
            />

            {/* Translation Input/Output Panels */}
            <TranslationPanel
              sourceText={sourceText}
              setSourceText={setSourceText}
              translatedData={translatedData}
              isLoading={isLoading}
              onTranslate={handleTranslate}
              onClear={handleClear}
              onSaveFavorite={handleSaveFavorite}
              isFavorite={isCurrentFavorite}
              context={context}
              setContext={setContext}
              sourceLang={sourceLang}
              targetLang={targetLang}
            />
          </div>
        )}

        {activeTab === 'phrasebook' && (
          <div className="animate-in fade-in duration-150">
            <PhrasebookView
              categories={categories}
              entries={phraseEntries}
              onUsePhrase={handleUsePhrase}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-150">
            <HistoryView
              history={history}
              onSelect={handleSelectHistoryItem}
              onDelete={handleDeleteHistory}
              onClearAll={handleClearAllHistory}
              onToggleFavorite={handleToggleHistoryFavorite}
            />
          </div>
        )}

        {activeTab === 'models' && (
          <div className="animate-in fade-in duration-150">
            <ModelsView
              engineStatus={engineInfo}
              onRefreshHealth={fetchHealth}
              config={config}
              onUpdateConfig={handleUpdateConfig}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">LinguaAI</span>
            <span>•</span>
            <span>Smart Open-Source AI Neural Translator</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Local Inference Ready</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('models')}
              className="hover:text-blue-600 transition-colors"
            >
              Open-Weights Architecture
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('phrasebook')}
              className="hover:text-violet-600 transition-colors"
            >
              Regional Indian Phrasebook
            </button>
            <span>•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              GitHub / Hacktoberfest 2026
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
