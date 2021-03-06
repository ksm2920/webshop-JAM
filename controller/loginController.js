const { User, validateLoginForm } = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const loginRender = (req, res) => {
  res.render("login.ejs", { error: "", cartItems: [], returnUrl: req.originalUrl, wishlist: [] });
};

const loginSubmit = async (req, res) => {
  const returnUrl = req.body.returnUrl;
  const { error } = validateLoginForm(req.body);

  const { email, password } = req.body;
  
  if (error) {
    return res.render("login.ejs", {
      error: error.details[0].message,
      cartItems: [],
      returnUrl,
      wishlist: []
    });
  }
  

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.render("register.ejs", {
        error: "You don't have an account. Please sign up",
        cartItems: [],
        returnUrl,
        wishlist: []
      });
    }

    const validUser = await bcrypt.compare(password, user.password);

    if (!validUser) {
      return res.render("login.ejs", {
        error: "Wrong password",
        cartItems: [], 
        returnUrl,
        wishlist: []
      });
    }

    const jwtToken = await jwt.sign({ user: user }, process.env.SECRET_KEY);
    if (jwtToken) {
      res.cookie("jwtToken", jwtToken, { maxAge: 3600000, httpOnly: true });
      //redirect to shopping cart
      var jwtObjevt = jwt.verify(jwtToken, process.env.SECRET_KEY);
      //console.log(returnUrl);
      if (jwtObjevt.user.role == "admin") {
        if(returnUrl == "" || returnUrl == "/login")
          return res.redirect("/adminPage");
        else
          res.redirect(returnUrl);
      } 
      else {
        if(returnUrl == "" || returnUrl == "/login")
          return res.redirect("/");
        else
          res.redirect(returnUrl);
      }
    }

    //redirect to shopping cart
    return res.send("Error, how did u get here");
  } catch (err) {
    return res.render("login.ejs", { error: "System error" + err, cartItems: [], returnUrl, wishlist: [] });
  }
};

module.exports = {
  loginRender,
  loginSubmit,
};
