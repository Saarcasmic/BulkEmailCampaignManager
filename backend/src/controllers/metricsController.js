const Campaign = require('../models/Campaign');

exports.getMetrics = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    // Optionally: check if req.user.id === campaign.createdBy
    res.json({ metrics: campaign.metrics });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 