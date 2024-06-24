const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user with the same email exists
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).send("Account already exists");
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create a new user
    user = await userModel.create({
      email,
      password: hash,
      name,
    });

    // Generate JWT token and set it in cookie
    const token = generateToken({ email });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Respond with the created user object
    res.status(201).send(user);
  } catch (err) {
    // Handle any errors
    res.status(500).send(err.message);
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user with the email exists
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    // Generate JWT token and set it in cookie
    const token = generateToken({ email });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Respond with user data or a success message
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    // Handle any errors
    res.status(500).send(err.message);
  }
};

module.exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).send("Logout successful");
};

module.exports.getUserProfile = async (req, res) => {
  try {
    // Extract user information from JWT token (if available)
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Respond with user data
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    // Handle any errors
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    res.status(500).send(err.message);
  }
};
