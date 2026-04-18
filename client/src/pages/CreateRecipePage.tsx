// client/src/pages/CreateRecipePage.tsx
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import "../pages/CreateRecipePage.css";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";


export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [cookTime, setCookTime] = useState<number | "">("");
  const [difficulty, setDifficulty] = useState("easy");
  const [privacy, setPrivacy] = useState("private");
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");
  const navigate = useNavigate();

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);

  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User not logged in");

      let uploadedImageUrl = "";
      if (imageUrl) {
        const imageData = new FormData();
        imageData.append("image", imageUrl);

        const uploadRes = await fetch("http://localhost:3000/upload/image", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: imageData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");

        uploadedImageUrl = (await uploadRes.json()).url;
      }

      const res = await fetch("http://localhost:3000/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          ingredients,
          cookTime,
          difficulty,
          imageUrl: uploadedImageUrl,
          instructions,
          isPublic: privacy === "public",
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to save recipe");
      }

      alert("Recipe saved successfully!");
      setTitle(""); setDescription(""); setIngredients([""]);
      setCookTime(""); setDifficulty("easy"); setPrivacy("public");
      setImageUrl(null); setInstructions("");

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
            <img src={URL.createObjectURL(imageUrl)} alt="Recipe" className="create-recipe-main-image"/>
          ) : <div className="recipe-no-image"/>}
        </div>

        <form onSubmit={handleSubmit} className="create-recipe-content">

          {/* Add Image */}
          <div style={{ marginBottom: "14px" }}>
            <label>Add Image</label>
            <div className="image-upload-wrapper">
              <label className="choose-file-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageUrl(e.target.files[0]); 
                      e.target.value = ""; 
                    }
                  }}
                />
                Choose File
              </label>

              {/*filename + X*/}
              {imageUrl && (
                <div className="ingredient-row" style={{ marginTop: "8px" }}>
                  <input type="text" value={imageUrl.name} readOnly />
                  <button
                    type="button"
                    className="remove-ingredient-btn"
                    onClick={() => setImageUrl(null)}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recipe Name */}
          <div>
            <label>Recipe Name</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter recipe name" required />
          </div>

          {/* Description */}
          <div>
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>

          {/* Ingredients */}
          <div>
            <label>Ingredients</label>
            {ingredients.map((ing, i) => (
              <div key={i} className="ingredient-row ingredient">
                <input
                  type="text"
                  value={ing}
                  onChange={(e) => handleIngredientChange(i, e.target.value)}
                  placeholder={`Ingredient ${i + 1}`}
                  required
                  className="ingredient-input"
                />
                {i > 0 && (
                  <button
                    type="button"
                    className="remove-ingredient-btn"
                    onClick={() => removeIngredient(i)}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-ingredient-btn" onClick={addIngredient}>
              + Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label>Instructions</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Enter cooking instructions" required className="instructions"/>
          </div>

          {/* Cook Time */}
          <div>
            <label>Cook Time (minutes)</label>
            <input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value ? Number(e.target.value) : "")} required />
          </div>

          {/* Difficulty */}
          <div>
            <label>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Privacy */}
          <div>
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