export type AiKnowledgeItem = {
  synonyms: string[];
  title: string;
  ingredients: string[];
};

export const aiSearchKnowledge: Record<string, AiKnowledgeItem> = {
  italian: {
    synonyms: ["italian", "italy", "mediterranean"],
    title: "pasta",
    ingredients: ["tomato"],
  },
  dessert: {
    synonyms: ["dessert", "sweet", "cake"],
    title: "cake",
    ingredients: ["sugar"],
  },
};