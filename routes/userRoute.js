const express = require('express');

const router = express.Router();

const {registerRender, registerSubmit} = require('../controller/registerController');
const {loginRender, loginSubmit} = require('../controller/loginController');
const {resetRender, resetSubmit, resetParams, resetFormSubmit} = require('../controller/resetPassController');
const {logout} = require('../controller/logoutController');

router.get('/register', registerRender);

router.post('/register', registerSubmit);

router.get('/login', loginRender);

router.post('/login', loginSubmit);

router.get('/reset', resetRender);

router.post('/reset', resetSubmit);

router.get('/reset/:token', resetParams);

router.post('/resetPasswordForm', resetFormSubmit);

router.get('/logout', logout);

module.exports = router;
