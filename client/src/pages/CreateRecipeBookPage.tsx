// client/src/pages/CreateRecipeBookPage.tsx
import { useState, useContext, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import "./CreateRecipeBookPage.css";
import { AuthContext } from "../components/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface RecipeBook {
  _id: string;
  name: string;
  description?: string;
}

interface Recipe {
  _id: string;
  title: string;
}

export default function CreateRecipeBookPage() {
  const { token } = useContext(AuthContext);

  const [createOpen, setCreateOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [books, setBooks] = useState<RecipeBook[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState("");

  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
      if (!token) return;

      const bookIdFromUrl = searchParams.get("bookId");

      if (bookIdFromUrl) {
        setAddOpen(true);              
        setSelectedBookId(bookIdFromUrl); 
      }

    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:3000/recipe-books/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          console.error("Invalid JSON for books:", text);
          alert("Server returned invalid JSON for recipe books");
          setBooks([]);
          return;
        }
        if (res.ok) setBooks(data.recipeBooks || []);
        else alert(data.message || "Error fetching recipe books");
      } catch (err) {
        console.error(err);
        alert("Server error fetching books");
      } finally {
        setLoadingBooks(false);
      }
    };

  const fetchRecipes = async () => {
    try {
      const res = await fetch("http://localhost:3000/recipes/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setRecipes(data || []);
      else alert(data.message || "Error fetching recipes");
    } catch (err) {
      console.error(err);
      alert("Server error fetching recipes");
    } finally {
      setLoadingRecipes(false);
    }
  };

    fetchBooks();
    fetchRecipes();
  }, [token]);

  const handleCreateBook = async () => {
    if (!name) {
      alert("Please enter a book name");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/recipe-books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, isPublic }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Error creating recipe book");
        return;
      }
      alert("Recipe book created successfully!");
      setName("");
      setDescription("");
      setIsPublic(false);
      setCreateOpen(false);
      setBooks((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
      alert("Server error creating book");
    }
  };

  const handleAddRecipe = async () => {
    if (!selectedBookId || !selectedRecipeId) {
      alert("Please select both a recipe book and a recipe");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:3000/recipe-books/${selectedBookId}/recipes/${selectedRecipeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Error adding recipe to book");
        return;
      }
      alert("Recipe added to book successfully!");
      setSelectedRecipeId("");
      setRecipes((prev) => prev.filter((r) => r._id !== selectedRecipeId));
    } catch (err) {
      console.error(err);
      alert("Server error adding recipe");
    }
  };

  return (
    <div className="create-book-page">
      <div className="page-container">
          <button
            className="icon-btn-crb close-btn-crb"
            onClick={() => navigate(-1)}
          >
            ✕
          </button>
        <h1 className="page-title">Create Recipe Book</h1>

        <div className="accordion-container">
          {/* CREATE BOOK */}
          <div className="accordion-card">
            <div
              className="accordion-header"
              onClick={() => setCreateOpen(!createOpen)}
            >
              <span>Create new empty recipe book</span>
              <span className="arrow">{createOpen ? "▲" : "▼"}</span>
            </div>

            {createOpen && (
              <div className="accordion-content">
                <label>Recipe Book Name</label>
                <input
                  type="text"
                  placeholder="Enter recipe book name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label>Description</label>
                <textarea
                  placeholder="Optional description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <label>Visibility</label>
                <select
                  value={isPublic ? "public" : "private"}
                  onChange={(e) => setIsPublic(e.target.value === "public")}
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>

                <button className="primary-button" onClick={handleCreateBook}>
                  Create Recipe Book
                </button>
              </div>
            )}
          </div>

          {/* ADD RECIPE TO BOOK */}
          <div className="accordion-card">
            <div
              className="accordion-header"
              onClick={() => setAddOpen(!addOpen)}
            >
              <span>Add a recipe to existing recipe book</span>
              <span className="arrow">{addOpen ? "▲" : "▼"}</span>
            </div>

            {addOpen && (
              <div className="accordion-content">
                <label>Select Recipe Book</label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  disabled={loadingBooks}
                >
                  <option value="">Choose a recipe book</option>
                  {books.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <label>Select Recipe</label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  disabled={loadingRecipes}
                >
                  <option value="">Choose recipe</option>
                  {recipes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.title}
                    </option>
                  ))}
                </select>

                <button
                  className="primary-button"
                  onClick={handleAddRecipe}
                  disabled={loadingBooks || loadingRecipes}
                >
                  Add Recipe
                </button>
              </div>
            )}
          </div>
        </div>
       </div>
     <BottomNav />
    </div>
  );
}