const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const jwt_secret = process.env.JWT_SECRET;
const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, jwt_secret, {
    expiresIn: "15m",
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, jwt_refresh_secret, {
    expiresIn: "7d",
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, jwt_refresh_secret);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
