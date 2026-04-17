import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { getMyLikes } from "../services/recipeService";
import { getRecipeBookById } from "../services/recipeBookService";
import RecipeBookCard from "../components/RecipeBookCard";
import BottomNav from "../components/BottomNav";
import type { RecipeBook } from "../types/recipeBook";
import "./MyRecipeBooksPage.css";
import PageHeader from "../components/PageHeader";

export default function FavoriteBooksPage() {
  const { token } = useContext(AuthContext);
  const [favoriteBooks, setFavoriteBooks] = useState<RecipeBook[]>([]);
  const [likedBookIds, setLikedBookIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!token) return;

        const likes = await getMyLikes(token);

        const bookIds = likes
          .filter((like: { targetType: string; targetId: string; createdAt: string }) => like.targetType === "book")
          .sort((a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((like: { targetType: string; targetId: string }) => like.targetId.toString());

        setLikedBookIds(bookIds);

        const results = await Promise.all(
          bookIds.map(async (id: string) => {
            try {
              return await getRecipeBookById(id, token);
            } catch {
              return null;
            }
          })
        );

        setFavoriteBooks(results.filter(Boolean));
      } catch {
        setFavoriteBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mybooks-page">
      <PageHeader title="Favorite Books" />

      {favoriteBooks.length === 0 ? (
        <p>No favorite books yet</p>
      ) : (
        <div className="books-feed">
          {favoriteBooks.map((book) => (
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
      )}

      <BottomNav />
    </div>
  );
}