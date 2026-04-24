import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "../pages/EditRecipePage.css";
import { getImageUrl } from "../utils/getImageUrl";
import PageHeader from "../components/PageHeader";
import { apiFetch } from "../services/apiClient";
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

const parseIngredient = (ing: string): Ingredient => {
  const parts = ing.trim().split(" ");
  if (parts.length >= 3) {
    return { quantity: parts[0], unit: parts[1], name: parts.slice(2).join(" ") };
  } else if (parts.length === 2) {
    return { quantity: parts[0], unit: "", name: parts[1] };
  }
  return { quantity: "", unit: "", name: ing };
};

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "", unit: "" }]);
  const [steps, setSteps] = useState<InstructionStep[]>([{ text: "", done: false }]);
  const [cookTime, setCookTime] = useState<number | "">("");
  const [difficulty, setDifficulty] = useState("easy");
  const [privacy, setPrivacy] = useState("private");
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    if (!id || !token) return;
    const fetchRecipe = async () => {
      try {
        const res = await apiFetch(`/recipes/${id}`, {}, token);
        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description || "");
        setIngredients(
          (data.ingredients || [""]).map((ing: string) =>
            typeof ing === "string" ? parseIngredient(ing) : ing
          )
        );
        setCookTime(data.cookTime || "");
        setDifficulty(data.difficulty || "easy");
        setPrivacy(data.isPublic ? "public" : "private");
        setExistingImage(data.imageUrl || "");
        if (data.instructions) {
          setSteps(
            data.instructions.split("\n").filter(Boolean).map((s: string) => ({ 
              text: s.replace(/^\d+\.\s*/, ""), 
              done: false 
            }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipe();
  }, [id, token]);

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
    if (!id || !token) return;

    try {
      let uploadedImageUrl = existingImage || "";
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

      const res = await apiFetch(`/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          ingredients: ingredients.map(formatIngredient),
          cookTime: cookTime === "" ? 0 : cookTime,
          difficulty,
          imageUrl: uploadedImageUrl,
          instructions,
          isPublic: privacy === "public",
        }),
      }, token);

      if (!res.ok) throw new Error("Failed to update recipe");
      navigate(`/recipes/${id}`, { replace: true });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating recipe");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      const res = await apiFetch(`/recipes/${id}`, {
        method: "DELETE",
      }, token);
      if (!res.ok) throw new Error("Failed to delete");
      navigate("/my-recipes");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting recipe");
    }
  };

  return (
    <div className="create-recipe-page">
      <div className="create-recipe-card">
        <PageHeader title="Edit Recipe" />

        <div className="recipe-image-wrapper">
          {imageUrl ? (
            <img src={URL.createObjectURL(imageUrl)} alt="Recipe" className="create-recipe-main-image" />
          ) : existingImage ? (
            <img src={getImageUrl(existingImage)} alt="Recipe" className="create-recipe-main-image" />
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
              onChange={(e) => { if (e.target.files?.[0]) setImageUrl(e.target.files[0]); }}
            />
            {imageUrl || existingImage ? "Change Photo" : "Add Photo"}
          </label>
          {(imageUrl || existingImage) && (
            <button
              type="button"
              className="recipe-image-remove-btn"
              onClick={() => { setImageUrl(null); setExistingImage(""); }}
            >
              Remove Photo
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="create-recipe-content">
          <div className="form-field">
            <label>Recipe Name</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter recipe name" required />
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>

          <div className="form-field">
            <label>Ingredients</label>
            {ingredients.map((ing, i) => (
              <div key={i} className="ingredient-row">
                <input type="text" value={ing.name} onChange={(e) => handleIngredientChange(i, "name", e.target.value)} placeholder="Ingredient" required className="ingredient-name-input" />
                <input type="text" value={ing.quantity} onChange={(e) => handleIngredientChange(i, "quantity", e.target.value)} placeholder="Qty" className="ingredient-qty-input" />
                <select value={ing.unit} onChange={(e) => handleIngredientChange(i, "unit", e.target.value)} className="ingredient-unit-select">
                  {UNITS.map((u) => <option key={u} value={u}>{u || "unit"}</option>)}
                </select>
                <button type="button" className="remove-ingredient-btn" style={{ position: "static" }} onClick={() => removeIngredient(i)} disabled={ingredients.length === 1}>✕</button>
              </div>
            ))}
            <button type="button" className="add-ingredient-btn" onClick={addIngredient}>+ Add Ingredient</button>
          </div>

          <div className="form-field">
            <label>Instructions</label>
            {steps.map((step, i) => (
              <div key={i} className="step-row">
                <span className="step-number">{i + 1}.</span>
                <input type="text" value={step.text} onChange={(e) => handleStepChange(i, e.target.value)} placeholder={`Step ${i + 1}`} required className="step-input" />
                <button type="button" className="remove-ingredient-btn" style={{ position: "static" }} onClick={() => removeStep(i)} disabled={steps.length === 1}>✕</button>
              </div>
            ))}
            <button type="button" className="add-ingredient-btn" onClick={addStep}>+ Add Step</button>
          </div>

          <div className="form-field">
            <label>Cook Time (minutes)</label>
            <input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value ? Number(e.target.value) : "")} required />
          </div>

          <div className="form-field">
            <label>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-field">
            <label>Privacy</label>
            <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          <button type="submit" className="save-recipe-btn">Update Recipe</button>
          <button type="button" className="delete-recipe-btn" onClick={handleDelete}>
            Delete Recipe
          </button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}
