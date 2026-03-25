// client/src/pages/RecipeDetailsPage.tsx
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import "./RecipeDetailsPage.css";

type Recipe = {
  _id: string;
  title: string;
  description?: string;
  ingredients: string[];
  cookTime: number;
  difficulty: string;
  instructions?: string;
  imageUrl?: string;
};

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch(`http://localhost:3000/recipes/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();
      setRecipe(data);
    };

    fetchRecipe();
  }, [id, token]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-details-page">
      
      {/* IMAGE */}
      <div className="image-wrapper">
        {recipe.imageUrl && (
          <img
            src={`http://localhost:3000${recipe.imageUrl}`}
            alt={recipe.title}
            className="recipe-main-image"
          />
        )}

        {/* TOP BUTTONS */}
        <button className="close-btn" onClick={() => navigate("/my-recipes")}>
          ✕
        </button>

        <button
          className="edit-btn"
          onClick={() => navigate(`/edit/${recipe._id}`)}
        >
          ✎
        </button>
      </div>

      {/* CONTENT CARD */}
      <div className="recipe-content">
        <h1 className="recipe-title">{recipe.title}</h1>

        {recipe.description && (
          <p className="recipe-description">{recipe.description}</p>
        )}

        {/* META */}
        <div className="recipe-meta">
          <div className="meta-box">
            <span>{recipe.cookTime}</span>
            <small>min</small>
          </div>

          <div className="meta-box">
            <span>{recipe.difficulty}</span>
            <small>difficulty</small>
          </div>
        </div>

        {/* INGREDIENTS */}
        <h3>Ingredients</h3>
        <ul className="ingredients-list">
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>

        {/* INSTRUCTIONS */}
        {recipe.instructions && (
          <>
            <h3>Instructions</h3>
            <p className="instructions">{recipe.instructions}</p>
          </>
        )}
      </div>
    </div>
  );
}