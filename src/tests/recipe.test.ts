//src/tests/recipes.test.ts

import request from "supertest";
import initApp from "../app";
import Recipe from "../models/recipeModel";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await Recipe.deleteMany();
});

afterAll((done) => {
  done();
});


describe("Recipe API", () => {

  test("Create Recipe", async () => {
    const recipeData = {
      title: "Test Recipe",
      owner: "testuser",
      description: "A delicious test recipe",
      ingredients: ["ingredient1", "ingredient2"],
      cookTime: 30,
      difficulty: "easy",
      isPublic: true,
      imageUrl: "http://example.com/image.jpg",
    };

    const response = await request(app)
      .post("/recipes")
      .send(recipeData);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(recipeData.title);
    expect(response.body.owner).toBe(recipeData.owner);
    expect(response.body._id).toBeDefined();
  });

});

