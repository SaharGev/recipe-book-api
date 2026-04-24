import "./ProfileSummaryCard.css";
import type { User } from "../types/user";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

type ProfileSummaryCardProps = {
  user: User | null;
  recipesCount: number;
  booksCount: number;
  friendsCount?: number;
  onRecipesClick?: () => void;
  onBooksClick?: () => void;
  onFriendsClick?: () => void;
};

export default function ProfileSummaryCard({
  user,
  recipesCount,
  booksCount,
  friendsCount = 0,
  onRecipesClick,
  onBooksClick,
  onFriendsClick,
}: ProfileSummaryCardProps) {
  const navigate = useNavigate();

  return (
    <div className="profile-summary-card">
      <div className="profile-summary-header">
        <div className="profile-user-info">
          {user?.profileImageUrl ? (
            <img
              src={getImageUrl(user.profileImageUrl)}
              alt="profile"
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar" />
          )}

          <div className="profile-summary-text">
            <h2>{user?.username || "User"}</h2>
            <p>{user?.email || "No email"}</p>
          </div>
        </div>

        <button type="button" className="profile-settings-button" onClick={() => navigate("/settings")}>
          ⚙
        </button>
      </div>

      <div className="profile-stats">
        <div className="profile-stat" onClick={onFriendsClick} style={{ cursor: "pointer" }}>
          <strong>{friendsCount}</strong>
          <p>Friends</p>
        </div>

        <div className="profile-stat" onClick={onBooksClick} style={{ cursor: "pointer" }}>
          <strong>{booksCount}</strong>
          <p>Books</p>
        </div>

        <div className="profile-stat" onClick={onRecipesClick} style={{ cursor: "pointer" }}>
          <strong>{recipesCount}</strong>
          <p>Recipes</p>
        </div>
      </div>
    </div>
  );
}
