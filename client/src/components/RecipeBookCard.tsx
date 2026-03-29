import "./RecipeBookCard.css";

type RecipeBookCardProps = {
  title: string;
  recipesCount: number;
};

export default function RecipeBookCard({ title, recipesCount }: RecipeBookCardProps) {
  return (
    <div className="recipe-book-card">

      <div className="recipe-preview">
        <div className="recipe-thumb" />
        <div className="recipe-thumb" />
        <div className="recipe-thumb" />
        <div className="recipe-thumb" />
      </div>
      
      <h3>{title}</h3>
      <p>{recipesCount} recipes</p>
    </div>
  );
}