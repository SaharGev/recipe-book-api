export interface AiFilters {
  ingredients: string[];
}

export interface AiRecipeSearchFilters {
  ingredients: string[];
  difficulty?: "easy" | "medium" | "hard";
}

export interface AiSearchResponse {
  originalQuery: string;
  filters: AiRecipeSearchFilters;
  recipes: unknown[];
}

export interface AiSearchRequest {
  query: string;
}

export interface AiClient {
  analyzeQuery(query: string): Promise<AiRecipeSearchFilters>;
}