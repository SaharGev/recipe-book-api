import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useContext } from "react";
import { AuthContext } from "./components/AuthContext";
import HomePage from "./pages/HomePage";

export default function AppRoutes() {
  const { token, setToken, setRefreshToken } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/home" /> : <RegisterPage />} />
        <Route path="/home" element={token ? <HomePage /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}