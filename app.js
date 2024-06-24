const express = require("express");
const app = express();
require("dotenv").config();
const connectToDB = require("./config/mongoose-connection");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
connectToDB(); // connecting to the database

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.get("/", function (req, res) {
  res.send("hey");
});

app.listen(3000);
