const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const jwt_secret = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied." });

  try {
    const decoded = jwt.verify(token, jwt_secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Access denied" });
  }
}

module.exports = verifyToken;
