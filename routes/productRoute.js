var express = require('express');
const { loadProductDetails } = require('../controller/productController');
var router = express.Router();



// GET home page. 
router.get('/products/:id', loadProductDetails);

module.exports = router;