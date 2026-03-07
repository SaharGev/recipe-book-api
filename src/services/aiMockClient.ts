import { AiClient, AiRecipeSearchFilters } from "../types/aiTypes";

export const aiMockClient: AiClient = {
  analyzeQuery: async (query: string): Promise<AiRecipeSearchFilters> => {
    const lowerQuery = query.toLowerCase();

    const ingredients: string[] = [];
    let difficulty: "easy" | "medium" | "hard" | undefined;

    if (lowerQuery.includes("pasta")) {
      ingredients.push("pasta");
    }

    if (lowerQuery.includes("tomato")) {
      ingredients.push("tomato");
    }

    if (lowerQuery.includes("easy")) {
      difficulty = "easy";
    }

    if (lowerQuery.includes("medium")) {
      difficulty = "medium";
    }

    if (lowerQuery.includes("hard")) {
      difficulty = "hard";
    }

    return {
      ingredients,
      difficulty,
    };
  },
};