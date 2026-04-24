import { useEffect, useState, useContext, useRef, useCallback } from "react";
import BottomNav from "../components/BottomNav";
import RecipeBookCard from "../components/RecipeBookCard";
import { getMyRecipeBooks } from "../services/recipeBookService";
import { getMyLikes } from "../services/recipeService";
import type { RecipeBook } from "../types/recipeBook";
import "./MyRecipeBooksPage.css";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function MyRecipeBooksPage() {
  const { token } = useContext(AuthContext);
  const [books, setBooks] = useState<RecipeBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [likedBookIds, setLikedBookIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  const pageRef = useRef(page);

  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { loadingMoreRef.current = loadingMore; }, [loadingMore]);
  useEffect(() => { pageRef.current = page; }, [page]);

  const fetchBooks = useCallback(async (pageToLoad = 1) => {
    try {
      if (pageToLoad === 1) setLoading(true);
      else setLoadingMore(true);
      setError("");
      if (!token) return;

      const data = await getMyRecipeBooks(token, pageToLoad, 6);

      if (pageToLoad === 1) {
        setBooks(data.recipeBooks);
        const likes = await getMyLikes(token);
        const bookIds = likes
          .filter((like: { targetType: string; targetId: string }) => like.targetType === "book")
          .map((like: { targetType: string; targetId: string }) => like.targetId.toString());
        setLikedBookIds(bookIds);
      } else {
        setBooks((prev) => [...prev, ...data.recipeBooks]);
      }

      setTotal(data.total);
      setHasMore(data.hasMore);

    } catch {
      setError("Failed to load books");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBooks(1);
  }, [token]);

  useEffect(() => {
    if (loading) return;
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingMoreRef.current) {
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          setPage(nextPage);
          fetchBooks(nextPage);
        }
      },
      { threshold: 0, rootMargin: "0px" }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchBooks, loading]);

  return (
    <div className="mybooks-page">
      <PageHeader title="My Recipe Books" />
      <p className="mybooks-count">{total} Books</p>
      <div className="mybooks-add-button-wrapper">
        <button
          className="mybooks-add-button"
          onClick={() => navigate("/createRecipeBook")}
        >
          + Add Book
        </button>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : error ? (
        <p>{error}</p>
      ) : books.length === 0 ? (
        <div className="mybooks-empty-state">
          <p className="mybooks-empty-text">
            No books yet 📚<br />
            Start by creating your first recipe book!
          </p>
        </div>
      ) : (
        <div className="books-feed">
          {books.map((book) => (
            <RecipeBookCard
              key={book._id}
              _id={book._id}
              title={book.name}
              recipesCount={book.recipes?.length || 0}
              recipes={book.recipes as { imageUrl?: string }[]}
              initialLiked={likedBookIds.includes(book._id)}
              isPublic={(book as any).isPublic}
            />
          ))}
        </div>
      )}

      <div ref={observerRef} style={{ height: "20px" }} />
      {loadingMore && <p>Loading more...</p>}

      <BottomNav />
    </div>
  );
}
