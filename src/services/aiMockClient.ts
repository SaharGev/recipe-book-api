import { AiClient, AiRecipeSearchFilters } from "../types/aiTypes";
import { aiSearchKnowledge } from "./aiSearchKnowledge";

export const aiMockClient: AiClient = {
  analyzeQuery: async (query: string): Promise<AiRecipeSearchFilters> => {
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery
      .split(" ")
      .map((word) => word.trim())
      .filter(Boolean);

    // extracted values
    let title: string | undefined;
    let category: string | undefined;
    let recipeBookName: string | undefined;
    let favorites: boolean | undefined;

    const ingredients: string[] = [];

    // difficulty detection
    const difficultyKeywords = ["easy", "medium", "hard"] as const;

    const detectedDifficulty = difficultyKeywords.find((keyword) =>
      words.includes(keyword)
    );

    const ignoredWords = [
      "i",
      "have",
      "with",
      "and",
      "recipe",
      "recipes",
      "favorite",
      "favorites",
      "book",
      "books",
      "easy",
      "medium",
      "hard",
    ] as const;

    for (const word of words) {
      if (!ignoredWords.includes(word as (typeof ignoredWords)[number])) {
        if (!ingredients.includes(word)) {
          ingredients.push(word);
        }
      }
    }

    const isBookSearch = lowerQuery.includes("book");
    const isFavoritesSearch =
      lowerQuery.includes("favorite") || lowerQuery.includes("favorites");

    if (isBookSearch) {
      recipeBookName = query.trim();
    }

    if (isFavoritesSearch) {
      favorites = true;
    }

    // knowledge-based detection
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
      difficulty: detectedDifficulty,
      title,
      category,
      recipeBookName,
      favorites,
    };
  },
};