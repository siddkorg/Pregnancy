
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Ensure AI client is created with the correct environment variable
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

  const text = response.text || '{"title": "A Gentle Moment", "content": "The world slows down as you wait for your little one."}';
  try {
    return JSON.parse(text);
  } catch (e) {
    return { title: "A Gentle Moment", content: text };
  }
};

export const generateStoryAudio = async (text: string): Promise<string> => {
  const ai = getAI();
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
};

export const generateBabyImage = async (week: number): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `An artistic, soft-lit 3D medical illustration of a baby in the womb at ${week} weeks gestation. Soft pastel colors, ethereal atmosphere, highly detailed, peaceful.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Instructions require iterating through all parts to find the image part
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    // Fallback to a relevant placeholder if no image part is found
    return `https://images.unsplash.com/photo-1520206159162-9f9302fd49ca?auto=format&fit=crop&q=80&w=400&h=400`;
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};

export const generateDailyTip = async (week: number): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give a single, gentle pregnancy tip for week ${week}. Short and sweet.`,
    });
    return response.text || "Drink plenty of water today!";
  } catch {
    return "Nurture yourself today, mama.";
  }
};
