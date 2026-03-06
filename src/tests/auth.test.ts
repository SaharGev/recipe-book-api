import request from "supertest";
import { Express } from "express";
import User from "../models/userModel";

let app: Express;
let token = "";
let refreshToken = "";
let userEmail = "";
let userPassword = "";


process.env.JWT_EXPIRES_IN = "1";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";

jest.mock("google-auth-library", () => {
  const verifyIdTokenMock = jest.fn();

  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: verifyIdTokenMock,
    })),
    __verifyIdTokenMock: verifyIdTokenMock,
  };
});

const { __verifyIdTokenMock } = jest.requireMock("google-auth-library") as {
  __verifyIdTokenMock: jest.Mock;
};

beforeAll(async () => {
  const { default: initApp } = await import("../app");
  app = await initApp();
  await User.deleteMany({});
});

afterAll((done) => {
  done();
});

describe("Test Auth Suite", () => {
  test("Test Registration missing fields fails", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "a@test.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Username, email and password are required");
  });

  test("Test Registration succeeds", async () => {
    const username = "authUser_" + Date.now();
    const email = `auth_${Date.now()}@test.com`;
    const password = "testpass";

    const response = await request(app).post("/auth/register").send({
      username,
      email,
      password,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");

    const savedUser = await User.findOne({ email });
    expect(savedUser).not.toBeNull();
    expect(savedUser?.refreshTokens?.length).toBe(1);
  });

  test("Test Registration duplicate email fails", async () => {
    const email = `dup_${Date.now()}@test.com`;

    // first registration
    const res1 = await request(app).post("/auth/register").send({
      username: "u1_" + Date.now(),
      email,
      password: "testpass",
    });
    expect(res1.status).toBe(201);

    // second registration with same email
    const res2 = await request(app).post("/auth/register").send({
      username: "u2_" + Date.now(),
      email,
      password: "testpass",
    });

    expect(res2.status).toBe(409);
    expect(res2.body).toHaveProperty("message");
    expect(res2.body.message).toBe("Email already exists");
  });

  test("Test Registration duplicate phone fails", async () => {
    const phone = "050" + Date.now().toString().slice(-7);

    // first registration
    const res1 = await request(app).post("/auth/register").send({
      username: "phoneUser1_" + Date.now(),
      email: `phone1_${Date.now()}@test.com`,
      password: "testpass",
      phone,
    });
    expect(res1.status).toBe(201);

    // second registration with same phone
    const res2 = await request(app).post("/auth/register").send({
      username: "phoneUser2_" + Date.now(),
      email: `phone2_${Date.now()}@test.com`,
      password: "testpass",
      phone,
    });

    expect(res2.status).toBe(409);
    expect(res2.body).toHaveProperty("message");
    expect(res2.body.message).toBe("Phone already exists");
  });

  test("Test Login missing fields fails", async () => {
    const cases = [
      { body: { password: "123456" } }, // missing email/phone
      { body: { email: "a@test.com" } }, // missing password
      { body: { phone: "0500000000" } }, // missing password
    ];

    for (const c of cases) {
      const response = await request(app).post("/auth/login").send(c.body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Email or phone and password are required");
    }
  });

  test("Test Login with invalid credentials fails", async () => {
    // 1) email not found
    const res1 = await request(app).post("/auth/login").send({
      email: "notexist@test.com",
      password: "123456",
    });

    expect(res1.status).toBe(401);
    expect(res1.body).toHaveProperty("message");
    expect(res1.body.message).toBe("Invalid credentials");

    // 2) wrong password for existing user
    const username = "loginUser_" + Date.now();
    const email = `login_${Date.now()}@test.com`;
    const password = "testpass";

    await request(app).post("/auth/register").send({
      username,
      email,
      password,
    });

    const res2 = await request(app).post("/auth/login").send({
      email,
      password: "wrongPassword",
    });

    expect(res2.status).toBe(401);
    expect(res2.body).toHaveProperty("message");
    expect(res2.body.message).toBe("Invalid credentials");
  });

  test("Test Login succeeds", async () => {
    const username = "okUser_" + Date.now();
    userEmail = `ok_${Date.now()}@test.com`;
    userPassword = "testpass";

    // register first
    const regRes = await request(app).post("/auth/register").send({
      username,
      email: userEmail,
      password: userPassword,
    });
    expect(regRes.status).toBe(201);

    // login
    const loginRes = await request(app).post("/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
    expect(loginRes.body).toHaveProperty("refreshToken");

    token = loginRes.body.token;
    refreshToken = loginRes.body.refreshToken;
  });

  test("Test Refresh Token works", async () => {
    const refreshRes = await request(app).post("/auth/refresh").send({
      refreshToken,
    });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body).toHaveProperty("token");
    expect(refreshRes.body).toHaveProperty("refreshToken");

    // refresh token should rotate (change)
    expect(refreshRes.body.refreshToken).not.toBe(refreshToken);

    token = refreshRes.body.token;
    refreshToken = refreshRes.body.refreshToken;
  });

  test("Test double use of refresh token fails", async () => {
    // first use - should succeed
    const firstRes = await request(app).post("/auth/refresh").send({
      refreshToken,
    });

    expect(firstRes.status).toBe(200);
    expect(firstRes.body).toHaveProperty("refreshToken");

    const newRefreshToken = firstRes.body.refreshToken;

    // second use of the OLD refresh token - should fail
    const secondRes = await request(app).post("/auth/refresh").send({
      refreshToken,
    });

    expect(secondRes.status).toBe(401);

    // try to use the NEW refresh token - should also fail (because list is cleared)
    const thirdRes = await request(app).post("/auth/refresh").send({
      refreshToken: newRefreshToken,
    });

    expect(thirdRes.status).toBe(401);
  });

  test("Test Logout without refresh token fails", async () => {
    const response = await request(app).post("/auth/logout").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Refresh token is required");
  });

  test("Test Logout invalidates refresh token", async () => {
    const username = "logoutUser_" + Date.now();
    const email = `logout_${Date.now()}@test.com`;

    // register to get refresh token
    const regRes = await request(app).post("/auth/register").send({
      username,
      email,
      password: "testpass",
    });

    expect(regRes.status).toBe(201);
    const rt = regRes.body.refreshToken;
    expect(rt).toBeTruthy();

    // logout
    const logoutRes = await request(app).post("/auth/logout").send({
      refreshToken: rt,
    });

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body).toHaveProperty("message");

    // try to refresh with the same refresh token - should fail
    const refreshRes = await request(app).post("/auth/refresh").send({
      refreshToken: rt,
    });

    expect(refreshRes.status).toBe(401);
  });

  test("Test access token expiration fails", async () => {
    const username = "expUser_" + Date.now();
    const email = `exp_${Date.now()}@test.com`;

    const regRes = await request(app).post("/auth/register").send({
      username,
      email,
      password: "testpass",
    });

    expect(regRes.status).toBe(201);
    const token = regRes.body.token;

    // wait 2 seconds (token expires after 1)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const res = await request(app)
      .get("/recipes")
      .set("Authorization", "Bearer " + token);

    expect(res.status).toBe(401);
  });

  test("Test access to protected route without token fails", async () => {
    const res = await request(app).get("/recipes");
    expect(res.status).toBe(401);
  });

  test("Test Registration duplicate username fails", async () => {
    const username = "dupUser_" + Date.now();

    // first registration
    const res1 = await request(app).post("/auth/register").send({
      username,
      email: `u1_${Date.now()}@test.com`,
      password: "testpass",
    });
    expect(res1.status).toBe(201);

    // second registration with same username
    const res2 = await request(app).post("/auth/register").send({
      username,
      email: `u2_${Date.now()}@test.com`,
      password: "testpass",
    });

    expect(res2.status).toBe(409);
    expect(res2.body).toHaveProperty("message");
    expect(res2.body.message).toBe("Username already exists");
  });
});

