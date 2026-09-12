import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

export async function generateArticleSummary(
  title: string,
  description: string,
) {
  const prompt = `
You are an AI news assistant for KhabarJunction.

Analyze the following news article information and provide:

1. A concise summary in 2-3 sentences.
2. Three important key takeaways.

Use simple, neutral, factual language.
Do not invent information that is not present in the provided content.

Title:
${title}

Description:
${description}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text ?? "";
}