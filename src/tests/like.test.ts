import request from "supertest";
import initApp from "../app";
import { Express } from "express";
import { getlogedInUser, createRandomObjectId } from "./utils";

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

  test("POST /likes with token should create like", async () => {
    // register user to get token
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    const res = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user.token)
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
      .set("Authorization", "Bearer " + user.token)
      .send({
        targetType: "recipe",
        targetId,
      });

    expect(res1.status).toBe(201);
    expect(res1.body.action).toBe("liked");

    // second like (toggle -> unlike)
    const res2 = await request(app)
      .post("/likes")
      .set("Authorization", "Bearer " + user.token)
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
      .set("Authorization", "Bearer " + user.token)
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
      .set("Authorization", "Bearer " + user.token)
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
      .set("Authorization", "Bearer " + user.token)
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
      .set("Authorization", "Bearer " + user.token)
      .send({
        targetType: "recipe",
        // missing targetId
      });

    expect(res.status).toBe(400);
  });
});