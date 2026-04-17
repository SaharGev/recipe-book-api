import "./RecipeBookCard.css";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getCommentCount } from "../services/commentService";

type RecipePreview = {
  imageUrl?: string;
};

type RecipeBookCardProps = {
  _id: string;
  title: string;
  recipesCount: number;
  recipes?: RecipePreview[];
  initialLiked?: boolean;
  onLikeToggle?: (id: string, liked: boolean) => void;
};

export default function RecipeBookCard({ _id, title, recipesCount, recipes = [], initialLiked = false, onLikeToggle }: RecipeBookCardProps) {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [liked, setLiked] = useState(initialLiked);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    getCommentCount("book", _id).then(setCommentCount);
  }, [_id]);

  const handleLikeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      if (!token) return;
      const response = await fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetType: "book",
          targetId: _id,
        }),
      });
      const data = await response.json();
      const newLiked = data.action === "liked";
      setLiked(newLiked);
      onLikeToggle?.(_id, newLiked);
    } catch (error) {
      console.error("failed to toggle like", error);
    }
  };

  const previewImages = [...recipes]
  .slice(-4)
  .reverse()
  .map((recipe) => recipe.imageUrl)
  .filter(Boolean) as string[];

  return (
    <div className="recipe-book-card" onClick={() => navigate(`/recipe-books/${_id}`)}>

      <div className="recipe-preview" style={{ position: "relative" }}>
        <div className="recipe-book-like-comment-row">
          {commentCount > 0 && <span className="recipe-card-comments">💬 {commentCount}</span>}
          <button
            type="button"
            className="recipe-book-like-btn"
            onClick={handleLikeClick}
          >
            {liked ? "❤️" : "♡"}
          </button>
        </div>
        {[0, 1, 2, 3].map((index) =>
          previewImages[index] ? (
            <img
              key={index}
              src={getImageUrl(previewImages[index])}
              alt={`${title} preview ${index + 1}`}
              className="recipe-thumb"
            />
          ) : (
            <div key={index} className="recipe-thumb recipe-thumb-placeholder" />
          )
        )}
      </div>
      
      <h3>{title}</h3>
      <p>{recipesCount} recipes</p>
    </div>
  );
}