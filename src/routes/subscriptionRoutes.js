const express = require('express');
const router = express.Router();
const { Subscription } = require('../models');
const authenticate = require('../middleware/authMiddleware');

// Note: authentication should be applied before this route is reached in server.js
// but we apply it here as well for safety.
router.use(authenticate);

// Get current user's subscription status
router.get('/status', async (req, res) => {
  try {
    const userId = req.user.id;
    let subscription = await Subscription.findOne({ where: { user_id: userId } });
    
    // BACKWARD COMPATIBILITY: If an old user logs in without a subscription, create one.
    if (!subscription) {
      console.log(`>>> [SUBSCRIPTION] Auto-creating trial for existing user: ${userId}`);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      
      subscription = await Subscription.create({
        user_id: userId,
        plan_type: 'free',
        start_date: new Date(),
        end_date: endDate,
        status: 'active'
      });
    }
    
    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update to paid subscription
router.post('/upgrade', async (req, res) => {
  try {
    const { planDurationDays } = req.body;
    const duration = parseInt(planDurationDays) || 30;
    
    const userId = req.user.id;
    let subscription = await Subscription.findOne({ where: { user_id: userId } });
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + duration);

    if (subscription) {
      await subscription.update({
        plan_type: 'paid',
        start_date: startDate,
        end_date: endDate,
        status: 'active'
      });
      res.json({ message: 'Subscription upgraded successfully', subscription });
    } else {
      const newSub = await Subscription.create({
        user_id: userId,
        plan_type: 'paid',
        start_date: startDate,
        end_date: endDate,
        status: 'active'
      });
      res.json({ message: 'Subscription created successfully', subscription: newSub });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
