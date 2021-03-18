const { User, validateCheckoutForm } = require("../model/user");
const {loadProducts} = require("../controller/indexController");

const checkoutRender = async (req, res) => {
  res.render("checkout.ejs", {
    error: "",
    cartItems: null,
    user: req.user,
  });
};

const checkoutSubmit = async (req, res) => {
  const { error } = validateCheckoutForm(req.body);
  //console.log(error);
  const {lastname, address, city, zip, phone} = req.body
  const checkoutUserId = req.user.user._id;

  if (error) {
    return res.render("checkout.ejs", {
      error: error.details[0].message,
      cartItems: null,
      user: req.user
    });
  } else {
   await User.findByIdAndUpdate(
     checkoutUserId,
     {lastname:lastname, address:address, city:city, zip:zip, phone:phone},
     () => {
      res.clearCookie('jwtToken').redirect('/');
    }
   )
  }
};

module.exports = {
  checkoutRender,
  checkoutSubmit,
};
