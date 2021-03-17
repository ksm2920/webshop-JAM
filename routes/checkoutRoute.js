const {
  checkoutRender,
  checkoutSubmit,
} = require("../controller/checkoutController");

const express = require("express");
const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

router.get("/checkout", verifyUser, checkoutRender);
router.post("/checkout", verifyUser, checkoutSubmit);

module.exports = router;
