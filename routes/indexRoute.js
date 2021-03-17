var express = require("express");
const { loadProducts } = require("../controller/indexController");
const verifyUser = require("../middleware/verifyUser");
var router = express.Router();

// GET home page.
router.get("/", verifyUser, loadProducts);

//router.get('/products/:name', loadProducts);

module.exports = router;
