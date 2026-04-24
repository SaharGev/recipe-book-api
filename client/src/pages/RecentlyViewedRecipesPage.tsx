import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { getRecentlyViewed } from "../services/authService";
import { getMyLikes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";
import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import "./MyRecipesPage.css";
import type { Recipe } from "../types/recipe";

export default function RecentlyViewedRecipesPage() {
  const { token } = useContext(AuthContext);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getRecentlyViewed();
        setRecipes(data.recentlyViewedRecipes || []);
        if (token) {
          const likes = await getMyLikes(token);
          setLikedIds(likes.filter((l: any) => l.targetType === "recipe").map((l: any) => l.targetId.toString()));
        }
      } catch {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  if (loading) return <p className="myrecipes-loading-text">Loading...</p>;

  return (
    <div className="myrecipes-page">
      <PageHeader title="Recently Viewed Recipes" />
      <p className="myrecipes-recipes-count">{recipes.length} Recipes</p>
      {recipes.length === 0 ? (
        <p className="myrecipes-loading-text">No recently viewed recipes</p>
      ) : (
        <div className="myrecipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} initialLiked={likedIds.includes(recipe._id)} />
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  );
}
