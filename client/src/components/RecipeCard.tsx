import type { Recipe } from "../types/recipe";
import { useNavigate } from "react-router-dom";
import { toggleLike } from "../services/recipeService";
import "./RecipeCard.css";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useState } from "react";
import { getImageUrl } from "../utils/getImageUrl";


type RecipeCardProps = {
  recipe: Recipe;
  initialLiked?: boolean;
};

export default function RecipeCard({ recipe, initialLiked = false }: RecipeCardProps) {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [liked, setLiked] = useState(initialLiked);

    const imageSrc = getImageUrl(recipe.imageUrl);

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
                <button
                    type="button"
                    className="recipe-like-btn"
                    onClick={handleLikeClick}
                >
                    {liked ? "❤️" : "♡"}
                </button>
              {recipe.imageUrl ? (
                <img
                    src={imageSrc}
                    alt={recipe.title}
                    className="recipe-card-image"
                />
                ) : (
                <div className="recipe-card-image-placeholder" />
                )}
            </div>

            <div className="recipe-card-content">
                <h3>{recipe.title}</h3>
                {recipe.cookTime && <span className="recipe-card-time">{recipe.cookTime} min</span>}
            </div>
        </button>
    );
}