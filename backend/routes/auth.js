const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../config/db");
const verifyToken = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimit");
const { sendError } = require("../utils/errors");

router.post(
  "/login",
  loginLimiter,
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(e => e.msg).join(', '),
        errors: errors.array(),
      });
    }

    const { username, password } = req.body;

    try {
      const [users] = await db.query(
        "SELECT * FROM admin WHERE username = ?",
        [username]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      const user = users[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is missing!');
        return res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      return sendError(res, 500, "Server error", error);
    }
  }
);

router.post(
  "/change-password",
  verifyToken,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array().map(e => e.msg).join(', '),
      });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      const [users] = await db.query("SELECT * FROM admin WHERE id = ?", [req.userId]);

      if (users.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = users[0];
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query("UPDATE admin SET password = ? WHERE id = ?", [hashedPassword, req.userId]);

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      sendError(res, 500, "Server error", error);
    }
  }
);

module.exports = router;
