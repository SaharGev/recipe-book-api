export type RecipeBook = {
  _id: string;
  name: string;
  recipes: unknown[];
  isPublic?: boolean;
  collaborators: {
    user: {
      _id: string;
      username: string;
    };
  }[];
};
