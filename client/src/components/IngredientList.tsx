// client/src/components/IngredientList.tsx
interface IngredientListProps {
    ingredients: string[];
}

export default function IngredientList({ ingredients }: IngredientListProps) {
    return (
        <ul style={{ paddingLeft: "1rem"}}>
            {ingredients.map((item, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>
                    {item}
                </li>
            ))}
        </ul>
    );
}