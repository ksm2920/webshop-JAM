const {
  addToWishlist,
  wishlistRender,
  removeFromWishlist,
} = require("../controller/wishlistController");

const express = require("express");
const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

router.get("/addToWishlist/:id", verifyUser, addToWishlist);
router.get("/wishlist", verifyUser, wishlistRender);
router.get("/removeFromWishlist/:id", verifyUser, removeFromWishlist);

module.exports = router;
