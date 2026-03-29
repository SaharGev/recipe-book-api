import type { Recipe } from "../types/recipe";
import { useNavigate } from "react-router-dom";
import "./RecipeCard.css";


type RecipeCardProps = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const navigate = useNavigate();
    return (
        <button
            className="recipe-card"
            type="button"
            onClick={() => navigate(`/recipes/${recipe._id}`)}
        >
            <div className="recipe-card-preview">
              {recipe.imageUrl ? (
                <img
                   src={`http://localhost:3000${recipe.imageUrl}`}
                   alt={recipe.title}
                   className="recipe-card-image"
                />
              ) : (
                <div className="recipe-card-image-placeholder" />
              )}
            </div>

            <div className="recipe-card-content">
                <h3>{recipe.title}</h3>
                {recipe.description && <p>{recipe.description}</p>}
                {recipe.cookTime && <span className="recipe-card-time">{recipe.cookTime} min</span>}
            </div>
        </button>
    );
}