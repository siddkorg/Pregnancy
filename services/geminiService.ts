
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStory = async (week: number, mood: string): Promise<{ title: string; content: string }> => {
  const ai = getAI();
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

  return JSON.parse(response.text);
};

export const generateBabyImage = async (week: number): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A beautiful, soft-lit, artistic 3D medical illustration of a baby in the womb at ${week} weeks gestation. Soft ethereal colors, peaceful atmosphere, high detail.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  return "https://picsum.photos/400/400";
};

export const generateDailyTip = async (week: number): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Give a single, gentle pregnancy tip for week ${week}. Short and sweet.`,
  });
  return response.text || "Drink plenty of water today!";
};
