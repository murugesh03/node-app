const User = require("../models/user");
const Product = require("../models/products");
const logger = require("../utils/logger/logger");

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const stats = {
      totalUsers,
      totalProducts
    };

    logger.info("Dashboard accessed", {
      email: req.session.user?.email,
      stats
    });

    return res.render("dashboard", {
      user: req.session.user,
      stats
    });
  } catch (error) {
    logger.error("Error loading dashboard", {
      error: error.message,
      stack: error.stack
    });
    return res.render("dashboard", {
      user: req.session.user,
      stats: { totalUsers: 0, totalProducts: 0 }
    });
  }
};
