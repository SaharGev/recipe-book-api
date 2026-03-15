import { BrowserRouter, Routes, Route, Navigate, useNavigate, Router } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useContext } from "react";
import { AuthContext } from "./components/AuthContext";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import AddPage from "./pages/AddPage";
import MyRecipesPage from "./pages/MyRecipesPage";
import CreateRecipeBookPage from "./pages/CreateRecipeBookPage";
import CreateRecipe from "./pages/CreateRecipePage";

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
        <Route path="/my-recipes" element={token ? <MyRecipesPage /> : <Navigate to="/" />} />
        <Route path="/createRecipeBook" element={token ? <CreateRecipeBookPage /> : <Navigate to="/" />} />
        <Route path="/createRecipe" element={token ? <CreateRecipe /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}