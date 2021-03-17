var express = require("express");
const { loadProductDetails } = require("../controller/productController");
var router = express.Router();
const verifyUser = require("../middleware/verifyUser");

// GET home page.
router.get("/products/:id", verifyUser, loadProductDetails);

module.exports = router;
