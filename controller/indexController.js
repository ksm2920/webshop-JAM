require('dotenv').config();

const Product = require("../model/product");


const loadProducts = async (req, res) => {
    try{
        var pageIndex = 1;
        var pageSize = Number.parseInt(process.env.INDEX_PAGE_SIZE);
        if(req.query.pageIndex)
          pageIndex = Number.parseInt(req.query.pageIndex);
        var error = null;
        var totalProductCount = 0;
        await Product.countDocuments({}, (err, count) => {
          if(err)
          {
            error = err;
            return;
          }
          totalProductCount = count;
        });
        var products = await Product.find().limit(pageIndex * pageSize).sort("name");
    }
    catch(err){
      error = err;
    }
    res.render('index.ejs', { products,  error, pageIndex, pageSize, totalProductCount});
}

module.exports = { loadProducts }