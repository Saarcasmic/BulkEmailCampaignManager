const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { sendBulkEmail } = require('../utils/sendEmail');
const { scheduleCampaign, cancelCampaignSchedule } = require('../utils/scheduler');

exports.getAll = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user.id });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

async function sendAndMarkSent(campaign, userToken) {
  const user = await User.findById(userToken.id);
  if (!user) {
    throw new Error('User not found.');
  }

  if (!user.isSenderVerified) {
    throw new Error('Sender email is not verified. Please go to your profile to verify.');
  }
  
  try {
    await sendBulkEmail(campaign.recipients, campaign.subject, campaign.content, campaign._id.toString(), user.email);
    
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    campaign.metrics.sent = campaign.recipients.length;
    await campaign.save();
  } catch (err) {
    console.error(`Failed to send campaign ${campaign._id}:`, err);
    campaign.status = 'draft';
    await campaign.save();
    throw err;
  }
}

exports.create = async (req, res) => {
  try {
    const { name, description, recipients, subject, content, scheduledAt, scheduledTimezone } = req.body;
    const campaign = new Campaign({
      name,
      description,
      recipients,
      subject,
      content,
      scheduledAt,
      scheduledTimezone,
      createdBy: req.user.id,
    });
    await campaign.save();
    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      campaign.status = 'scheduled';
      await campaign.save();
      scheduleCampaign(campaign, (c) => sendAndMarkSent(c, req.user));
    } else {
      await sendAndMarkSent(campaign, req.user);
    }
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let campaign = await Campaign.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    const { scheduledAt, scheduledTimezone } = req.body;
    Object.assign(campaign, req.body);
    if (scheduledAt) campaign.scheduledAt = scheduledAt;
    if (scheduledTimezone) campaign.scheduledTimezone = scheduledTimezone;
    await campaign.save();
    cancelCampaignSchedule(campaign._id);
    if (campaign.scheduledAt && new Date(campaign.scheduledAt) > new Date()) {
      campaign.status = 'scheduled';
      await campaign.save();
      scheduleCampaign(campaign, (c) => sendAndMarkSent(c, req.user));
    } else if (campaign.status !== 'sent') {
      await sendAndMarkSent(campaign, req.user);
    }
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    cancelCampaignSchedule(campaign._id);
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 