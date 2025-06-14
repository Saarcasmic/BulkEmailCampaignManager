const Campaign = require('../models/Campaign');
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

async function sendAndMarkSent(campaign) {
  try {
    await sendBulkEmail(campaign.recipients, campaign.subject, campaign.content, campaign._id.toString());
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    campaign.metrics.sent = campaign.recipients.length;
    await campaign.save();
  } catch (err) {
    // Optionally log error
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
    // Schedule or send immediately
    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      campaign.status = 'scheduled';
      await campaign.save();
      scheduleCampaign(campaign, sendAndMarkSent);
    } else {
      await sendAndMarkSent(campaign);
    }
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
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
    // Cancel previous schedule if any
    cancelCampaignSchedule(campaign._id);
    // Schedule or send immediately
    if (campaign.scheduledAt && new Date(campaign.scheduledAt) > new Date()) {
      campaign.status = 'scheduled';
      await campaign.save();
      scheduleCampaign(campaign, sendAndMarkSent);
    } else if (campaign.status !== 'sent') {
      await sendAndMarkSent(campaign);
    }
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
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