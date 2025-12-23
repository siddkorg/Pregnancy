
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Ensure AI client is created with the correct environment variable
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Curated static library of artistic baby/pregnancy representations.
 * 6 images per stage to ensure variety when "Re-imagining".
 */
const STATIC_BABY_LIBRARY: Record<string, string[]> = {
  // Stage 1: Weeks 1-4 (The Spark)
  spark: [
    "https://images.unsplash.com/photo-1559599141-3816a0b361e2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1502781253888-af2b069d8544?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1475116127127-e3ce09ee84e1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=800"
  ],
  // Stage 2: Weeks 5-12 (Tiny Growth)
  tiny: [
    "https://images.unsplash.com/photo-1520206159162-9f9302fd49ca?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1513273159381-c4a8ee0e814a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1556139930-c23fa4a4f934?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1481841584373-d220f5c2f542?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800"
  ],
  // Stage 3: Weeks 13-20 (First Kicks)
  blooming: [
    "https://images.unsplash.com/photo-1523350165414-082d792c9012?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1532033028614-d5763d0dd1d4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1544171255-235816bb9825?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800"
  ],
  // Stage 4: Weeks 21-28 (Hearing Voices)
  active: [
    "https://images.unsplash.com/photo-1555252333-978fead023f4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1544126592-807daa2b5652?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800"
  ],
  // Stage 5: Weeks 29-36 (Dreaming)
  dreaming: [
    "https://images.unsplash.com/photo-1520206159162-9f9302fd49ca?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1510333302764-dc33c7885e30?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
  ],
  // Stage 6: Weeks 37-42 (Ready to Meet)
  ready: [
    "https://images.unsplash.com/photo-1555006203-9977828065f4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1526631134603-879796696ee8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1542442828-287217bfb842?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1537673156864-5d2de38e11e2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=800"
  ]
};

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

const getFruitReference = (week: number) => {
  if (week <= 4) return "a tiny poppy seed";
  if (week <= 8) return "a sweet raspberry";
  if (week <= 12) return "a bright lime";
  if (week <= 16) return "a smooth avocado";
  if (week <= 20) return "a curved banana";
  if (week <= 24) return "a cob of corn";
  if (week <= 28) return "a purple eggplant";
  if (week <= 32) return "a striped squash";
  if (week <= 36) return "a tropical papaya";
  return "a round watermelon";
};

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
 * Returns a static artistic image from our library based on the week.
 * This replaces the AI image generation to prevent 429 errors.
 */
export const generateBabyImage = async (week: number): Promise<string> => {
  // Determine the stage
  let stageKey = 'ready';
  if (week <= 4) stageKey = 'spark';
  else if (week <= 12) stageKey = 'tiny';
  else if (week <= 20) stageKey = 'blooming';
  else if (week <= 28) stageKey = 'active';
  else if (week <= 36) stageKey = 'dreaming';
  else stageKey = 'ready';

  const options = STATIC_BABY_LIBRARY[stageKey];
  // Select a random image from the 6 available for this stage
  const randomIndex = Math.floor(Math.random() * options.length);
  
  // Artificial delay to simulate "imagining" and maintain UX feel
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return options[randomIndex];
};

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
