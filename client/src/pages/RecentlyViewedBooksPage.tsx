import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { getRecentlyViewed } from "../services/authService";
import { getMyLikes } from "../services/recipeService";
import RecipeBookCard from "../components/RecipeBookCard";
import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import "./HomePage.css";
import type { RecipeBook } from "../types/recipeBook";

export default function RecentlyViewedBooksPage() {
  const { token } = useContext(AuthContext);
  const [books, setBooks] = useState<RecipeBook[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getRecentlyViewed();
        setBooks(data.recentlyViewedBooks || []);
        if (token) {
          const likes = await getMyLikes(token);
          setLikedIds(likes.filter((l: any) => l.targetType === "book").map((l: any) => l.targetId.toString()));
        }
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="home-page">
      <PageHeader title="Recently Viewed Books" />
      <p className="myrecipebooks-count">{books.length} Books</p>
      {books.length === 0 ? (
        <p>No recently viewed books</p>
      ) : (
        <div className="books-feed">
          {books.map((book) => (
            <RecipeBookCard
              key={book._id}
              _id={book._id}
              title={book.name}
              recipesCount={book.recipes?.length || 0}
              recipes={book.recipes as { imageUrl?: string }[]}
              initialLiked={likedIds.includes(book._id)}
              isPublic={(book as any).isPublic}
            />
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  );
}
