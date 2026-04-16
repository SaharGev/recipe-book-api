import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import BottomNav from "../components/BottomNav";
import "./MyRecipesPage.css";
import { getMyLikes, toggleLike } from "../services/recipeService";
import { getImageUrl } from "../utils/getImageUrl";

type Recipe = {
  _id: string;
  title: string;
  description: string;
  cookTime: number;
  difficulty: string;
  instructions?: string;
  imageUrl?: string;
};

type LikeItem = {
  targetType: string;
  targetId: string;
};

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
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
  if (recipes.length === 0)
  return (
    <div className="myrecipes-page">
      <button
          className="icon-btn-mr"
          onClick={() => navigate(-1)}
        >
          ‹
        </button>
      <h1 className="myrecipes-page-title">My Recipes</h1>
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
      <button
          className="icon-btn-mr"
          onClick={() => navigate(-1)}
        >
          ‹
        </button>
      <h1 className="myrecipes-page-title">My Recipes</h1>
      <p className="myrecipes-recipes-count">{recipes.length} Recipes</p>

      <div className="myrecipes-add-button-wrapper">
        <button
          className="myrecipes-add-button"
          onClick={() => navigate("/createRecipe")}
        >
          + Add Recipe
        </button>
      </div>

      <div className="myrecipes-grid">
        {recipes.map((recipe) => {
          const isLiked = likedIds.includes(recipe._id);

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

                    setLikedIds((prev) =>
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

              {recipe.description && (
                <p className="myrecipes-card-description">
                  {recipe.description}
                </p>
              )}

              <div className="myrecipes-card-meta">
                {recipe.cookTime && <span>⏱ {recipe.cookTime} min</span>}
                {recipe.difficulty && <span>• {recipe.difficulty}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}