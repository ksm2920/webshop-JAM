const {
  addToShoppingCart,
  decreaseProduct,
  removeFromCart,
  checkoutRender,
} = require("../controller/shoppingcartController");

const express = require("express");
const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

router.get("/addToCart/:id", verifyUser, addToShoppingCart);
router.get("/removeFromCart/:id", verifyUser, decreaseProduct);
router.get("/removeFromCart/:id", verifyUser, removeFromCart);
router.get("/checkout", checkoutRender);

module.exports = router;
