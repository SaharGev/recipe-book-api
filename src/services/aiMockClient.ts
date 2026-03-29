import { AiClient, AiRecipeSearchFilters } from "../types/aiTypes";
import { aiSearchKnowledge } from "./aiSearchKnowledge";

export const aiMockClient: AiClient = {
  analyzeQuery: async (query: string): Promise<AiRecipeSearchFilters> => {
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery
      .split(" ")
      .map((word) => word.trim())
      .filter(Boolean);


    let title: string | undefined;
    let category: string | undefined;

    const ingredients: string[] = [];

    let difficulty: "easy" | "medium" | "hard" | undefined;

    if (lowerQuery.includes("easy")) {
      difficulty = "easy";
    }

    if (lowerQuery.includes("medium")) {
      difficulty = "medium";
    }

    if (lowerQuery.includes("hard")) {
      difficulty = "hard";
    }

    for (const [key, knowledge] of Object.entries(aiSearchKnowledge)) {
      if (knowledge.synonyms.some((synonym) => words.includes(synonym))) {
        category = key;
        title = knowledge.title;

        for (const ing of knowledge.ingredients) {
          if (!ingredients.includes(ing)) {
            ingredients.push(ing);
          }
        }
      }
    }

    return {
      ingredients,
      difficulty,
      title,
      category,
    };
  },
};