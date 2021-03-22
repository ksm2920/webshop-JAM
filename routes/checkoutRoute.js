const {
  checkoutRender,
  checkoutSubmit,
  payment,
  shoppingSuccess,
} = require("../controller/checkoutController");

const express = require("express");
const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

router.get("/checkout", verifyUser, checkoutRender);
router.post("/checkout", verifyUser, checkoutSubmit);
router.get("/payment", verifyUser, payment);
router.get("/shoppingSuccess", verifyUser, shoppingSuccess);

module.exports = router;
