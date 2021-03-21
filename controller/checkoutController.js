require("dotenv").config();
const { User, validateCheckoutForm } = require("../model/user");
const {loadProducts} = require("../controller/indexController");
const nodemailer = require('nodemailer');
const nodemailerSmtpTransport = require("nodemailer-smtp-transport");


const transport = nodemailer.createTransport( 
  nodemailerSmtpTransport({ service: "gmail",
  auth:{
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_SENDER_PWD
  }
}))

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
  const {lastname, address, city, zip, email, phone} = req.body
  const checkoutUserId = req.user.user._id;
  

  if (error) {
    return res.render("checkout.ejs", {
      error: error.details[0].message,
      cartItems: null,
      user: req.user
    });
  } else {
    try {
      await User.findByIdAndUpdate(
        checkoutUserId,
        {lastname:lastname, address:address, city:city, zip:zip, phone:phone},
        () => {
          res.clearCookie('jwtToken').redirect('/');
        }
      );
      console.log("email", req.user.email);
      await transport.sendMail({
          from: "deblina4.se@gmail.com",
          to: email, // Change to your recipient
        // Change to your verified sender
          subject: 'Webshop - Order confirmation',
        
          html: `<h1> Thank you for shopping with us! </h1>`,
      }, function(err, info){
          if (err ){
            console.log(err);
          }
          else {
            console.log('Message sent: ' + info.response);
          }
      });
    }
    catch (err){
      console.log(err);
    }
  }
};

module.exports = {
  checkoutRender,
  checkoutSubmit,
};
