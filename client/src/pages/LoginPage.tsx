import { useState } from "react";
import { login } from "../services/authService";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setRefreshToken } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await login(identifier, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      setToken(data.token);
      setRefreshToken(data.refreshToken);

      console.log("login response:", data);
    } catch (error) {
      console.error("login failed:", error);
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
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="login-input-wrapper">
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="forgot-password">Forgot password?</div>

          <button className="login-button" type="submit">
            Login
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="google-button" type="button">
          Continue with Google
        </button>

        <div className="login-footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}