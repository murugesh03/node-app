function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  next();
}

module.exports = authMiddleware;
