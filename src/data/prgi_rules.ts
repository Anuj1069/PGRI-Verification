
export const PRGI_RULES = {
  disallowedWords: [
    "Police", "CBI", "CID", "Army", "Intelligence", "Government", "State", 
    "Administration", "National", "Republic", "India", "Bharat", "President", 
    "Parliament", "Corruption", "Crime", "Investigation", "Anticorruption",
    "Bureau", "Force", "Military", "Judiciary", "Court", "Magistrate",
    "Rashtriya", "Federal", "Official", "BSF", "Border Security Force", "Gazette"
  ],
  restrictedPrefixesSuffixes: [
    "The", "A", "New", "Naya", "Daily", "Weekly", "Monthly", "News", "Times", 
    "Herald", "Post", "Chronicle", "Gazette", "Observer", "Mirror", "Express",
    "Morning", "Super", "Bulletin", "Khabar", "Samachar"
  ],
  existingTitlesSample: [
    "The Times of India",
    "Hindustan Times",
    "The Hindu",
    "Indian Express",
    "Dainik Jagran",
    "Dainik Bhaskar",
    "Malayala Manorama",
    "Eenadu",
    "The Telegraph",
    "Deccan Chronicle",
    "Ananda Bazar Patrika",
    "Amar Ujala",
    "The Economic Times",
    "The Statesman",
    "Navbharat Times",
    "Punjab Kesari",
    "Mathrubhumi",
    "Sakshi",
    "Daily Thanthi",
    "Rajasthan Patrika",
    "Times of India",
    "Tribune",
    "Frontline",
    "Hindustan"
  ],
  phoneticRules: [
    { pattern: "Khabar", similar: ["Chabar", "Khabara", "Qabar"] },
    { pattern: "News", similar: ["Nuz", "Newz", "Nyuz"] },
    { pattern: "Samachar", similar: ["Samachaar", "Shmachar"] },
    { pattern: "Times of Bharat", similar: ["Times of India"] },
    { pattern: "Desh Samay", similar: ["Desh Samachar", "Desh Sandesh"] }
  ],
  semanticRules: [
    { original: "City News", translation: "Shahar Samachar" },
    { original: "Daily World", translation: "Dainik Duniya" },
    { original: "Morning Star", translation: "Prabhat Tara" },
    { original: "National News", translation: "Rashtriya Samachar" }
  ]
};

export const FEW_SHOT_EXAMPLES = [
  {
    input: "Vasundhara Vani",
    output: {
      probability: 92,
      verdict: "Highly Unique. Distinctive Sanskrit-origin word; no similar registered title.",
      complianceChecklist: { disallowedWords: [], prefixSuffix: [], phoneticMatches: [], semanticSimilarity: [] }
    }
  },
  {
    input: "National News Daily",
    output: {
      probability: 8,
      verdict: "Rejected. Triple violation: disallowed word 'National' + two generic terms 'News Daily'.",
      complianceChecklist: {
        disallowedWords: ["National"],
        prefixSuffix: ["News", "Daily"],
        phoneticMatches: [],
        semanticSimilarity: []
      }
    }
  },
  {
    input: "Konkan Kiraan",
    output: {
      probability: 88,
      verdict: "Unique. Unique combination; no phonetic matches in database.",
      complianceChecklist: { disallowedWords: [], prefixSuffix: [], phoneticMatches: [], semanticSimilarity: [] }
    }
  },
  {
    input: "The India Times",
    output: {
      probability: 5,
      verdict: "Rejected. Disallowed word 'India'; phonetically similar to 'The Times of India'.",
      complianceChecklist: {
        disallowedWords: ["India"],
        prefixSuffix: ["The", "Times"],
        phoneticMatches: ["The Times of India"],
        semanticSimilarity: ["The Times of India"]
      }
    }
  },
  {
    input: "Police Patrika",
    output: {
      probability: 3,
      verdict: "Rejected. Disallowed word 'Police'. Strict disallowed word rule applies.",
      complianceChecklist: {
        disallowedWords: ["Police"],
        prefixSuffix: [],
        phoneticMatches: [],
        semanticSimilarity: []
      }
    }
  },
  {
    input: "Ladakh Luminary",
    output: {
      probability: 94,
      verdict: "Highly Unique. New region; very few registered titles. Distinctive alliteration.",
      complianceChecklist: { disallowedWords: [], prefixSuffix: [], phoneticMatches: [], semanticSimilarity: [] }
    }
  },
  {
    input: "Government Gazette",
    output: {
      probability: 2,
      verdict: "Rejected. Disallowed word 'Government'; also conflicts with official Gazette. Misleads as official publication.",
      complianceChecklist: {
        disallowedWords: ["Government"],
        prefixSuffix: ["Gazette"],
        phoneticMatches: ["The Gazette of India"],
        semanticSimilarity: ["Official Gazette"]
      }
    }
  },
  {
    input: "Times of Bharat",
    output: {
      probability: 9,
      verdict: "Rejected. Phonetically/semantically similar to 'Times of India'. Bharat is also a restricted national identifier.",
      complianceChecklist: {
        disallowedWords: ["Bharat"],
        prefixSuffix: ["Times"],
        phoneticMatches: ["Times of India"],
        semanticSimilarity: ["Times of India"]
      }
    }
  }
];
