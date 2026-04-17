import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getComments, createComment, deleteComment } from "../services/commentService";
import "./CommentsSection.css";
import { getImageUrl } from "../utils/getImageUrl";


type Comment = {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profileImageUrl?: string;
  };
  content: string;
  createdAt: string;
};

type Props = {
  targetType: "recipe" | "book";
  targetId: string;
  currentUserId: string | null;
};

export default function CommentsSection({ targetType, targetId, currentUserId }: Props) {
  const { token } = useContext(AuthContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(targetType, targetId);
        setComments(data);
      } catch {
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [targetId]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !token) return;
    try {
      setSubmitting(true);
      await createComment(targetType, targetId, newComment.trim(), token);
      const data = await getComments(targetType, targetId);
      setComments(data);
      setNewComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!token) return;
    try {
      await deleteComment(commentId, token);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {}
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments</h3>

      <div className="comments-input-row">
        <input
          className="comments-input"
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          maxLength={500}
        />
        <button
          className="comments-submit-btn"
          onClick={handleSubmit}
          disabled={submitting || !newComment.trim()}
        >
          Post
        </button>
      </div>

      {loading ? (
        <p className="comments-empty">Loading...</p>
      ) : comments.length === 0 ? (
        <p className="comments-empty">No comments yet</p>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-avatar">
                {comment.userId.profileImageUrl ? (
                  <img src={getImageUrl(comment.userId.profileImageUrl)} alt={comment.userId.username} />
                ) : (
                  <div className="comment-avatar-placeholder" />
                )}
              </div>
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-username">{comment.userId.username}</span>
                  {comment.userId._id === currentUserId && (
                    <button
                      className="comment-delete-btn"
                      onClick={() => handleDelete(comment._id)}
                    >
                      🗑
                    </button>
                  )}
                </div>
                <p className="comment-content">{comment.content}</p>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}