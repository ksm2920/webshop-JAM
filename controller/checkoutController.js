const { User, validateCheckoutForm } = require("../model/user");

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

  if (error) {
    return res.render("checkout.ejs", {
      error: error.details[0].message,
      cartItems: null,
      user: req.user
    });
  } else {
    // user.lastname = req.body.lastname;
    // user.address = req.body.address;
    // user.city = req.body.city;
    // user.zip = req.body.zip;
    // user.phone = req.body.phone;
    // await user.save();

    return res.redirect("/");
  }
};

module.exports = {
  checkoutRender,
  checkoutSubmit,
};
