const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
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

router.post("/profile/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const { rows } = await pool.query(
      `Select password_hash from ecommerce.users where id = $1`,
      [userId]
    );

    const match = await bcrypt.compare(oldPassword, rows[0].password_hash);

    if (!match)
      return res
        .status(401)
        .json({ message: "Current password is not correct." });

    const saltRound = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRound);

    await pool.query(
      "UPDATE ecommerce.users SET password_hash = $1 WHERE id = $2",
      [newPasswordHash, userId]
    );

    res.status(200).json({ message: "Update password successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
