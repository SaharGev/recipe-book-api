// client/src/pages/EditRecipeBookPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { getRecipeBookById } from "../services/recipeBookService";
import { getImageUrl } from "../utils/getImageUrl";
import "./EditRecipeBookPage.css";
import PageHeader from "../components/PageHeader";

type Recipe = {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  cookTime: number;
  difficulty: string;
};

export default function EditRecipeBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [bookName, setBookName] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [privacy, setPrivacy] = useState("private");

  const fetchBook = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token || !id) return;

      const data = await getRecipeBookById(id, token);
      setRecipes(data.recipes || []);
      setBookName(data.name || "");
      setBookDescription(data.description || "");
      setPrivacy(data.isPublic ? "public" : "private");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const removeRecipe = async (recipeId: string) => {
    try {
      const token = localStorage.getItem("accessToken");

      await fetch(
        `http://localhost:3000/recipe-books/${id}/recipes/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBook = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`http://localhost:3000/recipe-books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: bookName,
        description: bookDescription,
        isPublic: privacy === "public",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    alert("Book updated!");
    navigate(`/recipe-books/${id}`);

  } catch (err) {
    console.error(err);
    alert("Error updating book");
  }
};

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-page">
      <div className="edit-card">
        <PageHeader title="Edit Recipe Book" />
        <div className="edit-book-form">
          <label>Book Name</label>
          <input
              type="text"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
          />

          <label>Description</label>
          <textarea
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
          />

          <label>Privacy</label>
          <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
          >
              <option value="private">Private</option>
              <option value="public">Public</option>
          </select>

          </div>

        <div className="add-recipe-wrapper">
          <button
              className="add-recipe-btn"
              onClick={() => navigate(`/createRecipeBook?bookId=${id}`)}
          >
              + Add Recipe
          </button>
          </div>

        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">

              <button
                className="delete-btn"
                onClick={() => removeRecipe(recipe._id)}
              >
                🗑
              </button>

              <div
                onClick={() => navigate(`/recipes/${recipe._id}`)}
              >
                <div className="recipe-img-wrapper">
                  {recipe.imageUrl ? (
                    <img
                      src={getImageUrl(recipe.imageUrl)}
                      className="recipe-img"
                    />
                  ) : (
                    <div className="recipe-placeholder" />
                  )}
                </div>

                <h3 className="erb-recipe-title">{recipe.title}</h3>

                <p className="recipe-description">
                  {recipe.description}
                </p>

                <div className="recipe-meta">
                  {recipe.cookTime && <span>⏱ {recipe.cookTime} min </span>}
                  {recipe.difficulty && <span>• {recipe.difficulty}</span>}
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="update-book-wrapper">
          <button className="update-book-btn" onClick={handleUpdateBook}>
              Update Book
          </button>
        </div>
       </div>
      <BottomNav />
    </div>
  );
}