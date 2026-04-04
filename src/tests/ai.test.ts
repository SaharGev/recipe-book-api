import request from "supertest";
import { Express } from "express";
import { getlogedInUser, getLoggedInCustomUser } from "./utils";
import initApp from "../app";
import Recipe from "../models/recipeModel";
import RecipeBook from "../models/recipeBookModel";
import Like from "../models/likeModel";

let app: Express;
let accessToken: string;

beforeAll(async () => {
  app = await initApp();

  const user = await getlogedInUser(app);
  accessToken = user.accessToken;
});

beforeEach(async () => {
  await Recipe.deleteMany({});
  await RecipeBook.deleteMany({});
  await Like.deleteMany({});
});

afterEach(async () => {
  await Recipe.deleteMany({});
  await RecipeBook.deleteMany({});
  await Like.deleteMany({});
});

afterAll((done) => {
  done();
});


describe("AI tests", () => {
  test("POST /ai/ai-search without token should return 401", async () => {
    const response = await request(app)
      .post("/ai/ai-search")
      .send({
        query: "pasta with tomato",
      });

    expect(response.statusCode).toBe(401);
  });

  test("POST /ai/ai-search should return 200", async () => {
    const response = await request(app)
        .post("/ai/ai-search")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
        query: "pasta with tomato"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.originalQuery).toBe("pasta with tomato");
    expect(Array.isArray(response.body.recipes)).toBe(true);
  });

  test("POST /ai/ai-search without query should return 400", async () => {
    const response = await request(app)
        .post("/ai/ai-search")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});

    expect(response.statusCode).toBe(400);
  });

  test("POST /ai/ai-search with unknown query should return empty ingredients array", async () => {
    const response = await request(app)
        .post("/ai/ai-search")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
        query: "chocolate cake"
        });

    expect(response.statusCode).toBe(200);
    expect(response.statusCode).toBe(200);
    expect(response.body.originalQuery).toBe("chocolate cake");
  });

  test("POST /ai/ai-search should work with uppercase query", async () => {
    const response = await request(app)
      .post("/ai/ai-search")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        query: "Pasta With Tomato"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.originalQuery).toBe("Pasta With Tomato");
    expect(Array.isArray(response.body.recipes)).toBe(true);
  });

  test("POST /ai/ai-search should return matching recipes from DB", async () => {
    await Recipe.create({
        title: "Pasta with Tomato Sauce",
        owner: "507f1f77bcf86cd799439011",
        description: "test recipe",
        ingredients: ["pasta", "tomato"],
        cookTime: 20,
        difficulty: "easy",
        isPublic: true,
    });

    const response = await request(app)
        .post("/ai/ai-search")
        .set("Authorization", `Bearer ${accessToken}`)
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
        isPublic: true,
    });

    await Recipe.create({
        title: "Pasta with Tomato Sauce",
        owner: "507f1f77bcf86cd799439011",
        description: "test recipe 2",
        ingredients: ["pasta", "tomato"],
        cookTime: 20,
        difficulty: "easy",
        isPublic: true,
    });

    const response = await request(app)
        .post("/ai/ai-search")
        .set("Authorization", `Bearer ${accessToken}`)
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
        title: `Pasta with Tomato Recipe ${i}`,
        owner: "507f1f77bcf86cd799439011",
        description: "pasta with tomato",
        ingredients: ["pasta", "tomato"],
        cookTime: 10,
        difficulty: "easy",
        isPublic: true,
        });
    }

    await Recipe.insertMany(recipes);

    const response = await request(app)
        .post("/ai/ai-search")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
        query: "pasta with tomato"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.recipes.length).toBe(10);
    expect(Array.isArray(response.body.sections)).toBe(true);
    expect(response.body.sections[0].type).toBe("recipes");
    expect(response.body.sections[0].items.length).toBe(10);
  });

  test("POST /ai/ai-search should filter recipes by difficulty", async () => {
    await Recipe.create({
        title: "Easy Pasta",
        owner: "507f1f77bcf86cd799439011",
        description: "easy recipe",
        ingredients: ["pasta", "tomato"],
        cookTime: 10,
        difficulty: "easy",
        isPublic: true,
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
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
        query: "pasta tomato easy"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.recipes.length).toBe(1);
    expect(response.body.recipes[0].title).toBe("Easy Pasta");
  });

  test("POST /ai/ai-search should return matching recipe books from DB", async () => {
    await RecipeBook.create({
      name: "Italian Pasta Book",
      owner: "507f1f77bcf86cd799439011",
      description: "A collection of pasta recipes",
      isPublic: true,
      recipes: [],
    });

    const response = await request(app)
      .post("/ai/ai-search")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        query: "Italian Pasta Book",
      });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.recipeBooks)).toBe(true);
    expect(response.body.recipeBooks.length).toBe(1);
    expect(response.body.recipeBooks[0].name).toBe("Italian Pasta Book");
    expect(Array.isArray(response.body.sections)).toBe(true);
    expect(response.body.sections[1].type).toBe("recipeBooks");
    expect(response.body.sections[1].items.length).toBe(1);
  });

  test("POST /ai/ai-search should return recipe books using AI recipeBookName filter", async () => {
    await RecipeBook.create({
      name: "Dessert Book",
      owner: "507f1f77bcf86cd799439011",
      description: "Sweet recipes collection",
      isPublic: true,
      recipes: [],
    });

    const response = await request(app)
      .post("/ai/ai-search")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        query: "dessert book",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.filters.recipeBookName).toBe("dessert book");
    expect(Array.isArray(response.body.recipeBooks)).toBe(true);
    expect(response.body.recipeBooks.length).toBe(1);
    expect(response.body.recipeBooks[0].name).toBe("Dessert Book");
  });

  test("POST /ai/ai-search should detect favorites filter", async () => {
    const response = await request(app)
      .post("/ai/ai-search")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        query: "favorite pasta",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.filters.favorites).toBe(true);
  });

  test("POST /ai/ai-search should return only favorite recipes", async () => {
    const user = await getlogedInUser(app);

    const favoriteRecipe = await Recipe.create({
      title: "Favorite Pasta",
      owner: user._id,
      description: "liked recipe",
      ingredients: ["pasta", "tomato"],
      cookTime: 15,
      difficulty: "easy",
      isPublic: true,
    });

    await Recipe.create({
      title: "Regular Pasta",
      owner: user._id,
      description: "not liked recipe",
      ingredients: ["pasta", "tomato"],
      cookTime: 20,
      difficulty: "easy",
      isPublic: true,
    });

    await Like.create({
      userId: user._id,
      targetType: "recipe",
      targetId: favoriteRecipe._id,
    });

    const response = await request(app)
      .post("/ai/ai-search")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        query: "favorite pasta",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.filters.favorites).toBe(true);
    expect(Array.isArray(response.body.recipes)).toBe(true);
    expect(response.body.recipes.length).toBe(1);
    expect(response.body.recipes[0].title).toBe("Favorite Pasta");
  });

  test("POST /ai/ai-search without favorites keyword should return both favorite and non-favorite recipes", async () => {
    const user = await getlogedInUser(app);

    const favoriteRecipe = await Recipe.create({
      title: "Favorite Pasta",
      owner: user._id,
      description: "pasta recipe",
      ingredients: ["pasta", "tomato"],
      cookTime: 15,
      difficulty: "easy",
      isPublic: true,
    });

    const nonFavoriteRecipe = await Recipe.create({
      title: "Regular Pasta",
      owner: user._id,
      description: "pasta recipe",
      ingredients: ["pasta", "tomato"],
      cookTime: 20,
      difficulty: "easy",
      isPublic: true,
    });

    await Like.create({
      userId: user._id,
      targetType: "recipe",
      targetId: favoriteRecipe._id,
    });

    const response = await request(app)
      .post("/ai/ai-search")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        query: "pasta",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.filters.favorites).toBeUndefined();
    expect(Array.isArray(response.body.recipes)).toBe(true);
    expect(response.body.recipes.length).toBe(2);

    const titles = response.body.recipes.map((recipe: { title: string }) => recipe.title);
    expect(titles).toContain("Favorite Pasta");
    expect(titles).toContain("Regular Pasta");
  });

  test("POST /ai/ai-search should combine favorites with other filters", async () => {
    const user = await getlogedInUser(app);

    const favoriteRecipe = await Recipe.create({
      title: "Easy Favorite Pasta",
      owner: user._id,
      description: "pasta recipe",
      ingredients: ["pasta", "tomato"],
      cookTime: 10,
      difficulty: "easy",
      isPublic: true,
    });

    const nonMatchingFavorite = await Recipe.create({
      title: "Hard Favorite Pasta",
      owner: user._id,
      description: "pasta recipe",
      ingredients: ["pasta", "tomato"],
      cookTime: 30,
      difficulty: "hard",
      isPublic: true,
    });

    await Like.create({
      userId: user._id,
      targetType: "recipe",
      targetId: favoriteRecipe._id,
    });

    await Like.create({
      userId: user._id,
      targetType: "recipe",
      targetId: nonMatchingFavorite._id,
    });

    const response = await request(app)
      .post("/ai/ai-search")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        query: "favorite pasta easy",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.filters.favorites).toBe(true);
    expect(response.body.filters.difficulty).toBe("easy");

    expect(response.body.recipes.length).toBe(1);
    expect(response.body.recipes[0].title).toBe("Easy Favorite Pasta");
  });

  test("POST /ai/ai-search should not return private recipes of other users", async () => {
    const user = await getlogedInUser(app);

    
    const otherUser = await getLoggedInCustomUser(app, {
      email: "other@example.com",
      username: "otherUser",
      password: "testpassword",
    });

    
    await Recipe.create({
      title: "Secret Pasta",
      owner: otherUser._id,
      description: "private recipe",
      ingredients: ["pasta", "tomato"],
      cookTime: 20,
      difficulty: "easy",
      isPublic: false,
    });

    
    await Recipe.create({
      title: "Public Pasta",
      owner: otherUser._id,
      description: "public recipe",
      ingredients: ["pasta", "tomato"],
      cookTime: 15,
      difficulty: "easy",
      isPublic: true,
    });

    const response = await request(app)
      .post("/ai/ai-search")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        query: "pasta",
      });

    expect(response.statusCode).toBe(200);

    const titles = response.body.recipes.map((r: { title: string }) => r.title);

    expect(titles).toContain("Public Pasta");
    expect(titles).not.toContain("Secret Pasta");
  });

  test("POST /ai/ai-search should not return private recipe books of other users", async () => {
    const user = await getlogedInUser(app);

    const otherUser = await getLoggedInCustomUser(app, {
      email: "otherbook@example.com",
      username: "otherbookuser",
      password: "testpassword",
    });

    // private book (should NOT be returned)
    await RecipeBook.create({
      name: "Secret Book",
      owner: otherUser._id,
      description: "private book",
      isPublic: false,
      recipes: [],
    });

    // public book (should be returned)
    await RecipeBook.create({
      name: "Public Book",
      owner: otherUser._id,
      description: "public book",
      isPublic: true,
      recipes: [],
    });

    const response = await request(app)
      .post("/ai/ai-search")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        query: "book",
      });

    expect(response.statusCode).toBe(200);

    const names = response.body.recipeBooks.map((b: { name: string }) => b.name);

    expect(names).toContain("Public Book");
    expect(names).not.toContain("Secret Book");
  });
});