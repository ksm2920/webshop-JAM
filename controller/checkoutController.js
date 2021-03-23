const { User, validateCheckoutForm } = require("../model/user");
const { loadProducts } = require("../controller/indexController");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

  const userWithCourseData = await User.findOne({
    _id: req.user.user._id,
  }).populate("shoppingCart.productId");
  console.log(userWithCourseData.shoppingCart);

  const { lastname, address, city, zip, phone } = req.body;
  const checkoutUserId = req.user.user._id;

  if (error) {
    return res.render("checkout.ejs", {
      error: error.details[0].message,
      cartItems: userWithCourseData.shoppingCart,
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
        res.redirect("/payment");
      }
    );
  }
};

const payment = async (req, res) => {
  const userWithCourseData = await User.findOne({
    _id: req.user.user._id,
  }).populate("shoppingCart.productId");

  const session = await stripe.checkout.sessions.create({
    success_url: "http://localhost:8000/shoppingSuccess",
    cancel_url: "https://example.com/cancel",
    payment_method_types: ["card"],
    line_items: userWithCourseData.shoppingCart.map((productId) => {
      return {
        name: productId.productId.name,
        amount: productId.productId.price * 100,
        quantity: productId.quantity,
        currency: "sek",
      };
    }),
    mode: "payment",
  });

  console.log(session);
  res.render("payment.ejs", {
    cartItems: userWithCourseData.shoppingCart,
    sessionId: session.id,
  });
};

const shoppingSuccess = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  user.shoppingCart = [];
  user.save();

  res.send("Din varukorg är tom. Vi skickar din beställning inom 3 dagar");
};

module.exports = {
  checkoutRender,
  checkoutSubmit,
  payment,
  shoppingSuccess,
};
