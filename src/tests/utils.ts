// src/tests/utils.ts
import request from "supertest";
import { Express } from "express";

export type UserData = {
  email: string;
  username: string;
  password: string;
  _id: string;
  token: string;
  refreshToken: string;
};

export const UserData = {
  email: "test@example.com",
  username: "testuser",
  password: "testpassword",
  _id: "",
  token: "",
  refreshToken: "",
};

//
export const otherUsers: UserData[] = [
  {
    email: "other1@example.com",
    username: "otheruser1",
    password: "testpassword",
    _id: "",
    token: "",
    refreshToken: "",
  },
  {
    email: "other2@example.com",
    username: "otheruser2",
    password: "testpassword",
    _id: "",
    token: "",
    refreshToken: "",
  },
];

export const getlogedInUser = async (app: Express): Promise<UserData> => {
    const email = UserData.email;
    const password = UserData.password;
    let response = await request(app).post("/auth/register").send({ "email": email, "username": UserData.username, "password": password });
    if (response.status !== 201) {
      response = await request(app).post("/auth/login").send({ "email": email, "password": password });
    }
    const logedUser = {
        _id: response.body._id,
        email: email,
        password: password,
        username: UserData.username,
        token: response.body.token,
        refreshToken: response.body.refreshToken,
    };
    return logedUser;
}

export type RecipeData = {
  title: string;
//   owner: string;
  description?: string;
  ingredients: string[];
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isPublic: boolean;
  imageUrl?: string;
};  

export const recipesList: RecipeData[] = [
  {
    title: "Test Recipe 1",
    // owner: "testuser1",
    description: "A delicious test recipe 1",
    ingredients: ["ingredient1", "ingredient2"],
    cookTime: 30,
    difficulty: "easy",
    isPublic: true,
    imageUrl: "http://example.com/image1.jpg",
  },
  {
    title: "Test Recipe 2",
    // owner: "testuser2",
    description: "A delicious test recipe 2",
    ingredients: ["ingredient3", "ingredient4"],
    cookTime: 45,
    difficulty: "medium",
    isPublic: true,
    imageUrl: "http://example.com/image2.jpg",
  },
  {
  title: "Private Recipe",
//   owner: "testuser3",
  ingredients: ["secret"],
  cookTime: 10,
  difficulty: "easy",
  isPublic: false,
  imageUrl: "http://example.com/image3.jpg",
 }
];