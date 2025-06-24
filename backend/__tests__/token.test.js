const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/token");

const jwt = require("jsonwebtoken");

describe("JWT Token", () => {
  const mockUser = {
    id: 4,
    email: "nhan@example.com.au",
  };

  test("Generate a valid access token", () => {
    const token = generateAccessToken(mockUser);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    expect(decoded).toHaveProperty("id", mockUser.id);
    expect(decoded).toHaveProperty("email", mockUser.email);
    expect(decoded).toHaveProperty("exp");
  });

  test("Verify a refresh token correctly", () => {
    const token = generateRefreshToken(mockUser);
    const decoded = verifyRefreshToken(token);
    console.log(decoded);
    expect(decoded).toHaveProperty("id", mockUser.id);
    expect(decoded).toHaveProperty("email", mockUser.email);
  });

  test("Invalid refresh token", () => {
    const invalidToken = "invalid_token";

    expect(() => {
      jwt_refresh_secret(invalidToken);
    }).toThrow();
  });
});
