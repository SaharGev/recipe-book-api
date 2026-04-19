import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import MyRecipeBooksPage from "./pages/MyRecipeBooksPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import RecipeBookDetailsPage from "./pages/RecipeBookDetailsPage";
import EditRecipePage from "./pages/EditRecipePage";
import FavoriteRecipesPage from "./pages/FavoriteRecipesPage";
import FavoriteBooksPage from "./pages/FavoriteBooksPage";
import SettingsPage from "./pages/SettingsPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import AddFriendsPage from "./pages/AddFriendsPage";
import FriendsPage from "./pages/FriendsPage";
import EditRecipeBookPage from "./pages/EditRecipeBookPage";
import PublicRecipesPage from "./pages/PublicRecipesPage";
import PublicBooksPage from "./pages/PublicBooksPage";
import SharedRecipesPage from "./pages/SharedRecipesPage";
import SharedBooksPage from "./pages/SharedBooksPage";

export default function AppRoutes() {
  const { token } = useContext(AuthContext);

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
        <Route path="/my-recipeBooks" element={token ? <MyRecipeBooksPage /> : <Navigate to="/" />} />
        <Route path="/recipes/:id" element={token ? <RecipeDetailsPage /> : <Navigate to="/" />} />
        <Route path="/recipe-books/:id" element={token ? <RecipeBookDetailsPage /> : <Navigate to="/" />} />
        <Route path="/edit-recipe/:id" element={token ? <EditRecipePage /> : <Navigate to="/" />} />
        <Route path="/favorite-recipes" element={token ? <FavoriteRecipesPage /> : <Navigate to="/" />} />
        <Route path="/favorite-books" element={token ? <FavoriteBooksPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={token ? <SettingsPage /> : <Navigate to="/" />} />
        <Route path="/complete-profile" element={token ? <CompleteProfilePage /> : <Navigate to="/" />} />
        <Route path="/add-friends" element={token ? <AddFriendsPage /> : <Navigate to="/" />} />
        <Route path="/friends" element={token ? <FriendsPage /> : <Navigate to="/" />} />
        <Route path="/edit-book/:id" element={token ? <EditRecipeBookPage /> : <Navigate to="/" />} />
        <Route path="/public-recipes" element={token ? <PublicRecipesPage /> : <Navigate to="/" />} />
        <Route path="/public-books" element={token ? <PublicBooksPage /> : <Navigate to="/" />} />
        <Route path="/shared-recipes" element={token ? <SharedRecipesPage /> : <Navigate to="/" />} />
        <Route path="/shared-books" element={token ? <SharedBooksPage /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}