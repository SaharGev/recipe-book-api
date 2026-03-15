// client/src/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecipePage from "./pages/RecipePage";

function HomePage() {
  return <h1>Home Page</h1>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/recipes/:id" element={<RecipePage />} />
      </Routes>
    </BrowserRouter>
  );
}