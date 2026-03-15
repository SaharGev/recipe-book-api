import "./ProfileSummaryCard.css";
import type { User } from "../types/user";

type ProfileSummaryCardProps = {
  user: User | null;
};

export default function ProfileSummaryCard({
  user,
}: ProfileSummaryCardProps) {
  return (
    <div className="profile-summary-card">
      <div className="profile-summary-header">
        <div className="profile-avatar" />

        <div className="profile-summary-text">
          <h2>{user?.username || "User"}</h2>
          <p>{user?.email || "No email"}</p>
        </div>

        <button type="button" className="profile-settings-button">
          ⚙
        </button>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <strong>156</strong>
          <p>Friends</p>
        </div>

        <div className="profile-stat">
          <strong>4</strong>
          <p>Books</p>
        </div>

        <div className="profile-stat">
          <strong>24</strong>
          <p>Recipes</p>
        </div>
      </div>
    </div>
  );
}