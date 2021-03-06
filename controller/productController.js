const { Product } = require("../model/product");
const { User } = require("../model/user");

const loadProductDetails = async (req, res) => {
  const _id = req.params.id;

  try {
    var error = null;
    var product = await Product.findOne({ _id });
    const token = req.cookies.jwtToken;
    if (token) {
      const userWithData = await User.findOne({
        _id: req.user.user._id,
      }).populate("shoppingCart.productId");

      res.render("product.ejs", {
        product,
        error,
        cartItems: userWithData.shoppingCart,
        user: req.user,
        wishlist: userWithData.wishlist
      });
    } else {
      res.render("product.ejs", { product, error, cartItems: [], wishlist: [] });
    }
  } catch (err) {
    error = err;
    //console.error(err)
  }
};

module.exports = { loadProductDetails };
