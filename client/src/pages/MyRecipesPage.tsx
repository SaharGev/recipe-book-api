import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import BottomNav from "../components/BottomNav";
import "./MyRecipesPage.css";
import { getMyLikes } from "../services/recipeService";
import PageHeader from "../components/PageHeader";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../types/recipe";

type LikeItem = {
  targetType: string;
  targetId: string;
};

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sharedRecipes, setSharedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!token) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/recipes/my", {
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch recipes");
        }

        const data: Recipe[] = await res.json();
        setRecipes(data);

        const sharedRes = await fetch("http://localhost:3000/recipes/shared-with-me", {
          headers: { Authorization: "Bearer " + token },
        });
        const sharedData: Recipe[] = await sharedRes.json();
        setSharedRecipes(sharedData);

        const likes = await getMyLikes(token);

        const likedRecipeIds = (likes as LikeItem[])
          .filter((l) => l.targetType === "recipe")
          .map((l) => l.targetId.toString());

        setLikedIds(likedRecipeIds);

        console.log("likedRecipeIds:", likedRecipeIds);
        console.log("recipes ids:", data.map((recipe) => recipe._id));
        
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [token]);

  if (loading) return <p className="myrecipes-loading-text">Loading your recipes...</p>;
  if (error) return <p className="myrecipes-error-text">{error}</p>;
  if (recipes.length === 0 && sharedRecipes.length === 0)
  return (
    <div className="myrecipes-page">
      <PageHeader title="My Recipes" />
      <p className="myrecipes-recipes-count">0 Recipes</p>

      <div className="myrecipes-add-button-wrapper">
        <button
          className="myrecipes-add-button"
          onClick={() => navigate("/createRecipe")}
        >
          + Add Recipe
        </button>
      </div>

      <p className="myrecipes-empty-text">
        No recipes yet 🍳<br />
        Start by adding your first recipe!
      </p>

      <BottomNav />
    </div>
  );

  return (
    <div className="myrecipes-page">
      <PageHeader title="My Recipes" />
      <p className="myrecipes-recipes-count">{recipes.length} Recipes</p>

      <div className="myrecipes-add-button-wrapper">
        <button
          className="myrecipes-add-button"
          onClick={() => navigate("/createRecipe")}
        >
          + Add Recipe
        </button>
      </div>

      {sharedRecipes.length > 0 && (
        <p className="myrecipes-recipes-count">Shared with me ({sharedRecipes.length})</p>
      )}

      <div className="myrecipes-grid">
        {[...recipes, ...sharedRecipes].map((recipe) => (
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