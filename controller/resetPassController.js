const { User } = require("../model/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

require("dotenv").config;

const transport = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 465,
  secure: true,
  auth: {
    user: process.env.TRANSPORT_MAIL,
    pass: process.env.MAIL_PASS,
  },
});

const resetRender = (req, res) => {
  res.render("requestReset.ejs", { error: "", cartItems: null });
};

const resetSubmit = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  if (!user)
    return res.render("register.ejs", {
      error: "You don't have account. Please sign up first!",
      cartItems: null,
    });

  const token = crypto.randomBytes(32).toString("hex");

  user.token = token;
  user.tokenExpiration = Date.now() + 3600000;

  await user.save();

  await transport.sendMail({
    from: process.env.TRANSPORT_MAIL,
    to: user.email,
    subject: "Reset your password",
    html: `<h2>Click<a href = "http://localhost:8000/reset/${user.token}"> Here </a>to reset your password</h2>`,
  });
  res.render("checkEmail.ejs", { cartItems: null });
};

const resetParams = async (req, res) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({
      token: token,
      tokenExpiration: { $gt: Date.now() },
    });

    if (!user) return res.redirect("/register");

    res.render("resetPasswordForm.ejs", {
      error: "",
      email: user.email,
      cartItems: null,
    });
  } catch (err) {
    res.render("requestReset.ejs", { error: "Try again", cartItems: null });
  }
};

const resetFormSubmit = async (req, res) => {
  const newPassword = req.body.password;
  const email = req.body.email;

  const salt = await bcrypt.genSalt(12);
  const newHashedPassword = await bcrypt.hash(newPassword, salt);

  const user = await User.findOne({ email: email });
  user.password = newHashedPassword;
  await user.save();

  res.redirect("/login");
};

module.exports = {
  resetRender,
  resetSubmit,
  resetParams,
  resetFormSubmit,
};
