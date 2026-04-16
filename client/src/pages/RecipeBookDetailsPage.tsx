// client/src/pages/RecipeBookDetailsPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
<<<<<<< HEAD
import { getRecipeBookById, searchUsers } from "../services/recipeBookService";
=======
import { getRecipeBookById } from "../services/recipeBookService";
>>>>>>> 147cbee595acd38aaa7a7d50fd85dd2d12e4b5f8
import { getFriends } from "../services/userService";
import type { RecipeBook } from "../types/recipeBook";
import { getImageUrl } from "../utils/getImageUrl";
import "./RecipeBookDetailsPage.css";
import { BsShare } from "react-icons/bs";

type Recipe = {
  _id: string;
  title: string;
  description: string;
  instructions?: string;
  imageUrl?: string;
  cookTime: number;
  difficulty: string;
};

type User = {
  _id: string;
  username: string;
};

type Collaborator = {
<<<<<<< HEAD
  user:
    | {
        _id: string;
        username?: string;
      }
    | string;
=======
  user: {
    _id: string;
    username?: string;
    profileImageUrl?: string;
  } | string;
>>>>>>> 147cbee595acd38aaa7a7d50fd85dd2d12e4b5f8
};

type RecipeBookWithPopulated = Omit<RecipeBook, "collaborators"> & {
  collaborators: Collaborator[];
};

export default function RecipeBookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] =
    useState<RecipeBookWithPopulated | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showShareModal, setShowShareModal] = useState(false);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [friends, setFriends] = useState<User[]>([]);

  const previewImages =
    ((book?.recipes as Recipe[]) || [])
      .slice(-4)
      .reverse()
      .map((r) => r.imageUrl)
      .filter(Boolean);

  const fetchBook = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      if (!token || !id) {
        setError("Missing token or book id");
        return;
      }

      const data = await getRecipeBookById(id, token);
      setBook(data);
    } catch {
      setError("Failed to load recipe book");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const data = await getFriends(token);
        setFriends(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFriends();
  }, []);

  const handleSearch = async (value: string) => {
    setSearch(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoadingUsers(true);

      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const data = await searchUsers(value, token);

<<<<<<< HEAD
      const filtered = (data as User[]).filter((u) =>
        friends.some((f) => f._id === u._id)
      );

      setUsers(filtered);
=======
      const toShare = selectedFriendIds.filter(fid => !sharedUserIds.includes(fid));
      const toUnshare = sharedUserIds.filter(fid => !selectedFriendIds.includes(fid));

      for (const friendId of toShare) {
        const friend = friends.find(f => f._id === friendId);
        if (!friend) continue;
        await fetch(`http://localhost:3000/recipe-books/${book?._id}/share`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ username: friend.username }),
        });
      }

      for (const friendId of toUnshare) {
        const friend = friends.find(f => f._id === friendId);
        if (!friend) continue;
        await fetch(`http://localhost:3000/recipe-books/${book?._id}/unshare`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ username: friend.username }),
        });
      }

      await fetchBook();
      setShowShareModal(false);
      setSelectedFriendIds([]);
>>>>>>> 147cbee595acd38aaa7a7d50fd85dd2d12e4b5f8
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

<<<<<<< HEAD
  const updateCollaborators = (userId: string, add: boolean) => {
    setBook((prev) => {
      if (!prev) return prev;

      const current = prev.collaborators || [];

      const updated = add
        ? [...current, { user: userId }]
        : current.filter((c) => {
            const id =
              typeof c.user === "string" ? c.user : c.user._id;

            return id !== userId;
          });

      return {
        ...prev,
        collaborators: updated,
      };
    });
  };

  const openShareModal = () => {
    setSearch("");
    setUsers([]);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setSearch("");
    setUsers([]);
    setShowShareModal(false);
  };

  const shareBook = async (userId: string) => {
    try {
      const token = localStorage.getItem("accessToken");

      await fetch(
        `http://localhost:3000/recipe-books/${book?._id}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: users.find((u) => u._id === userId)?.username,
          }),
        }
      );

      updateCollaborators(userId, true);
    } catch (err) {
      console.error(err);
    }
  };

  const unshareBook = async (userId: string) => {
    try {
      const token = localStorage.getItem("accessToken");

      await fetch(
        `http://localhost:3000/recipe-books/${book?._id}/unshare`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: users.find((u) => u._id === userId)?.username,
          }),
        }
      );

      updateCollaborators(userId, false);
    } catch (err) {
      console.error(err);
    }
  };

