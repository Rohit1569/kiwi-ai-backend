const express = require('express');
const router = express.Router();
const fitnessController = require('../controllers/fitnessController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/profile', fitnessController.createOrUpdateProfile);
router.get('/profile', fitnessController.getProfile);
router.delete('/profile', fitnessController.deleteProfile);

module.exports = router;
