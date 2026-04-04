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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [sections, setSections] = useState<AiSearchSection[]>([]);
  const [recentlyViewedRecipes, setRecentlyViewedRecipes] = useState<Recipe[]>([]);
  const [recentlyViewedBooks, setRecentlyViewedBooks] = useState<RecipeBook[]>([]);

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
          <div key={category} className="category-chip">
            {category}
          </div>
        ))}
      </div>

      {query.trim().length < 2 && recentlyViewedRecipes.length > 0 && (
        <div className="search-section">
          <div className="search-section-header">
            <h3 className="search-section-title">Recently viewed recipes</h3>
          </div>

          <div className="search-results-section">
            {recentlyViewedRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}

      {query.trim().length < 2 && recentlyViewedBooks.length > 0 && (
        <div className="search-section">
          <div className="search-section-header">
            <h3 className="search-section-title">Recently viewed books</h3>
          </div>

          <div className="search-results-section">
            {recentlyViewedBooks.map((book) => (
              <RecipeBookCard
                key={book._id}
                _id={book._id}
                title={book.name}
                recipesCount={book.recipes?.length || 0}
              />
            ))}
          </div>
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
              <RecipeCard key={recipe._id} recipe={recipe} />
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