import { AiRecipeSearchFilters, AiSearchResponse } from "../types/aiTypes";
import { aiClient } from "./aiClient";
import Recipe from "../models/recipeModel";
import RecipeBook from "../models/recipeBookModel";
import Like from "../models/likeModel";

export const aiSearchService = async (
  query: string,
  userId: string
): Promise<AiSearchResponse> => {
  // analyze AI query
  const filters: AiRecipeSearchFilters = await aiClient.analyzeQuery(query);

  // favorites lookup
  let favoriteRecipeIds: string[] = [];

  if (filters.favorites) {
    const favoriteLikes = await Like.find({
      userId,
      targetType: "recipe",
    });

    favoriteRecipeIds = favoriteLikes.map((like) => like.targetId.toString());
  }

  // derived flags
  const hasNoFilters =
    filters.ingredients.length === 0 &&
    !filters.difficulty &&
    !filters.title;

  // recipe query object
  const queryObject: {
    ingredients?: { $all: string[] };
    difficulty?: "easy" | "medium" | "hard";
    category?: string;
  } = {};

  if (filters.ingredients.length > 0) {
    queryObject.ingredients = { $all: filters.ingredients };
  }

  if (filters.difficulty) {
    queryObject.difficulty = filters.difficulty;
  }

  // access filters
  const recipeAccessFilter = {
    $or: [
      { owner: userId },
      { isPublic: true },
      { "collaborators.user": userId },
    ],
  };

  const recipeBookAccessFilter = {
    $or: [
      { owner: userId },
      { isPublic: true },
      { "collaborators.user": userId },
    ],
  };

  // recipes query
  const recipes = await Recipe.find({
    $and: [
      recipeAccessFilter,
      ...(filters.favorites ? [{ _id: { $in: favoriteRecipeIds } }] : []),
      {
        $or: [
          ...(Object.keys(queryObject).length > 0 ? [queryObject] : []),
          ...(filters.title
            ? [{ title: { $regex: filters.title, $options: "i" } }]
            : []),
          ...(hasNoFilters
            ? [{ title: { $regex: query, $options: "i" } }]
            : []),
          ...(filters.category
            ? [
                { title: { $regex: filters.category, $options: "i" } },
                { description: { $regex: filters.category, $options: "i" } },
                { ingredients: { $in: [filters.category] } },
              ]
            : []),
          ...(query
            ? [
                {
                  $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                  ],
                },
              ]
            : []),
        ],
      },
    ],
  }).limit(10);

  // recipe books query
  const recipeBooks = await RecipeBook.find({
    $and: [
      recipeBookAccessFilter,
      {
        $or: [
          ...(filters.recipeBookName
            ? [{ name: { $regex: filters.recipeBookName, $options: "i" } }]
            : []),
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    ],
  }).limit(10);

  return {
    originalQuery: query,
    filters,
    recipes,
    recipeBooks,
    sections: [
      {
        type: "recipes",
        title: "Recipes",
        items: recipes,
      },
      {
        type: "recipeBooks",
        title: "Recipe Books",
        items: recipeBooks,
      },
    ],
  };
};