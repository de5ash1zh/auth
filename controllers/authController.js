const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");

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
};

module.exports.loginUser = function (req, res) {};

module.exports.logoutUser = function (req, res) {};

module.exports.getUserProfile = function (req, res) {};
