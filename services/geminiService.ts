
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Ensure AI client is created with the correct environment variable
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Fallback images for different stages of pregnancy if AI generation fails
 */
const getFallbackImage = (week: number) => {
  if (week <= 12) {
    // First Trimester: Tiny sprout/embryo stage
    return "https://images.unsplash.com/photo-1559599141-3816a0b361e2?auto=format&fit=crop&q=80&w=800";
  } else if (week <= 26) {
    // Second Trimester: Developing features
    return "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800";
  } else {
    // Third Trimester: Full baby
    return "https://images.unsplash.com/photo-1520206159162-9f9302fd49ca?auto=format&fit=crop&q=80&w=800";
  }
};

export const generateStory = async (week: number, mood: string): Promise<{ title: string; content: string }> => {
  const ai = getAI();
  try {
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
  } catch (e) {
    return { title: "A Gentle Moment", content: "The world slows down as you wait for your little one. You are doing a wonderful job, mama." };
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
          { text: `An artistic, ethereal 3D medical visualization of a developing baby in the womb at ${week} weeks gestation. Soft pastel lighting, dreamlike atmosphere, high definition, cinematic and peaceful medical art.` }
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
    
    // Fallback if no image part is in the response
    return getFallbackImage(week);
  } catch (error) {
    console.error("AI Image generation failed, using fallback:", error);
    return getFallbackImage(week);
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
