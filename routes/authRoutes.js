const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Page rendering routes
router.get('/', authController.renderLoginPage);
router.get('/signup', authController.renderSignupPage);

// Authentication action routes
router.post('/signup', authController.signupUser);
router.post('/login', authController.loginUser);

module.exports = router;
