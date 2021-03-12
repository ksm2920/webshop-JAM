const express = require('express');
const multer = require('multer');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

const {addProductForm, addProductFormSubmit, adminProductListRender} = require('../controller/adminController');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + ".png");        
    }
})
var upload = multer({storage: storage});

router.get('/addProduct', verifyAdmin, addProductForm);
router.post('/addProduct', [verifyAdmin, upload.single('image')], addProductFormSubmit);
router.get('/adminPage', verifyAdmin, adminProductListRender);

module.exports = router;