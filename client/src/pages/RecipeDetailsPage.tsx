// client/src/pages/RecipeDetailsPage.tsx
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import "./RecipeDetailsPage.css";
import type { Recipe } from "../types/recipe";
import { getFriends } from "../services/userService";
import { apiFetch } from "../services/apiClient";
import { getImageUrl } from "../utils/getImageUrl";
import { BsShare } from "react-icons/bs";
import ShareModal from "../components/ShareModal";
import BottomNav from "../components/BottomNav";
import { getCommentCount } from "../services/commentService";

function InstructionStepItem({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="step-row-view">
      <button
        type="button"
        className={`step-checkbox ${done ? "step-done" : ""}`}
        onClick={() => setDone(!done)}
      >
        {done ? "✓" : ""}
      </button>
      <span className={done ? "step-text step-text-done" : "step-text"}>
        {text}
      </span>
    </div>
  );
}


export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const accessToken = token || localStorage.getItem("accessToken");

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [shareMessage, setShareMessage] = useState("");
  const [shareError, setShareError] = useState("");
  const [friends, setFriends] = useState<{ _id: string; username: string; email: string; profileImageUrl?: string }[]>([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [sharedUserIds, setSharedUserIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<{ _id: string; username: string; profileImageUrl?: string } | null>(null);
  const [isSharedOpen, setIsSharedOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    getCommentCount("recipe", id || "").then(setCommentCount);
  }, [id]);

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

    const fetchCurrentUser = async () => {
      try {
        if (!token) return;
        const res = await apiFetch("/users/me", {}, token);
        const data = await res.json();
        if (res.ok) {
          setCurrentUserId(data._id);
          setCurrentUser(data);
        }
      } catch {}
    };
    fetchCurrentUser();
  }, [token]);
    

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!accessToken) return;
      const res = await apiFetch(`/recipes/${id}`, {}, accessToken);

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) setForbidden(true);
        return;
      }

      setRecipe(data);
      if (data.collaborators) {
        setSharedUserIds(data.collaborators.map((c: { user: string | { _id: string } }) => 
          typeof c.user === "string" ? c.user : c.user._id
        ));
            }
    };

  fetchRecipe();
  }, [id, accessToken]);

  const handleShare = async () => {
    try {
      setShareError("");
      if (!token) return;

      const toShare = selectedFriendIds.filter(fid => !sharedUserIds.includes(fid));
      const toUnshare = sharedUserIds.filter(fid => !selectedFriendIds.includes(fid));

      for (const friendId of toShare) {
        const friend = friends.find(f => f._id === friendId);
        if (!friend) continue;
        const response = await fetch(`/recipes/${id}/share`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: friend.email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to share");
      }

      for (const friendId of toUnshare) {
        const friend = friends.find(f => f._id === friendId);
        if (!friend) continue;
        const response = await fetch(`/recipes/${id}/unshare`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: friend.email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to unshare");
      }

      setSharedUserIds([...selectedFriendIds]);
      setShowShareModal(false);
    } catch (err) {
      setShareError(err instanceof Error ? err.message : "Failed to share");
    }
  };

  if (forbidden) return (
    <div className="recipe-page-wrapper">
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>🔒 Private Recipe</h2>
        <p>This recipe is private and cannot be accessed.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
  if (!recipe) return <p>Loading...</p>;

  const isOwner = currentUserId && recipe.owner && 
    (typeof recipe.owner === "string" 
      ? recipe.owner === currentUserId 
      : recipe.owner._id === currentUserId);

  return (
    <div className="recipe-page-wrapper">
      <div className="recipe-details-page">

        {/* IMAGE */}
        <div className="image-wrapper">
          <div className="recipe-image-placeholder">
            {recipe.imageUrl ? (
              <img
                src={getImageUrl(recipe.imageUrl)}
                alt={recipe.title}
                className="recipe-main-image"
              />
            ) : (
              <div className="recipe-no-image" />
            )}
          </div>

          {/* TOP BUTTONS */}
          <button className="icon-btn-rd close-btn-rd" onClick={() => navigate(-1)}>
            ‹
          </button>

          {isOwner && (
            <button
              className="icon-btn-rd edit-btn-rd"
              onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
            >
              ✎
            </button>
          )}

          {isOwner && !recipe.isPublic && (
            <button
              className="icon-btn-rd share-btn-rd"
              onClick={() => {
                setSelectedFriendIds([...sharedUserIds]);
                setShowShareModal(true);
              }}
            >
              <BsShare />
            </button>
          )}

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
              <div className="instructions-list">
                {recipe.instructions.split("\n").filter(Boolean).map((step, i) => (
                  <InstructionStepItem key={i} text={step.replace(/^\d+\.\s*/, "")} />
                ))}
              </div>
            </>
          )}

          <button
            className="comments-nav-btn"
            onClick={() => navigate(`/comments/recipe/${id}`)}
          >
            💬 Comments {commentCount > 0 && `(${commentCount})`}
            <span style={{ marginLeft: "auto" }}>›</span>
          </button>

          {/* SHARED WITH */}
          {!recipe.isPublic && (
            recipe.owner || (recipe.collaborators && recipe.collaborators.length > 0)
          ) && (
            <>
              <div 
                className="comments-header"
                onClick={() => setIsSharedOpen(!isSharedOpen)}
              >
                <h3 style={{ margin: 0 }}>Shared with</h3>
                <span className="comments-toggle">{isSharedOpen ? "▲" : "▼"}</span>
              </div>

              {isSharedOpen && (
              <div className="shared-with-list">
                {recipe.owner && typeof recipe.owner === "object" && (
                  <div className="shared-with-item">
                    <div className="share-friend-avatar">
                      {recipe.owner.profileImageUrl ? (
                        <img src={getImageUrl(recipe.owner.profileImageUrl)} alt={recipe.owner.username} />
                      ) : (
                        <div className="share-friend-avatar-placeholder" />
                      )}
                    </div>
                    <p className="shared-with-username">{recipe.owner.username}</p>
                    <span className="shared-with-badge">Owner</span>
                  </div>
                )}

                {!isOwner && currentUser && (
                  <div className="shared-with-item">
                    <div className="share-friend-avatar">
                      {currentUser.profileImageUrl ? (
                        <img src={getImageUrl(currentUser.profileImageUrl)} alt={currentUser.username} />
                      ) : (
                        <div className="share-friend-avatar-placeholder" />
                      )}
                    </div>
                    <p className="shared-with-username">{currentUser.username}</p>
                  </div>
                )}

                {recipe.collaborators && recipe.collaborators
                  .filter((c: any) => {
                    const uid = typeof c.user === "object" ? c.user._id : c.user;
                    return uid !== currentUserId;
                  })
                  .map((c: any) => (
                    <div key={c.user._id || c.user} className="shared-with-item">
                      <div className="share-friend-avatar">
                        {c.user.profileImageUrl ? (
                          <img src={getImageUrl(c.user.profileImageUrl)} alt={c.user.username} />
                        ) : (
                          <div className="share-friend-avatar-placeholder" />
                        )}
                      </div>
                      <p className="shared-with-username">{c.user.username || "Unknown"}</p>
                    </div>
                  ))}
              </div>
              )}
            </>
          )}

        </div>
      </div>
      {showShareModal && (
        <ShareModal
          title="Share Recipe"
          friends={friends}
          selectedFriendIds={selectedFriendIds}
          friendSearch={friendSearch}
          onSearchChange={setFriendSearch}
          onToggleFriend={(friendId) => {
            setSelectedFriendIds(prev =>
              prev.includes(friendId)
                ? prev.filter(id => id !== friendId)
                : [...prev, friendId]
            );
            setShareError("");
          }}
          onDone={handleShare}
          onCancel={() => {
            setShowShareModal(false);
            setSelectedFriendIds([]);
            setShareError("");
            setShareMessage("");
          }}
          error={shareError}
        />
      )}

    <BottomNav />
    </div>
  );
}
