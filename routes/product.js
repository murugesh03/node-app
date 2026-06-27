const express = require("express");
const router = express.Router();
const constroller = require("../controllers/productController");
const upload = require("../middleware/multer");

router.get("/", constroller.getAllProducts);

router.get("/:id", constroller.getProductId);

router.post("/", upload.single("image"), constroller.addProduct);

router.patch("/:id", constroller.updateProduct);

router.delete("/:id", constroller.deleteProduct);

module.exports = router;

// /product - get

// /product/1 - get

// /product - post

// /product/1 - patch

// /product/1 - delete
