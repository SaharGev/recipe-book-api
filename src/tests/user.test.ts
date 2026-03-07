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
      .set("Authorization", "Bearer " + user.token)
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
        .set("Authorization", "Bearer " + user.token);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(user._id);
    expect(response.body.email).toBe(user.email);
    expect(response.body.username).toBe(user.username);
  });

  test("PATCH /users/me - update user details succeeds", async () => {
    const user = await getlogedInUser(app);

    const response = await request(app)
        .patch("/users/me")
        .set("Authorization", "Bearer " + user.token)
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
        .set("Authorization", "Bearer " + user.token)
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
        .set("Authorization", "Bearer " + user1.token)
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
        .set("Authorization", "Bearer " + user1.token)
        .send({
        phone: "0509999999",
        });

    expect(response.status).toBe(409);
  });
});