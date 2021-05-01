const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

router.post('/sign-up', userController.generateOTP);
router.post('/create', userController.verifyOTP, userController.create);
router.post('/sign-in', userController.signIn)
router.get('/profile', userController.profile)

module.exports = router;