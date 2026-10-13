import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  HardDrive,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Server,
  Zap,
  Lock,
  Layers,
  Code
} from 'lucide-react';

interface ModelsViewProps {
  engineStatus: any;
  onRefreshHealth: () => void;
  config: any;
  onUpdateConfig: (newCfg: any) => void;
}

export const ModelsView: React.FC<ModelsViewProps> = ({
  engineStatus,
  onRefreshHealth,
  config,
  onUpdateConfig,
}) => {
  const [modelName, setModelName] = useState(config?.name || 'qwen2.5:1.5b');
  const [engineType, setEngineType] = useState(config?.engine_type || 'ollama');
  const [ollamaHost, setOllamaHost] = useState(config?.ollama_host || 'http://localhost:11434');
  const [temp, setTemp] = useState(config?.temperature || 0.3);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateConfig({
      model_name: modelName,
      engine_type: engineType,
      ollama_host: ollamaHost,
      temperature: parseFloat(temp.toString()),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Privacy & Architecture Overview */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 rounded-md bg-blue-500/30 text-blue-300">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
                Privacy-First Guarantee
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              Local Open-Weight AI Architecture
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              LinguaAI is built entirely on open-weight neural models. All translation inference runs locally via Ollama, CTranslate2, or Hugging Face. Translation history never leaves your device and is kept in local IndexedDB.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRefreshHealth}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Check Model Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* Engine Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Engine</span>
            <Cpu className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100 truncate mb-1">
            {engineStatus?.active_engine || 'Local Multilingual Engine'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Runtime: {engineType.toUpperCase()}
          </p>
        </div>

        {/* Status 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Ollama Connectivity</span>
            <Server className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                engineStatus?.ollama_available ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              {engineStatus?.ollama_available ? 'Connected' : 'Standby / Fallback'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {engineStatus?.ollama_available
              ? 'Local LLM server running'
              : 'Seamless fallback active (No crashes)'}
          </p>
        </div>

        {/* Status 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Storage & Privacy</span>
            <HardDrive className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            100% On-Device
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            IndexedDB zero cloud logging
          </p>
        </div>
      </div>

      {/* Model Configuration Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          Developer Configuration (Hot-Swappable Runtime)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Change the model or runtime endpoint without rebuilding or restarting the application.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Model Name (Ollama / HuggingFace ID)
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g. qwen2.5:1.5b, llama3.2:3b, facebook/nllb-200-distilled-600M"
              className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Tested recommended models: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">qwen2.5:1.5b</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">qwen2.5:7b</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">nllb-200-distilled-600M</code>
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Inference Engine Type
            </label>
            <select
              value={engineType}
              onChange={(e) => setEngineType(e.target.value)}
              className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="ollama">Ollama (Local LLM Daemon)</option>
              <option value="ctranslate2">CTranslate2 (Optimized NLLB C++ Engine)</option>
              <option value="transformers">HuggingFace Transformers</option>
              <option value="heuristic">Built-in Rule-Guided Multilingual Engine</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Ollama Daemon Host URL
            </label>
            <input
              type="text"
              value={ollamaHost}
              onChange={(e) => setOllamaHost(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Temperature ({temp})
            </label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>0.0 (Deterministic / Literal)</span>
              <span>0.3 (Standard)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Configuration saved and applied!
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* Open Weights vs Proprietary Comparison Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          Open-Weight Architecture vs Closed Hosted APIs
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Why open-source AI matters for translation privacy, security, and digital sovereignty.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">Dimension</th>
                <th className="py-3 px-4 text-blue-600 dark:text-blue-400">LinguaAI (Open-Weights)</th>
                <th className="py-3 px-4 rounded-r-lg text-slate-400">Closed Commercial APIs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3 px-4 font-semibold">Data Privacy</td>
                <td className="py-3 px-4 text-emerald-600 font-medium">100% Local, zero server leakage</td>
                <td className="py-3 px-4 text-rose-500">Sent to third-party data centers</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Cost & Quotas</td>
                <td className="py-3 px-4 text-emerald-600 font-medium">Free, unlimited, no token fees</td>
                <td className="py-3 px-4 text-rose-500">Per-character / token metering</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Offline Operation</td>
                <td className="py-3 px-4 text-emerald-600 font-medium">Yes, runs entirely offline</td>
                <td className="py-3 px-4 text-rose-500">Requires continuous internet connection</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Model Freedom</td>
                <td className="py-3 px-4 text-emerald-600 font-medium">Any GGUF / HuggingFace model</td>
                <td className="py-3 px-4 text-rose-500">Vendor lock-in, proprietary weights</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Regional Scripts</td>
                <td className="py-3 px-4 text-emerald-600 font-medium">Full Devanagari & Indic fine-tuning</td>
                <td className="py-3 px-4 text-amber-500">Generic statistical or English-centric bias</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
