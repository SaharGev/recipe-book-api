export type RecipeIngredient =
  | string
  | {
      name?: string;
      quantity?: number | string;
      unit?: string;
    };

export type Recipe = {
  _id: string;
  title: string;
  description?: string;
  ingredients: RecipeIngredient[];
  cookTime: number;
  difficulty: string;
  instructions?: string;
  imageUrl?: string;
  isPublic?: boolean;
};