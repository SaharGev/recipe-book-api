import request from "supertest";
import { Express } from "express";
import initApp from "../app";
import Recipe from "../models/recipeModel";

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

beforeEach(async () => {
  await Recipe.deleteMany({});
});

afterEach(async () => {
  await Recipe.deleteMany({});
});

afterAll((done) => {
  done();
});


describe("AI tests", () => {
  test("POST /ai/ai-search should return 200", async () => {
    const response = await request(app)
        .post("/ai/ai-search")
        .send({
        query: "pasta with tomato"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.originalQuery).toBe("pasta with tomato");
    expect(response.body.filters.ingredients).toContain("pasta");
    expect(response.body.filters.ingredients).toContain("tomato");
    expect(Array.isArray(response.body.recipes)).toBe(true);
  });

  test("POST /ai/ai-search without query should return 400", async () => {
    const response = await request(app)
        .post("/ai/ai-search")
        .send({});

    expect(response.statusCode).toBe(400);
  });

  test("POST /ai/ai-search with unknown query should return empty ingredients array", async () => {
    const response = await request(app)
        .post("/ai/ai-search")
        .send({
        query: "chocolate cake"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.filters.ingredients).toEqual([]);
  });

  test("POST /ai/ai-search should work with uppercase query", async () => {
    const response = await request(app)
        .post("/ai/ai-search")
        .send({
        query: "Pasta With Tomato"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.filters.ingredients).toContain("pasta");
    expect(response.body.filters.ingredients).toContain("tomato");
  });

  test("POST /ai/ai-search should return matching recipes from DB", async () => {
    await Recipe.create({
        title: "Pasta with Tomato Sauce",
        owner: "507f1f77bcf86cd799439011",
        description: "test recipe",
        ingredients: ["pasta", "tomato"],
        cookTime: 20,
        difficulty: "easy",
    });

    const response = await request(app)
        .post("/ai/ai-search")
        .send({
        query: "pasta with tomato"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.recipes.length).toBe(1);
    expect(response.body.recipes[0].title).toBe("Pasta with Tomato Sauce");
  });

  test("POST /ai/ai-search should return only recipes that match all ingredients", async () => {
    await Recipe.create({
        title: "Pasta Only",
        owner: "507f1f77bcf86cd799439011",
        description: "test recipe 1",
        ingredients: ["pasta"],
        cookTime: 10,
        difficulty: "easy",
    });

    await Recipe.create({
        title: "Pasta with Tomato Sauce",
        owner: "507f1f77bcf86cd799439011",
        description: "test recipe 2",
        ingredients: ["pasta", "tomato"],
        cookTime: 20,
        difficulty: "easy",
    });

    const response = await request(app)
        .post("/ai/ai-search")
        .send({
        query: "pasta with tomato"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.recipes.length).toBe(1);
    expect(response.body.recipes[0].title).toBe("Pasta with Tomato Sauce");
  });

  test("POST /ai/ai-search should limit results to 10 recipes", async () => {
    const recipes = [];

    for (let i = 0; i < 15; i++) {
        recipes.push({
        title: `Pasta Recipe ${i}`,
        owner: "507f1f77bcf86cd799439011",
        description: "test recipe",
        ingredients: ["pasta", "tomato"],
        cookTime: 10,
        difficulty: "easy",
        });
    }

    await Recipe.insertMany(recipes);

    const response = await request(app)
        .post("/ai/ai-search")
        .send({
        query: "pasta with tomato"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.recipes.length).toBe(10);
  });

  test("POST /ai/ai-search should filter recipes by difficulty", async () => {
    await Recipe.create({
        title: "Easy Pasta",
        owner: "507f1f77bcf86cd799439011",
        description: "easy recipe",
        ingredients: ["pasta", "tomato"],
        cookTime: 10,
        difficulty: "easy",
    });

    await Recipe.create({
        title: "Hard Pasta",
        owner: "507f1f77bcf86cd799439011",
        description: "hard recipe",
        ingredients: ["pasta", "tomato"],
        cookTime: 30,
        difficulty: "hard",
    });

    const response = await request(app)
        .post("/ai/ai-search")
        .send({
        query: "pasta tomato easy"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.recipes.length).toBe(1);
    expect(response.body.recipes[0].title).toBe("Easy Pasta");
  });
});