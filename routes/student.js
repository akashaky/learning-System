const express = require('express');
const router = express.Router();

const studentController = require('../controller/studentController')
const userController = require('../controller/userController')
router.get('/attempt-test', userController.auth, studentController.getRandomQuiz)
router.post('/submit-test', userController.auth, studentController.submitQuiz)
module.exports = router;