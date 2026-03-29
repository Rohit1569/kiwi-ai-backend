const { Subscription } = require('../models');
const { Op } = require('sequelize');

/**
 * Background job to update expired subscriptions
 * This runs every 24 hours (or could be more frequent)
 */
const updateExpiredSubscriptions = async () => {
  console.log('>>> [CRON] Checking for expired subscriptions...');
  try {
    const now = new Date();
    const [updatedCount] = await Subscription.update(
      { status: 'expired' },
      {
        where: {
          status: 'active',
          end_date: {
            [Op.lt]: now
          }
        }
      }
    );
    console.log(`>>> [CRON] Expired ${updatedCount} subscriptions.`);
  } catch (error) {
    console.error('!!! [CRON ERROR] Failed to update expired subscriptions:', error);
  }
};

// Run immediately on start
updateExpiredSubscriptions();

// Schedule to run every 12 hours
setInterval(updateExpiredSubscriptions, 12 * 60 * 60 * 1000);

module.exports = { updateExpiredSubscriptions };
