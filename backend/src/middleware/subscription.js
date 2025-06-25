const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    // Only check if user is authenticated and has a trial
    if (req.user && req.user.id) {
      const user = await User.findById(req.user.id);
      // Handle trial expiration
      if (user && user.subscription && user.subscription.status === 'trial') {
        if (user.subscription.trialEndsAt && new Date(user.subscription.trialEndsAt) < new Date()) {
          user.subscription.status = 'expired';
          await user.save();
        }
      }
      // Handle active subscription expiration
      if (user && user.subscription && user.subscription.status === 'active') {
        if (user.subscription.subscriptionEndsAt && new Date(user.subscription.subscriptionEndsAt) < new Date()) {
          user.subscription.status = 'expired';
          await user.save();
        }
      }
    }
    next();
  } catch (err) {
    // Don't block the request if this fails, just log
    console.error('Subscription middleware error:', err);
    next();
  }
}; 