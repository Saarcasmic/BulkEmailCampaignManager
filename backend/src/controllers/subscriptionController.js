const User = require('../models/User');

exports.startTrial = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent starting a trial if one is already active or has been used
    if (user.subscription.status !== 'none') {
      return res.status(400).json({ message: 'You have already used your trial or have an active subscription.' });
    }

    user.subscription.status = 'trial';
    user.subscription.trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    user.subscription.plan = 'standard';
    await user.save();

    res.json({
      message: '7-day trial started successfully!',
      subscription: user.subscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while starting trial', error: error.message });
  }
}; 