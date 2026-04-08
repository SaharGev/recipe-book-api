import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import BottomNav from "../components/BottomNav";
import { getCurrentUser, uploadProfileImage, updateProfileImage, updateCurrentUser } from "../services/userService";
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
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="settings-field">
          <label className="settings-label">Email</label>
          <input
            className="settings-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="settings-field">
          <label className="settings-label">Phone</label>
          <input
            className="settings-input"
            type="text"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {message && <p className="settings-message">{message}</p>}

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
              setMessage(err instanceof Error ? err.message : "Failed to save");
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
              if (!token) return;
              const { refreshToken } = useContext(AuthContext);
              await logout(refreshToken || "");
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