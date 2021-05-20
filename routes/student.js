const express = require('express');
const router = express.Router();

const studentController = require('../controller/studentController')
const userController = require('../controller/userController')
router.get('/attempt-test/code', studentController.getRandomQuiz)
router.post('/submit-test', studentController.submitQuiz)
module.exports = router;