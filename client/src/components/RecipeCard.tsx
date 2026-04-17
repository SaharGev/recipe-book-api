import type { Recipe } from "../types/recipe";
import { useNavigate } from "react-router-dom";
import { toggleLike } from "../services/recipeService";
import "./RecipeCard.css";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { getImageUrl } from "../utils/getImageUrl";
import { getCommentCount } from "../services/commentService";


type RecipeCardProps = {
  recipe: Recipe;
  initialLiked?: boolean;
  showDescription?: boolean;
};

export default function RecipeCard({ recipe, initialLiked = false, showDescription = true }: RecipeCardProps) {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [liked, setLiked] = useState(initialLiked);
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
      setLiked(initialLiked);
    }, [initialLiked]);

    useEffect(() => {
      getCommentCount("recipe", recipe._id).then(setCommentCount);
    }, [recipe._id]);

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
        <div
          className="recipe-card"
          onClick={() => navigate(`/recipes/${recipe._id}`)}
        >
            <div className="recipe-card-preview">
                <div className="recipe-like-comment-row">
                  {commentCount > 0 && <span className="recipe-card-comments">💬 {commentCount}</span>}
                  <button
                      type="button"
                      className="recipe-like-btn"
                      onClick={handleLikeClick}
                  >
                      {liked ? "❤️" : "♡"}
                  </button>
                </div>
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
                {showDescription && recipe.description && (
                  <p className="recipe-card-description">{recipe.description}</p>
                )}
                <div className="recipe-card-meta">
                  {recipe.cookTime && <span className="recipe-card-time">⏱ {recipe.cookTime} min</span>}
                  {recipe.difficulty && <span className="recipe-card-time">• {recipe.difficulty}</span>}
                </div>
            </div>
        </div>
    );
}