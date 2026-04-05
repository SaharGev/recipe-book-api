// client/src/pages/EditRecipePage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "../pages/EditRecipePage.css";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [cookTime, setCookTime] = useState<number | "">("");
  const [difficulty, setDifficulty] = useState("easy");
  const [privacy, setPrivacy] = useState("private");
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`http://localhost:3000/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setTitle(data.title);
        setDescription(data.description || "");
        setIngredients(data.ingredients || [""]);
        setCookTime(data.cookTime || "");
        setDifficulty(data.difficulty || "easy");
        setPrivacy(data.isPublic ? "public" : "private");
        setInstructions(data.instructions || "");
        setExistingImage(data.imageUrl || "");
      } catch (err: unknown) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Error fetching recipe");
      }
    };

    fetchRecipe();
  }, [id]);

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

    if (!id) {
      alert("Recipe ID not found");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User not logged in");

      let uploadedImageUrl = existingImage || "";

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

      const bodyData = {
        title,
        description,
        ingredients,
        cookTime: cookTime === "" ? 0 : cookTime,
        difficulty,
        imageUrl: uploadedImageUrl,
        instructions,
        isPublic: privacy === "public",
      };

      console.log("Updating recipe:", bodyData);

      const res = await fetch(`http://localhost:3000/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update recipe");
      }

      alert("Recipe updated!");
      navigate(`/recipes/${id}`);
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? "Error updating recipe: " + err.message : "Error updating recipe");
    }
  };

  return (
    <div className="create-recipe-page">
      <div className="create-recipe-card">
        <h1 className="edr-recipe-title">Edit Recipe</h1>

        {/* under title */}
        <div className="buttons-row-under-title">
          <button className="edr-icon-btn edr-close-btn" onClick={() => navigate(`/recipes/${id}`)}>✕</button>

          <button
            className="edr-icon-btn delete-btn"
            onClick={async () => {
              if (!window.confirm("Are you sure you want to delete this recipe?")) return;
              try {
                const token = localStorage.getItem("accessToken");
                const res = await fetch(`http://localhost:3000/recipes/${id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to delete");
                alert("Recipe deleted!");
                navigate("/my-recipes");
              } catch (err: unknown) {
                console.error(err);
                alert(err instanceof Error ? err.message : "Error deleting recipe");
              }
            }}
          >
            🗑
          </button>
        </div>

        {/* Image */}
        <div className="recipe-image-wrapper">
          {imageUrl ? (
            <img src={URL.createObjectURL(imageUrl)} className="edr-recipe-main-image"/>
          ) : existingImage ? (
            <img src={existingImage} className="edr-recipe-main-image"/>
          ) : (
            <div className="edr-recipe-no-image"/>
          )}
        </div>

        <form onSubmit={handleSubmit} className="create-recipe-content">

          {/* Image Upload */}
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

              {(imageUrl || existingImage) && (
                <div className="ingredient-row ingredient" style={{ marginTop: "8px" }}>
                  <input
                    type="text"
                    value={imageUrl ? imageUrl.name : "Current image"}
                    readOnly
                  />
                  <button
                    type="button"
                    className="remove-ingredient-btn"
                    onClick={() => {
                      setImageUrl(null);
                      setExistingImage("");
                    }}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label>Recipe Name</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter recipe name" required />
          </div>

          {/* Description */}
          <div>
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description"/>
          </div>

          {/* Ingredients */}
          <div>
            <label>Ingredients</label>
            {ingredients.map((ing, i) => (
              <div key={i} className="ingredient-row ingredient">
                <input type="text" value={ing} onChange={(e) => handleIngredientChange(i, e.target.value)} placeholder={`Ingredient ${i+1}`} required className="ingredient-input"/>
                {i > 0 && <button type="button" className="remove-ingredient-btn" onClick={() => removeIngredient(i)}>X</button>}
              </div>
            ))}
            <button type="button" className="add-ingredient-btn" onClick={addIngredient}>+ Add Ingredient</button>
          </div>

          {/* Instructions */}
          <div>
            <label>Instructions</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="instructions" required/>
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

          <button type="submit" className="save-recipe-btn">Update Recipe</button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}