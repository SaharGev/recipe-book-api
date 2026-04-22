import { AiRecipeSearchFilters, AiSearchResponse } from "../types/aiTypes";
import { aiClient } from "./aiClient";
import Recipe from "../models/recipeModel";
import RecipeBook from "../models/recipeBookModel";
import Like from "../models/likeModel";

export const aiSearchService = async (
  query: string,
  userId: string
): Promise<AiSearchResponse> => {
  const filters: AiRecipeSearchFilters = await aiClient.analyzeQuery(query);
  console.log("AI filters:", JSON.stringify(filters, null, 2));

  let favoriteRecipeIds: string[] = [];
  if (filters.favorites) {
    const favoriteLikes = await Like.find({
      userId,
      targetType: "recipe",
    });
    favoriteRecipeIds = favoriteLikes.map((like) => like.targetId.toString());
  }

  // who can see what - user sees their own, public, and shared recipes
  const accessFilter = {
    $or: [
      { owner: userId },
      { isPublic: true },
      { "collaborators.user": userId },
    ],
  };

  // build the recipe search conditions based only on AI filters
  const recipeConditions: object[] = [];

  if (filters.ingredients.length > 0) {
    recipeConditions.push({
      ingredients: {
        $all: filters.ingredients.map((ing) => new RegExp(ing, "i")),
      },
    });
  }

  if (filters.difficulty) {
    recipeConditions.push({ difficulty: filters.difficulty });
  }

  if (filters.title) {
    recipeConditions.push({ title: { $regex: filters.title, $options: "i" } });
  }

  if (filters.category) {
    recipeConditions.push({
      $or: [
        { title: { $regex: filters.category, $options: "i" } },
        { description: { $regex: filters.category, $options: "i" } },
      ],
    });
  }

  // if AI found no filters at all, fall back to searching the raw query
  if (recipeConditions.length === 0) {
    recipeConditions.push({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
  }

  const recipes = await Recipe.find({
    $and: [
      accessFilter,
      ...(filters.favorites ? [{ _id: { $in: favoriteRecipeIds } }] : []),
      { $and: recipeConditions },
    ],
  }).limit(10);

  const recipeBookConditions: object[] = [];

  if (filters.recipeBookName) {
    recipeBookConditions.push({
      $or: [
        { name: { $regex: filters.recipeBookName, $options: "i" } },
        { description: { $regex: filters.recipeBookName, $options: "i" } },
      ],
    });
  } else {
    recipeBookConditions.push({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
  }

  const recipeBooks = await RecipeBook.find({
    $and: [accessFilter, { $or: recipeBookConditions }],
  })
    .populate("recipes")
    .limit(10);

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