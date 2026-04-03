// src/pages/MyRecipeBooksPage.tsx
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import RecipeBookCard from "../components/RecipeBookCard";
import { getMyRecipeBooks } from "../services/recipeBookService";
import type { RecipeBook } from "../types/recipeBook";
import "./MyRecipeBooksPage.css";

export default function MyRecipeBooksPage() {
  const [books, setBooks] = useState<RecipeBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await getMyRecipeBooks(token);
        setBooks(data.recipeBooks);
      } catch {
        setError("Failed to load books");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="home-page">
      <h3 className="section-title mybooks-title">My Recipe Books</h3>

      <div className="books-feed">
        {loading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p>{error}</p>
        ) : books.length === 0 ? (
          <p>No books yet</p>
        ) : (
          books.map((book) => (
            <RecipeBookCard
              key={book._id}
              title={book.name}
              recipesCount={book.recipes?.length || 0}
            />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}