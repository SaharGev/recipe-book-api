import "./RecipeBookCard.css";
import { useNavigate } from "react-router-dom";

type RecipeBookCardProps = {
  _id: string;
  title: string;
  recipesCount: number;
};

export default function RecipeBookCard({ _id, title, recipesCount }: RecipeBookCardProps) {
  const navigate = useNavigate();

  return (
    <div className="recipe-book-card" onClick={() => navigate(`/recipe-books/${_id}`)}>

      <div className="recipe-preview">
        <div className="recipe-thumb" />
        <div className="recipe-thumb" />
        <div className="recipe-thumb" />
        <div className="recipe-thumb" />
      </div>
      
      <h3>{title}</h3>
      <p>{recipesCount} recipes</p>
    </div>
  );
}