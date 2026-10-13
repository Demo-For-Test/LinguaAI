"""
Regional Knowledge Base & Curated Indian Language Phrasebook
Focus on English, Hindi, and Marathi with cultural nuance, honorifics, and Devanagari script.
"""

from typing import List, Dict, Any, Optional

CATEGORIES = [
    {"id": "travel", "name": "Travel & Directions", "icon": "Compass"},
    {"id": "education", "name": "Education & Learning", "icon": "GraduationCap"},
    {"id": "daily", "name": "Everyday Conversation", "icon": "MessageSquare"},
    {"id": "professional", "name": "Professional & Business", "icon": "Briefcase"},
    {"id": "emergency", "name": "Emergency & Health", "icon": "ShieldAlert"},
    {"id": "tech", "name": "Technical & Digital", "icon": "Laptop"},
]

PHRASEBOOK_ENTRIES = [
    # Travel
    {
        "id": "tr_1",
        "category": "travel",
        "english": "Where is the nearest railway station or metro station?",
        "hindi": "निकटतम रेलवे स्टेशन या मेट्रो स्टेशन कहाँ है?",
        "marathi": "सर्वात जवळचे रेल्वे स्टेशन किंवा मेट्रो स्टेशन कुठे आहे?",
        "context": "Useful when asking locals for directions in India",
        "transliteration_hi": "Nikat-tam railway station ya metro station kahaan hai?",
        "transliteration_mr": "Sarvaat javalche railway station kinva metro station kuthe aahe?",
        "notes": "Devanagari script properly preserved."
    },
    {
        "id": "tr_2",
        "category": "travel",
        "english": "How much does a ticket to Pune cost?",
        "hindi": "पुणे के लिए टिकट कितने का है?",
        "marathi": "पुण्यासाठी तिकिटाचे दर किती आहेत?",
        "context": "Transit counters and booking booths",
        "transliteration_hi": "Pune ke liye ticket kitne ka hai?",
        "transliteration_mr": "Punyasaathi tikitache dar kiti aahet?"
    },
    {
        "id": "tr_3",
        "category": "travel",
        "english": "Please turn on the meter, or tell me the fixed fare.",
        "hindi": "कृपया मीटर चालू करें, या तय किराया बता दीजिए।",
        "marathi": "कृपया मीटर चालू करा, किंवा ठरलेले भाडे सांगा.",
        "context": "Auto-rickshaw and taxi rides",
        "transliteration_hi": "Kripya meter chaaloo karein, ya tay kiraaya bata dijiye.",
        "transliteration_mr": "Kripya meter chaaloo kara, kinva tharlele bhaade saanga."
    },
    
    # Professional
    {
        "id": "pr_1",
        "category": "professional",
        "english": "I'll get back to you shortly.",
        "hindi": "मैं शीघ्र ही आपसे संपर्क करूँगा / करूंगी।",
        "marathi": "मी लवकरच आपल्याशी संपर्क साधेन.",
        "context": "Polite business response to client inquiry (Not literal 'wapas aana')",
        "transliteration_hi": "Main sheeghra hi aapse sampark karoonga.",
        "transliteration_mr": "Mee lavkarch aaplyaashi samparka saadhen.",
        "cultural_note": "A literal word-for-word translation ('मैं वापस आऊंगा') sounds colloquial or awkward in formal emails. Professional Hindi and Marathi use polite honorifics and 'संपर्क' (contact)."
    },
    {
        "id": "pr_2",
        "category": "professional",
        "english": "Thank you for the update. Let us schedule a follow-up meeting.",
        "hindi": "जानकारी के लिए धन्यवाद। आइए हम एक आगामी बैठक निर्धारित करें।",
        "marathi": "माहितीबद्दल धन्यवाद. आपण पुढील बैठक निश्चित करूया.",
        "context": "Corporate emails and agile team discussions"
    },
    {
        "id": "pr_3",
        "category": "professional",
        "english": "Please review the attached contract and let me know your thoughts.",
        "hindi": "कृपया संलग्न अनुबंध की समीक्षा करें और अपने विचार साझा करें।",
        "marathi": "कृपया सोबत जोडलेला करार तपासा आणि आपले मत कळवा.",
        "context": "Freelancers and business deals sending proposals"
    },

    # Daily Conversation
    {
        "id": "dl_1",
        "category": "daily",
        "english": "Namaste, how are you? Is everything going well?",
        "hindi": "नमस्ते, आप कैसे हैं? सब कुछ ठीक चल रहा है ना?",
        "marathi": "नमस्कार, तुम्ही कसे आहात? सर्व काही व्यवस्थित चालू आहे ना?",
        "context": "Warm greeting with respectful honorifics"
    },
    {
        "id": "dl_2",
        "category": "daily",
        "english": "Did you have lunch? What would you like to have?",
        "hindi": "क्या आपने दोपहर का भोजन किया? आप क्या लेना पसंद करेंगे?",
        "marathi": "आपण दुपारचे जेवण केले का? आपल्याला काय खायला आवडेल?",
        "context": "Common cultural hospitable inquiry in Indian households"
    },

    # Education
    {
        "id": "ed_1",
        "category": "education",
        "english": "Could you please explain this concept in simpler words?",
        "hindi": "क्या आप कृपया इस संकल्पना को सरल शब्दों में समझा सकते हैं?",
        "marathi": "तुम्ही ही संकल्पना सोप्या शब्दांत समजावून सांगू शकाल का?",
        "context": "Classroom, tutoring, or academic query"
    },
    {
        "id": "ed_2",
        "category": "education",
        "english": "When is the project submission deadline?",
        "hindi": "परियोजना जमा करने की अंतिम तिथि कब है?",
        "marathi": "प्रकल्प सादर करण्याची अंतिम मुदत कधी आहे?",
        "context": "Colleges, schools, university exams"
    },

    # Emergency
    {
        "id": "em_1",
        "category": "emergency",
        "english": "I need urgent medical assistance. Where is the nearest hospital?",
        "hindi": "मुझे तत्काल चिकित्सा सहायता चाहिए। निकटतम अस्पताल कहाँ है?",
        "marathi": "मला तातडीने वैद्यकीय मदतीची गरज आहे. सर्वात जवळचे रुग्णालय कुठे आहे?",
        "context": "Emergency and first aid situations"
    }
]

def search_phrasebook(query: str = "", category: str = "") -> List[Dict[str, Any]]:
    results = []
    q = query.lower().strip()
    for item in PHRASEBOOK_ENTRIES:
        if category and item["category"] != category:
            continue
        if not q or (
            q in item["english"].lower() or
            q in item["hindi"].lower() or
            q in item["marathi"].lower() or
            q in item.get("context", "").lower()
        ):
            results.append(item)
    return results
