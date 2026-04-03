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

  if (loading) return <p className="myrecipes-loading-text">Loading your recipes...</p>;
  if (error) return <p className="myrecipes-error-text">{error}</p>;
  if (recipes.length === 0) return <p className="myrecipes-no-recipes-text">No recipes found.</p>;

  return (
    <div className="myrecipes-page">
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
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="myrecipes-card"
            onClick={() => navigate(`/recipe/${recipe._id}`)}
          >
            {recipe.imageUrl ? (
              <img
                src={`http://localhost:3000${recipe.imageUrl}`}
                alt={recipe.title}
                className="myrecipes-card-image"
              />
            ) : (
              <div className="myrecipes-card-image-placeholder" />
            )}

            <h3 className="myrecipes-card-title">{recipe.title}</h3>

            {recipe.instructions && (
              <p className="myrecipes-card-description">
                {recipe.instructions.length > 80
                  ? recipe.instructions.slice(0, 80) + "..."
                  : recipe.instructions}
              </p>
            )}

            <div className="myrecipes-card-meta">
              {recipe.cookTime && <span>⏱ {recipe.cookTime} min</span>}
              {recipe.difficulty && <span>• {recipe.difficulty}</span>}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}