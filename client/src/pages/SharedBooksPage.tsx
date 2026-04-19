import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { AuthContext } from "../components/AuthContext";
import BottomNav from "../components/BottomNav";
import "./MyRecipeBooksPage.css";
import { getMyLikes } from "../services/recipeService";
import { getSharedWithMeBooks } from "../services/recipeBookService";
import PageHeader from "../components/PageHeader";
import RecipeBookCard from "../components/RecipeBookCard";
import type { RecipeBook } from "../types/recipeBook";

export default function SharedBooksPage() {
  const [books, setBooks] = useState<RecipeBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [likedBookIds, setLikedBookIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const { token } = useContext(AuthContext);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  const pageRef = useRef(page);

  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { loadingMoreRef.current = loadingMore; }, [loadingMore]);
  useEffect(() => { pageRef.current = page; }, [page]);

  const fetchBooks = useCallback(async (pageToLoad = 1) => {
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      if (pageToLoad === 1) setLoading(true);
      else setLoadingMore(true);

      const data = await getSharedWithMeBooks(token, pageToLoad, 6);

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

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error occurred");
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

  if (loading) return <p>Loading shared books...</p>;
  if (error) return <p>{error}</p>;

  if (books.length === 0)
    return (
      <div className="mybooks-page">
        <PageHeader title="Shared with me" />
        <p className="mybooks-empty-text">No books shared with you yet 📚</p>
        <BottomNav />
      </div>
    );

  return (
    <div className="mybooks-page">
      <PageHeader title="Shared with me - Books" />
      <p className="mybooks-count">{total} Books</p>

      <div className="books-feed">
        {books.map((book) => (
          <RecipeBookCard
            key={book._id}
            _id={book._id}
            title={book.name}
            recipesCount={book.recipes?.length || 0}
            recipes={book.recipes as { imageUrl?: string }[]}
            initialLiked={likedBookIds.includes(book._id)}
          />
        ))}
      </div>

      <div ref={observerRef} style={{ height: "20px" }} />
      {loadingMore && <p>Loading more...</p>}

      <BottomNav />
    </div>
  );
}