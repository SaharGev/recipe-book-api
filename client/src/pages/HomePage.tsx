import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { logout } from "../services/authService";

export default function HomePage() {
  const { setToken, setRefreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <h1>Home Page</h1>
      <button
        onClick={async () => {
          const refreshToken = localStorage.getItem("refreshToken");

          if (refreshToken) {
            try {
              await logout(refreshToken);
            } catch (error) {
              console.error("logout failed:", error);
            }
          }

          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setToken(null);
          setRefreshToken(null);
          navigate("/");
        }}
      >
        Logout
      </button>
    </>
  );
}