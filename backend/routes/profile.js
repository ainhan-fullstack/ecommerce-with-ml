const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verifyToken = require("../middleware/auth");

router.get("/profile", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows: userProfile } = await pool.query(
      `Select username, email, about_me from ecommerce.users where id = $1`,
      [userId]
    );

    return res.json(userProfile[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/profile", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const aboutMe = req.body.about;

  try {
    await pool.query(`UPDATE ecommerce.users SET about_me = $1 WHERE id = $2`, [
      aboutMe,
      userId,
    ]);
    res.status(200).json({ message: "Update about me successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
