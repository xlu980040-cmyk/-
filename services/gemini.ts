import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image based on the provided name.
 * Contains logic for specific "Easter egg" names.
 */
export const generateAvatarImage = async (name: string): Promise<string> => {
  const cleanName = name.trim();
  
  let prompt = '';

  // Special logic for "郭晓" (Guo Xiao) -> Bitter Melon King
  if (cleanName === '郭晓') {
    prompt = `
      A whimsical, high-quality 3D render of the "Bitter Melon King". 
      A character that is an anthropomorphic bitter gourd (bitter melon) vegetable.
      He is wearing a majestic golden crown and a regal red velvet cape with fur trim.
      He holds a golden scepter topped with a small bitter melon.
      The character has a grumpy but cute expression, with textured green bumpy skin characteristic of the vegetable.
      Cinematic lighting, vibrant green colors, vegetable kingdom background, Pixar or Dreamworks style character design.
    `;
  } else {
    // General prompt for other names
    prompt = `
      A creative, artistic, and high-quality portrait avatar representing the spirit of the name "${cleanName}".
      Fantasy or sci-fi character design, digital painting style, intricate details, vibrant colors, soft lighting, 
      centered composition, 8k resolution, masterpiece. 
      The character should look unique and distinct.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        // We use generateContent for nano banana series (flash-image)
        // No responseMimeType needed for image gen models usually, but we want to ensure we get an image back.
      }
    });

    // Parse the response to find the image part
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};