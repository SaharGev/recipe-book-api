// client/src/pages/HomePage.tsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import BottomNav from "../components/BottomNav";
import ProfileSummaryCard from "../components/ProfileSummaryCard";
import RecipeBookCard from "../components/RecipeBookCard";
import "./HomePage.css";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/userService";
import type { User } from "../types/user";
import { getMyRecipes } from "../services/recipeService";
import { getMyRecipeBooks } from "../services/recipeBookService";

export default function HomePage() {
  const { setToken, setRefreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const goToMyRecipes = () => {
    navigate("/my-recipes");
  };

  const [user, setUser] = useState<User | null>(null);
  const [recipesCount, setRecipesCount] = useState(0);
  const [booksCount, setBooksCount] = useState(0);
  const [books, setBooks] = useState<any[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setBooksLoading(true);
        setBooksError("");
        const token = localStorage.getItem("token");

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

      } catch (err) {
        setError("");
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
              title={book.title}
              recipesCount={book.recipes?.length || 0}
            />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}