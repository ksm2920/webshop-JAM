const Product = require("../model/product");


const loadProductDetails = async (req, res) => {
    const _id = req.params.id;
    try{

        var error = null;
        var product = await Product.findOne({ _id });
        console.log("Product", product);
    }
    catch(err){
      error = err;
    }
    res.render('product.ejs', { product,  error});
}

module.exports = { loadProductDetails }