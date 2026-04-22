import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiClient, AiRecipeSearchFilters } from "../types/aiTypes";

export const aiRealClient: AiClient = {
  analyzeQuery: async (query: string): Promise<AiRecipeSearchFilters> => {
    console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);
    
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
        // try Gemini first
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed: AiRecipeSearchFilters = JSON.parse(text);
        return parsed;
        } catch {
        // fallback - return basic text search
        return {
            ingredients: [],
        };
    }
  },
};