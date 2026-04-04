import request from "supertest";
import initApp from "../app";
import { Express } from "express";
import { getlogedInUser, getLoggedInCustomUser, createRandomObjectId } from "./utils";

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll((done) => {
  done();
});

describe("Likes API", () => {

  test("POST /likes without token should fail", async () => {
    const res = await request(app)
      .post("/likes")
      .send({
        targetType: "recipe",
        targetId: "507f1f77bcf86cd799439011",
      });

    expect(res.status).toBe(401);
  });

  test("GET /likes without token should fail", async () => {
    const res = await request(app).get("/likes");

    expect(res.status).toBe(401);
  });

  test("GET /likes with token should return user likes", async () => {
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    const likeRes = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({
        targetType: "recipe",
        targetId,
      });

    expect(likeRes.status).toBe(201);

    const getRes = await request(app)
      .get("/likes")
      .set("Authorization", "Bearer " + user.accessToken);

    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    expect(
      getRes.body.some(
        (like: any) =>
          like.targetType === "recipe" && like.targetId.toString() === targetId
      )
    ).toBe(true);
  });

  test("GET /likes should return only likes of the logged-in user", async () => {
    const user1 = await getlogedInUser(app);
    const user2 = await getLoggedInCustomUser(app, {
      email: `likes_${Date.now()}@test.com`,
      username: `likes_user_${Date.now()}`,
      password: "testpassword",
    });

    const targetId1 = createRandomObjectId();
    const targetId2 = createRandomObjectId();

    const likeRes1 = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user1.accessToken)
      .send({
        targetType: "recipe",
        targetId: targetId1,
      });

    expect(likeRes1.status).toBe(201);

    const likeRes2 = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user2.accessToken)
      .send({
        targetType: "recipe",
        targetId: targetId2,
      });

    expect(likeRes2.status).toBe(201);

    const getRes = await request(app)
      .get("/likes")
      .set("Authorization", "Bearer " + user1.accessToken);

    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);

    expect(
      getRes.body.some((like: any) => like.targetId.toString() === targetId1)
    ).toBe(true);

    expect(
      getRes.body.some((like: any) => like.targetId.toString() === targetId2)
    ).toBe(false);
  });

  test("POST /likes with token should create like", async () => {
    // register user to get token
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    const res = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({
        targetType: "recipe",
        targetId,
      });

    expect(res.status).toBe(201);
    expect(res.body.action).toBe("liked");
  });

  test("POST /likes should toggle unlike when like already exists", async () => {
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    // first like
    const res1 = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({
        targetType: "recipe",
        targetId,
      });

    expect(res1.status).toBe(201);
    expect(res1.body.action).toBe("liked");

    // second like (toggle -> unlike)
    const res2 = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({
        targetType: "recipe",
        targetId,
      });

    expect(res2.status).toBe(200);
    expect(res2.body.action).toBe("unliked");
  });

  test("POST /likes with invalid targetType should fail", async () => {
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    const res = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({
        targetType: "invalidType",
        targetId,
      });

    expect(res.status).toBe(400);
  });

  test("POST /likes should work for recipe book", async () => {
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    const res = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({
        targetType: "book",
        targetId,
      });

    expect(res.status).toBe(201);
    expect(res.body.action).toBe("liked");
  });

  test("POST /likes with invalid targetId should fail", async () => {
    const user = await getlogedInUser(app);

    const res = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({
        targetType: "recipe",
        targetId: "not-an-objectid",
      });

    expect(res.status).toBe(400);
  });

  test("POST /likes missing fields should fail", async () => {
    const user = await getlogedInUser(app);

    const res = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({
        targetType: "recipe",
        // missing targetId
      });

    expect(res.status).toBe(400);
  });
});