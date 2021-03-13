var express = require('express');
const { loadProducts } = require('../controller/indexController');
var router = express.Router();



// GET home page. 
router.get('/', loadProducts);

//router.get('/products/:name', loadProducts);

module.exports = router;