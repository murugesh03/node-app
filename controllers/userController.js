const bcrypt = require("bcryptjs");
const User = require("../models/user");
const logger = require("../utils/logger/logger");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.render("users-management", { users, message: null });
  } catch (error) {
    logger.error("Error fetching users", {
      error: error.message,
      stack: error.stack
    });
    return res.render("users-management", {
      message: "Failed to fetch users",
      error: true,
      users: []
    });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      const users = await User.find().select("-password");
      return res.render("users-management", {
        message: "Please provide all required fields.",
        error: true,
        users
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const users = await User.find().select("-password");
      return res.render("users-management", {
        message: "User with this email already exists.",
        error: true,
        users
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    logger.info("User added successfully", { email, name, role });
    const users = await User.find().select("-password");
    return res.render("users-management", {
      message: `User ${name} added successfully`,
      success: true,
      users
    });
  } catch (error) {
    logger.error("Error adding user", {
      error: error.message,
      stack: error.stack
    });
    const users = await User.find().select("-password");
    return res.render("users-management", {
      message: "Failed to add user",
      error: true,
      users
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      const users = await User.find().select("-password");
      return res.render("users-management", {
        message: "User not found",
        error: true,
        users
      });
    }

    logger.info("User deleted successfully", {
      email: user.email,
      name: user.name
    });
    const users = await User.find().select("-password");
    return res.render("users-management", {
      message: `User ${user.name} deleted successfully`,
      success: true,
      users
    });
  } catch (error) {
    logger.error("Error deleting user", {
      error: error.message,
      stack: error.stack
    });
    const users = await User.find().select("-password");
    return res.render("users-management", {
      message: "Failed to delete user",
      error: true,
      users
    });
  }
};
