import pytest
from fastapi.testclient import TestClient
from main import app
from detector import detect_language_and_script
from phrasebook import search_phrasebook

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "engine_info" in data

def test_languages_endpoint():
    response = client.get("/api/languages")
    assert response.status_code == 200
    data = response.json()
    assert len(data["languages"]) >= 10
    codes = [l["code"] for l in data["languages"]]
    assert "en" in codes
    assert "hi" in codes
    assert "mr" in codes

def test_language_detection():
    # Hindi Devanagari detection
    det_hi = detect_language_and_script("नमस्ते, आप कैसे हैं?")
    assert det_hi["language"] == "hi"
    assert det_hi["script"] == "Devanagari"

    # Marathi Devanagari detection
    det_mr = detect_language_and_script("नमस्कार, तुम्ही कसे आहात? सर्व काही ठीक आहे.")
    assert det_mr["language"] == "mr"
    assert det_mr["script"] == "Devanagari"

    # English Latin detection
    det_en = detect_language_and_script("Hello world, this is a test translation.")
    assert det_en["language"] == "en"
    assert det_en["script"] == "Latin"

def test_translation_endpoint_idiom_context():
    # Prompt example: "I'll get back to you" into Hindi business context
    response = client.post("/api/translate", json={
        "text": "I'll get back to you",
        "source_lang": "en",
        "target_lang": "hi",
        "style": "business",
        "context": "Professional email response to a prospective client"
    })
    assert response.status_code == 200
    data = response.json()
    assert "संपर्क" in data["translated_text"] or "उत्तर" in data["translated_text"]
    assert data["target_lang"] == "hi"
    assert "explanation" in data
    assert data["word_count"] > 0

def test_translation_marathi():
    response = client.post("/api/translate", json={
        "text": "Where is the nearest railway station or metro station?",
        "source_lang": "en",
        "target_lang": "mr",
        "style": "standard"
    })
    assert response.status_code == 200
    data = response.json()
    assert "रेल्वे" in data["translated_text"]
    assert "कुठे" in data["translated_text"]

def test_phrasebook_search():
    results = search_phrasebook(query="railway", category="travel")
    assert len(results) >= 1
    assert "railway" in results[0]["english"].lower()

def test_empty_translation_validation():
    response = client.post("/api/translate", json={
        "text": "   ",
        "source_lang": "en",
        "target_lang": "hi",
        "style": "standard"
    })
    assert response.status_code == 400

def test_evaluation_set_endpoint():
    response = client.get("/api/evaluation-set")
    assert response.status_code == 200
    evals = response.json()
    assert len(evals) >= 3
    assert any("business" in e["style"] for e in evals)
