"""
LinguaAI Configuration and Model Specifications
Supports configurable local backends:
- Ollama runtime (e.g. Qwen2.5:1.5b / 7b, Llama-3.2, etc.)
- CTranslate2 / HuggingFace NLLB-200 (nllb-200-distilled-600M / quantized int8)
- Local Fallback Rule-Guided Engine (for offline demonstration without GPU/high RAM requirement)
"""

import os
from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class ModelConfig(BaseModel):
    name: str = "qwen2.5:1.5b"
    engine_type: str = "ollama"  # "ollama", "ctranslate2", "transformers", "heuristic"
    ollama_host: str = "http://localhost:11434"
    hf_model_id: str = "facebook/nllb-200-distilled-600M"
    timeout_seconds: float = 30.0
    temperature: float = 0.3
    max_tokens: int = 1024

# Supported Language Definitions with script metadata & NLLB codes
SUPPORTED_LANGUAGES = [
    {"code": "en", "name": "English", "native": "English", "script": "Latin", "nllb": "eng_Latn", "supported": True},
    {"code": "hi", "name": "Hindi", "native": "हिन्दी", "script": "Devanagari", "nllb": "hin_Deva", "supported": True, "priority": True},
    {"code": "mr", "name": "Marathi", "native": "मराठी", "script": "Devanagari", "nllb": "mar_Deva", "supported": True, "priority": True},
    {"code": "bn", "name": "Bengali", "native": "বাংলা", "script": "Bengali", "nllb": "ben_Beng", "supported": True},
    {"code": "ta", "name": "Tamil", "native": "தமிழ்", "script": "Tamil", "nllb": "tam_Taml", "supported": True},
    {"code": "te", "name": "Telugu", "native": "తెలుగు", "script": "Telugu", "nllb": "tel_Telu", "supported": True},
    {"code": "gu", "name": "Gujarati", "native": "ગુજરાતી", "script": "Gujarati", "nllb": "guj_Gujr", "supported": True},
    {"code": "kn", "name": "Kannada", "native": "ಕನ್ನಡ", "script": "Kannada", "nllb": "kan_Knda", "supported": True},
    {"code": "ml", "name": "Malayalam", "native": "മലയാളം", "script": "Malayalam", "nllb": "mal_Mlym", "supported": True},
    {"code": "pa", "name": "Punjabi", "native": "ਪੰਜਾਬੀ", "script": "Gurmukhi", "nllb": "pan_Guru", "supported": True},
    {"code": "ur", "name": "Urdu", "native": "اردو", "script": "Arabic", "nllb": "urd_Arab", "supported": True},
    {"code": "es", "name": "Spanish", "native": "Español", "script": "Latin", "nllb": "spa_Latn", "supported": True},
    {"code": "fr", "name": "French", "native": "Français", "script": "Latin", "nllb": "fra_Latn", "supported": True},
    {"code": "de", "name": "German", "native": "Deutsch", "script": "Latin", "nllb": "deu_Latn", "supported": True},
    {"code": "ja", "name": "Japanese", "native": "日本語", "script": "Japanese", "nllb": "jpn_Jpan", "supported": True},
    {"code": "zh", "name": "Chinese (Simplified)", "native": "中文", "script": "Simplified Han", "nllb": "zho_Hans", "supported": True},
    {"code": "ar", "name": "Arabic", "native": "العربية", "script": "Arabic", "nllb": "arb_Arab", "supported": True},
    {"code": "ru", "name": "Russian", "native": "Русский", "script": "Cyrillic", "nllb": "rus_Cyrl", "supported": True},
]

# Translation Styles
TRANSLATION_STYLES = [
    {
        "id": "standard",
        "name": "Standard",
        "description": "Accurate, natural, and balanced translation preserving original meaning.",
        "prompt_instruction": "Provide an accurate, fluent, and natural translation preserving tone and intent."
    },
    {
        "id": "formal",
        "name": "Formal",
        "description": "Professional, respectful communication suitable for official letters and workplace.",
        "prompt_instruction": "Translate into a formal, highly professional, and respectful tone with polite honorifics."
    },
    {
        "id": "casual",
        "name": "Casual",
        "description": "Everyday conversations, friendly chat, and relaxed social tone.",
        "prompt_instruction": "Translate using colloquial, friendly, and everyday conversational language."
    },
    {
        "id": "academic",
        "name": "Academic",
        "description": "Scholarly, research-oriented, and objective vocabulary.",
        "prompt_instruction": "Translate in a scholarly, rigorous, and academic tone with precise terminology."
    },
    {
        "id": "business",
        "name": "Business",
        "description": "Professional business correspondence, corporate emails, and client proposals.",
        "prompt_instruction": "Translate into a polished corporate and business tone tailored for professional correspondence."
    },
    {
        "id": "creative",
        "name": "Creative",
        "description": "Preserve the emotional resonance, literary flair, and original voice.",
        "prompt_instruction": "Preserve metaphorical nuance, artistic flair, and expressive cadence in the translation."
    },
    {
        "id": "simple",
        "name": "Simple Language",
        "description": "Easy-to-understand wording, concise phrasing, and clear vocabulary.",
        "prompt_instruction": "Translate using clear, simple, plain language that is easy for anyone to understand."
    }
]
