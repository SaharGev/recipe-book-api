import User from "../models/userModel";

describe("User Model", () => {
  test("User without required fields should fail validation", async () => {
    const user = new User({});
    const err = user.validateSync();

    expect(err).toBeDefined();
    expect(err?.errors?.username).toBeDefined();
    expect(err?.errors?.email).toBeDefined();
  });

  test("User with username and email should pass validation", () => {
    const user = new User({
        username: "testUser",
        email: "test@test.com",
    });

    const err = user.validateSync();
    expect(err).toBeUndefined();
    });

  test("User can have profileImageUrl", () => {
    const user = new User({
      username: "testUser",
      email: "test@test.com",
      profileImageUrl: "/uploads/test.png"
    });

    const err = user.validateSync();
    expect(err).toBeUndefined();
    expect(user.profileImageUrl).toBe("/uploads/test.png");
  });
});