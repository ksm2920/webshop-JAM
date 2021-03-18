const { User, validateLoginForm } = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const loginRender = (req, res) => {
  res.render("login.ejs", { error: "", cartItems: null });
};

const loginSubmit = async (req, res) => {
  const { error } = validateLoginForm(req.body);

  if (error) {
    return res.render("login.ejs", {
      error: error.details[0].message,
      cartItems: null,
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.render("register.ejs", {
        error: "You don't have an account. Please sign up",
        cartItems: null,
      });
    }

    const validUser = await bcrypt.compare(password, user.password);

    if (!validUser) {
      return res.render("login.ejs", {
        error: "Wrong password",
        cartItems: null,
      });
    }

    const jwtToken = await jwt.sign({ user: user }, process.env.SECRET_KEY);
    if (jwtToken) {
      res.cookie("jwtToken", jwtToken, { maxAge: 3600000, httpOnly: true });
      //redirect to shopping cart
      var jwtObjevt = jwt.verify(jwtToken, process.env.SECRET_KEY);
      if (jwtObjevt.user.role) {
        return res.redirect("/adminPage");
      } else {
        res.redirect("/");
      }
    }

    //redirect to shopping cart
    return res.send("Error, how did u get here");
  } catch (err) {
    return res.render("login.ejs", { error: "System error" + err });
  }
};

module.exports = {
  loginRender,
  loginSubmit,
};
