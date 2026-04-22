import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiClient, AiRecipeSearchFilters } from "../types/aiTypes";

const cache = new Map<string, AiRecipeSearchFilters>();

export const aiRealClient: AiClient = {
  analyzeQuery: async (query: string): Promise<AiRecipeSearchFilters> => {
    const cacheKey = query.trim().toLowerCase();

    if (cache.has(cacheKey)) {
      console.log("AI cache hit:", cacheKey);
      return cache.get(cacheKey)!;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a recipe search assistant.
      Analyze the following search query and return a JSON object with these fields:
      - ingredients: string[] (ingredients mentioned in the query)
      - difficulty: "easy" | "medium" | "hard" | null
      - title: string | null (specific recipe name if mentioned)
      - category: string | null (type of food, e.g. "italian", "dessert")
      - recipeBookName: string | null (if user is searching for a recipe book)
      - favorites: boolean | null (true if user wants their favorite recipes)

      Return ONLY the JSON object, no explanation, no markdown.

      Query: "${query}"
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed: AiRecipeSearchFilters = JSON.parse(cleaned);
      cache.set(cacheKey, parsed);
      return parsed;
    } catch (error) {
      console.error("Gemini error:", error);
      return { ingredients: [] };
    }
  },
};