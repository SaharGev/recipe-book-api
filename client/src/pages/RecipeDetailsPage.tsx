// client/src/pages/RecipeDetailsPage.tsx
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import "./RecipeDetailsPage.css";
import type { Recipe } from "../types/recipe";
import { getFriends } from "../services/userService";
import { getImageUrl } from "../utils/getImageUrl";


export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const accessToken = token || localStorage.getItem("accessToken");

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [shareError, setShareError] = useState("");
  const [friends, setFriends] = useState<{ _id: string; username: string; email: string; profileImageUrl?: string }[]>([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [sharedUserIds, setSharedUserIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!token) return;
        const data = await getFriends(token);
        setFriends(data);
      } catch {
        setFriends([]);
      }
    };
    fetchFriends();
  }, [token]);

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch(`http://localhost:3000/recipes/${id}`, {
        headers: { Authorization: "Bearer " + accessToken },
      });

      const data = await res.json();

      if (!res.ok) {
        return;
      }

      setRecipe(data);
      if (data.collaborators) {
        setSharedUserIds(data.collaborators.map((c: any) => c.user));
      }
    };

    fetchRecipe();
  }, [id, accessToken]);

  const handleShare = async () => {
    try {
      setShareError("");
      if (!token || !shareEmail.trim()) return;

      const response = await fetch(`http://localhost:3000/recipes/${id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: shareEmail.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to share");

      const sharedFriend = friends.find(f => f.email === shareEmail.trim());
      if (sharedFriend) {
        setSharedUserIds(prev => [...prev, sharedFriend._id]);
      }
    } catch (err) {
      setShareError(err instanceof Error ? err.message : "Failed to share");
    }
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-page-wrapper">
      <div className="recipe-details-page">

        {/* IMAGE */}
        <div className="image-wrapper">
          <div className="recipe-image-placeholder">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="recipe-main-image"
              />
            ) : (
              <div className="recipe-no-image" />
            )}
          </div>

          {/* TOP BUTTONS */}
          <button className="icon-btn close-btn" 
            onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/my-recipes");
            }
          }}
          >
            ✕
          </button>

          <button
            className="icon-btn edit-btn"
            onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
          >
            ✎
          </button>

          <button
            className="icon-btn share-btn"
            onClick={() => setShowShareModal(true)}
          >
            ↗
          </button>

        </div>

        {/* CONTENT */}
        <div className="recipe-content">
          <h1 className="recipe-title">{recipe.title}</h1>

          {recipe.description && (
            <p className="recipe-description">{recipe.description}</p>
          )}

          {/* META */}
          <div className="recipe-meta">
            <div className="meta-box">
              <span>{recipe.cookTime}</span>
              <small>min</small>
            </div>

            <div className="meta-box">
              <span>{recipe.difficulty}</span>
              <small>difficulty</small>
            </div>

            <div className="meta-box">
              <span>{recipe.isPublic ? "Public" : "Private"}</span>
              <small>privacy</small>
            </div>
          </div>

          {/* INGREDIENTS */}
          <h3>Ingredients</h3>
          <ul className="ingredients-list">
            {(Array.isArray(recipe.ingredients) ? recipe.ingredients : []).map((ing, i) => (
              <li key={i}>
                {typeof ing === "string"
                  ? ing
                  : `${ing.quantity ?? ""} ${ing.unit ?? ""} ${ing.name ?? ""}`.trim()}
              </li>
            ))}
          </ul>

          {/* INSTRUCTIONS */}
          {recipe.instructions && (
            <>
              <h3>Instructions</h3>
              <p className="instructions">{recipe.instructions}</p>
            </>
          )}
        </div>
      </div>
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="share-modal-title">Share Recipe</h3>
            <p className="share-modal-subtitle">Search by name, email or phone</p>
            {friends.length === 0 ? (
              <p className="share-modal-subtitle">No friends yet. Add friends first!</p>
            ) : (
              <>
              <input
                className="share-modal-input"
                type="text"
                placeholder="Search friends..."
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
              />
              <div className="share-friends-list">
                 {friends.filter(f => 
                  f.username.toLowerCase().includes(friendSearch.toLowerCase())
                ).map((friend) => (
                  <div
                    key={friend._id}
                    className={`share-friend-item ${shareEmail === friend.email ? "selected" : ""}`}
                    onClick={() => {
                      setShareEmail(friend.email);
                      setShareError("");
                      setShareMessage("");
                    }}
                  >
                    <div className="share-friend-avatar">
                      {friend.profileImageUrl ? (
                        <img src={getImageUrl(friend.profileImageUrl)} alt={friend.username} />
                      ) : (
                        <div className="share-friend-avatar-placeholder" />
                      )}
                    </div>
                    <p className="share-friend-username">{friend.username}</p>
                    {sharedUserIds.includes(friend._id) ? (
                      <span className="share-friend-shared">Shared ✓</span>
                    ) : shareEmail === friend.email ? (
                      <span className="share-friend-selected">Selected</span>
                    ) : null}
                  </div>
                ))}
              </div>
              </>
            )}
            {shareError && <p className="share-modal-error">{shareError}</p>}
            {shareMessage && <p className="share-modal-success">{shareMessage}</p>}
            <div className="share-modal-actions">
              <button
                type="button"
                className="share-modal-btn"
                onClick={handleShare}
              >
                Share
              </button>
              <button
                type="button"
                className="share-modal-cancel"
                onClick={() => {
                  setShowShareModal(false);
                  setShareEmail("");
                  setShareError("");
                  setShareMessage("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}