const express = require('express');
const router = express.Router();

const adminController = require('../controller/adminController')
const userController = require('../controller/userController')
router.post('/upload-viedo', userController.auth, adminController.uploadViedo)

module.exports = router;