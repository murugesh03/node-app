const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const dashboardController = require("../controllers/dashboardController");
const upload = require("../middleware/multer");

const seededUser = {
  email: "admin@example.com",
  password: "Admin@123"
};

router.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  return res.render("login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === seededUser.email && password === seededUser.password) {
    req.session.user = { email };
    return req.session.save((err) => {
      if (err) {
        return res.status(500).render("login", {
          message: "Unable to complete login. Please try again.",
          error: true
        });
      }
      return res.redirect("/dashboard");
    });
  }

  return res.render("login", {
    message: "Invalid email or password.",
    error: true
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

router.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return dashboardController.getDashboard(req, res);
});

router.get("/products", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return productController.renderProductsList(req, res);
});

router.get("/products/new", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return res.render("product-form", { user: req.session.user });
});

router.post(
  "/products/new",
  (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    next();
  },
  upload.single("image"),
  productController.addProduct
);

router.get("/users", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return userController.getAllUsers(req, res);
});

router.post("/users/add", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return userController.addUser(req, res);
});

router.post("/users/delete/:userId", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return userController.deleteUser(req, res);
});

module.exports = router;
