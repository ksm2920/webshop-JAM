const express = require('express');

const router = express.Router();

const {registerRender, registerSubmit} = require('../controller/registerController');
const {loginRender, loginSubmit} = require('../controller/loginController');

router.get('/register', registerRender);
router.post('/register', registerSubmit);
router.get('/login', loginRender);
router.post('/login', loginSubmit);

module.exports = router;
