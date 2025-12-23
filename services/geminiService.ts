
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Always use process.env.API_KEY directly as per guidelines
// Create a new instance right before making an API call to ensure it uses the most up-to-date key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to handle retries with exponential backoff for 429 errors
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 429;
    if (isRateLimit && retries > 0) {
      console.warn(`Rate limit hit (429). Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Generates a heartwarming story for the mother
 */
export const generateStory = async (week: number, mood: string): Promise<{ title: string; content: string }> => {
  const ai = getAI();
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, heartwarming 1-minute story for a pregnant mother who is at week ${week} and feeling ${mood}. The story should be soothing and end with a positive affirmation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["title", "content"]
        }
      }
    });

    const text = response.text || '{"title": "A Gentle Moment", "content": "The world slows down as you wait for your little one."}';
    return JSON.parse(text);
  }).catch(() => ({ 
    title: "A Gentle Moment", 
    content: "The world slows down as you wait for your little one. You are doing a wonderful job, mama." 
  }));
};

/**
 * Generates audio for the story using TTS model
 */
export const generateStoryAudio = async (text: string): Promise<string> => {
  const ai = getAI();
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this story in a very soothing, gentle, and maternal tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Failed to generate audio");
    return base64Audio;
  });
};

/**
 * Generates a daily pregnancy tip
 */
export const generateDailyTip = async (week: number): Promise<string> => {
  const ai = getAI();
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give a single, gentle pregnancy tip for week ${week}. Short and sweet.`,
    });
    return response.text || "Drink plenty of water today!";
  }).catch(() => "Nurture yourself today, mama.");
};

/**
 * Generates an artistic visualization of the baby using image generation model
 * Fixes: Module '"../services/geminiService"' has no exported member 'generateBabyImage'
 */
export const generateBabyImage = async (week: number): Promise<string> => {
  const ai = getAI();
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A beautiful, artistic and heartwarming high-quality visualization of a fetus in the womb at week ${week} of pregnancy. The style should be soft, ethereal, and magical, focusing on growth milestones. Pastel tones, dreamlike atmosphere, comforting and positive.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    // Iterate through parts to find the image part as per instructions
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64EncodeString}`;
        }
      }
    }
    throw new Error("No image data in response");
  });
};
