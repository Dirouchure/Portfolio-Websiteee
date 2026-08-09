const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../config/db");

router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { username, password } = req.body;

    try {
      // Find user
      const [users] = await db.query(
        "SELECT * FROM admin WHERE username = ?",
        [username]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Username or password is incorrect",
        });
      }

      const user = users[0];

      // Compare password
      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Username or password is incorrect",
        });
      }

      // Check JWT secret
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          success: false,
          message: "JWT_SECRET is missing in .env",
        });
      }

      // Generate token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
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
      console.error("Login Error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;