=======
>>>>>>> 147cbee595acd38aaa7a7d50fd85dd2d12e4b5f8
  if (loading) return <p>Loading book...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div className="book-details-page">
      <div className="book-hero">
        <div className="image-wrapper">
          <div className="book-cover">
            {[0, 1, 2, 3].map((index) =>
              previewImages[index] ? (
                <img
                  key={index}
                  src={getImageUrl(
                    previewImages[index] as string
                  )}
                  className="book-cover-img"
                />
              ) : (
                <div
                  key={index}
                  className="book-cover-placeholder"
                />
              )
            )}
          </div>

          <button
            className="icon-btn-rbd close-btn-rbd"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>

          <button
            className="icon-btn-rbd edit-btn-rbd"
            onClick={() =>
              navigate(`/edit-book/${book._id}`)
            }
          >
            ✎
          </button>

          <button
<<<<<<< HEAD
            className="icon-btn-rbd share-btn-rbd"
            onClick={openShareModal}
=======
            className="icon-btn share-btn"
            onClick={() => {
              const sharedIds = book?.collaborators?.map((c) =>
                typeof c.user === "string" ? c.user : c.user._id
              ) || [];
              setSelectedFriendIds(sharedIds);
              setShowShareModal(true);
            }}
>>>>>>> 147cbee595acd38aaa7a7d50fd85dd2d12e4b5f8
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

        <div className="book-recipes-grid">
          {(book.recipes as Recipe[])?.map((recipe) => (
            <div
              key={recipe._id}
              className="myrecipes-card"
              onClick={() =>
                navigate(`/recipes/${recipe._id}`)
              }
            >
              <div className="myrecipes-card-preview">
                {recipe.imageUrl ? (
                  <img
                    src={getImageUrl(recipe.imageUrl)}
                    className="myrecipes-card-image"
                  />
                ) : (
                  <div className="myrecipes-card-image-placeholder" />
                )}
              </div>

              <h3 className="myrecipes-card-title">
                {recipe.title}
              </h3>

              {recipe.description && (
                <p className="myrecipes-card-description">
                  {recipe.description}
                </p>
              )}

              <div className="myrecipes-card-meta">
                {recipe.cookTime && (
                  <span>⏱ {recipe.cookTime} min</span>
                )}
                {recipe.difficulty && (
                  <span>• {recipe.difficulty}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showShareModal && (
<<<<<<< HEAD
        <div
          className="modal-overlay"
          onClick={closeShareModal}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title">Share book</h3>

            <input
              value={search}
              placeholder="Search user..."
              onChange={(e) =>
                handleSearch(e.target.value)
              }
            />

            {loadingUsers && (
              <p className="muted">Searching...</p>
            )}

            {users.map((u) => {
              const isUserShared = book.collaborators?.some(
                (c) =>
                  typeof c.user === "string"
                    ? c.user === u._id
                    : c.user._id === u._id
              );

              return (
                <div key={u._id} className="user-row">
                  <span>{u.username}</span>

                  <button
                    className={`share-toggle-btn ${
                      isUserShared ? "unshare" : "share"
                    }`}
                    onClick={() =>
                      isUserShared
                        ? unshareBook(u._id)
                        : shareBook(u._id)
                    }
                  >
                    {isUserShared
                      ? "Unshare"
                      : "Share"}
                  </button>
                </div>
              );
            })}

            <button
              className="modal-close-btn"
              onClick={closeShareModal}
            >
              Close
            </button>
=======
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="share-modal-title">Share Book</h3>
            <p className="share-modal-subtitle">Select friends to share with</p>
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
                  ).map((friend) => {
                    const isSelected = selectedFriendIds.includes(friend._id);
                    return (
                      <div
                        key={friend._id}
                        className="share-friend-item"
                        onClick={() => {
                          setSelectedFriendIds(prev =>
                            isSelected
                              ? prev.filter(fid => fid !== friend._id)
                              : [...prev, friend._id]
                          );
                          setShareError("");
                        }}
                      >
                        <input type="checkbox" className="share-friend-checkbox" checked={isSelected} onChange={() => {}} />
                        <div className="share-friend-avatar">
                          {friend.profileImageUrl ? (
                            <img src={getImageUrl(friend.profileImageUrl)} alt={friend.username} />
                          ) : (
                            <div className="share-friend-avatar-placeholder" />
                          )}
                        </div>
                        <p className="share-friend-username">{friend.username}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {shareError && <p className="share-modal-error">{shareError}</p>}
            <div className="share-modal-actions">
              <button type="button" className="share-modal-btn" onClick={handleShare}>Done</button>
              <button type="button" className="share-modal-cancel" onClick={() => {
                setShowShareModal(false);
                setSelectedFriendIds([]);
                setShareError("");
              }}>Cancel</button>
            </div>
>>>>>>> 147cbee595acd38aaa7a7d50fd85dd2d12e4b5f8
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}