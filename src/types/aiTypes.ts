export interface AiFilters {
  ingredients: string[];
}

export interface AiRecipeSearchFilters {
  ingredients: string[];
  difficulty?: "easy" | "medium" | "hard";
  title?: string;
  category?: string;
  recipeBookName?: string;
  favorites?: boolean;
}

export interface AiSearchSection {
  type: "recipes" | "recipeBooks";
  title: string;
  items: unknown[];
}

export interface AiSearchResponse {
  originalQuery: string;
  filters: AiRecipeSearchFilters;
  recipes: unknown[];
  recipeBooks: unknown[];
  sections: AiSearchSection[];
}

export interface AiSearchRequest {
  query: string;
}

export interface AiClient {
  analyzeQuery(query: string): Promise<AiRecipeSearchFilters>;
}