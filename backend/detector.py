"""
Language Detector and Script Analyzer
Analyzes unicode code ranges to reliably detect scripts (Devanagari, Tamil, Bengali, Telugu, Gujarati, Latin, Han, etc.)
and determines primary language candidate with confidence.
"""

import re
from typing import Dict, Any

SCRIPT_RANGES = {
    "Devanagari": (0x0900, 0x097F),
    "Bengali": (0x0980, 0x09FF),
    "Gurmukhi": (0x0A00, 0x0A7F),
    "Gujarati": (0x0A80, 0x0AFF),
    "Tamil": (0x0B80, 0x0BFF),
    "Telugu": (0x0C00, 0x0C7F),
    "Kannada": (0x0C80, 0x0CFF),
    "Malayalam": (0x0D00, 0x0D7F),
    "Arabic": (0x0600, 0x06FF),
    "Cyrillic": (0x0400, 0x04FF),
    "Japanese_Hiragana": (0x3040, 0x309F),
    "Japanese_Katakana": (0x30A0, 0x30FF),
    "Han": (0x4E00, 0x9FFF),
    "Latin": (0x0041, 0x024F),
}

# Marathi distinctive keywords vs Hindi distinctive keywords
MARATHI_MARKERS = ["आहे", "आहेत", "नाही", "होते", "करा", "बघ", "कसे", "कुठे", "झाले", "सांगा", "आपण", "माझे", "तुझे", "करायचे", "केले", "यांचे", "म्हणून"]
HINDI_MARKERS = ["है", "हैं", "नहीं", "था", "थी", "थे", "करें", "कहाँ", "कैसे", "कहा", "किया", "होगा", "आपका", "मेरा", "तुम्हारा", "इसलिए", "सकते"]

SPANISH_MARKERS = ["que", "por", "para", "con", "una", "este", "está", "como", "pero", "gracias"]
FRENCH_MARKERS = ["que", "pour", "avec", "dans", "cette", "mais", "merci", "vous", "nous", "sont"]
GERMAN_MARKERS = ["und", "der", "die", "das", "nicht", "eine", "mit", "sich", "danke", "bitte"]

def detect_language_and_script(text: str) -> Dict[str, Any]:
    if not text or not text.strip():
        return {"language": "en", "confidence": 0.0, "script": "Unknown"}

    cleaned = text.strip()
    char_counts = {script: 0 for script in SCRIPT_RANGES}
    total_letters = 0

    for ch in cleaned:
        code = ord(ch)
        for script, (start, end) in SCRIPT_RANGES.items():
            if start <= code <= end:
                char_counts[script] += 1
                total_letters += 1
                break

    if total_letters == 0:
        return {"language": "en", "confidence": 0.5, "script": "Latin"}

    # Find predominant script
    predominant_script, count = max(char_counts.items(), key=lambda item: item[1])
    confidence = round(count / total_letters, 2)

    # Tokenize words supporting unicode scripts and Latin
    words = [w.lower() for w in re.findall(r'[\u0900-\u097F]+|[a-zA-Z\u00C0-\u017F]+', cleaned)]

    # Disambiguate Devanagari between Marathi and Hindi
    if predominant_script == "Devanagari":
        mr_matches = sum(1 for w in words if w in MARATHI_MARKERS)
        hi_matches = sum(1 for w in words if w in HINDI_MARKERS)
        if mr_matches > hi_matches:
            return {"language": "mr", "confidence": max(confidence, 0.85), "script": "Devanagari"}
        elif hi_matches > mr_matches:
            return {"language": "hi", "confidence": max(confidence, 0.85), "script": "Devanagari"}
        else:
            # Default Devanagari to Hindi if equal/neutral
            return {"language": "hi", "confidence": max(confidence, 0.75), "script": "Devanagari"}

    # Direct script-to-language mappings
    if predominant_script == "Bengali":
        return {"language": "bn", "confidence": confidence, "script": "Bengali"}
    if predominant_script == "Tamil":
        return {"language": "ta", "confidence": confidence, "script": "Tamil"}
    if predominant_script == "Telugu":
        return {"language": "te", "confidence": confidence, "script": "Telugu"}
    if predominant_script == "Gujarati":
        return {"language": "gu", "confidence": confidence, "script": "Gujarati"}
    if predominant_script == "Kannada":
        return {"language": "kn", "confidence": confidence, "script": "Kannada"}
    if predominant_script == "Malayalam":
        return {"language": "ml", "confidence": confidence, "script": "Malayalam"}
    if predominant_script == "Gurmukhi":
        return {"language": "pa", "confidence": confidence, "script": "Gurmukhi"}
    if predominant_script == "Arabic":
        return {"language": "ar", "confidence": confidence, "script": "Arabic"}
    if predominant_script == "Cyrillic":
        return {"language": "ru", "confidence": confidence, "script": "Cyrillic"}
    if predominant_script in ("Japanese_Hiragana", "Japanese_Katakana"):
        return {"language": "ja", "confidence": confidence, "script": "Japanese"}
    if predominant_script == "Han":
        return {"language": "zh", "confidence": confidence, "script": "Chinese"}

    # Latin disambiguation
    if predominant_script == "Latin":
        text_lower = cleaned.lower()
        es_score = sum(1 for m in SPANISH_MARKERS if f" {m} " in f" {text_lower} ")
        fr_score = sum(1 for m in FRENCH_MARKERS if f" {m} " in f" {text_lower} ")
        de_score = sum(1 for m in GERMAN_MARKERS if f" {m} " in f" {text_lower} ")

        if es_score > fr_score and es_score > de_score and es_score > 0:
            return {"language": "es", "confidence": 0.8, "script": "Latin"}
        if fr_score > es_score and fr_score > de_score and fr_score > 0:
            return {"language": "fr", "confidence": 0.8, "script": "Latin"}
        if de_score > es_score and de_score > fr_score and de_score > 0:
            return {"language": "de", "confidence": 0.8, "script": "Latin"}
        return {"language": "en", "confidence": confidence, "script": "Latin"}

    return {"language": "en", "confidence": 0.6, "script": predominant_script}
