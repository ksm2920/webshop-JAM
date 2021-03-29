require("dotenv").config();
const { User, validateCheckoutForm } = require("../model/user");
const { v4 } = require("uuid");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const getTotal = (cartItems) => {
  let totalPrice = 0;
  for(let i=0; i < cartItems.length; i++){
    totalPrice += cartItems[i].productId.price * cartItems[i].quantity;
  }
  return totalPrice;
}


const transport = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 465,
  secure: true,
  auth: {
    user: process.env.TRANSPORT_MAIL,
    pass: process.env.MAIL_PASS,
  },
})

const checkoutRender = async (req, res) => {
  console.log("Verified");
  const userWithData = await User.findOne({
    _id: req.user.user._id,
  }).populate("shoppingCart.productId");
  //console.log(userWithData.shoppingCart);

  res.render("checkout.ejs", {
    error: "",
    user: req.user,
    cartItems: userWithData.shoppingCart,
    wishlist: userWithData.wishlist
  });
};

const checkoutSubmit = async (req, res) => {
  const { error } = validateCheckoutForm(req.body);

  const userWithData = await User.findOne({
    _id: req.user.user._id,
  }).populate("shoppingCart.productId");
;
  // console.log(userWithData.shoppingCart);

  const {lastname, address, city, zip, email, phone} = req.body
  const checkoutUserId = req.user.user._id;
  

  if (error) {
    return res.render("checkout.ejs", {
      error: error.details[0].message,
      cartItems: userWithData.shoppingCart,
      user: req.user,
      wishlist: userWithData.wishlist
    });
  } else {

    await User.findByIdAndUpdate(
      checkoutUserId,
      {
        lastname: lastname,
        address: address,
        city: city,
        zip: zip,
        phone: phone
      },
      () => {
        res.redirect("/payment");
      }
    );
    }
  }

const payment = async (req, res) => {
  const userWithData = await User.findOne({
    _id: req.user.user._id,
  }).populate("shoppingCart.productId");

  const session = await stripe.checkout.sessions.create({
    success_url: "http://localhost:8000/shoppingSuccess",
    cancel_url: "http://localhost:8000/",
    payment_method_types: ["card"],
    line_items: userWithData.shoppingCart.map((productId) => {
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
    cartItems: userWithData.shoppingCart,
    sessionId: session.id,
  });
};

const shoppingSuccess = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  const userWithData = await User.findOne({
    _id: req.user.user._id,
  }).populate("shoppingCart.productId");
  console.log(user);
  user.shoppingCart = [];
  user.orderNo = v4();
  user.orderItems = userWithData.shoppingCart;
  user.save();

    await transport.sendMail({
          from: process.env.TRANSPORT_MAIL,
          to: user.email, // Change to your recipient
        // Change to your verified sender
          subject: 'Webshop - Order confirmation',
        
          html: `<h1> Thank you for shopping with us! </h1>
                  <h3>Your Order No is ${user.orderNo}</h3>
                  <h3>You purchase amount is ${getTotal(userWithData.shoppingCart)}</h3>`,
      }, function(err, info){
          if (err ){
            console.log(err);
          }
          else {
            console.log('Message sent: ' + info.response);
          }
      });

      res.render("shoppingcartSucess.ejs", {cartItems: [], wishlist:[]});


};

module.exports = {
  checkoutRender,
  checkoutSubmit,
  payment,
  shoppingSuccess,
};
