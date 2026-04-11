import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { addFriend, searchUsers } from "../services/userService";
import { getImageUrl } from "../utils/getImageUrl";
import BottomNav from "../components/BottomNav";
import "./AddFriendsPage.css";

type UserResult = {
  _id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
};

export default function AddFriendsPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
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

  const handleAdd = async (user: UserResult) => {
    try {
      if (!token) return;
      await addFriend(token, user.email);
      setAddedIds((prev) => [...prev, user._id]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add friend");
    }
  };

  return (
    <div className="add-friends-page">
      <h2 className="add-friends-title">Add Friends</h2>
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
              <div className="add-friends-result-info">
                <p className="add-friends-result-username">{user.username}</p>
              </div>
              <button
                type="button"
                className={`add-friends-result-btn ${addedIds.includes(user._id) ? "added" : ""}`}
                disabled={addedIds.includes(user._id)}
                onClick={() => handleAdd(user)}
              >
                {addedIds.includes(user._id) ? "Added ✓" : "Add"}
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="add-friends-skip-btn"
        onClick={() => navigate("/home")}
      >
        Skip
      </button>

      <BottomNav />
    </div>
  );
}