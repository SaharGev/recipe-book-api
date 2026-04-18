import request from "supertest";
import { Express } from "express";
import initApp from "../app";
import User from "../models/userModel";
import { getlogedInUser, getLoggedInCustomUser } from "./utils";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany({});
});

afterAll((done) => {
  done();
});

describe("User API", () => {
  test("PATCH /users/profile-image - update profile image succeeds", async () => {
    const user = await getlogedInUser(app);

    const imageUrl = "/uploads/test-profile.png";

    const response = await request(app)
      .patch("/users/profile-image")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({ profileImageUrl: imageUrl });

    expect(response.status).toBe(200);
    expect(response.body.profileImageUrl).toBe(imageUrl);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser?.profileImageUrl).toBe(imageUrl);
  });

  test("GET /users/me - get current user succeeds", async () => {
    const user = await getlogedInUser(app);

    const response = await request(app)
        .get("/users/me")
        .set("Authorization", "Bearer " + user.accessToken);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(user._id);
    expect(response.body.email).toBe(user.email);
    expect(response.body.username).toBe(user.username);
  });

  test("PATCH /users/me - update user details succeeds", async () => {
    const user = await getlogedInUser(app);

    const response = await request(app)
        .patch("/users/me")
        .set("Authorization", "Bearer " + user.accessToken)
        .send({
        username: "updatedUserName",
        phone: "0501234567",
        });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("updatedUserName");
    expect(response.body.phone).toBe("0501234567");
    expect(response.body.email).toBe(user.email);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser?.username).toBe("updatedUserName");
    expect(updatedUser?.phone).toBe("0501234567");
  });

  test("GET /users/me fails without token", async () => {
    const response = await request(app).get("/users/me");

    expect(response.status).toBe(401);
  });

  test("PATCH /users/me fails when no fields are provided", async () => {
    const user = await getlogedInUser(app);

    const response = await request(app)
        .patch("/users/me")
        .set("Authorization", "Bearer " + user.accessToken)
        .send({});

    expect(response.status).toBe(400);
  });

  test("PATCH /users/me fails without token", async () => {
    const response = await request(app)
        .patch("/users/me")
        .send({
        username: "newName",
        });

    expect(response.status).toBe(401);
  });

  test("PATCH /users/me fails when username already exists", async () => {
    const user1 = await getlogedInUser(app);

    const user2 = await getLoggedInCustomUser(app, {
        email: "another@test.com",
        username: "anotherUser",
        password: "testpassword",
    });

    const response = await request(app)
        .patch("/users/me")
        .set("Authorization", "Bearer " + user1.accessToken)
        .send({
        username: user2.username,
        });

    expect(response.status).toBe(409);
  });

  test("PATCH /users/me fails when phone already exists", async () => {
    const user1 = await getlogedInUser(app);

    await getLoggedInCustomUser(app, {
        email: "phoneuser@test.com",
        username: "phoneUser",
        password: "testpassword",
        phone: "0509999999",
    });

    const response = await request(app)
        .patch("/users/me")
        .set("Authorization", "Bearer " + user1.accessToken)
        .send({
        phone: "0509999999",
        });

    expect(response.status).toBe(409);
  });

  test("GET /users/me/recently-viewed returns recipes and books", async () => {
    const user = await getlogedInUser(app);

    const recipeResp = await request(app)
      .post("/recipes")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({
        title: "User Recently Recipe",
        ingredients: ["egg"],
        cookTime: 5,
        difficulty: "easy",
      });

    expect(recipeResp.status).toBe(201);
    const recipeId = recipeResp.body._id;

    const bookResp = await request(app)
      .post("/recipe-books")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({
        name: "User Recently Book",
        description: "test",
        isPublic: true,
      });

    expect(bookResp.status).toBe(201);
    const bookId = bookResp.body._id;

    await request(app)
      .get(`/recipes/${recipeId}`)
      .set("Authorization", "Bearer " + user.accessToken);

    await request(app)
      .get(`/recipe-books/${bookId}`)
      .set("Authorization", "Bearer " + user.accessToken);

    const response = await request(app)
      .get("/users/me/recently-viewed")
      .set("Authorization", "Bearer " + user.accessToken);

    expect(response.status).toBe(200);

    expect(response.body.recentlyViewedRecipes.length).toBeGreaterThan(0);
    expect(response.body.recentlyViewedBooks.length).toBeGreaterThan(0);

    expect(response.body.recentlyViewedRecipes[0]._id).toBe(recipeId);
    expect(response.body.recentlyViewedBooks[0]._id).toBe(bookId);
  });

  test("POST /users/friends - add friend succeeds", async () => {
    const user1 = await getlogedInUser(app);
    const user2 = await getLoggedInCustomUser(app, {
      email: "friend1@test.com",
      username: "friendUser1",
      password: "testpassword",
    });

    const response = await request(app)
      .post("/users/friends")
      .set("Authorization", "Bearer " + user1.accessToken)
      .send({ identifier: user2.email });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("friend");
    expect(response.body.friend.email).toBe(user2.email);
  });

  test("POST /users/friends - add friend by username succeeds", async () => {
    const user1 = await getlogedInUser(app);
    const user2 = await getLoggedInCustomUser(app, {
      email: "friend2@test.com",
      username: "friendUser2",
      password: "testpassword",
    });

    const response = await request(app)
      .post("/users/friends")
      .set("Authorization", "Bearer " + user1.accessToken)
      .send({ identifier: user2.username });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("friend");
  });

  test("POST /users/friends - cannot add yourself", async () => {
    const user = await getlogedInUser(app);

    const response = await request(app)
      .post("/users/friends")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({ identifier: user.email });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Cannot add yourself");
  });

  test("POST /users/friends - cannot add same friend twice", async () => {
    const user1 = await getlogedInUser(app);
    const user2 = await getLoggedInCustomUser(app, {
      email: "friend3@test.com",
      username: "friendUser3",
      password: "testpassword",
    });

    await request(app)
      .post("/users/friends")
      .set("Authorization", "Bearer " + user1.accessToken)
      .send({ identifier: user2.email });

    const response = await request(app)
      .post("/users/friends")
      .set("Authorization", "Bearer " + user1.accessToken)
      .send({ identifier: user2.email });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Already friends");
  });

  test("GET /users/friends - get friends list succeeds", async () => {
    const user1 = await getlogedInUser(app);
    const user2 = await getLoggedInCustomUser(app, {
      email: "friend4@test.com",
      username: "friendUser4",
      password: "testpassword",
    });

    await request(app)
      .post("/users/friends")
      .set("Authorization", "Bearer " + user1.accessToken)
      .send({ identifier: user2.email });

    const response = await request(app)
      .get("/users/friends")
      .set("Authorization", "Bearer " + user1.accessToken);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("friends");
    expect(response.body.friends.length).toBeGreaterThan(0);
  });

  test("DELETE /users/friends/:friendId - remove friend succeeds", async () => {
    const user1 = await getlogedInUser(app);
    const user2 = await getLoggedInCustomUser(app, {
      email: "friend5@test.com",
      username: "friendUser5",
      password: "testpassword",
    });

    await request(app)
      .post("/users/friends")
      .set("Authorization", "Bearer " + user1.accessToken)
      .send({ identifier: user2.email });

    const response = await request(app)
      .delete(`/users/friends/${user2._id}`)
      .set("Authorization", "Bearer " + user1.accessToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Friend removed successfully");
  });

  test("POST /users/friends - add non-existent user fails", async () => {
    const user = await getlogedInUser(app);

    const response = await request(app)
      .post("/users/friends")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({ identifier: "nonexistent@test.com" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("GET /users/search - search users by username succeeds", async () => {
    const user = await getlogedInUser(app);
    await getLoggedInCustomUser(app, {
      email: "searchable@test.com",
      username: "searchableUser",
      password: "testpassword",
    });

    const response = await request(app)
      .get("/users/search?query=searchable")
      .set("Authorization", "Bearer " + user.accessToken);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
    expect(response.body.users.length).toBeGreaterThan(0);
    expect(response.body.users[0].username).toBe("searchableUser");
  });

  test("GET /users/search - does not return current user", async () => {
    const user = await getlogedInUser(app);

    const response = await request(app)
      .get(`/users/search?query=${user.username}`)
      .set("Authorization", "Bearer " + user.accessToken);

    expect(response.status).toBe(200);
    const ids = response.body.users.map((u: any) => u._id);
    expect(ids).not.toContain(user._id);
  });

  test("GET /users/search - missing query returns 400", async () => {
    const user = await getlogedInUser(app);

    const response = await request(app)
      .get("/users/search")
      .set("Authorization", "Bearer " + user.accessToken);

    expect(response.status).toBe(400);
  });

  test("GET /users/search - without token returns 401", async () => {
    const response = await request(app)
      .get("/users/search?query=test");

    expect(response.status).toBe(401);
  });

  test("GET /users/search - partial email does not return results", async () => {
    const user = await getlogedInUser(app);
    await getLoggedInCustomUser(app, {
      email: "partialtest@test.com",
      username: "xyzUser",
      password: "testpassword",
    });

    const response = await request(app)
      .get("/users/search?query=partial")
      .set("Authorization", "Bearer " + user.accessToken);

    expect(response.status).toBe(200);
    const emails = response.body.users.map((u: any) => u.email);
    expect(emails).not.toContain("partialtest@test.com");
  });

  test("GET /users/search - full email returns correct user", async () => {
    const user = await getlogedInUser(app);
    await getLoggedInCustomUser(app, {
      email: "fullmatch@test.com",
      username: "fullMatchUser",
      password: "testpassword",
    });

    const response = await request(app)
      .get("/users/search?query=fullmatch@test.com")
      .set("Authorization", "Bearer " + user.accessToken);

    expect(response.status).toBe(200);
    expect(response.body.users.length).toBe(1);
    expect(response.body.users[0].username).toBe("fullMatchUser");
  });

  test("GET /users/friends - supports pagination", async () => {
    await User.updateMany({}, { $set: { friends: [] } });
    const user1 = await getlogedInUser(app);

    // add 8 friends
    for (let i = 0; i < 8; i++) {
      const friend = await getLoggedInCustomUser(app, {
        email: `pagfriend${i}@test.com`,
        username: `pagFriend${i}`,
        password: "testpassword",
      });
      await request(app)
        .post("/users/friends")
        .set("Authorization", "Bearer " + user1.accessToken)
        .send({ identifier: friend.email });
    }

    // page 1 - should return 5
    const page1 = await request(app)
      .get("/users/friends?page=1&limit=5")
      .set("Authorization", "Bearer " + user1.accessToken);

    expect(page1.status).toBe(200);
    expect(page1.body.friends.length).toBe(5);
    expect(page1.body.hasMore).toBe(true);

    // page 2 - should return remaining
    const page2 = await request(app)
      .get("/users/friends?page=2&limit=5")
      .set("Authorization", "Bearer " + user1.accessToken);

    expect(page2.status).toBe(200);
    expect(page2.body.friends.length).toBeGreaterThan(0);
    expect(page2.body.hasMore).toBe(false);
  });
});