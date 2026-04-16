import { getImageUrl } from "../utils/getImageUrl";

type Friend = {
  _id: string;
  username: string;
  profileImageUrl?: string;
};

type ShareModalProps = {
  title: string;
  friends: Friend[];
  selectedFriendIds: string[];
  friendSearch: string;
  onSearchChange: (value: string) => void;
  onToggleFriend: (friendId: string) => void;
  onDone: () => void;
  onCancel: () => void;
  error?: string;
};

export default function ShareModal({
  title,
  friends,
  selectedFriendIds,
  friendSearch,
  onSearchChange,
  onToggleFriend,
  onDone,
  onCancel,
  error,
}: ShareModalProps) {
  return (
    <div className="share-modal-overlay" onClick={onCancel}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="share-modal-title">{title}</h3>
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
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="share-friends-list">
              {friends
                .filter(f => f.username.toLowerCase().includes(friendSearch.toLowerCase()))
                .map((friend) => {
                  const isSelected = selectedFriendIds.includes(friend._id);
                  return (
                    <div
                      key={friend._id}
                      className="share-friend-item"
                      onClick={() => onToggleFriend(friend._id)}
                    >
                      <input
                        type="checkbox"
                        className="share-friend-checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                      />
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
        {error && <p className="share-modal-error">{error}</p>}
        <div className="share-modal-actions">
          <button
            type="button"
            className="share-modal-btn"
            onClick={onDone}
            disabled={selectedFriendIds.length === 0}
          >
            Done
          </button>
          <button
            type="button"
            className="share-modal-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}