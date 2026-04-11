import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { updateCurrentUser, uploadProfileImage, updateProfileImage, getCurrentUser } from "../services/userService";
import { getImageUrl } from "../utils/getImageUrl";
import "./SettingsPage.css";

export default function CompleteProfilePage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; phone?: string }>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return;
        const user = await getCurrentUser(token);
        setUsername(user.username || "");
        setPhone(user.phone || "");
        setAvatarPreview(user.profileImageUrl ? getImageUrl(user.profileImageUrl) : null);
      } catch {
        console.error("Failed to fetch user");
      }
    };

    fetchUser();
  }, [token]);

  return (
    <div className="settings-page">
      <h2 className="settings-title" style={{ textAlign: "center", marginBottom: "24px" }}>
        Complete Your Profile
      </h2>

      <div className="settings-section">
        <div className="settings-avatar-wrapper">
          <div className="settings-avatar-container">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="settings-avatar" />
            ) : (
              <div className="settings-avatar" />
            )}
            <button
              type="button"
              className="settings-avatar-icon-btn"
              onClick={() => document.getElementById("avatar-input")?.click()}
            >
              ✏️
            </button>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAvatarPreview(URL.createObjectURL(file));
                  setAvatarFile(file);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-field">
          <label className="settings-label">Username</label>
          <input
            className="settings-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setErrors((prev) => ({ ...prev, username: undefined })); }}
          />
          {errors.username && <p className="settings-message-error">{errors.username}</p>}
        </div>

        <div className="settings-field">
          <label className="settings-label">Phone (optional)</label>
          <input
            className="settings-input"
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: undefined })); }}
          />
          {errors.phone && <p className="settings-message-error">{errors.phone}</p>}
        </div>

        <button
          type="button"
          className="settings-save-btn"
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              if (!token) return;

              if (avatarFile) {
                const imageUrl = await uploadProfileImage(token, avatarFile);
                await updateProfileImage(token, imageUrl);
              }

              if (username) {
                await updateCurrentUser(token, { username, phone });
              }

              navigate("/add-friends");
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : "Failed to save";
              if (errorMessage.toLowerCase().includes("username")) {
                setErrors((prev) => ({ ...prev, username: errorMessage }));
              } else if (errorMessage.toLowerCase().includes("phone")) {
                setErrors((prev) => ({ ...prev, phone: errorMessage }));
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}