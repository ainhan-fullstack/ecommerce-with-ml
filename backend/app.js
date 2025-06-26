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
const paymentRoutes = require("./routes/payment");
const productRoutes = require("./routes/products");

app.get("/", (req, res) => res.send("Homepage!"));
app.use("/api", paymentRoutes);
app.use("/api", authRoutes);
app.use("/api", productRoutes);

module.exports = app;
