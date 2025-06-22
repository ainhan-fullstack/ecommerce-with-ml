const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const route = express.Router();

const jwt_secret = process.env.JWT_SECRET;

route.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const check = await pool.query(
      "Select * From ecommerce.users Where email = $1",
      [email]
    );

    if (check.rows.length > 0)
      return res.status(400).json({ message: "Email already registered." });

    const saltRound = 10;
    const password_hash = await bcrypt.hash(password, saltRound);

    const result = await pool.query(
      "Insert into ecommerce.users (username, email, password_hash) Values ($1, $2, $3) Returning id, username, email",
      [username, email, password_hash]
    );

    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, email: user.email }, jwt_secret, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Signup Error", error);
    res.status(500).json({ message: "Server Error." });
  }
});

route.post("/login", async (req, res) => {
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

    const token = jwt.sign({ id: user.id, email: user.email }, jwt_secret, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
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

module.exports = route;
