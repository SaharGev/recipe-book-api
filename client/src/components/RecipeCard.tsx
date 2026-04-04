import type { Recipe } from "../types/recipe";
import { useNavigate } from "react-router-dom";
import { toggleLike } from "../services/recipeService";
import "./RecipeCard.css";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useState } from "react";


type RecipeCardProps = {
  recipe: Recipe;
  initialLiked?: boolean;
};

export default function RecipeCard({ recipe, initialLiked = false }: RecipeCardProps) {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [liked, setLiked] = useState(initialLiked);

    const handleLikeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        try {
            if (!token) return;

            const data = await toggleLike(recipe._id, token);
            setLiked(data.action === "liked");
            console.log("like toggled for recipe:", recipe._id);
        } catch (error) {
            console.error("failed to toggle like", error);
        }
    };

    return (
        <button
            className="recipe-card"
            type="button"
            onClick={() => navigate(`/recipes/${recipe._id}`)}
        >
            <div className="recipe-card-preview">
              <span
              className="recipe-like-btn"
              onClick={(e) => handleLikeClick(e as unknown as React.MouseEvent<HTMLButtonElement>)}
              >
              {liked ? "❤️" : "♡"}
              </span>
              {recipe.imageUrl ? (
                <img
                   src={recipe.imageUrl}
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