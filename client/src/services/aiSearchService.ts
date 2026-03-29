import type { Recipe } from "../types/recipe";
import type { RecipeBook } from "../types/recipeBook";

interface RecipesSection {
  type: "recipes";
  title: string;
  items: Recipe[];
}

interface RecipeBooksSection {
  type: "recipeBooks";
  title: string;
  items: RecipeBook[];
}

export type AiSearchSection = RecipesSection | RecipeBooksSection;

interface AiSearchResponse {
  originalQuery: string;
  filters: unknown;
  recipes: Recipe[];
  recipeBooks: RecipeBook[];
  sections: AiSearchSection[];
}

export async function aiSearch(query: string): Promise<AiSearchResponse> {
  const response = await fetch("/ai/ai-search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to perform AI search");
  }

  return data;
}