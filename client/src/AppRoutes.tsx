import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useContext } from "react";
import { AuthContext } from "./components/AuthContext";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import AddPage from "./pages/AddPage";

export default function AppRoutes() {
  const { token, setToken, setRefreshToken } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={token ? <HomePage /> : <Navigate to="/" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={token ? <SearchPage /> : <Navigate to="/" />} />
        <Route path="/add" element={token ? <AddPage /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}