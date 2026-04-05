// client/src/pages/HomePage.tsx
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import ProfileSummaryCard from "../components/ProfileSummaryCard";
import RecipeBookCard from "../components/RecipeBookCard";
import "./HomePage.css";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/userService";
import type { User } from "../types/user";
import { getMyRecipes } from "../services/recipeService";
import { getMyRecipeBooks } from "../services/recipeBookService";
import type { RecipeBook } from "../types/recipeBook";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const goToMyRecipes = () => {
    navigate("/my-recipes");
  };

  const goToMyRecipeBooks = () => {
    navigate("/my-recipeBooks");
  };

  const [user, setUser] = useState<User | null>(null);
  const [recipesCount, setRecipesCount] = useState(0);
  const [booksCount, setBooksCount] = useState(0);
  const [books, setBooks] = useState<RecipeBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setBooksLoading(true);
        setBooksError("");

        if (!token) return;

        const data = await getCurrentUser(token);
        console.log("current user:", data);
        setUser(data);
        
        const recipes = await getMyRecipes(token);
        console.log("recipes data:", recipes);
        setRecipesCount(recipes.length);

        const booksData = await getMyRecipeBooks(token);
        setBooksCount(booksData.recipeBooks.length);
        setBooks(booksData.recipeBooks);
        console.log("books data:", booksData);

      } catch {
        setBooksError("Failed to load books");
      } finally {
        setTimeout(() => {
          setBooksLoading(false);
        }, 500);
      }

    };

    fetchUser();
  }, []);

  return (
    <div className="home-page">
       <ProfileSummaryCard
          user={user}
          recipesCount={recipesCount}
          booksCount={booksCount}
          onRecipesClick={goToMyRecipes}
          onBooksClick={goToMyRecipeBooks}
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
            />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}