import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import BottomNav from "../components/BottomNav";
import "./MyRecipesPage.css";
import { getMyLikes } from "../services/recipeService";
import PageHeader from "../components/PageHeader";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../types/recipe";

type LikeItem = {
  targetType: string;
  targetId: string;
};

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sharedRecipes, setSharedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchRecipes = useCallback(async (pageToLoad = 1) => {
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      if (pageToLoad === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch(`http://localhost:3000/recipes/my?page=${pageToLoad}&limit=6`, {
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch recipes");
      }

      const data = await res.json();

      if (pageToLoad === 1) {
        setRecipes(data.recipes);
      } else {
        setRecipes((prev) => [...prev, ...data.recipes]);
      }

      setTotal(data.total);
      setHasMore(data.hasMore);

      if (pageToLoad === 1) {
        const sharedRes = await fetch("http://localhost:3000/recipes/shared-with-me", {
          headers: { Authorization: "Bearer " + token },
        });
        const sharedData: Recipe[] = await sharedRes.json();
        setSharedRecipes(sharedData);

        const likes = await getMyLikes(token);
        const likedRecipeIds = (likes as LikeItem[])
          .filter((l) => l.targetType === "recipe")
          .map((l) => l.targetId.toString());
        setLikedIds(likedRecipeIds);
      }

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error occurred");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token]);

  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  const pageRef = useRef(page);

  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { loadingMoreRef.current = loadingMore; }, [loadingMore]);
  useEffect(() => { pageRef.current = page; }, [page]);

  useEffect(() => {
    if (loading) return;
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingMoreRef.current) {
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          setPage(nextPage);
          fetchRecipes(nextPage);
        }
      },
      { threshold: 0, rootMargin: "0px" }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchRecipes, loading]);

  useEffect(() => {
    fetchRecipes(1);
  }, []);

  if (loading) return <p className="myrecipes-loading-text">Loading your recipes...</p>;
  if (error) return <p className="myrecipes-error-text">{error}</p>;
  if (recipes.length === 0 && sharedRecipes.length === 0)
  return (
    <div className="myrecipes-page">
      <PageHeader title="My Recipes" />
      <p className="myrecipes-recipes-count">0 Recipes</p>

      <div className="myrecipes-add-button-wrapper">
        <button
          className="myrecipes-add-button"
          onClick={() => navigate("/createRecipe")}
        >
          + Add Recipe
        </button>
      </div>

      <p className="myrecipes-empty-text">
        No recipes yet 🍳<br />
        Start by adding your first recipe!
      </p>

      <BottomNav />
    </div>
  );

  return (
    <div className="myrecipes-page">
      <PageHeader title="My Recipes" />
      <p className="myrecipes-recipes-count">{total} Recipes</p>

      <div className="myrecipes-add-button-wrapper">
        <button
          className="myrecipes-add-button"
          onClick={() => navigate("/createRecipe")}
        >
          + Add Recipe
        </button>
      </div>

      {sharedRecipes.length > 0 && (
        <p className="myrecipes-recipes-count">Shared with me ({sharedRecipes.length})</p>
      )}

      <div className="myrecipes-grid">
        {[...recipes, ...sharedRecipes].map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            initialLiked={likedIds.includes(recipe._id)}
          />
        ))}
      </div>

      <div ref={observerRef} style={{ height: "20px", background: "transparent" }} />
      {loadingMore && <p className="myrecipes-loading-text">Loading more...</p>}

      <BottomNav />
    </div>
  );
}