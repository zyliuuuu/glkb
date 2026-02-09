
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function sendMessage(prompt: string, history: Message[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history.map(m => ({
          role: m.role === 'user' ? 'user' : 'model' as any,
          parts: [{ text: m.content }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `You are an expert Genomic Literature Knowledge Base (GLKB) assistant. 
        Your goal is to help researchers discover insights from genomic research.
        Be scientific, precise, and cite findings. Use Google Search to find current data.
        Always look for gene names, disease associations, and literature reviews.`,
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "I'm sorry, I couldn't process that genomic request.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || "Research Source",
        uri: chunk.web?.uri || "#"
      }))
      .filter((s: any) => s.uri !== "#") || [];

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
