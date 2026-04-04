const User = require("../models/User");

// User Management Controller - For admin use
const userManagementController = {
  // List all users
  list: async (req, res) => {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const users = await User.list(parseInt(limit), offset, search);
      const total = await User.count(search);

      res.json({
        success: true,
        data: {
          users: users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            created_at: user.created_at,
            last_login: user.last_login,
          })),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("List users error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  // Get user by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
            last_login: user.last_login,
          },
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

  // Create new user (admin only)
  create: async (req, res) => {
    try {
      const { email, password, name, role } = req.body;

      // Validate role - only admin can create admin
      if (role === 'admin' && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Only admins can create admin accounts.",
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists.",
        });
      }

      // Create user
      const user = await User.create({ email, password, name, role });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            created_at: user.created_at,
          },
        },
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  // Update user
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      // Check if current user has permission
      if (req.user.role !== 'admin' && req.user.id !== id) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to update this user.",
        });
      }

      // Only admin can change role
      if (role && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Only admins can change user roles.",
        });
      }

      // Check if email is being changed and if it's already in use
      if (email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== id) {
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
      if (role && req.user.role === 'admin') updates.role = role;

      const updatedUser = await User.update(id, updates);

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
            updated_at: updatedUser.updated_at,
          },
        },
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  // Delete user (admin only)
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Prevent self-deletion
      if (req.user.id === id) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account.",
        });
      }

      const deletedUser = await User.delete(id);

      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.json({
        success: true,
        message: "User deleted successfully.",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },
};

module.exports = userManagementController;