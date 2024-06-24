const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (user) {
    return res.status(400).send("account already exists");
  }

  let salt = bcrypt.genSalt(10);
  let hash = bcrypt.hash(password, salt);
  user = await userModel.create({
    email,
    password: hash,
    name,
  });
  let token = generateToken({ email });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(201).send(user);
};

module.exports.loginUser = function (req, res) {};

module.exports.logoutUser = function (req, res) {};

module.exports.getUserProfile = function (req, res) {};
