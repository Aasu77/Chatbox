const express = require("express");
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  verifyEmail,
} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);
router.post("/verify-email", verifyEmail);

module.exports = router;
