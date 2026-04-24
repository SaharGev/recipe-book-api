// client/src/pages/LoginPage.tsx
import { useState } from "react";
import { login } from "../services/authService";
import { signInWithGoogle } from "../services/firebaseService";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setToken, setRefreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(identifier, password);

      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      if (data.isNewUser) {
        navigate("/complete-profile");
      } else {
        navigate("/home");
      }

      console.log("login response:", data);
    } catch (error) {
      console.error("login failed:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon-wrapper">
          <div className="login-icon">🍳</div>
        </div>

        <h1 className="login-title">Welcome Back!</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-wrapper">
            <input
              className="login-input"
              type="text"
              placeholder="Email or Mobile"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="login-input-wrapper">
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>

          {error && <div className="login-error">{error}</div>}
          <button className="login-button" type="submit">
            Login
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          className="google-button"
          type="button"
          onClick={async () => {
            try {
              const idToken = await signInWithGoogle();
              const response = await fetch("/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
              });
              const data = await response.json();
              if (!response.ok) throw new Error(data.message || "Google login failed");
              console.log("google login data:", data);
              setToken(data.accessToken);
              setRefreshToken(data.refreshToken);
              if (data.isNewUser) {
                navigate("/complete-profile");
              } else {
                navigate("/home");
              }
            } catch (error) {
              setError(error instanceof Error ? error.message : "Google login failed");
            }
          }}
        >
          Continue with Google
        </button>

        <div className="login-footer-text">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
