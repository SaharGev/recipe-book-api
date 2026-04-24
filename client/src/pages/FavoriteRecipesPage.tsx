import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { getMyLikes, getRecipe } from "../services/recipeService";
import BottomNav from "../components/BottomNav";
import type { Recipe } from "../types/recipe";
import "./MyRecipesPage.css";
import PageHeader from "../components/PageHeader";
import RecipeCard from "../components/RecipeCard";

export default function FavoriteRecipesPage() {
  const { token } = useContext(AuthContext);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [likedRecipeIds, setLikedRecipeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!token) return;
        const likes = await getMyLikes(token);
        const recipeIds = likes
          .filter((like: { targetType: string; targetId: string; createdAt: string }) => like.targetType === "recipe")
          .sort((a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((like: { targetType: string; targetId: string }) => like.targetId.toString());
        setLikedRecipeIds(recipeIds);
        const results = await Promise.all(
          recipeIds.map(async (id: string) => {
            try { return await getRecipe(id, token); }
            catch { return null; }
          })
        );
        setFavoriteRecipes(results.filter(Boolean));
      } catch {
        setFavoriteRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [token]);

  if (loading) return <p className="myrecipes-loading-text">Loading...</p>;

  return (
    <div className="myrecipes-page">
      <PageHeader title="Favorite Recipes" />
      <p className="myrecipes-recipes-count">{favoriteRecipes.length} Recipes</p>
      {favoriteRecipes.length === 0 ? (
        <p className="myrecipes-loading-text">No favorite recipes yet</p>
      ) : (
        <div className="myrecipes-grid">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              initialLiked={likedRecipeIds.includes(recipe._id)}
            />
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  );
}
