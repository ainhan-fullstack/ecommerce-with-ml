function validateSignup(req, res, next) {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res
      .status(400)
      .json({ message: "Username, email and password are required." });

  if (typeof username !== "string" || username.trim() === "")
    return res.status(400).json({ message: "Username is required." });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email))
    return res.status(400).json({ message: "Invalid email format." });

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!passwordRegex.test(password))
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include an uppercase letter, number and special character",
    });

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email))
    return res.status(400).json({ message: "Invalid email format." });

  next();
}

module.exports = { validateSignup, validateLogin };
