
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Ensure AI client is created with the correct environment variable
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Fruit comparison data to help the AI understand the scale
 */
const getFruitReference = (week: number) => {
  if (week <= 4) return "a poppy seed";
  if (week <= 8) return "a raspberry";
  if (week <= 12) return "a lime";
  if (week <= 16) return "an avocado";
  if (week <= 20) return "a banana";
  if (week <= 24) return "an ear of corn";
  if (week <= 28) return "an eggplant";
  if (week <= 32) return "a squash";
  if (week <= 36) return "a papaya";
  return "a watermelon";
};

/**
 * Fallback images for different stages of pregnancy if AI generation fails
 */
const getFallbackImage = (week: number) => {
  if (week <= 12) {
    return "https://images.unsplash.com/photo-1559599141-3816a0b361e2?auto=format&fit=crop&q=80&w=800";
  } else if (week <= 26) {
    return "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800";
  } else {
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
  const fruit = getFruitReference(week);
  
  // Create a more descriptive prompt based on the development stage
  let stageDescription = "";
  if (week <= 4) stageDescription = "a tiny, magical cluster of cells, a golden spark of life beginning its journey";
  else if (week <= 8) stageDescription = "a tiny embryo with beginning features, nestled in a glowing womb";
  else if (week <= 20) stageDescription = "a developing fetus with recognizable features, translucent skin, peacefully floating";
  else stageDescription = "a fully formed baby, peacefully sleeping, detailed features, soft hair, curled in the womb";

  const prompt = `A hyper-realistic, beautiful 3D medical-style illustration of a baby in the womb at exactly ${week} weeks gestation. The baby is currently about the size of ${fruit}. ${stageDescription}. Soft, ethereal pink and gold studio lighting, cinematic atmosphere, peaceful and nurturing medical art.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
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
