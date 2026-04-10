import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { getRecipeBookById } from "../services/recipeBookService";
import type { RecipeBook } from "../types/recipeBook";
import { getImageUrl } from "../utils/getImageUrl";
import "./RecipeBookDetailsPage.css";
import { BsShare } from "react-icons/bs";

type Recipe = {
  _id: string;
  title: string;
  instructions?: string;
  imageUrl?: string;
  cookTime?: number;
  difficulty?: string;
};

export default function RecipeBookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<RecipeBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  const previewImages =
    (book?.recipes as Recipe[] || [])
      .slice(-4)
      .reverse()
      .map((r) => r.imageUrl)
      .filter(Boolean);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token || !id) {
          setError("Missing token or book id");
          return;
        }

        const data = await getRecipeBookById(id, token);
        setBook(data.recipeBook ?? data);
      } catch {
        setError("Failed to load recipe book");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <p>Loading book...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div className="book-details-page">

      <div className="book-hero">
        <div className="image-wrapper">
          <div className="book-cover">
            {[0, 1, 2, 3].map((index) =>
              previewImages[index] ? (
                <img
                  key={index}
                  src={getImageUrl(previewImages[index] as string)}
                  className="book-cover-img"
                />
              ) : (
                <div key={index} className="book-cover-placeholder" />
              )
            )}
          </div>

          <button className="icon-btn close-btn" onClick={() => navigate(-1)}>
            ✕
          </button>

          <button
            className="icon-btn edit-btn"
            onClick={() => navigate(`/edit-book/${book._id}`)}
          >
            ✎
          </button>

          <button
            className="icon-btn share-btn"
            onClick={() => setShowShareModal(true)}
          >
            <BsShare />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="book-content">
        <h1 className="book-title">{book.name}</h1>

        <p className="book-count">
          {(book.recipes as Recipe[])?.length || 0} Recipes
        </p>

        <div className="book-recipes-grid">
          {(book.recipes as Recipe[])?.map((recipe) => (
            <div
              key={recipe._id}
              className="myrecipes-card"
              onClick={() => navigate(`/recipes/${recipe._id}`)}
            >
              <div className="myrecipes-card-preview">
                {recipe.imageUrl ? (
                  <img
                    src={getImageUrl(recipe.imageUrl)}
                    className="myrecipes-card-image"
                  />
                ) : (
                  <div className="myrecipes-card-image-placeholder" />
                )}
              </div>

              <h3 className="myrecipes-card-title">{recipe.title}</h3>

              <div className="myrecipes-card-meta">
                {recipe.cookTime && <span>⏱ {recipe.cookTime} min</span>}
                {recipe.difficulty && <span>• {recipe.difficulty}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>hi</p>
            <button onClick={() => setShowShareModal(false)}>Close</button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}