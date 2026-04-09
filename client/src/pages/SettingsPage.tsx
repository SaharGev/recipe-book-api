import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import BottomNav from "../components/BottomNav";
import { getCurrentUser, uploadProfileImage, updateProfileImage, updateCurrentUser } from "../services/userService";
import { getImageUrl } from "../utils/getImageUrl";
import "./SettingsPage.css";
import { logout } from "../services/authService";

export default function SettingsPage() {
  const { token, refreshToken, setToken, setRefreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string; phone?: string }>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return;
        const user = await getCurrentUser(token);
        setUsername(user.username || "");
        setEmail(user.email || "");
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
      <div className="settings-header">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h2 className="settings-title">Settings</h2>
      </div>

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
        <h3 className="settings-section-title">Personal Details</h3>

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
          <label className="settings-label">Email</label>
          <input
            className="settings-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
          />
          {errors.email && <p className="settings-message-error">{errors.email}</p>}
        </div>

        <div className="settings-field">
          <label className="settings-label">Phone</label>
          <input
            className="settings-input"
            type="text"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: undefined })); }}
          />
          {errors.phone && <p className="settings-message-error">{errors.phone}</p>}
        </div>

        {message && <p className="settings-message-success">{message}</p>}

        <button
          type="button"
          className="settings-save-btn"
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              setMessage("");
              if (!token) return;

              if (avatarFile) {
                const imageUrl = await uploadProfileImage(token, avatarFile);
                await updateProfileImage(token, imageUrl);
              }

              await updateCurrentUser(token, { username, email, phone });
              setMessage("Saved successfully!");
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : "Failed to save";
              if (errorMessage.toLowerCase().includes("username")) {
                setErrors((prev) => ({ ...prev, username: errorMessage }));
              } else if (errorMessage.toLowerCase().includes("email")) {
                setErrors((prev) => ({ ...prev, email: errorMessage }));
              } else if (errorMessage.toLowerCase().includes("phone")) {
                setErrors((prev) => ({ ...prev, phone: errorMessage }));
              } else {
                setMessage(errorMessage);
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="settings-section">
        <button
          type="button"
          className="settings-logout-btn"
          onClick={async () => {
            try {
              if (!refreshToken) return;
              await logout(refreshToken);
              setToken(null);
              setRefreshToken(null);
              navigate("/");
            } catch {
              console.error("Logout failed");
            }
          }}
        >
          Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}