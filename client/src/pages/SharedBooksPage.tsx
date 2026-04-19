import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { AuthContext } from "../components/AuthContext";
import BottomNav from "../components/BottomNav";
import "./MyRecipesPage.css";
import { getMyLikes, getSharedWithMeRecipes } from "../services/recipeService";
import PageHeader from "../components/PageHeader";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../types/recipe";

type LikeItem = {
  targetType: string;
  targetId: string;
};

export default function SharedRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const { token } = useContext(AuthContext);

  const fetchRecipes = useCallback(async () => {
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getSharedWithMeRecipes(token);
      setRecipes(data || []);

      const likes = await getMyLikes(token);
      const likedRecipeIds = (likes as LikeItem[])
        .filter((l) => l.targetType === "recipe")
        .map((l) => l.targetId.toString());
      setLikedIds(likedRecipeIds);

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRecipes();
  }, [token]);

  if (loading) return <p className="myrecipes-loading-text">Loading shared recipes...</p>;
  if (error) return <p className="myrecipes-error-text">{error}</p>;

  if (recipes.length === 0)
    return (
      <div className="myrecipes-page">
        <PageHeader title="Shared with me" />
        <p className="myrecipes-empty-text">No recipes shared with you yet 🍳</p>
        <BottomNav />
      </div>
    );

  return (
    <div className="myrecipes-page">
      <PageHeader title="Shared with me" />
      <p className="myrecipes-recipes-count">{recipes.length} Recipes</p>

      <div className="myrecipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            initialLiked={likedIds.includes(recipe._id)}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}