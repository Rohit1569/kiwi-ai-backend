const { Subscription, User } = require('../models');

const checkSubscription = async (req, res, next) => {
  try {
    // Check if req.user exists (set by authenticate middleware)
    if (!req.user || !req.user.id) {
      console.error('!!! [SUBSCRIPTION] No user found in request. Ensure authenticate middleware is called before checkSubscription.');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = req.user.id;

    // 1. CHECK IF USER IS BLOCKED/ACTIVE
    const user = await User.findByPk(userId);
    if (!user || !user.is_active) {
      return res.status(403).json({ 
        error: 'Account disabled', 
        message: 'Your account has been disabled by an administrator. Please contact support.' 
      });
    }

    // 2. CHECK SUBSCRIPTION
    const subscription = await Subscription.findOne({ where: { user_id: userId } });

    if (!subscription) {
      // For existing users who don't have a subscription record yet,
      // we can automatically create a 30-day trial to avoid breaking their experience.
      console.log(`>>> [SUBSCRIPTION] No record found for user ${userId}. Creating trial.`);
      
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      
      const newSub = await Subscription.create({
        user_id: userId,
        plan_type: 'free',
        start_date: new Date(),
        end_date: endDate,
        status: 'active'
      });
      
      req.subscription = newSub;
      return next();
    }

    const now = new Date();
    if (subscription.status === 'expired' || subscription.end_date < now) {
      if (subscription.status !== 'expired') {
        await subscription.update({ status: 'expired' });
      }
      return res.status(403).json({ 
        error: 'Subscription expired', 
        message: 'Your subscription has expired. Please renew to continue using the app.' 
      });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ error: 'Internal server error during subscription check' });
  }
};

module.exports = checkSubscription;
