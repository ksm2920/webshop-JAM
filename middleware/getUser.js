const jwt = require("jsonwebtoken");
require("dotenv").config();

const getUser = (req, res, next) => {
  const token = req.cookies.jwtToken;

  if (token) {
    req.user = jwt.verify(token, process.env.SECRET_KEY);
  }
  console.group(req.user);
  next();
};

module.exports = getUser;
