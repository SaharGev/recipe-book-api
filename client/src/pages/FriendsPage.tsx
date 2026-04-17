import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { getFriends, removeFriend } from "../services/userService";
import { getImageUrl } from "../utils/getImageUrl";
import BottomNav from "../components/BottomNav";
import "./FriendsPage.css";
import PageHeader from "../components/PageHeader";

type Friend = {
  _id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
};

export default function FriendsPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!token) return;
        const data = await getFriends(token);
        setFriends(data);
      } catch {
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [token]);

  const handleRemove = async (friendId: string) => {
    try {
      if (!token) return;
      await removeFriend(token, friendId);
      setFriends((prev) => prev.filter((f) => f._id !== friendId));
    } catch {
      console.error("Failed to remove friend");
    }
  };

  return (
    <div className="friends-page">
      <PageHeader title="Friends" />
      <button
        type="button"
        className="friends-add-btn"
        onClick={() => navigate("/add-friends", { state: { from: "friends" } })}
      >
        + Add Friends
      </button>

      {loading ? (
        <p className="friends-empty">Loading...</p>
      ) : friends.length === 0 ? (
        <p className="friends-empty">No friends yet</p>
      ) : (
        <div className="friends-list">
          {friends.map((friend) => (
            <div key={friend._id} className="friends-item">
              <div className="friends-avatar">
                {friend.profileImageUrl ? (
                  <img src={getImageUrl(friend.profileImageUrl)} alt={friend.username} />
                ) : (
                  <div className="friends-avatar-placeholder" />
                )}
              </div>
              <div className="friends-info">
                <p className="friends-username">{friend.username}</p>
              </div>
              <button
                type="button"
                className="friends-remove-btn"
                onClick={() => handleRemove(friend._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}