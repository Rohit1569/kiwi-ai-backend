const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin only.' });
  }
};

router.use(authenticate);
router.use(isAdmin);

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.patch('/users/:id/access', adminController.toggleUserAccess);
router.patch('/users/:id/subscription', adminController.updateSubscription);

module.exports = router;
