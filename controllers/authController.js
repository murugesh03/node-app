const bcrypt = require("bcryptjs");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const logger = require("../utils/logger/logger");
//info, warn, error
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    logger.info(`Creating user: ${name} (${email})`);
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // password should not be saved diretly in the DB it should be hashed before saving in db
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    const token = generateToken(user);
    res
      .status(201)
      .json({ message: "User created successfully.", user, token });
  } catch (error) {
    logger.error("Error creating user", {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Attempting login for user: ${email}`);
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user);
    logger.info("User logged in successfully", {
      name: user.name,
      email: user.email,
      role: user.role
    });
    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    logger.error("Error logging in user", {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: error.message });
  }
};
