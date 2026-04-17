// client/src/pages/RecipeBookDetailsPage.tsx

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { getRecipeBookById } from "../services/recipeBookService";
import { getFriends } from "../services/userService";
import type { RecipeBook } from "../types/recipeBook";
import { getImageUrl } from "../utils/getImageUrl";
import "./RecipeBookDetailsPage.css";
import { BsShare } from "react-icons/bs";
import ShareModal from "../components/ShareModal";
import CommentsSection from "../components/CommentsSection";
import RecipeCard from "../components/RecipeCard";


type Recipe = {
  _id: string;
  title: string;
  description: string;
  instructions?: string;
  imageUrl?: string;
  cookTime: number;
  difficulty: string;
};

type Collaborator = {
  user: {
    _id: string;
    username?: string;
    profileImageUrl?: string;
  } | string;
};

type RecipeBookWithPopulated = Omit<RecipeBook, "collaborators"> & {
  collaborators: Collaborator[];
};

export default function RecipeBookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
const { token } = useContext(AuthContext);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [book, setBook] =
    useState<RecipeBookWithPopulated | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showShareModal, setShowShareModal] = useState(false);
  const [friends, setFriends] = useState<{ _id: string; username: string; profileImageUrl?: string }[]>([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [shareError, setShareError] = useState("");
  const [likedRecipeIds, setLikedRecipeIds] = useState<string[]>([]);

  const fetchBook = async () => {
    try {
      setLoading(true);

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken || !id) {
        setError("Missing token or book id");
        return;
      }

      const data = await getRecipeBookById(id, accessToken);
      if (data) setBook(data);
    } catch (err: any) {
      if (err?.message?.includes("401") || err?.message?.includes("Unauthorized")) {
        return;
      }
      setError("Failed to load recipe book");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const accessToken = token || localStorage.getItem("accessToken");
        if (!accessToken) return;
        const res = await fetch("http://localhost:3000/likes", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        const ids = data
          .filter((l: { targetType: string; targetId: string }) => l.targetType === "recipe")
          .map((l: { targetId: string }) => l.targetId.toString());
        setLikedRecipeIds(ids);
      } catch {}
    };
    fetchLikes();
  }, [token]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const accessToken = token || localStorage.getItem("accessToken");
        if (!accessToken) return;
        const data = await getFriends(accessToken);
        setFriends(data);

        const res = await fetch("http://localhost:3000/users/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const userData = await res.json();
        if (res.ok) setCurrentUserId(userData._id);
      } catch {
        setFriends([]);
      }
    };
    fetchFriends();
  }, [token]);

  const handleShare = async () => {
    try {
      setShareError("");
      const accessToken = token || localStorage.getItem("accessToken");
      if (!accessToken) return;

      const sharedUserIds = book?.collaborators?.map((c) =>
        typeof c.user === "string" ? c.user : c.user._id
      ) || [];

      const toShare = selectedFriendIds.filter(fid => !sharedUserIds.includes(fid));
      const toUnshare = sharedUserIds.filter(fid => !selectedFriendIds.includes(fid));

      for (const friendId of toShare) {
        const friend = friends.find(f => f._id === friendId);
        if (!friend) continue;
        await fetch(`http://localhost:3000/recipe-books/${book?._id}/share`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ username: friend.username }),
        });
      }

      for (const friendId of toUnshare) {
        const friend = friends.find(f => f._id === friendId);
        if (!friend) continue;
        await fetch(`http://localhost:3000/recipe-books/${book?._id}/unshare`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ username: friend.username }),
        });
      }

      await fetchBook();
      setShowShareModal(false);
      setSelectedFriendIds([]);
    } catch (err) {
      setShareError(err instanceof Error ? err.message : "Failed to share");
    }
  };

  if (loading) return <p>Loading book...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div className="book-details-page">
      <div className="book-hero">
        <div className="book-header-bar">
          <button
            className="icon-btn-rbd close-btn-rbd"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>

          <button
            className="icon-btn-rbd edit-btn-rbd"
            onClick={() => navigate(`/edit-book/${book._id}`)}
          >
            ✎
          </button>

          <button
            className="icon-btn-rbd share-btn-rbd"
            onClick={() => {
              const sharedIds = book?.collaborators?.map((c) =>
                typeof c.user === "string" ? c.user : c.user._id
              ) || [];
              setSelectedFriendIds(sharedIds);
              setShowShareModal(true);
            }}
          >
            <BsShare />
          </button>
        </div>
      </div>

      <div className="book-content">
        <h1 className="book-title">{book.name}</h1>

        <p className="book-count">
          {(book.recipes as Recipe[])?.length || 0} Recipes
        </p>

        {book.collaborators && book.collaborators.length > 0 && (
          <>
            <h3 className="book-shared-title">Shared with:</h3>
            <div className="shared-with-list shared-with-list--left">
              {book.collaborators.map((c) => {
                const user = typeof c.user === "string" ? null : c.user;
                if (!user) return null;
                return (
                  <div key={user._id} className="shared-with-item">
                    <div className="share-friend-avatar">
                      {user.profileImageUrl ? (
                        <img src={getImageUrl(user.profileImageUrl)} alt={user.username} />
                      ) : (
                        <div className="share-friend-avatar-placeholder" />
                      )}
                    </div>
                    <p className="shared-with-username">{user.username || "Unknown"}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <CommentsSection
          targetType="book"
          targetId={id || ""}
          currentUserId={currentUserId}
        />

        <h3 className="book-section-title">Recipes:</h3>
        <div className="book-recipes-grid">
          {(book.recipes as Recipe[])?.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe as any}
              initialLiked={likedRecipeIds.includes(recipe._id)}
            />
          ))}
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          title="Share Book"
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
          }}
          error={shareError}
        />
      )}

      <BottomNav />
    </div>
  );
}