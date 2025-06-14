const Campaign = require('../models/Campaign');

exports.getAnalytics = async (req, res) => {
  const campaign = await Campaign.findById(req.params.campaignId);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  // Convert Map to plain object
  const devices = campaign.analytics.devices ? Object.fromEntries(campaign.analytics.devices) : {};
  const geos = campaign.analytics.geos ? Object.fromEntries(campaign.analytics.geos) : {};
  res.json({ devices, geos });
}; 