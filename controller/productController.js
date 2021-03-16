const Product = require("../model/product");
const { User } = require("../model/user");

const loadProductDetails = async (req, res) => {
  const _id = req.params.id;
  const userWithCourseData = await User.findOne({
    _id: req.user.user._id,
  }).populate("shoppingCart.productId");
  const cartItems = userWithCourseData.shoppingCart;
  try {
    var error = null;
    var product = await Product.findOne({ _id });
    console.log("Product", product);
  } catch (err) {
    error = err;
  }
  res.render("product.ejs", { product, error, cartItems });
};
module.exports = { loadProductDetails };
