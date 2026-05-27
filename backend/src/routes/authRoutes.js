const express = require("express");
const router = express.Router();
const { authUser, registerUser, forgotPassword, resetPassword } = require("../controllers/authController");

router.post("/login", authUser);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

module.exports = router;
