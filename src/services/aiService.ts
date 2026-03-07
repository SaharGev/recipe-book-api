import { AiRecipeSearchFilters, AiSearchResponse } from "../types/aiTypes";
import { aiClient } from "./aiClient";
import { aiMockClient } from "./aiMockClient";
import Recipe from "../models/recipeModel";

export const aiSearchService = async (query: string): Promise<AiSearchResponse> => {
    const filters: AiRecipeSearchFilters = await aiClient.analyzeQuery(query);

    if (filters.ingredients.length === 0) {
        return {
            originalQuery: query,
            filters,
            recipes: [],
        };
    }
    const queryObject: {
        ingredients: { $all: string[] };
        difficulty?: "easy" | "medium" | "hard";
    } = {
        ingredients: { $all: filters.ingredients },
    };

    if (filters.difficulty) {
        queryObject.difficulty = filters.difficulty;
    }

    const recipes = await Recipe.find(queryObject).limit(10);

    return {
        originalQuery: query,
        filters,
        recipes,
    };
};