describe("Google Auth", () => {
  test("POST /auth/google missing idToken should return 400", async () => {
    const res = await request(app).post("/auth/google").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /auth/google invalid token should return 401", async () => {
    __verifyIdTokenMock.mockRejectedValueOnce(new Error("invalid token"));

    const res = await request(app).post("/auth/google").send({
      idToken: "fake_token",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /auth/google should create user and return tokens", async () => {
    __verifyIdTokenMock.mockResolvedValueOnce({
      getPayload: () => ({
        sub: "google-user-123",
        email: "google@test.com",
        name: "Google User",
        picture: "http://image.test/profile.png",
      }),
    });

    const res = await request(app).post("/auth/google").send({
      idToken: "valid_google_token",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");
  });

  test("POST /auth/google existing user should login", async () => {
    __verifyIdTokenMock.mockResolvedValueOnce({
      getPayload: () => ({
        sub: "google-user-123",
        email: "google@test.com",
        name: "Google User",
        picture: "http://image.test/profile.png",
      }),
    });

    const firstLogin = await request(app).post("/auth/google").send({
      idToken: "valid_google_token",
    });

    expect(firstLogin.status).toBe(200);

    // login again with same google user
    __verifyIdTokenMock.mockResolvedValueOnce({
      getPayload: () => ({
        sub: "google-user-123",
        email: "google@test.com",
        name: "Google User",
        picture: "http://image.test/profile.png",
      }),
    });

    const secondLogin = await request(app).post("/auth/google").send({
      idToken: "valid_google_token",
    });

    expect(secondLogin.status).toBe(200);
    expect(secondLogin.body).toHaveProperty("_id");
    expect(secondLogin.body).toHaveProperty("token");
  });

  test("POST /auth/google should fail if payload missing email", async () => {
    __verifyIdTokenMock.mockResolvedValueOnce({
      getPayload: () => ({
        sub: "google-user-123",
        email: undefined,
        name: "Google User",
      }),
    });

    const res = await request(app).post("/auth/google").send({
      idToken: "valid_google_token",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /auth/google should attach googleId to existing email user", async () => {
    // create user via regular register
    const email = `local_${Date.now()}@test.com`;
    const password = "testpassword";
    const username = `localuser_${Date.now()}`;

    const regRes = await request(app).post("/auth/register").send({
      username,
      email,
      password,
    });
    expect(regRes.status).toBe(201);
    const existingUserId = regRes.body._id;

    // google login with SAME email but new googleId
    __verifyIdTokenMock.mockResolvedValueOnce({
      getPayload: () => ({
        sub: "google-attached-999",
        email,
        name: "Attached User",
        picture: "http://image.test/p.png",
      }),
    });

    const googleRes = await request(app).post("/auth/google").send({
      idToken: "valid_google_token",
    });

    expect(googleRes.status).toBe(200);
    expect(googleRes.body).toHaveProperty("_id");
    expect(googleRes.body._id).toBe(existingUserId);
    expect(googleRes.body).toHaveProperty("token");
    expect(googleRes.body).toHaveProperty("refreshToken");
  });
});