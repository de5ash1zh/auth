const jwt = require("jsonwebtoken");

const generateToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.JWT_SECRET);
    return token;
  } catch (err) {
    console.error("JWT token generation error:", err);
    throw err; // Throw the error to handle it upstream
  }
};

module.exports = generateToken;
