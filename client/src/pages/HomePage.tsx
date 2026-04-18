import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import ProfileSummaryCard from "../components/ProfileSummaryCard";
import RecipeBookCard from "../components/RecipeBookCard";
import "./HomePage.css";
import { getCurrentUser, getFriends } from "../services/userService";
import type { User } from "../types/user";
import { getMyRecipes, getMyLikes } from "../services/recipeService";
import { getMyRecipeBooks } from "../services/recipeBookService";
import type { RecipeBook } from "../types/recipeBook";
import { AuthContext } from "../components/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [user, setUser] = useState<User | null>(null);
  const [recipesCount, setRecipesCount] = useState(0);
  const [booksCount, setBooksCount] = useState(0);
  const [books, setBooks] = useState<RecipeBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [booksError, setBooksError] = useState("");
  const [likedBookIds, setLikedBookIds] = useState<string[]>([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  const pageRef = useRef(page);

  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { loadingMoreRef.current = loadingMore; }, [loadingMore]);
  useEffect(() => { pageRef.current = page; }, [page]);

  const fetchBooks = useCallback(async (pageToLoad = 1) => {
    try {
      if (pageToLoad === 1) setBooksLoading(true);
      else setLoadingMore(true);
      setBooksError("");
      if (!token) return;

      const booksData = await getMyRecipeBooks(token, pageToLoad, 6);

      if (pageToLoad === 1) {
        setBooks(booksData.recipeBooks);
        setBooksCount(booksData.total);
      } else {
        setBooks((prev) => [...prev, ...booksData.recipeBooks]);
      }

      setHasMore(booksData.hasMore);

    } catch {
      setBooksError("Failed to load books");
    } finally {
      setBooksLoading(false);
      setLoadingMore(false);
    }
  }, [token]);

  useEffect(() => {
    const fetchInitial = async () => {
      if (!token) return;
      try {
        const data = await getCurrentUser(token);
        setUser(data);

        const recipes = await getMyRecipes(token);
        setRecipesCount(recipes.total ?? recipes.recipes?.length ?? 0);

        const friendsData = await getFriends(token);
        setFriendsCount(friendsData.length);

        const likes = await getMyLikes(token);
        const bookIds = likes
          .filter((like: { targetType: string; targetId: string }) => like.targetType === "book")
          .map((like: { targetType: string; targetId: string }) => like.targetId.toString());
        setLikedBookIds(bookIds);

        await fetchBooks(1);
      } catch {
        setBooksError("Failed to load");
      }
    };

    fetchInitial();
  }, [token]);

  useEffect(() => {
    if (booksLoading) return;
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
  }, [fetchBooks, booksLoading]);

  return (
    <div className="home-page">
      <ProfileSummaryCard
        user={user}
        recipesCount={recipesCount}
        booksCount={booksCount}
        friendsCount={friendsCount}
        onRecipesClick={() => navigate("/my-recipes")}
        onBooksClick={() => navigate("/my-recipeBooks")}
        onFriendsClick={() => navigate("/friends")}
      />
      <div className="section-divider" />
      <h3 className="section-title">My Books</h3>
      <div className="books-feed">
        {booksLoading ? (
          <p>Loading books...</p>
        ) : booksError ? (
          <p>{booksError}</p>
        ) : books.length === 0 ? (
          <p>No books yet</p>
        ) : (
          books.map((book) => (
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

      <div ref={observerRef} style={{ height: "20px" }} />
      {loadingMore && <p>Loading more...</p>}

      <BottomNav />
    </div>
  );
}