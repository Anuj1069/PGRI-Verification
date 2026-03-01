import { GoogleGenAI, Type, ThinkingLevel, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { PRGI_RULES, FEW_SHOT_EXAMPLES } from "../data/prgi_rules";

export interface VerificationResult {
  probability: number;
  uniqueWordsScore: number;
  distinctiveSyntaxScore: number;
  verdict: string;
  complianceChecklist: {
    disallowedWords: string[];
    prefixSuffix: string[];
    phoneticMatches: string[];
    semanticSimilarity: string[];
  };
  similarTitles: Array<{
    title: string;
    matchPercentage: number;
    reason: string;
    year: number;
    location: string;
  }>;
  suggestions: Array<{
    title: string;
    probability: number;
    reason: string;
  }>;
}

export enum PRGIErrorCode {
  MISSING_API_KEY = "MISSING_API_KEY",
  EMPTY_RESPONSE = "EMPTY_RESPONSE",
  INVALID_JSON = "INVALID_JSON",
  NETWORK_ERROR = "NETWORK_ERROR",
  SAFETY_BLOCK = "SAFETY_BLOCK",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  INVALID_INPUT = "INVALID_INPUT"
}

export class PRGIError extends Error {
  code: PRGIErrorCode;
  constructor(code: PRGIErrorCode, message: string) {
    super(message);
    this.name = "PRGIError";
    this.code = code;
  }
}

export const PRGI_ERROR_MESSAGES: Record<PRGIErrorCode, string> = {
  [PRGIErrorCode.MISSING_API_KEY]: "Gemini API key is missing. Please ensure you have enabled 'Preview' in the Share settings or configured the key correctly.",
  [PRGIErrorCode.EMPTY_RESPONSE]: "The AI service returned an empty response. This might be due to temporary service issues. Please try again.",
  [PRGIErrorCode.INVALID_JSON]: "The AI returned an invalid response format. We're working on improving the model's reliability. Please try again.",
  [PRGIErrorCode.NETWORK_ERROR]: "A network error occurred while connecting to the AI service. Please check your internet connection.",
  [PRGIErrorCode.SAFETY_BLOCK]: "The title you entered was flagged by safety filters. Please try a different, professional publication title.",
  [PRGIErrorCode.INVALID_INPUT]: "The title provided is invalid or too short for analysis.",
  [PRGIErrorCode.UNKNOWN_ERROR]: "An unexpected error occurred during analysis. Please try again later."
};

export async function analyzeTitle(title: string): Promise<VerificationResult> {
  if (!title || title.trim().length < 2) {
    throw new PRGIError(PRGIErrorCode.INVALID_INPUT, PRGI_ERROR_MESSAGES[PRGIErrorCode.INVALID_INPUT]);
  }

  console.log("Starting analysis for title:", title);
  
  // Try multiple possible environment variable names used in different AI Studio contexts
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  // Check for missing or placeholder keys
  const isPlaceholder = (key: string | undefined) => {
    if (!key) return true;
    const lower = key.toLowerCase();
    return lower === "undefined" || 
           lower === "null" || 
           lower === "" || 
           lower.includes("your_api_key") || 
           lower.includes("placeholder");
  };

  if (isPlaceholder(apiKey)) {
    console.error("Gemini API key is missing or invalid placeholder. GEMINI_API_KEY:", process.env.GEMINI_API_KEY, "API_KEY:", process.env.API_KEY);
    throw new PRGIError(PRGIErrorCode.MISSING_API_KEY, "The AI service is not properly configured. Please ensure you have enabled 'Preview' in the Share settings or configured the key correctly.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey! });
    
    const systemInstruction = `You are the Lead Verification Officer for the Press Registrar General of India (PRGI). 
      Your task is to analyze publication titles for compliance with strict legal and linguistic guidelines.
      
      ### TRAINING DATASET & KNOWLEDGE BASE:
      - DISALLOWED WORDS: ${PRGI_RULES.disallowedWords.join(", ")}
      - RESTRICTED GENERIC TERMS: ${PRGI_RULES.restrictedPrefixesSuffixes.join(", ")}
      - SAMPLE EXISTING TITLES: ${PRGI_RULES.existingTitlesSample.join(", ")}
      
      ### CORE PRGI COMPLIANCE RULES (Learned from Dataset):
      1. DISALLOWED WORDS: Reject any title containing words implying government authority (Police, CBI, Army, Government, BSF, Official, Federal, Republic), national symbols (National, Rashtriya, India, Bharat), or investigative terms.
      2. GENERIC PREFIX/SUFFIX: Adding generic terms like 'The', 'New', 'Naya', 'Daily', 'Weekly', 'Morning', 'Super' to an existing or common title is NOT allowed and leads to rejection.
      3. PHONETIC/SEMANTIC SIMILARITY: Prohibit titles that sound similar or are direct translations of existing titles (e.g., 'Times of Bharat' is too similar to 'Times of India').
      4. BRAND CONFLICTS: Reject titles that conflict with established media groups (e.g., Hindustan, Tribune, Frontline).
      5. UNIQUENESS: Approved titles often use distinctive geographic identifiers (Ladakh, Konkan, Nilgiri), poetic combinations (Rann Rashmi, Ganga Geeti), or unique nouns (Prism, Mosaic).
      
      ### FEW-SHOT EXAMPLES (From Training Data):
      ${FEW_SHOT_EXAMPLES.map(ex => `Input: "${ex.input}" -> Output: ${JSON.stringify(ex.output)}`).join("\n")}
      
      Analyze the publication title: "${title}" and return ONLY a JSON object following the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: systemInstruction,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            probability: { type: Type.NUMBER },
            uniqueWordsScore: { type: Type.NUMBER },
            distinctiveSyntaxScore: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            complianceChecklist: {
              type: Type.OBJECT,
              properties: {
                disallowedWords: { type: Type.ARRAY, items: { type: Type.STRING } },
                prefixSuffix: { type: Type.ARRAY, items: { type: Type.STRING } },
                phoneticMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
                semanticSimilarity: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            similarTitles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  matchPercentage: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                  year: { type: Type.NUMBER },
                  location: { type: Type.STRING }
                }
              }
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  probability: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    
    if (!text) {
      throw new PRGIError(PRGIErrorCode.EMPTY_RESPONSE, PRGI_ERROR_MESSAGES[PRGIErrorCode.EMPTY_RESPONSE]);
    }

    // Clean the response text in case the model wraps it in markdown blocks
    let cleanedText = text.replace(/```json\n?/, "").replace(/\n?```/, "").trim();
    
    // Sometimes the model might still include markdown even with responseMimeType
    if (cleanedText.includes("```")) {
      const match = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) cleanedText = match[1];
    }

    console.log("Cleaned AI response:", cleanedText);
    
    try {
      const parsed = JSON.parse(cleanedText);
      // Ensure all required fields exist to prevent frontend crashes
      return {
        probability: parsed.probability ?? 0,
        uniqueWordsScore: parsed.uniqueWordsScore ?? 0,
        distinctiveSyntaxScore: parsed.distinctiveSyntaxScore ?? 0,
        verdict: parsed.verdict ?? "Analysis complete.",
        complianceChecklist: {
          disallowedWords: parsed.complianceChecklist?.disallowedWords ?? [],
          prefixSuffix: parsed.complianceChecklist?.prefixSuffix ?? [],
          phoneticMatches: parsed.complianceChecklist?.phoneticMatches ?? [],
          semanticSimilarity: parsed.complianceChecklist?.semanticSimilarity ?? [],
        },
        similarTitles: parsed.similarTitles ?? [],
        suggestions: parsed.suggestions ?? [],
      };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Original text:", text);
      throw new PRGIError(PRGIErrorCode.INVALID_JSON, PRGI_ERROR_MESSAGES[PRGIErrorCode.INVALID_JSON]);
    }
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    
    if (error instanceof PRGIError) {
      throw error;
    }

    // Handle specific Gemini SDK errors if possible, or fallback to network/unknown
    if (error.message?.includes("API key not valid")) {
      throw new PRGIError(PRGIErrorCode.MISSING_API_KEY, "The API key provided to the AI service is invalid. Please ensure you have enabled 'Preview' in the Share settings or that your project has a valid Gemini API key configured.");
    }

    if (error.message?.includes("fetch") || error.message?.includes("network")) {
      throw new PRGIError(PRGIErrorCode.NETWORK_ERROR, PRGI_ERROR_MESSAGES[PRGIErrorCode.NETWORK_ERROR]);
    }
    
    if (error.message?.includes("safety") || error.message?.includes("blocked")) {
      throw new PRGIError(PRGIErrorCode.SAFETY_BLOCK, PRGI_ERROR_MESSAGES[PRGIErrorCode.SAFETY_BLOCK]);
    }

    throw new PRGIError(PRGIErrorCode.UNKNOWN_ERROR, error.message || PRGI_ERROR_MESSAGES[PRGIErrorCode.UNKNOWN_ERROR]);
  }
}
