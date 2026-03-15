// client/src/pages/AddPage.tsx
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "../pages/AddPage.css";

export default function AddPage() {
  const navigate = useNavigate();

  return (
    <div className="add-options-page">
      <h1 className="page-title">Add Recipe</h1>

      <div className="options-container">

        <div
          className="option-card"
          onClick={() => navigate("/createRecipe")}
        >
          <div className="option-icon">➕</div>
          <div>
            <h2>Add Recipe</h2>
            <p>Create your own recipe</p>
          </div>
        </div>

        <div
          className="option-card"
          onClick={() => navigate("/createRecipeBook")}
        >
          <div className="option-icon">📖</div>
          <div>
            <h2>Add Book Recipe</h2>
            <p>Add a recipe to a recipe book</p>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}