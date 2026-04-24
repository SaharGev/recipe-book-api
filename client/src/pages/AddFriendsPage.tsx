import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../components/AuthContext";
import { addFriend, getFriends, removeFriend, searchUsers } from "../services/userService";
import { getImageUrl } from "../utils/getImageUrl";
import BottomNav from "../components/BottomNav";
import "./AddFriendsPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";


type UserResult = {
  _id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
};

export default function AddFriendsPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const fromFriends = location.state?.from === "friends";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!token) return;
        const friends = await getFriends(token);
        setFriendIds(friends.map((f: { _id: string }) => f._id));
      } catch {
        setFriendIds([]);
      }
    };
    fetchFriends();
  }, [token]);
  
  useEffect(() => {
    if (query.trim().length < 2) {
      const timer = setTimeout(() => setResults([]), 0);
      return () => clearTimeout(timer);
    }

    const timeout = setTimeout(async () => {
      try {
        if (!token) return;
        const users = await searchUsers(token, query);
        setResults(users);
      } catch {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, token]);

  const isAdded = (userId: string) => addedIds.includes(userId) || friendIds.includes(userId);

  const handleToggleFriend = async (user: UserResult) => {
    try {
      if (!token) return;
      if (isAdded(user._id)) {
        await removeFriend(token, user._id);
        setAddedIds((prev) => prev.filter((id) => id !== user._id));
        setFriendIds((prev) => prev.filter((id) => id !== user._id));
      } else {
        await addFriend(token, user.email);
        setAddedIds((prev) => [...prev, user._id]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update friend");
    }
  };

  return (
    <div className="add-friends-page">
      <PageHeader title="Add Friends" />
      <p className="add-friends-subtitle">
        Find friends by username, email or phone
      </p>

      <div className="add-friends-input-wrapper">
        <input
          className="add-friends-input"
          type="text"
          placeholder="Username, email or phone"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError("");
          }}
        />
      </div>

      {error && <p className="add-friends-error">{error}</p>}

      {results.length > 0 && (
        <div className="add-friends-results">
          {results.map((user) => (
            <div key={user._id} className="add-friends-result-item">
              <div className="add-friends-result-avatar">
                {user.profileImageUrl ? (
                  <img src={getImageUrl(user.profileImageUrl)} alt={user.username} />
                ) : (
                  <div className="add-friends-result-avatar-placeholder" />
                )}
              </div>
              <div className="add-friends-result-info">
                <p className="add-friends-result-username">{user.username}</p>
              </div>
              <button
                type="button"
                className={`add-friends-result-btn ${isAdded(user._id) ? "added" : ""}`}
                disabled={false}
                onClick={() => handleToggleFriend(user)}
              >
                {isAdded(user._id) ? "Added ✓" : "Add"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="add-friends-actions">
        <button
          type="button"
          className="add-friends-done-btn"
          onClick={() => fromFriends ? navigate("/friends", { replace: true }) : navigate("/home", { replace: true })}
        >
          Done
        </button>
        {!fromFriends && (
          <button
            type="button"
            className="add-friends-skip-btn"
            onClick={() => navigate("/home", { replace: true })}
          >
            Skip
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
