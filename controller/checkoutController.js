const { User, validateCheckoutForm } = require("../model/user");
const { loadProducts } = require("../controller/indexController");

const checkoutRender = async (req, res) => {
  const userWithCourseData = await User.findOne({
    _id: req.user.user._id,
  }).populate("shoppingCart.productId");
  console.log(userWithCourseData.shoppingCart);

  res.render("checkout.ejs", {
    error: "",
    user: req.user,
    cartItems: userWithCourseData.shoppingCart,
  });
};

const checkoutSubmit = async (req, res) => {
  const { error } = validateCheckoutForm(req.body);
  //console.log(error);
  const { lastname, address, city, zip, phone } = req.body;
  const checkoutUserId = req.user.user._id;

  if (error) {
    return res.render("checkout.ejs", {
      error: error.details[0].message,
      cartItems: null,
      user: req.user,
    });
  } else {
    await User.findByIdAndUpdate(
      checkoutUserId,
      {
        lastname: lastname,
        address: address,
        city: city,
        zip: zip,
        phone: phone,
      },
      () => {
        res.clearCookie("jwtToken").redirect("/");
      }
    );
  }
};

module.exports = {
  checkoutRender,
  checkoutSubmit,
};
