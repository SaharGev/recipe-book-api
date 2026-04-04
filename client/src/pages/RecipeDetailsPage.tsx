// client/src/pages/RecipeDetailsPage.tsx
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import "./RecipeDetailsPage.css";
import type { Recipe } from "../types/recipe";


export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const accessToken = token || localStorage.getItem("accessToken");

  const [recipe, setRecipe] = useState<Recipe | null>(null);


  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch(`http://localhost:3000/recipes/${id}`, {
        headers: { Authorization: "Bearer " + accessToken },
      });

      const data = await res.json();

      if (!res.ok) {
        return;
      }

      setRecipe(data);
    };

    fetchRecipe();
  }, [id, accessToken]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-details-page">
      
      {/* IMAGE */}
      <div className="image-wrapper">
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
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
          {(Array.isArray(recipe.ingredients) ? recipe.ingredients : []).map((ing, i) => (
            <li key={i}>
              {typeof ing === "string"
                ? ing
                : `${ing.quantity ?? ""} ${ing.unit ?? ""} ${ing.name ?? ""}`.trim()}
            </li>
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