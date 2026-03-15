import "./BottomNav.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav">
    <button
        type="button"
        onClick={() => navigate("/home")}
        className={location.pathname === "/home" ? "active" : ""}
        >
        <div>👤</div>
        <span>Profile</span>
    </button>

    <button
        type="button"
        onClick={() => navigate("/add")}
        className={location.pathname === "/add" ? "active" : ""}
        >
        <div>➕</div>
        <span>Add</span>
    </button>

    <button
        type="button"
        onClick={() => navigate("/search")}
        className={location.pathname === "/search" ? "active" : ""}
        >
        <div>🔍</div>
        <span>Search</span>
    </button>
    </nav>
  );
}