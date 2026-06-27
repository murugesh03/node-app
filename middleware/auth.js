const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  const header = req.headers.authorization; //"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. Invalid token format." });
  }

  const token = header.split(" ")[1]; // Remove "Bearer " prefix

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
}

function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action." });
    }
    next();
  };
}

module.exports = { protect, restrictTo };
