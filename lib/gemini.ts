import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

export type ArticleSummary = {
  summary: string;
  keyTakeaways: string[];
};

export async function generateArticleSummary(
  title: string,
  description: string,
): Promise<ArticleSummary> {
  const prompt = `
You are an AI news assistant for KhabarJunction.

Analyze the provided news article title and description.

Return ONLY valid JSON in exactly this structure:

{
  "summary": "A concise summary in 2-3 sentences.",
  "keyTakeaways": [
    "Important takeaway 1",
    "Important takeaway 2",
    "Important takeaway 3"
  ]
}

Rules:
- Use simple, neutral, factual language.
- Do not invent information.
- Use only the information available in the title and description.
- Provide exactly three key takeaways.
- Do not use Markdown.
- Do not include code fences.
- Do not include any text outside the JSON object.

Title:
${title}

Description:
${description}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  try {
    const parsedResponse = JSON.parse(text) as ArticleSummary;

    if (
      typeof parsedResponse.summary !== "string" ||
      !Array.isArray(parsedResponse.keyTakeaways) ||
      parsedResponse.keyTakeaways.length !== 3 ||
      !parsedResponse.keyTakeaways.every(
        (takeaway) => typeof takeaway === "string",
      )
    ) {
      throw new Error("Invalid AI summary structure");
    }

    return parsedResponse;
  } catch {
    throw new Error("Gemini returned an invalid JSON response");
  }
}