import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { getMyLikes, getRecipe } from "../services/recipeService";
import BottomNav from "../components/BottomNav";
import type { Recipe } from "../types/recipe";
import { getImageUrl } from "../utils/getImageUrl";
import { toggleLike } from "../services/recipeService";
import "./MyRecipesPage.css";

export default function FavoriteRecipesPage() {
  const { token } = useContext(AuthContext);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [likedRecipeIds, setLikedRecipeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            try {
              return await getRecipe(id, token);
            } catch {
              return null;
            }
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
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h1 className="myrecipes-page-title">Favorite Recipes</h1>
      <p className="myrecipes-recipes-count">{favoriteRecipes.length} Recipes</p>

      {favoriteRecipes.length === 0 ? (
        <p className="myrecipes-loading-text">No favorite recipes yet</p>
      ) : (
        <div className="myrecipes-grid">
          {favoriteRecipes.map((recipe) => {
            const isLiked = likedRecipeIds.includes(recipe._id);
            return (
              <div
                key={recipe._id}
                className="myrecipes-card"
                onClick={() => navigate(`/recipes/${recipe._id}`)}
              >
                <div className="myrecipes-card-preview">
                  {recipe.imageUrl ? (
                    <img
                      src={getImageUrl(recipe.imageUrl)}
                      alt={recipe.title}
                      className="myrecipes-card-image"
                    />
                  ) : (
                    <div className="myrecipes-card-image-placeholder" />
                  )}
                  <button
                    type="button"
                    className="myrecipes-like-btn"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!token) return;
                      try {
                        const data = await toggleLike(recipe._id, token);
                        setLikedRecipeIds((prev) =>
                          data.action === "liked"
                            ? [...prev, recipe._id]
                            : prev.filter((id) => id !== recipe._id)
                        );
                      } catch (error) {
                        console.error("failed to toggle like", error);
                      }
                    }}
                  >
                    {isLiked ? "❤️" : "♡"}
                  </button>
                </div>
                <h3 className="myrecipes-card-title">{recipe.title}</h3>
                <div className="myrecipes-card-meta">
                  {recipe.cookTime && <span>⏱ {recipe.cookTime} min</span>}
                  {recipe.difficulty && <span>• {recipe.difficulty}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}