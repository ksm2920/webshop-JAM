const { User } = require("../model/user");

const addToWishlist = async (req, res) => {
  const productId = req.params.id;
  const user = await User.findOne({ _id: req.user.user._id });

  if (productId !== null && productId !== undefined) {
    user.saveToWishlist(productId);
  }

  await res.redirect("/");
};

const removeFromWishlist = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  if (user) {
    const productId = req.params.id;

    if (productId !== null && productId !== undefined) {
      user.removeFromWishlist(productId);
    }
    await res.redirect("/");
  }
};

const wishlistRender = async (req, res) => {
  const userWishlist = await User.findOne({
    _id: req.user.user._id,
  }).populate("wishlist.productId");

  const userWithData = await User.findOne({
    _id: req.user.user._id,
  }).populate("shoppingCart.productId");

  res.render("wishlist.ejs", {
    wishlist: userWishlist.wishlist,
    err: " ",
    cartItems: userWithData.shoppingCart,
    user: req.user,
  });
};

module.exports = {
  addToWishlist,
  wishlistRender,
  removeFromWishlist,
};
