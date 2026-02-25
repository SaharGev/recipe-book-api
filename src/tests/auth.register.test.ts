import request from "supertest";
import app from "../app";

describe("POST /auth/register", () => {
  it("should return 400 if missing required fields", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "test@test.com"
      // missing username + password
    });

    expect(res.statusCode).toBe(400);
  });
});