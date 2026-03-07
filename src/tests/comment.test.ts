// src/tests/comment.test.ts
import request from "supertest";
import initApp from "../app";
import { Express } from "express";
import mongoose from "mongoose";
import { getlogedInUser, createRandomObjectId, getLoggedInCustomUser } from "./utils";

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll((done) => {
  done();
});

describe("Comments", () => {
  test("POST /comments without token should fail", async () => {
    const res = await request(app).post("/comments").send({
      targetType: "recipe",
      targetId: "507f1f77bcf86cd799439011",
      content: "Nice!",
    });

    expect(res.status).toBe(401);
  });

  test("POST /comments with token should create comment (201)", async () => {
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    const res = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + user.token)
        .send({
        targetType: "recipe",
        targetId,
        content: "Nice recipe!",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });

  test("POST /comments with invalid targetType should fail", async () => {
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    const res = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + user.token)
        .send({
        targetType: "invalid",
        targetId,
        content: "Nice recipe!",
    });

    expect(res.status).toBe(400);
  });

  test("POST /comments with invalid targetId should fail", async () => {
    const user = await getlogedInUser(app);

    const res = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + user.token)
        .send({
        targetType: "recipe",
        targetId: "not-an-object-id",
        content: "Nice recipe!",
        });

    expect(res.status).toBe(400);
  });

  test("POST /comments missing content should fail", async () => {
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    const res = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + user.token)
        .send({
        targetType: "recipe",
        targetId
        // content missing
        });

    expect(res.status).toBe(400);
  });

  test("PUT /comments/:id should update comment content", async () => {
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    // create comment first
    const createRes = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + user.token)
        .send({
        targetType: "recipe",
        targetId,
        content: "Original comment",
        });

    expect(createRes.status).toBe(201);
    const commentId = createRes.body._id;

    // update comment
    const updateRes = await request(app)
        .put("/comments/" + commentId)
        .set("Authorization", "Bearer " + user.token)
        .send({
        content: "Updated comment",
        });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toHaveProperty("_id");
    expect(updateRes.body.content).toBe("Updated comment");
  });

  test("DELETE /comments/:id should delete my comment", async () => {
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    // create comment
    const createRes = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + user.token)
        .send({
        targetType: "recipe",
        targetId,
        content: "comment to delete",
        });

    expect(createRes.status).toBe(201);
    const commentId = createRes.body._id;

    // delete comment
    const delRes = await request(app)
        .delete("/comments/" + commentId)
        .set("Authorization", "Bearer " + user.token);

    expect(delRes.status).toBe(200);
    expect(delRes.body.message).toBe("Deleted");
  });

  test("GET /comments should return comments by target", async () => {
    const user = await getlogedInUser(app);
    const targetId = createRandomObjectId();

    // create 2 comments on same target
    const c1 = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + user.token)
        .send({ targetType: "recipe", targetId, content: "first" });
    expect(c1.status).toBe(201);

    const c2 = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + user.token)
        .send({ targetType: "recipe", targetId, content: "second" });
    expect(c2.status).toBe(201);

    // get by target
    const res = await request(app).get(
        `/comments?targetType=recipe&targetId=${targetId}`
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test("PUT /comments/:id should fail if comment belongs to another user", async () => {
    const user1 = await getlogedInUser(app);
    const user2 = await getLoggedInCustomUser(app, {
        email: "other@test.com",
        username: "otheruser",
        password: "testpassword",
    });

    const targetId = createRandomObjectId();

    // user1 creates comment
    const createRes = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + user1.token)
        .send({
        targetType: "recipe",
        targetId,
        content: "user1 comment",
        });

    const commentId = createRes.body._id;

    // user2 tries to update
    const updateRes = await request(app)
        .put("/comments/" + commentId)
        .set("Authorization", "Bearer " + user2.token)
        .send({
        content: "hacked comment",
        });

    expect(updateRes.status).toBe(404);
  });

  test("DELETE /comments/:id should fail if comment belongs to another user", async () => {
    const user1 = await getLoggedInCustomUser(app, {
        email: "delete-owner@test.com",
        username: "deleteOwnerUser",
        password: "testpassword",
    });

    const user2 = await getLoggedInCustomUser(app, {
        email: "delete-other@test.com",
        username: "deleteOtherUser",
        password: "testpassword",
    });

    const targetId = createRandomObjectId();

    const createRes = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + user1.token)
        .send({
        targetType: "recipe",
        targetId,
        content: "to protect",
        });

    expect(createRes.status).toBe(201);
    expect(createRes.body._id).toBeDefined();

    const commentId = createRes.body._id;

    const delRes = await request(app)
        .delete("/comments/" + commentId)
        .set("Authorization", "Bearer " + user2.token);

    expect(delRes.status).toBe(404);
  });
});