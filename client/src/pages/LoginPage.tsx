import { useState } from "react";
import { login } from "../services/authService";
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

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      setToken(data.token);
      setRefreshToken(data.refreshToken);
      
      navigate("/home");

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

          {error && <div className="login-error">{error}</div>}          <div className="forgot-password">Forgot password?</div>
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
          Already have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}