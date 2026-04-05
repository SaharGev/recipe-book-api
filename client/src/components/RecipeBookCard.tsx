import "./RecipeBookCard.css";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

type RecipePreview = {
  imageUrl?: string;
};

type RecipeBookCardProps = {
  _id: string;
  title: string;
  recipesCount: number;
  recipes?: RecipePreview[];
};

export default function RecipeBookCard({ _id, title, recipesCount, recipes = [] }: RecipeBookCardProps) {
  const navigate = useNavigate();

  const previewImages = [...recipes]
  .slice(-4)
  .reverse()
  .map((recipe) => recipe.imageUrl)
  .filter(Boolean) as string[];

  return (
    <div className="recipe-book-card" onClick={() => navigate(`/recipe-books/${_id}`)}>

      <div className="recipe-preview">
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