const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { validateSignup, validateLogin } = require("../middleware/validation");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/token");

require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const router = express.Router();

router.post("/signup", validateSignup, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const emailCheck = await pool.query(
      "Select * From ecommerce.users Where email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0)
      return res.status(400).json({ message: "Email already registered." });

    const userCheck = await pool.query(
      "Select * From ecommerce.users where username = $1",
      [username]
    );

    if (userCheck.rows.length > 0)
      return res.status(400).json({ message: "Username already taken" });

    const saltRound = 10;
    const password_hash = await bcrypt.hash(password, saltRound);

    const result = await pool.query(
      "Insert into ecommerce.users (username, email, password_hash) Values ($1, $2, $3) Returning id, username, email",
      [username, email, password_hash]
    );

    const user = result.rows[0];

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ token: accessToken, user });
  } catch (error) {
    console.error("Signup Error", error);
    res.status(500).json({ message: "Server Error." });
  }
});

router.post("/login", validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "Select * From ecommerce.users where email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "Invalid credential." });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: "Invalid credential" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        token: accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (error) {
    console.error("Login Error", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully." });
});

router.post("/refresh-token", (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "Refresh token missing" });

  try {
    const payload = verifyRefreshToken(token);
    const user = { id: payload.id, email: payload.email };
    const newAccessToken = generateAccessToken(user);
    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

module.exports = router;
