export type RecipeBook = {
  _id: string;
  name: string;
  recipes: unknown[];

  collaborators: {
    user: {
      _id: string;
      username: string;
    };
  }[];
};