const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// FIX: The middleware is exported directly, not as an object property
const verifyToken = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// BIOMETRIC ROUTES
router.post('/save-voice-print', verifyToken, authController.saveVoicePrint);

module.exports = router;
