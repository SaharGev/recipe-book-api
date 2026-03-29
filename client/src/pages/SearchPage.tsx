import BottomNav from "../components/BottomNav";
import "./SearchPage.css";
import { useState } from "react";
import { aiSearch } from "../services/aiSearchService";
import RecipeCard from "../components/RecipeCard";
import RecipeBookCard from "../components/RecipeBookCard";
import type { AiSearchSection } from "../services/aiSearchService";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [sections, setSections] = useState<AiSearchSection[]>([]);

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
      console.log("AI search result:", data);
      console.log("AI search sections:", data.sections);

    } catch {
      setSearchError("Failed to search recipes");
    } finally {
      setSearchLoading(false);
    }
  };

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>

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
            {recipesSection.items.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
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
            {recipeBooksSection.items.map((book, index) => (
              <RecipeBookCard
                key={book._id || index}
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