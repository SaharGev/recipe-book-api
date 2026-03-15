// client/src/pages/RegisterPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";
import { register } from "../services/registerService";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setToken, setRefreshToken } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const data = await register(username, email, phone, password);

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);

    setToken(data.token);
    setRefreshToken(data.refreshToken);

    console.log("register response:", data);

    navigate("/home");
  } catch (error) {
    console.error("register failed:", error);

    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Register failed");
    }
  }
};

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon-wrapper">
          <div className="login-icon">🍳</div>
        </div>

        <h1 className="login-title">Create Account</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-wrapper">
            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="login-input-wrapper">
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-input-wrapper">
            <input
              className="login-input"
              type="text"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

          {error && <div className="login-error">{error}</div>}

          <button className="login-button" type="submit">
            Sign Up
          </button>
        </form>

        <div className="login-footer-text">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}