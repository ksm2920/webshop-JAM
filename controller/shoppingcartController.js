const Product = require("../model/product");
const { User } = require("../model/user");

const addToShoppingCart = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  if (user) {
    const productId = req.params.id;

    if (productId !== null && productId !== undefined) {
      user.addToCart(productId);
    }
    const userWithCourseData = await User.findOne({
      _id: req.user.user._id,
    }).populate("shoppingCart.productId");

    res.redirect("/");

  }
};

const decreaseProduct = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  if (user) {
    const productId = req.params.id;

    if (productId !== null && productId !== undefined) {
      user.decreaseProduct(productId);
    }
    res.redirect("/");
  }
};

const removeFromCart = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  if (user) {
    const productId = req.params.id;

    if (productId !== null && productId !== undefined) {
      console.log("pid", productId);
      user.removeFromCart(productId);
    }
    res.redirect("/");
  }
};

module.exports = {
  addToShoppingCart,
  decreaseProduct,
  removeFromCart,
};
