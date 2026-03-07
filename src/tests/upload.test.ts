import request from "supertest";
import { Express } from "express";
import fs from "fs";
import path from "path";
import User from "../models/userModel";
import { getlogedInUser } from "./utils";

let app: Express;

beforeAll(async () => {
  const { default: initApp } = await import("../app");
  app = await initApp();
  await User.deleteMany({});
});

afterAll((done) => done());

describe("Image Upload", () => {
  test("POST /upload/image - upload image succeeds", async () => {
    const user = await getlogedInUser(app);

    // create a tiny fake png file for the test
    const tmpDir = path.join(__dirname, "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const filePath = path.join(tmpDir, "test.png");
    fs.writeFileSync(
      filePath,
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    );

    const res = await request(app)
      .post("/upload/image")
      .set("Authorization", "Bearer " + user.token)
      .attach("image", filePath);

    expect(res.status).toBe(201);
    expect(res.body.url).toBeDefined();
    expect(typeof res.body.url).toBe("string");
    expect(res.body.url.length).toBeGreaterThan(0);
  });

  test("POST /upload/image fails without authentication", async () => {
    const response = await request(app)
      .post("/upload/image");

    expect(response.status).toBe(401);
  });

  test("POST /upload/image fails when no file is provided", async () => {
    const user = await getlogedInUser(app);

    const response = await request(app)
      .post("/upload/image")
      .set("Authorization", "Bearer " + user.token);

    expect(response.status).toBe(400);
  });

  test("POST /upload/image returns image url in uploads folder", async () => {
    const user = await getlogedInUser(app);

    const tmpDir = path.join(__dirname, "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const filePath = path.join(tmpDir, "test2.png");
    fs.writeFileSync(
      filePath,
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    );

    const response = await request(app)
      .post("/upload/image")
      .set("Authorization", "Bearer " + user.token)
      .attach("image", filePath);

    expect(response.status).toBe(201);
    expect(response.body.url).toContain("/uploads/");
  });
});