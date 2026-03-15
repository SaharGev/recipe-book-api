// client/src/pages/AddPage.tsx
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import "../pages/AddPage.css";

export default function AddPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [cookTime, setCookTime] = useState<number | "">("");
  const [difficulty, setDifficulty] = useState("easy");
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User not logged in");
      }

      let uploadedImageUrl = "";

      // שלב 1: העלאת תמונה
      if (imageUrl) {
        const imageData = new FormData();
        imageData.append("image", imageUrl);

        const uploadRes = await fetch("http://localhost:3000/upload/image", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageData,
        });

        if (!uploadRes.ok) {
          throw new Error("Image upload failed");
        }

        const uploadResult = await uploadRes.json();
        uploadedImageUrl = uploadResult.url;
      }

      // שלב 2: יצירת מתכון
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
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to save recipe");
      }

      const data = await res.json();
      console.log("Recipe saved:", data);

      alert("Recipe saved successfully!");

      setTitle("");
      setDescription("");
      setIngredients([""]);
      setCookTime("");
      setDifficulty("easy");
      setImageUrl(null);
      setInstructions("");

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Save recipe error:", err.message);
        alert("Error saving recipe: " + err.message);
      } else {
        console.error("Save recipe error:", err);
        alert("Error saving recipe");
      }
    }
  };

  return (
    <div className="create-recipe-page">
      <div className="create-recipe-card">
        <h1>Create Recipe</h1>

        <form onSubmit={handleSubmit}>

          <div>
            <label htmlFor="image">Add Image</label>
            <input
              type="file"
              accept="image/*"
              id="image"
              onChange={(e) =>
                e.target.files && setImageUrl(e.target.files[0])
              }
            />
          </div>

          <div>
            <label>Recipe Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter recipe name"
              required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div>
            <label>Ingredients</label>

            {ingredients.map((ing, i) => (
              <input
                key={i}
                type="text"
                value={ing}
                onChange={(e) =>
                  handleIngredientChange(i, e.target.value)
                }
                placeholder={`Ingredient ${i + 1}`}
                className="ingredient-input"
                required
              />
            ))}

            <button
              type="button"
              className="add-ingredient-btn"
              onClick={addIngredient}
            >
              + Add Ingredient
            </button>
          </div>
          
          <div>
            <label>Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter cooking instructions"
              required
            />
          </div>

          <div>
            <label>Cook Time (minutes)</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) =>
                setCookTime(e.target.value ? Number(e.target.value) : "")
              }
              required
            />
          </div>

          <div>
            <label>Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button type="submit" className="save-recipe-btn">
            Save Recipe
          </button>

        </form>
      </div>

      <BottomNav />
    </div>
  );
}