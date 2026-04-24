import { useState } from "react";
import BottomNav from "../components/BottomNav";
import "../pages/CreateRecipePage.css";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { apiFetch } from "../services/apiClient";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
};

type InstructionStep = {
  text: string;
  done: boolean;
};

const UNITS = ["", "cup", "tbsp", "tsp", "g", "kg", "ml", "l", "piece", "slice"];

const formatIngredient = (ing: Ingredient): string => {
  const parts = [ing.quantity, ing.unit, ing.name].filter(Boolean);
  return parts.join(" ");
};

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "", unit: "" }]);
  const [steps, setSteps] = useState<InstructionStep[]>([{ text: "", done: false }]);
  const [cookTime, setCookTime] = useState<number | "">("");
  const [difficulty, setDifficulty] = useState("easy");
  const [privacy, setPrivacy] = useState("private");
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // Ingredients
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const addIngredient = () => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);

  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Steps
  const handleStepChange = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], text: value };
    setSteps(updated);
  };

  const addStep = () => setSteps([...steps, { text: "", done: false }]);

  const removeStep = (index: number) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const toggleStep = (index: number) => {
    const updated = [...steps];
    updated[index].done = !updated[index].done;
    setSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!token) throw new Error("User not logged in");

      let uploadedImageUrl = "";
      if (imageUrl) {
        const imageData = new FormData();
        imageData.append("image", imageUrl);

        const uploadRes = await apiFetch("/upload/image", {
          method: "POST",
          body: imageData,
        }, token);

        if (!uploadRes.ok) throw new Error("Image upload failed");
        uploadedImageUrl = (await uploadRes.json()).url;
      }

      const instructions = steps.map((s, i) => `${i + 1}. ${s.text}`).join("\n");

      const res = await apiFetch("/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          ingredients: ingredients.map(formatIngredient),
          cookTime,
          difficulty,
          imageUrl: uploadedImageUrl,
          instructions,
          isPublic: privacy === "public",
        }),
      }, token);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to save recipe");
      }

      navigate(-1);
    } catch (err: unknown) {
      alert(err instanceof Error ? "Error saving recipe: " + err.message : "Error saving recipe");
    }
  };

  return (
    <div className="create-recipe-page">
      <div className="create-recipe-card">
        <PageHeader title="Create Recipe" />

        <div className="recipe-image-wrapper">
          {imageUrl ? (
            <img src={URL.createObjectURL(imageUrl)} alt="Recipe" className="create-recipe-main-image" />
          ) : (
            <div className="recipe-no-image" />
          )}
        </div>

        <div className="recipe-image-actions">
          <label className="recipe-image-action-btn">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files?.[0]) setImageUrl(e.target.files[0]);
              }}
            />
            {imageUrl ? "Change Photo" : "Add Photo"}
          </label>
          {imageUrl && (
            <button
              type="button"
              className="recipe-image-remove-btn"
              onClick={() => setImageUrl(null)}
            >
              Remove Photo
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="create-recipe-content">

          {/* Title */}
          <div className="form-field">
            <label>Recipe Name</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter recipe name" required />
          </div>

          {/* Description */}
          <div className="form-field">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>

          {/* Ingredients */}
          <div className="form-field">
            <label>Ingredients</label>
            {ingredients.map((ing, i) => (
              <div key={i} className="ingredient-row">
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(i, "name", e.target.value)}
                  placeholder="Ingredient"
                  required
                  className="ingredient-name-input"
                />
                <input
                  type="text"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(i, "quantity", e.target.value)}
                  placeholder="Qty"
                  className="ingredient-qty-input"
                />
                <select
                  value={ing.unit}
                  onChange={(e) => handleIngredientChange(i, "unit", e.target.value)}
                  className="ingredient-unit-select"
                >
                  {UNITS.map((u) => <option key={u} value={u}>{u || "unit"}</option>)}
                </select>
                <button
                  type="button"
                  className="remove-ingredient-btn"
                  style={{ position: "static" }}
                  onClick={() => removeIngredient(i)}
                  disabled={ingredients.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="add-ingredient-btn" onClick={addIngredient}>
              + Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div className="form-field">
            <label>Instructions</label>
            {steps.map((step, i) => (
              <div key={i} className="step-row">
                <span className="step-number">{i + 1}.</span>
                <input
                  type="text"
                  value={step.text}
                  onChange={(e) => handleStepChange(i, e.target.value)}
                  placeholder={`Step ${i + 1}`}
                  required
                  className="step-input"
                />
                <button
                  type="button"
                  className="remove-ingredient-btn"
                  style={{ position: "static" }}
                  onClick={() => removeStep(i)}
                  disabled={steps.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="add-ingredient-btn" onClick={addStep}>
              + Add Step
            </button>
          </div>

          {/* Cook Time */}
          <div className="form-field">
            <label>Cook Time (minutes)</label>
            <input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value ? Number(e.target.value) : "")} required />
          </div>

          {/* Difficulty */}
          <div className="form-field">
            <label>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Privacy */}
          <div className="form-field">
            <label>Privacy</label>
            <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          <button type="submit" className="save-recipe-btn">Save Recipe</button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}
