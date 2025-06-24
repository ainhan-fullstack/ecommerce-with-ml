const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const app = express();
const paymentRoutes = require("./routes/payment");

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => res.send("Homepage!"));
app.use("/api", paymentRoutes);
app.use("/api", authRoutes);

module.exports = app;
