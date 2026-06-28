const express = require("express");
const router = express.Router();
const controller = require("../controllers/uploadController");
const upload = require("../middleware/multer");

router.post("/", upload.single("file"), controller.upload);

module.exports = router;
