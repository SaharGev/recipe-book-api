export type Recipe = {
  _id: string;
  title: string;
  description?: string;
  ingredients: string[];
  cookTime: number;
  difficulty: string;
  instructions?: string;
  imageUrl?: string;
};