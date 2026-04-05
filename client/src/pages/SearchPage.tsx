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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [sections, setSections] = useState<AiSearchSection[]>([]);
  const [recentlyViewedRecipes, setRecentlyViewedRecipes] = useState<Recipe[]>([]);
  const [recentlyViewedBooks, setRecentlyViewedBooks] = useState<RecipeBook[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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

      const data = await aiSearch(query);
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

  const categories = [
    "Main courses 🍲",
    "Breakfasts 🍳",
  ];

  const favoriteRecipes: Recipe[] = [];
  const favoriteBooks: RecipeBook[] = [];

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
              className="search-section-link-btn"
              onClick={() => navigate("/my-recipes")}
            >
              All
            </button>
          </div>

          {recentlyViewedRecipes.length > 0 ? (
            <div className="search-results-section">
              {recentlyViewedRecipes.map((recipe) => (
                <div key={recipe._id} className="search-card-slot">
                  <RecipeCard recipe={recipe} />
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
              className="search-section-link-btn"
              onClick={() => navigate("/my-recipeBooks")}
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
              className="search-section-link-btn search-section-link-btn-disabled"
              disabled
            >
              All
            </button>
          </div>

          {favoriteRecipes.length > 0 ? (
            <div className="search-results-section">
              {favoriteRecipes.map((recipe) => (
                <div key={recipe._id} className="search-card-slot">
                  <RecipeCard recipe={recipe} />
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
              className="search-section-link-btn search-section-link-btn-disabled"
              disabled
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
                <RecipeCard recipe={recipe} />
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