import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Language, TranslationResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const translationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sourceSegments: {
      type: Type.ARRAY,
      description: "The source text broken down into grammatical units (words or phrases).",
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          matchId: { type: Type.INTEGER, description: "A unique ID for the concept. 0 if it has no direct translation." },
        },
        required: ["text", "matchId"],
      },
    },
    translations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          language: { type: Type.STRING },
          segments: {
            type: Type.ARRAY,
            description: "The translated text broken down into grammatical units, reordered as per the target language syntax.",
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                matchId: { type: Type.INTEGER, description: "Must match the matchId of the corresponding concept in sourceSegments." },
              },
              required: ["text", "matchId"],
            },
          },
        },
        required: ["language", "segments"],
      },
    },
  },
  required: ["sourceSegments", "translations"],
};

export const translateAndAnalyze = async (
  text: string,
  sourceLang: Language,
  targetLangs: Language[]
): Promise<TranslationResponse> => {
  if (!text.trim()) {
    throw new Error("Input text is empty");
  }

  const prompt = `
    You are a sophisticated linguistic engine. 
    Translate the following text from ${sourceLang} to: ${targetLangs.join(', ')}.
    
    Analyze the syntax and vocabulary. 
    Break down the source text and the translated texts into corresponding "segments" (words or meaningful phrases).
    Assign a unique 'matchId' (integer > 0) to concepts that are the same across languages.
    
    If a word exists in one language but is implied or non-existent in another (like articles or auxiliary verbs sometimes), use 'matchId: 0' or omit the match logic for that specific word, or group it with the relevant noun/verb if it makes semantic sense.
    
    Ensure the 'segments' in the target languages appear in the natural, correct word order for that language, allowing the user to see how the position of the "red" concept moves relative to the "blue" concept.

    Text to translate:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: translationSchema,
        temperature: 0.2, // Low temperature for more deterministic structural analysis
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("No response from AI");
    }
    
    // Robustly parse JSON by stripping Markdown code blocks if they exist
    const cleanedJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedJson) as TranslationResponse;

  } catch (error) {
    console.error("Gemini Translation Error:", error);
    throw error;
  }
};