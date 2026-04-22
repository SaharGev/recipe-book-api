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
import { getMyLikes, getRecipe, getPublicRecipes, getSharedWithMeRecipes } from "../services/recipeService";
import { getRecipeBookById, getPublicRecipeBooks, getSharedWithMeBooks } from "../services/recipeBookService";
import PageHeader from "../components/PageHeader";


export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [sections, setSections] = useState<AiSearchSection[]>([]);
  const [recentlyViewedRecipes, setRecentlyViewedRecipes] = useState<Recipe[]>([]);
  const [recentlyViewedBooks, setRecentlyViewedBooks] = useState<RecipeBook[]>([]);
  const [likedRecipeIds, setLikedRecipeIds] = useState<string[]>([]);
  const [likedBookIds, setLikedBookIds] = useState<string[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<RecipeBook[]>([]);
  const [publicRecipes, setPublicRecipes] = useState<Recipe[]>([]);
  const [publicBooks, setPublicBooks] = useState<RecipeBook[]>([]);
  const [sharedRecipes, setSharedRecipes] = useState<Recipe[]>([]);
  const [sharedBooks, setSharedBooks] = useState<RecipeBook[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { token } = useContext(AuthContext);
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
    if (searchLoading || query.trim().length < 2) return;
    try {
      setSearchLoading(true);
      setSearchError("");
      setHasSearched(true);
      const data = await aiSearch(query, token);
      setSections(data.sections);
    } catch {
      setSearchError("Failed to search recipes");
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim().length === 0) {
      setSections([]);
      setHasSearched(false);
    }
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
    const fetchPublic = async () => {
      try {
        if (!token) return;
        const recipesData = await getPublicRecipes(token, 1, 6);
        setPublicRecipes(recipesData.recipes || []);
        const booksData = await getPublicRecipeBooks(token, 1, 6);
        setPublicBooks(booksData.recipeBooks || []);
      } catch {
        setPublicRecipes([]);
        setPublicBooks([]);
      }
    };
    fetchPublic();
  }, [token]);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        if (!token) return;
        const recipesData = await getSharedWithMeRecipes(token, 1, 6);
        setSharedRecipes(recipesData.recipes || []);
        const booksData = await getSharedWithMeBooks(token, 1, 6);
        setSharedBooks(booksData.recipeBooks || []);
      } catch {
        setSharedRecipes([]);
        setSharedBooks([]);
      }
    };
    fetchShared();
  }, [token]);

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
            try { return await getRecipe(id, token); }
            catch { return null; }
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
            try { return await getRecipeBookById(id, token); }
            catch { return null; }
          })
        );
        setFavoriteBooks(results.filter(Boolean));
      } catch {
        setFavoriteBooks([]);
      }
    };
    fetchFavoriteBooks();
  }, [likedBookIds, token]);

  const renderSection = (
    title: string,
    items: (Recipe | RecipeBook)[],
    onAllClick: () => void,
    renderItem: (item: Recipe | RecipeBook) => React.ReactNode
  ) => (
    <div className="search-section">
      <div className="search-section-header">
        <h3 className="search-section-title">{title}</h3>
        <button
          type="button"
          className={`search-section-link-btn ${items.length === 0 ? "search-section-link-btn-disabled" : ""}`}
          disabled={items.length === 0}
          onClick={() => items.length > 0 && onAllClick()}
        >
          All
        </button>
      </div>
      {items.length > 0 ? (
        <div className="search-results-section">
          {items.map(renderItem)}
        </div>
      ) : (
        <p className="search-empty-message">Nothing here yet</p>
      )}
    </div>
  );

  return (
    <div className="search-page">
      <PageHeader title="Search" showBack={false} />
      <div className="search-input-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search a recipe..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim().length >= 2 && !searchLoading) {
                handleSearch();
              }
            }}
          />
        </div>
        <button
          className="search-submit-btn"
          onClick={handleSearch}
          disabled={query.trim().length < 2 || searchLoading}
        >
          Search
        </button>
      </div>

      {!hasSearched && (
        <>
          {renderSection(
            "Public Recipes",
            publicRecipes,
            () => navigate("/public-recipes"),
            (recipe) => (
              <div key={recipe._id} className="search-card-slot">
                <RecipeCard recipe={recipe as Recipe} initialLiked={likedRecipeIds.includes(recipe._id)} />
              </div>
            )
          )}

          {renderSection(
            "Public Books",
            publicBooks,
            () => navigate("/public-books"),
            (book) => (
              <div key={(book as RecipeBook)._id} className="search-card-slot">
                <RecipeBookCard
                  _id={(book as RecipeBook)._id}
                  title={(book as RecipeBook).name}
                  recipesCount={(book as RecipeBook).recipes?.length || 0}
                  recipes={(book as RecipeBook).recipes as { imageUrl?: string }[]}
                  initialLiked={likedBookIds.includes((book as RecipeBook)._id)}
                  isPublic={(book as any).isPublic}
                />
              </div>
            )
          )}

          {renderSection(
            "Recently viewed recipes",
            recentlyViewedRecipes,
            () => navigate("/my-recipes"),
            (recipe) => (
              <div key={recipe._id} className="search-card-slot">
                <RecipeCard recipe={recipe as Recipe} initialLiked={likedRecipeIds.includes(recipe._id)} />
              </div>
            )
          )}

          {renderSection(
            "Recently viewed books",
            recentlyViewedBooks,
            () => navigate("/my-recipeBooks"),
            (book) => (
              <div key={(book as RecipeBook)._id} className="search-card-slot">
                <RecipeBookCard
                  _id={(book as RecipeBook)._id}
                  title={(book as RecipeBook).name}
                  recipesCount={(book as RecipeBook).recipes?.length || 0}
                  recipes={(book as RecipeBook).recipes as { imageUrl?: string }[]}
                  initialLiked={likedBookIds.includes((book as RecipeBook)._id)}
                  isPublic={(book as any).isPublic}
                />
              </div>
            )
          )}

          {renderSection(
            "Favorite recipes",
            favoriteRecipes,
            () => navigate("/favorite-recipes"),
            (recipe) => (
              <div key={recipe._id} className="search-card-slot">
                <RecipeCard recipe={recipe as Recipe} initialLiked={likedRecipeIds.includes(recipe._id)} />
              </div>
            )
          )}

          {renderSection(
            "Favorite books",
            favoriteBooks,
            () => navigate("/favorite-books"),
            (book) => (
              <div key={(book as RecipeBook)._id} className="search-card-slot">
                <RecipeBookCard
                  _id={(book as RecipeBook)._id}
                  title={(book as RecipeBook).name}
                  recipesCount={(book as RecipeBook).recipes?.length || 0}
                  recipes={(book as RecipeBook).recipes as { imageUrl?: string }[]}
                  initialLiked={likedBookIds.includes((book as RecipeBook)._id)}
                  isPublic={(book as any).isPublic}
                />
              </div>
            )
          )}

          {renderSection(
            "Shared with me - Recipes",
            sharedRecipes,
            () => navigate("/shared-recipes"),
            (recipe) => (
              <div key={recipe._id} className="search-card-slot">
                <RecipeCard recipe={recipe as Recipe} initialLiked={likedRecipeIds.includes(recipe._id)} />
              </div>
            )
          )}

          {renderSection(
            "Shared with me - Books",
            sharedBooks,
            () => navigate("/shared-books"),
            (book) => (
              <div key={(book as RecipeBook)._id} className="search-card-slot">
                <RecipeBookCard
                  _id={(book as RecipeBook)._id}
                  title={(book as RecipeBook).name}
                  recipesCount={(book as RecipeBook).recipes?.length || 0}
                  recipes={(book as RecipeBook).recipes as { imageUrl?: string }[]}
                  initialLiked={likedBookIds.includes((book as RecipeBook)._id)}
                  isPublic={(book as any).isPublic}
                />
              </div>
            )
          )}
        </>
      )}

      {searchLoading && <p>Searching...</p>}
      {searchError && <p>{searchError}</p>}

      {hasSearched && !searchLoading && (
        <>
          {recipesSection && recipesSection.items.length > 0 && (
            <div className="search-section">
              <h3 className="search-section-title">Recipes found</h3>
              <div className={`search-results-section ${recipesSection.items.length === 1 ? "single-result" : ""}`}>
                {recipesSection.items.map((recipe) => (
                  <div key={recipe._id} className="search-card-slot">
                    <RecipeCard recipe={recipe} initialLiked={likedRecipeIds.includes(recipe._id)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {recipeBooksSection && recipeBooksSection.items.length > 0 && (
            <div className="search-section">
              <h3 className="search-section-title">Recipe books found</h3>
              <div className="search-results-section">
                {recipeBooksSection.items.map((book) => (
                  <div key={book._id} className="search-card-slot">
                    <RecipeBookCard
                      _id={book._id}
                      title={book.name}
                      recipesCount={book.recipes?.length || 0}
                      recipes={book.recipes as { imageUrl?: string }[]}
                      initialLiked={likedBookIds.includes(book._id)}
                      isPublic={(book as any).isPublic}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.every((section) => section.items.length === 0) && (
            <p>No results found</p>
          )}
        </>
      )}

      <BottomNav />
    </div>
  );
}