import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import BottomNav from "../components/BottomNav";
import ProfileSummaryCard from "../components/ProfileSummaryCard";
import RecipeBookCard from "../components/RecipeBookCard";
import "./HomePage.css";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/userService";
import type { User } from "../types/user";

export default function HomePage() {
  const { setToken, setRefreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const data = await getCurrentUser(token);
        console.log("current user:", data);
        setUser(data);
      } catch (err) {
        setError("Failed to load user");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="home-page">
      <ProfileSummaryCard user={user} />

      <div className="books-feed">
        <RecipeBookCard title="Desserts" recipesCount={4} />
        <RecipeBookCard title="Italian Food" recipesCount={6} />
        <RecipeBookCard title="Healthy Meals" recipesCount={8} />
      </div>

      <BottomNav />
    </div>
  );
}