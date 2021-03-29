const {
  addToShoppingCart,
  decreaseProduct,
  removeFromCart,
} = require("../controller/shoppingcartController");

const express = require("express");
const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

router.get("/addToCart/:id", verifyUser, addToShoppingCart);
router.get("/decreaseQuantity/:id", verifyUser, decreaseProduct);
router.get("/removeFromCart/:id", verifyUser, removeFromCart);

module.exports = router;
  