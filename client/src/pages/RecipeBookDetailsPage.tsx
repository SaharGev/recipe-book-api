import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { getRecipeBookById } from "../services/recipeBookService";
import type { RecipeBook } from "../types/recipeBook";

export default function RecipeBookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<RecipeBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("accessToken");
        if (!token || !id) {
          setError("Missing token or book id");
          return;
        }

        const data = await getRecipeBookById(id, token);
        const bookData = data.recipeBook ?? data;
        setBook(bookData);
      } catch {
        setError("Failed to load recipe book");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return (
    <div className="home-page">
      <button onClick={() => navigate(-1)}>Back</button>

      {loading ? (
        <p>Loading book...</p>
      ) : error ? (
        <p>{error}</p>
      ) : !book ? (
        <p>Book not found</p>
      ) : (
        <>
          <h2>{book.name}</h2>
          <p>{book.recipes?.length || 0} recipes</p>
        </>
      )}

      <BottomNav />
    </div>
  );
}