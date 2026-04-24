import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { getFriendsPaginated, removeFriend } from "../services/userService";
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  const pageRef = useRef(page);

  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { loadingMoreRef.current = loadingMore; }, [loadingMore]);
  useEffect(() => { pageRef.current = page; }, [page]);

  const fetchFriends = useCallback(async (pageToLoad = 1) => {
    try {
      if (pageToLoad === 1) setLoading(true);
      else setLoadingMore(true);
      if (!token) return;

      const data = await getFriendsPaginated(token, pageToLoad, 10);

      if (pageToLoad === 1) {
        setFriends(data.friends);
      } else {
        setFriends((prev) => [...prev, ...data.friends]);
      }

      setHasMore(data.hasMore);
    } catch {
      setFriends([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFriends(1);
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
          fetchFriends(nextPage);
        }
      },
      { threshold: 0, rootMargin: "0px" }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchFriends, loading]);

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
      <PageHeader 
        title="Friends" 
        onBack={() => navigate("/home")}
      />
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

      <div ref={observerRef} style={{ height: "20px" }} />
      {loadingMore && <p className="friends-empty">Loading more...</p>}

      <BottomNav />
    </div>
  );
}
