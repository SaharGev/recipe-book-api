// client/src/pages/MyRecipesPage.tsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import BottomNav from "../components/BottomNav";
import "./MyRecipesPage.css";

type Recipe = {
  _id: string;
  title: string;
  cookTime?: number;
  difficulty?: string;
  instructions?: string;
  imageUrl?: string;
};


export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [token]);

  if (loading) return <p className="loading-text">Loading your recipes...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (recipes.length === 0) return <p className="no-recipes-text">No recipes found.</p>;

  return (
    <div className="my-recipes-page">
      <h1 className="page-title">My Recipes</h1>
      <p className="recipes-count">{recipes.length} Recipes</p>

      <div className="add-recipe-button-wrapper">
      <button
          className="add-recipe-button"
          onClick={() => navigate("/add")}
        >
          + Add Recipe
        </button>
      </div>

      <div className="recipes-list">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="recipe-card"
            onClick={() => navigate(`/recipe/${recipe._id}`)}
          >
            <div className="recipe-info">
              <h3 className="recipe-title">{recipe.title}</h3>
              {recipe.instructions && (
                <p className="recipe-description">
                  {recipe.instructions.length > 80
                    ? recipe.instructions.slice(0, 80) + "..."
                    : recipe.instructions}
                </p>
              )}
              <div className="recipe-meta">
                {recipe.cookTime && <span>⏱ {recipe.cookTime} min</span>}
                {recipe.difficulty && <span>• {recipe.difficulty}</span>}
              </div>
            </div>

            {recipe.imageUrl && (
              <img
                src={`http://localhost:3000${recipe.imageUrl}`}
                alt={recipe.title}
                className="recipe-image"
              />
            )}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}