const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const profileRoutes = require("./routes/profile");

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", profileRoutes);

module.exports = app;
