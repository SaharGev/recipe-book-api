import BottomNav from "../components/BottomNav";
import "./SearchPage.css";
import { useEffect, useState } from "react";
import { aiSearch } from "../services/aiSearchService";
import RecipeCard from "../components/RecipeCard";
import RecipeBookCard from "../components/RecipeBookCard";
import type { AiSearchSection } from "../services/aiSearchService";
import type { Recipe } from "../types/recipe";
import type { RecipeBook } from "../types/recipeBook";
import { getRecentlyViewed } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { getMyLikes, getRecipe } from "../services/recipeService";
import { getRecipeBookById } from "../services/recipeBookService";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [sections, setSections] = useState<AiSearchSection[]>([]);
  const [recentlyViewedRecipes, setRecentlyViewedRecipes] = useState<Recipe[]>([]);
  const [recentlyViewedBooks, setRecentlyViewedBooks] = useState<RecipeBook[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [likedRecipeIds, setLikedRecipeIds] = useState<string[]>([]);
  const { token } = useContext(AuthContext);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<RecipeBook[]>([]);
  const [likedBookIds, setLikedBookIds] = useState<string[]>([]);


  const navigate = useNavigate();

  const recipesSection = sections.find(
    (section): section is Extract<AiSearchSection, { type: "recipes" }> =>
      section.type === "recipes"
  );

  const recipeBooksSection = sections.find(
    (section): section is Extract<AiSearchSection, { type: "recipeBooks" }> =>
      section.type === "recipeBooks"
  );

  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      setSearchError("");

      const data = await aiSearch(query, token);
      console.log("ai search result:", JSON.stringify(data.sections, null, 2));
      setSections(data.sections);

    } catch {
      setSearchError("Failed to search recipes");
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim().length < 2) {
      setSections([]);
      return;
    }

    const timeout = setTimeout(() => {
      handleSearch();
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const data = await getRecentlyViewed();
        setRecentlyViewedRecipes(data.recentlyViewedRecipes || []);
        setRecentlyViewedBooks(data.recentlyViewedBooks || []);
      } catch {
        setRecentlyViewedRecipes([]);
        setRecentlyViewedBooks([]);
      }
    };

    fetchRecentlyViewed();
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        if (!token) {
          setLikedRecipeIds([]);
          return;
        }

        const likes = await getMyLikes(token);

        const recipeIds = likes
          .filter((like: { targetType: string; targetId: string; createdAt: string }) => like.targetType === "recipe")
          .sort((a: { createdAt: string }, b: { createdAt: string }) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((like: { targetType: string; targetId: string }) => like.targetId.toString());

        setLikedRecipeIds(recipeIds);

        const bookIds = likes
          .filter((like: { targetType: string; targetId: string; createdAt: string }) => like.targetType === "book")
          .sort((a: { createdAt: string }, b: { createdAt: string }) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((like: { targetType: string; targetId: string }) => like.targetId.toString());

        setLikedBookIds(bookIds);
      } catch {
        setLikedRecipeIds([]);
        setLikedBookIds([]);
      }
    };

    fetchLikes();
  }, [token]);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        if (!token || likedRecipeIds.length === 0) {
          setFavoriteRecipes([]);
          return;
        }

        const results = await Promise.all(
          likedRecipeIds.map(async (id) => {
            try {
              return await getRecipe(id, token);
            } catch {
              return null;
            }
          })
        );

        setFavoriteRecipes(results.filter(Boolean));
      } catch {
        setFavoriteRecipes([]);
      }
    };

    fetchFavoriteRecipes();
  }, [likedRecipeIds, token]);

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        if (!token || likedBookIds.length === 0) {
          setFavoriteBooks([]);
          return;
        }

        const results = await Promise.all(
          likedBookIds.map(async (id) => {
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
      }
    };

    fetchFavoriteBooks();
  }, [likedBookIds, token]);

  const categories = [
    "Main courses 🍲",
    "Breakfasts 🍳",
  ];

  return (
    <div className="search-page">
      <h2 className="search-title">Search</h2>

      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search a recipe..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="search-categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-chip ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {query.trim().length < 2 && (
        <div className="search-section">
          <div className="search-section-header">
            <h3 className="search-section-title">Recently viewed recipes</h3>
            <button
              type="button"
              className={`search-section-link-btn ${recentlyViewedRecipes.length === 0 ? "search-section-link-btn-disabled" : ""}`}
              disabled={recentlyViewedRecipes.length === 0}
              onClick={() => recentlyViewedRecipes.length > 0 && navigate("/my-recipes")}
            >
              All
            </button>
          </div>

          {recentlyViewedRecipes.length > 0 ? (
            <div className="search-results-section">
              {recentlyViewedRecipes.map((recipe) => (
                <div key={recipe._id} className="search-card-slot">
                  <RecipeCard
                    recipe={recipe}
                    initialLiked={likedRecipeIds.includes(recipe._id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="search-empty-message">No recently viewed recipes yet</p>
          )}
        </div>
      )}

      {query.trim().length < 2 && (
        <div className="search-section">
          <div className="search-section-header">
            <h3 className="search-section-title">Recently viewed books</h3>
            <button
              type="button"
              className={`search-section-link-btn ${recentlyViewedBooks.length === 0 ? "search-section-link-btn-disabled" : ""}`}
              disabled={recentlyViewedBooks.length === 0}
              onClick={() => recentlyViewedBooks.length > 0 && navigate("/my-recipeBooks")}
            >
              All
            </button>
          </div>

          {recentlyViewedBooks.length > 0 ? (
            <div className="search-results-section">
              {recentlyViewedBooks.map((book) => (
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
          ) : (
            <p className="search-empty-message">No recently viewed books yet</p>
          )}
        </div>
      )}

      {query.trim().length < 2 && (
        <div className="search-section">
          <div className="search-section-header">
            <h3 className="search-section-title">Favorite recipes</h3>
            <button
              type="button"
              className={`search-section-link-btn ${favoriteRecipes.length === 0 ? "search-section-link-btn-disabled" : ""}`}
              disabled={favoriteRecipes.length === 0}
              onClick={() => favoriteRecipes.length > 0 && navigate("/favorite-recipes")}
            >
              All
            </button>
          </div>

          {favoriteRecipes.length > 0 ? (
            <div className="search-results-section">
              {favoriteRecipes.map((recipe) => (
                <div key={recipe._id} className="search-card-slot">
                  <RecipeCard
                    recipe={recipe}
                    initialLiked={likedRecipeIds.includes(recipe._id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="search-empty-message">No favorite recipes yet</p>
          )}
        </div>
      )}

      {query.trim().length < 2 && (
        <div className="search-section">
          <div className="search-section-header">
            <h3 className="search-section-title">Favorite books</h3>
            <button
              type="button"
              className={`search-section-link-btn ${favoriteBooks.length === 0 ? "search-section-link-btn-disabled" : ""}`}
              disabled={favoriteBooks.length === 0}
              onClick={() => favoriteBooks.length > 0 && navigate("/favorite-books")}
            >
              All
            </button>
          </div>

          {favoriteBooks.length > 0 ? (
            <div className="search-results-section">
              {favoriteBooks.map((book) => (
                <div key={book._id} className="search-card-slot">
                  <RecipeBookCard
                    _id={book._id}
                    title={book.name}
                    recipesCount={book.recipes?.length || 0}
                    recipes={book.recipes as { imageUrl?: string }[]}
                    initialLiked={likedBookIds.includes(book._id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="search-empty-message">No favorite books yet</p>
          )}
        </div>
      )}

      {searchLoading && <p>Searching...</p>}
      {searchError && <p>{searchError}</p>}

      {recipesSection && recipesSection.items.length > 0 && (
        <>
          <p className="search-results-count">
            {recipesSection.items.length} results found
          </p>

          <div
            className={`search-results-section ${
              recipesSection.items.length === 1 ? "single-result" : ""
            }`}
          >
            {recipesSection.items.map((recipe) => (
              <div key={recipe._id} className="search-card-slot">
                <RecipeCard
                  recipe={recipe}
                  initialLiked={likedRecipeIds.includes(recipe._id)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {recipeBooksSection && recipeBooksSection.items.length > 0 && (
        <>
          <p className="search-results-count">
            {recipeBooksSection.items.length} recipe books found
          </p>

          <div className="search-results-section">
            {recipeBooksSection.items.map((book) => (
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
        </>
      )}

      {!searchLoading &&
        !searchError &&
        sections.every((section) => section.items.length === 0) &&
        query && <p>No results found</p>
      }

      <BottomNav />
    </div>
  );
}