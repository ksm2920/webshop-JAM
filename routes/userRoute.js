const express = require("express");

const router = express.Router();

const {testRender, testSubmit} = require("../controller/userController");

router.get("/", testRender);
router.post("/", testSubmit);

module.exports = router;
