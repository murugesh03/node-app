const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPRIES_IN || "1h" }
  );
}

module.exports = generateToken;
