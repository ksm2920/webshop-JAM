var express = require("express");
const { loadProductDetails } = require("../controller/productController");
var router = express.Router();
const getUser = require("../middleware/getUser");

// GET home page.
router.get("/products/:id", getUser, loadProductDetails);

module.exports = router;
