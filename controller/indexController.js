require("dotenv").config();

const Product = require("../model/product");
const { User } = require("../model/user");

const loadProducts = async (req, res) => {
  try {
    var pageIndex = 1;
    var pageSize = Number.parseInt(process.env.INDEX_PAGE_SIZE);
    if (req.query.pageIndex) pageIndex = Number.parseInt(req.query.pageIndex);
    var error = null;
    var totalProductCount = 0;
    await Product.countDocuments({}, (err, count) => {
      if (err) {
        error = err;
        return;
      }
      totalProductCount = count;
    });
    var products = await Product.find()
      .limit(pageIndex * pageSize)
      .sort("name");
  } catch (err) {
    error = err;
  }

  const token = req.cookies.jwtToken;
  if (token) {
    const userWithCourseData = await User.findOne({
      _id: req.user.user._id,
    }).populate("shoppingCart.productId");
    //console.log(userWithCourseData);

    res.render("index.ejs", {
      products,
      error,
      pageIndex,
      pageSize,
      totalProductCount,
      user:req.user,
      cartItems: userWithCourseData.shoppingCart,
    });
  } else {
    res.render("index.ejs", {
      products,
      error,
      pageIndex,
      pageSize,
      totalProductCount,
      cartItems: null,
    });
  }
};

module.exports = { loadProducts };
