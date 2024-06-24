const express = require("express");
const router = express.Router();
const {
  resgisterUser,
  loginUser,
  logoutUser,
  getUserProfile,
} = require("../controllers/authController");

router.post("/register", resgisterUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", getUserProfile);

module.exports = router;
