const cron = require('node-cron');
const scheduledJobs = {};

function scheduleCampaign(campaign, sendCallback) {
  // Cancel existing job if any
  if (scheduledJobs[campaign._id]) {
    scheduledJobs[campaign._id].stop();
    delete scheduledJobs[campaign._id];
  }
  if (!campaign.scheduledAt) return;
  const date = new Date(campaign.scheduledAt);
  if (date < new Date()) return; // Don't schedule in the past
  const cronTime = `${date.getUTCMinutes()} ${date.getUTCHours()} ${date.getUTCDate()} ${date.getUTCMonth() + 1} *`;
  const job = cron.schedule(cronTime, () => {
    sendCallback(campaign);
    job.stop();
    delete scheduledJobs[campaign._id];
  }, { scheduled: true, timezone: 'UTC' });
  scheduledJobs[campaign._id] = job;
}

function cancelCampaignSchedule(campaignId) {
  if (scheduledJobs[campaignId]) {
    scheduledJobs[campaignId].stop();
    delete scheduledJobs[campaignId];
  }
}

module.exports = { scheduleCampaign, cancelCampaignSchedule }; 