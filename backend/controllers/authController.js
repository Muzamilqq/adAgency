const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });
};

// Auth Controller
const authController = {
  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(
        password,
        user.password_hash,
      );

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // Update last login
      await User.updateLastLogin(user.id);

      // Generate token
      const token = generateToken(user.id);

      // Return user info and token
      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  // Register new user
  register: async (req, res) => {
    try {
      const { email, password, name, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists.",
        });
      }

      // Create new user
      const user = await User.create({ email, password, name, role });

      // Generate token
      const token = generateToken(user.id);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  // Get current user info
  me: async (req, res) => {
    try {
      // User is already attached by auth middleware
      res.json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  // Refresh token
  refresh: async (req, res) => {
    try {
      // User is already attached by auth middleware
      const token = generateToken(req.user.id);

      res.json({
        success: true,
        data: {
          token,
        },
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Get user with password
      const user = await User.findById(userId, true);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // Verify current password
      const isValidPassword = await User.verifyPassword(
        currentPassword,
        user.password_hash,
      );
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect.",
        });
      }

      // Update password
      await User.updatePassword(userId, newPassword);

      res.json({
        success: true,
        message: "Password updated successfully.",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const { name, email } = req.body;
      const userId = req.user.id;

      // Check if email is being changed and if it's already in use
      if (email && email !== req.user.email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({
            success: false,
            message: "Email is already in use.",
          });
        }
      }

      // Build update object
      const updates = {};
      if (name) updates.name = name;
      if (email) updates.email = email;

      // Update user
      const updatedUser = await User.update(userId, updates);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
          },
        },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },
};

module.exports = authController;
