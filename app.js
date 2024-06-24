const express = require("express");
const app = express();
require("dotenv").config();
const connectToDB = require("./config/mongoose-connection");
connectToDB();

app.get("/", function (req, res) {});

app.listen(3000);
