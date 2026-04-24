import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { AuthContext } from "../components/AuthContext";
import BottomNav from "../components/BottomNav";
import "./MyRecipesPage.css";
import { getMyLikes, getPublicRecipes } from "../services/recipeService";
import PageHeader from "../components/PageHeader";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../types/recipe";

type LikeItem = {
  targetType: string;
  targetId: string;
};

export default function PublicRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const { token } = useContext(AuthContext);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  const pageRef = useRef(page);

  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { loadingMoreRef.current = loadingMore; }, [loadingMore]);
  useEffect(() => { pageRef.current = page; }, [page]);

  const fetchRecipes = useCallback(async (pageToLoad = 1) => {
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      if (pageToLoad === 1) setLoading(true);
      else setLoadingMore(true);

      const data = await getPublicRecipes(token, pageToLoad, 6);

      if (pageToLoad === 1) {
        setRecipes(data.recipes);
        const likes = await getMyLikes(token);
        const likedRecipeIds = (likes as LikeItem[])
          .filter((l) => l.targetType === "recipe")
          .map((l) => l.targetId.toString());
        setLikedIds(likedRecipeIds);
      } else {
        setRecipes((prev) => [...prev, ...data.recipes]);
      }

      setTotal(data.total);
      setHasMore(data.hasMore);

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error occurred");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRecipes(1);
  }, [token]);

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

  if (loading) return <p className="myrecipes-loading-text">Loading public recipes...</p>;
  if (error) return <p className="myrecipes-error-text">{error}</p>;

  if (recipes.length === 0)
    return (
      <div className="myrecipes-page">
        <PageHeader title="Public Recipes" />
        <p className="myrecipes-empty-text">No public recipes yet 🍳</p>
        <BottomNav />
      </div>
    );

  return (
    <div className="myrecipes-page">
      <PageHeader title="Public Recipes" />
      <p className="myrecipes-recipes-count">{total} Recipes</p>

      <div className="myrecipes-grid">
        {recipes.map((recipe) => (
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
