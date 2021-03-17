const { User, validateRegisterForm } = require("../model/user");
const bcrypt = require("bcrypt");

const registerRender = (req, res) => {
  res.clearCookie("jwtToken");
  res.render("register.ejs", { error: "", cartItems: null });
};

const registerSubmit = async (req, res) => {
  const { error } = validateRegisterForm(req.body);

  if (error) {
    return res.render("register.ejs", { error: error.details[0].message, cartItems:null });
  }
  const { name, email, password } = req.body;

  const existingEmail = await User.findOne({ email: email });

  if (existingEmail) {
    return res.render("login.ejs", {
      error: "You already have an account with this email, please sign in.",
      cartItems:null
    });
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });

  newUser.save();

  res.redirect("/login");
};

module.exports = {
  registerRender,
  registerSubmit,
};
