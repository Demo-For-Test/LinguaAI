export interface Language {
  code: string;
  name: string;
  native: string;
  script: string;
  nllb?: string;
  supported: boolean;
  priority?: boolean;
}

export interface TranslationStyle {
  id: string;
  name: string;
  description: string;
  prompt_instruction: string;
}

export interface TranslationHistoryItem {
  id: string;
  timestamp: number;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  style: string;
  context?: string;
  isFavorite: boolean;
  explanation?: string;
  alternative?: string;
  engineUsed?: string;
}

export interface TranslationResponse {
  translated_text: string;
  explanation?: string;
  alternative?: string;
  engine_used: string;
  model_weights?: string;
  detected_source?: {
    language: string;
    confidence: number;
    script: string;
  };
  actual_source: string;
  target_lang: string;
  char_count: number;
  word_count: number;
  error?: string;
}

export interface PhrasebookItem {
  id: string;
  category: string;
  english: string;
  hindi: string;
  marathi: string;
  context?: string;
  cultural_note?: string;
  transliteration_hi?: string;
  transliteration_mr?: string;
  notes?: string;
}

export interface PhrasebookCategory {
  id: string;
  name: string;
  icon: string;
}
