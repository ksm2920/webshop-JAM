var express = require("express");
const { loadProducts } = require("../controller/indexController");
const getUser = require("../middleware/getUser");
var router = express.Router();
const getUser = require('../middleware/getUser');


// GET home page. 
router.get('/', getUser, loadProducts);

//router.get('/products/:name', loadProducts);

module.exports = router;
