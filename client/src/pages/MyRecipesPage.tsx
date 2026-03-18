import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

type Recipe = {
  _id: string;
  title: string;
};

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await fetch("http://localhost:3000/recipes/my", {
        headers: {
          Authorization: "Bearer " + auth?.token,
        },
      });

      const data = await res.json();
      setRecipes(data);
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      <h1>My Recipes</h1>

      {recipes.map((recipe) => (
        <div
          key={recipe._id}
          onClick={() => navigate(`/recipes/${recipe._id}`)}
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            marginBottom: "10px",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          {recipe.title}
        </div>
      ))}
    </div>
  );
}