// src/pages/MyRecipeBooksPage.tsx
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import RecipeBookCard from "../components/RecipeBookCard";
import { getMyRecipeBooks } from "../services/recipeBookService";
import { getMyLikes } from "../services/recipeService";
import type { RecipeBook } from "../types/recipeBook";
import "./MyRecipeBooksPage.css";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function MyRecipeBooksPage() {
  const { token } = useContext(AuthContext);
  const [books, setBooks] = useState<RecipeBook[]>([]);
  const [sharedBooks, setSharedBooks] = useState<RecipeBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedBookIds, setLikedBookIds] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");
        if (!token) return;

        const data = await getMyRecipeBooks(token);
        setBooks(data.recipeBooks);

        const sharedRes = await fetch("http://localhost:3000/recipe-books/shared-with-me", {
          headers: { Authorization: "Bearer " + token },
        });
        const sharedData = await sharedRes.json();
        setSharedBooks(sharedData.recipeBooks || []);

        const likes = await getMyLikes(token);
        const bookIds = likes
          .filter((like: { targetType: string; targetId: string }) => like.targetType === "book")
          .map((like: { targetType: string; targetId: string }) => like.targetId.toString());
        setLikedBookIds(bookIds);
        
      } catch {
        setError("Failed to load books");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchBooks();
  }, [token]);

  return (
    <div className="mybooks-page">
      <PageHeader title="My Recipe Books" />
      <p className="mybooks-count">{books.length} Books</p>
      <div className="mybooks-add-button-wrapper">
        <button
          className="mybooks-add-button"
          onClick={() => navigate("/createRecipeBook")}
        >
          + Add Book
        </button>
      </div>
      <div className="books-feed">
        {loading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          [...books, ...sharedBooks].map((book) => (
            <RecipeBookCard
              key={book._id}
              _id={book._id}
              title={book.name}
              recipesCount={book.recipes?.length || 0}
              recipes={book.recipes as { imageUrl?: string }[]}
              initialLiked={likedBookIds.includes(book._id)}
            />
          ))
        )}
      </div>

      {!loading && !error && books.length === 0 && (
        <div className="mybooks-empty-state">
          <p className="mybooks-empty-text">
            No books yet 📚<br />
            Start by creating your first recipe book!
          </p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}