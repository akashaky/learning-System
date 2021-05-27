const express = require('express');
const router = express.Router();

const adminController = require('../controller/adminController')
const userController = require('../controller/userController')
router.post('/upload-viedo', userController.auth, adminController.uploadViedo)
router.post('/new-test', userController.auth, adminController.createTest)
router.post('/add-question',userController.auth, adminController.addQuestion)
router.get('/get-test-result', userController.auth, adminController.getTestResult)

module.exports = router;